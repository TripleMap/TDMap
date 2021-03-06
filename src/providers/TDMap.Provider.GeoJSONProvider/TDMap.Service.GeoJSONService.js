import {
    Promises
} from "../../utils/TDMap.Utils.Promises.js";
import {
    GeoJSONSelection
} from "./TDMap.Service.GeoJSONSelection.js";
import {
    GeoJSONProvider
} from "./TDMap.Service.GeoJSONProvider.js";

import {
    Subject
} from "rxjs/Subject";
import 'rxjs/add/operator/map';


export var GeoJSONService = L.GeoJSON.extend({
    // стили приходят с сервера feature.properties.style
    // стили пользователя хранятся на сервере с привязкой к атрибуту

    includes: GeoJSONSelection,
    initialize: function (options) {
        L.setOptions(this, options);
        L.GeoJSON.prototype.initialize.call(this, null, options);
        this._provider = new GeoJSONProvider(options.dataUrl);
        this.filteredIds = null;
        this.featuresFlow = new Subject();
        this._processFeatures();
    },

    setStyled: function () {
        this.styled = true
    },

    removeStyles: function () {
        this.styled = false
    },

    setLabeled: function () {
        this.labeled = true
    },

    removeLabels: function () {
        this.labeled = false
    },

    updateLabels: function () {

    },

    onAdd: function (map) {
        this._map = map;
        L.GeoJSON.prototype.onAdd.call(this, map);
        this._updateData();
        this._map.on("moveend", this._updateData, this);
    },

    onRemove: function (map) {
        this.clearLayers();
        L.GeoJSON.prototype.onRemove.call(this, map);
        map.off("moveend", this._updateData, this);
    },

    _updateData: function (e) {
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

    _updateDataByBounds: function (bbox) {
        this._provider
            .getDataByBounds(bbox)
            .map(res => this.filterData(res))
            .subscribe(
                filtered => this.featuresFlow.next(filtered),
                error => this.clearLayers()
            );
    },

    _processFeatures: function () {
        this.featuresFlow
            .map(features => this._replaceData(features))
            .subscribe();
    },

    filterData: function (data) {
        if (!this.filteredIds) {
            return data.features;
        }

        if (this.filteredIds.length === 0) {
            return [];
        }

        return data.features.filter(item => {
            return this.filteredIds.indexOf(item.properties.id) === -1 ? false : item
        });
    },

    _replaceData: function (features) {
        this.clearLayers();
        if (!features) return;

        for (let i = features.length - 1; i >= 0; i--) {
            this.addData(features[i])
        }
        this._map.fire("layer:load");
        this.subscribeOnSelection();
    },

    subscribeOnSelection: function () {
        if (this.options.selectable) {
            this.eachLayer(layer => {
                this.addSelections(layer, true)
            });

            this.on('click', this.addSelections, this);
            this._map.doubleClickZoom.disable();
            this.on('dblclick', this.clearSelections, this);
        }
    },

    setFilteredIds: function (arrayOfIdOrNull) {
        this.filteredIds = arrayOfIdOrNull;
        this._updateData();
    },

    stayOrRemoveViaFilteredIds: function () {
        this.eachLayer(layer => {
            if (this.filteredIds.indexOf(layer.feature.properties.id) === -1) {
                layer._path.style.visibility = "hidden";
            } else {
                if (layer._path.style.visibility === "hidden") {
                    layer._path.style.visibility = "visible";
                }
            }
        });
        return this;
    },

    removeFilteredIds: function () {
        this.filteredIds = null;
        this._updateData();
        return this;
    }
});

export var geoJSONService = function (options) {
    return new GeoJSONService(options);
};