import {
    BehaviorSubject
} from "rxjs/BehaviorSubject";

export var GeoJSONSelection = L.Class.extend({
    options: {
        multiple: false,
        activeStyle: {
            weight: 4,
            color: "#ff6d00"
        }
    },

    initialize: function(options) {
        L.setOptions(this, options);
        this.previousLayer = [];
        this.tempSelectedFeature = new BehaviorSubject(false);
        this.inSelectionsFeatures = new BehaviorSubject([]);

        document.onkeydown = (e) => {
            if (e.keyCode === 27) {
                this.clearSelections();
            }
        };
    },

    addSelections: function(eventOrFeature, onDataAdd) {
        if (!eventOrFeature) return;
        let layer = eventOrFeature.layer || eventOrFeature;
        let ctrlKey = false;
        if (eventOrFeature.originalEvent && eventOrFeature.originalEvent.ctrlKey) {
            ctrlKey = true;
        }

        if (onDataAdd && this.previousLayer.length) {
            for (let i = this.previousLayer.length - 1; i >= 0; i--) {
                if (this.previousLayer[i].feature.properties.id === layer.feature.properties.id) {
                    this.previousLayer[i] = layer;
                }
            }
        }
        if (onDataAdd && this.isInSelections(layer)) {
            let layers = this.inSelectionsFeatures.getValue();
            for (let i = 0; i < layers.length; i++) {
                if (layers[i].feature.properties.id === layer.feature.properties.id) {
                    layers[i] = layer;
                    this.setSelectionStyle(layer);
                }
            }
            this.inSelectionsFeatures.next(layers);
        }

        if (!onDataAdd) {
            if (!this.isInSelections(layer)) {
                if (this.options.multiple || ctrlKey) {
                    this.previousLayer.push(layer);
                    this.inSelectionsFeatures.next(this.inSelectionsFeatures.getValue().concat([layer]))
                } else {
                    for (let i = this.previousLayer.length - 1; i >= 0; i--) {
                        this.setBeforeSelectionStyle(this.previousLayer[i]);
                    }
                    this.previousLayer = [layer];
                    this.inSelectionsFeatures.next([layer]);
                }
                this.setSelectionStyle(layer);
            } else {
                for (let i = this.previousLayer.length - 1; i >= 0; i--) {
                    if (this.previousLayer[i].feature.properties.id === layer.feature.properties.id) {
                        this.previousLayer.splice(i, 1);
                    }
                }
                this.setBeforeSelectionStyle(layer);
                this.removeSelectionLayer(layer);
            }
        }
    },

    setSelectionStyle: function(layer) {
        layer.beforeSelectionStyle = {
            weight: layer.options.weight,
            color: layer.options.color
        };
        layer.setStyle(this.options.activeStyle);
    },

    setBeforeSelectionStyle: function(layer) {
        if (layer && layer.beforeSelectionStyle) {
            layer.setStyle(layer.beforeSelectionStyle);
        }
    },

    isInSelections: function(layer) {
        return (this.inSelectionsFeatures
            .getValue()
            .filter(inSelectionsFeatureId => inSelectionsFeatureId.feature.properties.id === layer.feature.properties.id ? inSelectionsFeatureId : false)
            .length > 0);
    },

    removeSelectionLayer: function(layer) {
        this.inSelectionsFeatures.next(this.inSelectionsFeatures.getValue().filter(item => item.feature.properties.id === layer.feature.properties.id ? false : item));
    },

    clearSelections: function() {
        this.previousLayer = [];
        let layers = this.inSelectionsFeatures.getValue();
        for (let i = layers.length - 1; i >= 0; i--) {
            this.setBeforeSelectionStyle(layers[i]);
        }
        this.inSelectionsFeatures.next([]);
    },

    setTempFeature: function(feature) {
        if (!feature) return;

        let layer = feature.layer || feature
        let tempStyle = {
            weight: layer.options.weight,
            color: layer.options.color
        };

        layer.setStyle(this.options.activeStyle);
        this.tempSelectedFeature.next(layer);
        setTimeout(() => this.tempSelectedFeature.getValue().setStyle(tempStyle), 3236);
    }
});