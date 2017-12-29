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
        this.previousLayer = null;
        this.tempSelectedFeature = new BehaviorSubject(false);
        this.inSelectionsFeatureIds = new BehaviorSubject([]);
    },

    addSelections: function(eventOrFeature, onDataAdd) {
        // 
        if (!eventOrFeature) return;
        let layer = eventOrFeature.layer || eventOrFeature;
        let ctrlKey = false;
        if (eventOrFeature.originalEvent && eventOrFeature.originalEvent.ctrlKey) {
            ctrlKey = true;
        }

        if (!this.isInSelections(layer)) {
            this.setSelectionStyle(layer);
            if (this.options.multiple) {
                this.inSelectionsFeatureIds.next(this.inSelectionsFeatureIds.getValue().concat([layer]))
            } else {
                this.setBeforeSelectionStyle(this.previousLayer);
                this.previousLayer = layer;
                this.inSelectionsFeatureIds.next([layer]);
            }
        } else {
            if (!onDataAdd) {
                this.setBeforeSelectionStyle(layer);
                this.removeSelection(layer);
            } else {
                //реплайсим
                this.setSelectionStyle(layer);
                let layers = this.inSelectionsFeatureIds.getValue();
                for (var i = 0; i < layers.length; i++) {
                    if (layers[i].feature.properies.id === layer.feature.properies.id) {
                        layers[i] = layers
                    }
                }
                this.inSelectionsFeatureIds.next(this.inSelectionsFeatureIds.getValue().concat(layers))
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
        return (this.inSelectionsFeatureIds
            .getValue()
            .filter(inSelectionsFeatureId => inSelectionsFeatureId.feature.properies.id === layer.feature.properies.id ? true : false)
            .length > 0);
    },

    removeSelection: function(layer) {
        this.inSelectionsFeatures.next(this.inSelectionsFeatures.getValue().filter(item => item.feature.properies.id === layer.feature.properies.id ? false : item));
    },

    clearSelections: function() {
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