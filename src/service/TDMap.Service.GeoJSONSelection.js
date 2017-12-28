import { BehaviorSubject } from "rxjs/BehaviorSubject";

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
        this.tempSelectedFeature = new BehaviorSubject(false);
        this.inSelectionsFeatureIds = new BehaviorSubject([]);
    },

    addSelections: function(feature) {
        if (!feature) return;
        let layer = feature.layer || feature
        if (this.isInSelections(layer)) return;
        this.setSelectionStyle(layer);
        this.options.multiple ?
            this.inSelectionsFeatureIds.next([layer.feature.properies.id]) :
            this.inSelectionsFeatureIds.next(this.inSelectionsFeatureIds.getValue().concat([layer.feature.properies.id]));
    },

    setSelectionStyle:function(layer){
        layer.beforeSelectionStyle = {
            weight: layer.options.weight,
            color: layer.options.color
        };
        layer.setStyle(this.options.activeStyle);
    },

    isInSelections: function(layer) {
        return (this.inSelectionsFeatureIds
            .getValue()
            .filter(inSelectionsFeatureId => inSelectionsFeatureId === layer.feature.properies.id ? true : false)
            .length > 0);
    },

    clearSelections: function() {
        this.inSelectionsFeatureIds.next([]);
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