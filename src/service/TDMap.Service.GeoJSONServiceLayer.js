import {
    Promises
} from "../utils/TDMap.Utils.Promises.js"

export var GeoJSONProvider = {

    initialize: function(options) {
        if (options.dataUrl === undefined && options.dataUrl === null) {
            throw new Error("Не задан url для GeoJSONProvider");
        }
        this.options = options;
    },

    getData: function() {
        return Promises.getPromise(this.options.dataUrl, this.options.params, this.options.headers);
    },

    getDataByBounds: function(bounds) {
        if (!this.options.params) {
            this.options.params = {};
        }
        if (bounds instanceof L.LatLngBounds) {
            this.options.params.bbox = this._getMinMaxBounds(bounds);
        } else {
            this.options.params.bbox = bounds;
        }

        if (this.options.styled) {
            this.options.params.styled = this.options.styled;
        } else {
            delete this.options.params.styled;
        }

        if (this.options.labeled) {
            this.options.params.labeled = this.options.labeled;
        } else {
            delete this.options.params.labeled;
        }
        return Promises.getPromise(this.options.dataUrl, this.options.params, this.options.headers);
    },

    _getMinMaxBounds: function(bounds) {
        if (bounds) {
            var nw = bounds.getNorthWest();
            var se = bounds.getSouthEast();
            var minMaxStringBounds = [nw.lng, se.lat, se.lng, nw.lat].toString();
            return minMaxStringBounds;
        }
    },
};


