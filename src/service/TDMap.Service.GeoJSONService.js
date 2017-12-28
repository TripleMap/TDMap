import {
    Promises
} from "../utils/TDMap.Utils.Promises.js";
import {
    Subject
} from "rxjs/Subject";
import 'rxjs/add/operator/map';
export var GeoJSONProvider = L.Class.extend({
    initialize: function(dataUrl) {
        if (!dataUrl) {
            throw new Error("Не задан url для GeoJSONProvider");
        }
        this.dataUrl = dataUrl;
    },

    getDataByBounds: function(bounds, labelLayer, styleLayer) {
        let params = {};
        bounds instanceof L.LatLngBounds ? (params.bbox = this._getMinMaxBounds(bounds)) : (params.bbox = bounds);
        params.labeled = labelLayer || false;
        params.styled = styleLayer || false;
        return TDMap.Utils.Promises.getPromise(this.dataUrl, params);
    },

    _getMinMaxBounds: function(bounds) {
        let nw = bounds.getNorthWest();
        let se = bounds.getSouthEast();
        return [nw.lng, se.lat, se.lng, nw.lat].toString();
    }
});

export var GeoJSONService = L.GeoJSON.extend({
    // стили приходят с сервера feature.properties.style
    // стили пользователя хранятся на сервере с привязкой к атрибуту
    initialize: function(options) {
        L.setOptions(this, options);
        L.GeoJSON.prototype.initialize.call(this, null, options);
        this._provider = new GeoJSONProvider(options.dataUrl);
        this.filteredIds = [];
        this.featuresFlow = new Subject();
        this._processFeatures();
    },

    setStyled: () => (this.styled = true),
    removeStyles: () => (this.styled = false),
    setLabeled: () => (this.labeled = true),
    removeLabels: () => (this.labeled = false),

    onAdd: function(map) {
        this._map = map;
        L.GeoJSON.prototype.onAdd.call(this, map);
        this._updateData();
        this._map.on("moveend", this._updateData, this);
    },

    onRemove: function(map) {
        this.clearLayers();
        L.GeoJSON.prototype.onRemove.call(this, map);
        map.off("moveend", this._updateData, this);
    },

    _updateData: function(e) {
        let bbox;
        this.options.bounds || this.options.circle ?
            (bbox = this.options.bounds || this.options.circle) :
            (bbox = this._map.getBounds());

        let zoom = this._map.getZoom();

        if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
            this.clearLayers();
            return;
        }

        this._updateDataByBounds(bbox);
    },

    _updateDataByBounds: function(bbox) {
        this._provider
            .getDataByBounds(bbox)
            .map(res => this.filterData(res))
            .subscribe(
                res => this.featuresFlow.next(res),
                error => this.clearLayers()
            );
    },

    _processFeatures: function() {
        this.featuresFlow
            .map(features => this._replaceData(features))
            .subscribe();
    },

    filterData: function(data) {
        return data.features.filter(item => this.filteredIds.indexOf(item.properies.id) === -1 ? item : false);
    },

    _replaceData: function(features) {
        this.clearLayers();
        if (!features) return;

        for (let i = features.length - 1; i >= 0; i--) {
            this.addData(features[i]);
        }
        this._map.fire("layer:load");
    },

    setFilteredIds: arrayOfId => {
        this.filteredIds = arrayOfId;
        return this.stayOrRemoveViaFilteredIds();
    },

    stayOrRemoveViaFilteredIds: () => {
        this.eachLayer(layer => {
            if (this.filteredIds.indexOf(layer.feature.properties.zu_id) === -1) {
                layer._path.style.visibility = "hidden";
            } else {
                if (layer._path.style.visibility === "hidden") {
                    layer._path.style.visibility = "visible";
                }
            }
        });
        return this;
    },

    removeFilteredIds: () => {
        this.filteredIds = [];
        this._updateData();
        return this;
    }
});
export var geoJSONService = function(options) {
    return new GeoJSONService(options);
};