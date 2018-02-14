import {
    BehaviorSubject
} from "rxjs/BehaviorSubject";

export var GeoJSONSelection = {
    selectOptions: {
        activeStyle: {
            weight: 4,
            color: "#ff6d00"
        }
    },
    options: {
        multiple: false,
    },

    previousLayer: [],
    tempSelectedFeature: new BehaviorSubject(false),
    inSelectionsFeatures: new BehaviorSubject([]),
    selectedFeaturesIds: new BehaviorSubject([]),
    changeSelection: new BehaviorSubject({
        added: [],
        removed: []
    }),

    addSelections: function (eventOrFeatureOrFeatureId, onDataAdd, multiple) {
        if (!eventOrFeatureOrFeatureId) return;
        let layerOrFeatureId = eventOrFeatureOrFeatureId.layer || eventOrFeatureOrFeatureId;
        let featureId = (layerOrFeatureId.feature && layerOrFeatureId.feature.properties && layerOrFeatureId.feature.properties.id) ? layerOrFeatureId.feature.properties.id : layerOrFeatureId;
        let mapLayer;
        if (typeof eventOrFeatureOrFeatureId === 'string') {
            this.eachLayer(layer => {
                if (layer.feature.properties.id === featureId) {
                    mapLayer = layer;
                }
            });
        } else {
            mapLayer = layerOrFeatureId;
        }

        let ctrlKey = false;
        if (eventOrFeatureOrFeatureId.originalEvent && eventOrFeatureOrFeatureId.originalEvent.ctrlKey) {
            ctrlKey = true;
        }

        if (onDataAdd && this.isInSelections(featureId)) {
            let featuresIds = this.inSelectionsFeatures.getValue();
            for (let i = 0; i < featuresIds.length; i++) {
                if (featuresIds[i] === featureId) {
                    this.setSelectionStyle(mapLayer);
                }
            };
        }

        if (!onDataAdd) {
            if (!this.isInSelections(featureId)) {
                if (this.options.multiple || ctrlKey || multiple) {
                    this.previousLayer.push(featureId);
                    this.inSelectionsFeatures.next(this.inSelectionsFeatures.getValue().concat([featureId]))
                    this.changeSelection.next({
                        added: [featureId],
                        removed: []
                    });
                } else {
                    for (let i = this.previousLayer.length - 1; i >= 0; i--) {
                        this.setBeforeSelectionStyle(this.previousLayer[i]);
                        this.changeSelection.next({
                            added: [],
                            removed: [this.previousLayer[i]]
                        });
                    }
                    this.previousLayer = [featureId];
                    this.inSelectionsFeatures.next([featureId]);
                    this.changeSelection.next({
                        added: [featureId],
                        removed: []
                    });
                }

                this.setSelectionStyle(mapLayer);
            } else {
                for (let i = this.previousLayer.length - 1; i >= 0; i--) {
                    if (this.previousLayer[i] === featureId) {
                        this.previousLayer.splice(i, 1);
                    }
                }
                this.removeSelectionLayer(featureId);
            }
        }
    },

    setSelectionStyle: function (layer) {
        if (layer) {
            layer.beforeSelectionStyle = {
                weight: layer.options.weight,
                color: layer.options.color
            };
            layer.setStyle(this.selectOptions.activeStyle);
        }

    },

    setBeforeSelectionStyle: function (featureId) {
        this.eachLayer(layer => {
            if (layer.feature.properties.id === featureId && layer.beforeSelectionStyle) {
                layer.setStyle(layer.beforeSelectionStyle);
            }
        });
    },

    isInSelections: function (featureId) {
        let i,
            values = this.inSelectionsFeatures.getValue(),
            len = values.length,
            inSelectionsFeatureId = false;

        for (i = 0; i < len; i++) {
            if (values[i] === featureId) {
                inSelectionsFeatureId = true;
                break;
            }

        }

        return inSelectionsFeatureId;
    },

    removeSelectionLayer: function (featureId) {
        this.setBeforeSelectionStyle(featureId);
        this.inSelectionsFeatures.next(this.inSelectionsFeatures.getValue().filter(inSelectionsFeatureId => inSelectionsFeatureId === featureId ? false : inSelectionsFeatureId));
        this.changeSelection.next({
            added: [],
            removed: [featureId]
        });
    },

    clearSelections: function () {
        this.previousLayer = [];
        let featuresIds = this.inSelectionsFeatures.getValue();
        for (let i = featuresIds.length - 1; i >= 0; i--) {
            this.setBeforeSelectionStyle(featuresIds[i]);
        }

        this.inSelectionsFeatures.next([]);
        this.changeSelection.next({
            added: [],
            removed: featuresIds
        });
    },

    setTempFeature: function (feature) {
        if (!feature) return;

        let layer = feature.layer || feature
        let tempStyle = {
            weight: layer.options.weight,
            color: layer.options.color
        };

        layer.setStyle(this.options.activeStyle);
        this.tempSelectedFeature.next(layer);
        setTimeout(() => layer.setStyle(tempStyle), 3236);
    },

    hasValues: function () {
        return this.inSelectionsFeatures.getValue().length > 0;
    }
};