export var GeoJSONServiceLayer = L.GeoJSON.extend({
    includes: GeoJSONProvider,

    initialize: function(options) {
        this.filteredIds = [];
        this.filterMode = false;
        L.GeoJSON.prototype.initialize.call(this, null, options);
        GeoJSONProvider.initialize.call(this, options);

        L.setOptions(this, options);
    },

    setStyles: function(styles) {
        this.styles = styles;
    },

    removeStyles: function() {
        this.options.styled = false;
        this.styles = false;
    },

    setLabels: function(labels) {
        this.labels = labels;
    },

    removeLabels: function() {
        this.options.labeled = false;
        this.labels = false;
    },

    onAdd: function(map) {
        this.map = map;
        L.GeoJSON.prototype.onAdd.call(this, map);
        map.on('moveend', this._updateData, this);
        this._updateData();
    },

    onRemove: function(map) {
        //удаляем слой//
        this.clearLayers();
        L.GeoJSON.prototype.onRemove.call(this, map);
        map.off('moveend', this._updateData, this);
    },

    _updateData: function(e) {
        var bbox;
        if (this.options.bounds) {
            bbox = this.options.bounds;
        } else if (this.options.circle) {
            bbox = this.options.circle;
        } else {
            bbox = this.map.getBounds();
        }

        var zoom = this.map.getZoom();

        if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
            this.clearLayers();
            return;
        }

        this._updateDataByBounds(bbox, zoom);
    },

    _updateDataByBounds: function(bbox, zoom) {
        var that = this;
        this.getDataByBounds(bbox).then(
            function(res) {
                var json;
                if (res.data.geoJSON) {
                    json = (res.data.geoJSON[0] || res.data.geoJSON);
                } else if (res.data.inbounds) {
                    json = res.data.inbounds[0];
                } else if (res.data.features) {
                    json = res.data;
                }
                that._replaceData(json.features);
            },
            function(error) {
                that.clearLayers();
            }
        );
    },

    styleEnebledInZoom: function(style) {
        var zoom = this.map.getZoom();
        for (var i = this.styles.length - 1; i >= 0; i--) {
            for (var s = this.styles[i].styles.length - 1; s >= 0; s--) {
                if (this.styles[i].styles[s].id === style.id) {
                    if (zoom >= this.styles[i].minZoom && zoom <= this.styles[i].maxZoom) {
                        return true;
                    }
                }
                if (this.styles[i].otherStyle.id === style.id && this.styles[i].otherStyle.allow === true) {
                    if (zoom >= this.styles[i].minZoom && zoom <= this.styles[i].maxZoom) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    _replaceData: function(features) {
        var that = this;
        if (features !== null && features !== undefined) {
            this.clearLayers();
            for (var i = 0; i < features.length; i++) {
                if (features[i] !== null) {
                    if (!this.styles) {
                        this.addData(features[i]);
                    } else {
                        if (features[i].styles && features[i].styles.length > 0) {
                            for (var s = 0; s < features[i].styles.length; s++) {
                                if (features[i].styles[s] !== null && this.styleEnebledInZoom(features[i].styles[s])) {
                                    features[i].style = features[i].styles[s];
                                    var dubleFeature = {};
                                    for (var key in features[i]) {
                                        dubleFeature[key] = features[i][key];
                                    }
                                    this.addData(dubleFeature);
                                }
                            }
                        }
                    }
                }
            }
            this.eachLayer(function(layer) {
                if (layer)
                    that._subscribe(layer);
                if (layer.feature.style) {
                    layer.setStyle(layer.feature.style);
                }
            });
            this.map.fire('layer:load');
            if (this.filterMode) {
                this.stayOrRemoveViaFilteredIds();
            }
            this.updateLabels();
        } else {
            this.clearLayers();
        }
    },

    updateLabels: function() {
        this.clearLabels();
        if (this.labels && this.labels.length > 0) {
            var zoom = this.map.getZoom();
            if (zoom >= this.labels[0].minZoom && zoom <= this.labels[0].maxZoom) {
                this.labelFeatures(this.labels[0]);
            }
        }
    },

    labelFeatures: function(label) {
        var that = this;

        function Point(x, y) {
            this.x = x;
            this.y = y;
        }

        function Region(points) {
            this.points = points || [];
            this.length = points.length;
        }

        Region.prototype.area = function() {
            var area = 0,
                i, j, point1, point2;
            for (i = 0, j = this.length - 1; i < this.length; j = i, i++) {
                point1 = this.points[i];
                point2 = this.points[j];
                area += point1.x * point2.y;
                area -= point1.y * point2.x;
            }
            area /= 2;
            return area;
        };

        Region.prototype.centroid = function() {
            var x = 0,
                y = 0,
                i, j, f, point1, point2;

            for (i = 0, j = this.length - 1; i < this.length; j = i, i++) {
                point1 = this.points[i];
                point2 = this.points[j];
                f = point1.x * point2.y - point2.x * point1.y;
                x += (point1.x + point2.x) * f;
                y += (point1.y + point2.y) * f;
            }
            f = this.area() * 6;
            return new Point(x / f, y / f);
        };

        function isNumber(str) {
            var pattern = /^[0-9]{1,7}([,.][0-9]{1,7})?$/;
            return pattern.test(str);
        }

        that.eachLayer(function(layer) {
            if (layer._path && layer._path.style.visibility !== 'hidden') {
                layer._path.id = "layer" + layer._leaflet_id;
                var group = d3.select('.leaflet-overlay-pane').select('svg').append('g').attr("class", 'labels');

                var region;
                if (layer._parts && layer._parts[0] && layer._parts[0].length > 0) {
                    region = new Region(layer._parts[0]);
                }

                function textEval() {
                    if (label.workField.options.type === 'boolean') {
                        if (layer.feature.properties.labelvalue !== 'Да' && layer.feature.properties.labelvalue !== 'Нет') {
                            if (layer.feature.properties.labelvalue === null || layer.feature.properties.labelvalue === false) {
                                layer.feature.properties.labelvalue = 'Нет';
                            } else {
                                layer.feature.properties.labelvalue = 'Да';
                            }
                        }
                    }
                    if (label.designed) {
                        var str;
                        if (isNumber(layer.feature.properties.labelvalue)) {
                            str = label.designedString.replace('{значение}', layer.feature.properties.labelvalue);
                        } else {
                            str = label.designedString.replace('{значение}', '\'' + layer.feature.properties.labelvalue + '\'');
                        }
                        if (label.rounded && label.roundedNumber) {
                            str = '(' + str + ').toFixed(' + label.roundedNumber + ')';
                        }
                        try {
                            return eval(str);
                        } catch (err) {
                            that.fire('ERROR', {
                                message: 'Ошибка формирования строки подписи. Проверьте составную подпись'
                            });
                            throw new Error();
                        }
                    } else {
                        return layer.feature.properties.labelvalue;
                    }
                }
                d3.selectAll("#layer" + layer._leaflet_id).each(function(d, i) {
                    if (!region) {
                        return;
                    }
                    var bounds = this.getBBox();
                    var pos = {
                        x: region.centroid().x,
                        y: region.centroid().y
                    };
                    if (pos.x === 0 && pos.y === 0) {
                        return;
                    }
                    if (isNaN(pos.x) || isNaN(pos.y)) {
                        return;
                    }

                    if (pos.x === Number.POSITIVE_INFINITY || pos.x === Number.NEGATIVE_INFINITY) {
                        return;
                    }
                    if (pos.y === Number.POSITIVE_INFINITY || pos.y === Number.NEGATIVE_INFINITY) {
                        return;
                    }

                    group.append('text')
                        .attr("class", "oreol")
                        .style("stroke", label.oreolColor)
                        .style("opacity", label.oreolOpacity)
                        .style("stroke-width", label.oreolWidth)
                        .style("font-size", label.fontSize)
                        .style("text-anchor", 'middle')
                        .style("font-family", 'Roboto,Helvetica Neue,sans-serif')
                        .attr("x", pos.x)
                        .attr("y", pos.y)
                        .text(textEval);
                    group.append('text')
                        .attr("class", "textpath")
                        .style("fill", label.textColor)
                        .style("fill-opacity", label.textOpacity)
                        .style("text-anchor", 'middle')
                        .style("font-size", label.fontSize)
                        .style("font-family", 'Roboto,Helvetica Neue,sans-serif')
                        .attr("x", pos.x)
                        .attr("y", pos.y)
                        .text(textEval);
                });
            }
        });
    },

    clearLabels: function() {
        $(".labels").remove();
    },

    _subscribe: function(layer) {
        if (layer) {
            this.layer = layer;
            layer.on('click', this._clickFireAndForward, this);
        }
    },

    _unSubcribeLayer: function(layer) {
        layer.off('click', this._clickFireAndForward);
    },

    _clickFireAndForward: function(e) {
        this.fire('tdmap:layer:click', e.target);
    },

    stayOrRemoveViaFilteredIds: function() {
        var that = this;
        this.eachLayer(function(layer) {
            if (that.filteredIds.indexOf(layer.feature.properties.zu_id) === -1) {
                layer._path.style.visibility = "hidden";
            } else {
                if (layer._path.style.visibility === "hidden") {
                    layer._path.style.visibility = 'visible';
                }
            }
        });
    },

    setFilteredIds: function(arrayOfId) {
        this.filteredIds = arrayOfId;
        this.filterMode = true;
        this.stayOrRemoveViaFilteredIds();
        return this;
    },

    removeFilteredIds: function() {
        this.filteredIds = null;
        this.filterMode = false;
        this._updateData();
        return this;
    }
});

export var geoJSONServiceLayer = function(options) {
    return new GeoJSONServiceLayer(options);
};