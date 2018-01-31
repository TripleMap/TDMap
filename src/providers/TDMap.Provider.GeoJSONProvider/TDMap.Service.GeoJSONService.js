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
        return data.features.filter(item => this.filteredIds.indexOf(item.properties.id) === -1 ? item : false);
    },

    _replaceData: function(features) {
        this.clearLayers();
        if (!features) return;
        if (features.length < 500) {
            for (let i = features.length - 1; i >= 0; i--) {
                this.addData(features[i])
            }
            this._map.fire("layer:load");
            this.subscribeOnSelection();
        } else {
            // throttling
            let elemsPer100mTimes = Math.floor(features.length / 250);
            let elemsPer100msTile = features.length % 250;
            for (let i = elemsPer100msTile; i >= 1; i--) {
                this.addData(features[features.length - i]);
            }
            let index = 0;
            let counter = 0;
            let checkForNext = (t) => {
                if (t === elemsPer100mTimes) {
                    this._map.fire("layer:load");
                    this.subscribeOnSelection();
                }
            }
            for (let t = 1; t <= elemsPer100mTimes; t++) {
                setTimeout(() => {
                    for (let z = index, len = (features.length - 1 - elemsPer100msTile) / elemsPer100mTimes; z <= len * t; z++) {
                        this.addData(features[z]);
                    }
                    checkForNext(t)
                    index += (features.length - elemsPer100msTile) / elemsPer100mTimes;
                }, 100 * t);
            }
        }
    },

    subscribeOnSelection: function() {
        if (this.options.selectable) {
            this.eachLayer(layer => {
                this.selections.addSelections(layer, true)
            });

            this.on('click', this.selections.addSelections, this.selections);
            this._map.doubleClickZoom.disable();
            this.on('dblclick', this.selections.clearSelections, this.selections);
        }
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