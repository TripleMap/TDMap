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
    // стили приходят с сервера feature.properies.style
    // стили пользователя хранятся на сервере с привязкой к атрибуту
    initialize: function(options) {
        L.setOptions(this, options);
        L.GeoJSON.prototype.initialize.call(this, null, options);
        this._provider = new GeoJSONProvider(options.dataUrl);
        this.filteredIds = [];
        this.featuresFlow = new Subject();
        this._processFeatures();
        if (this.options.selectable) {
            this.selections = new GeoJSONSelection(this.options.selectionOptions || {});
        }
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
            this.addData(features[i])
        }
        this.subscribeOnSelection();
        this._map.fire("layer:load");
    },

    subscribeOnSelection: function() {
        if (this.options.selectable) {
            this.eachLayer(layer => {
                if (this.selections.isInSelections(layer)) {
                    this.selections.setSelectionStyle(layer, true)
                }
            });

            this.on('click', this.selections.addSelections, this.selections);
            this._map.doubleClickZoom.disable();
            this.on('dblclick', this.clearSelections, this);
        }
    },

    clearSelections: function() {
        this.eachLayer(layer => {
            if (this.selections.isInSelections(layer)) {
                this.selections.setBeforeSelectionStyle(layer);
            }
        })
        this.selections.clearSelections();
    },

    setFilteredIds: arrayOfId => {
        this.filteredIds = arrayOfId;
        return this.stayOrRemoveViaFilteredIds();
    },

    stayOrRemoveViaFilteredIds: () => {
        this.eachLayer(layer => {
            if (this.filteredIds.indexOf(layer.feature.properies.zu_id) === -1) {
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