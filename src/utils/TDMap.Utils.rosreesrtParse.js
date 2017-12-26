export class CadastrSearchProviderPPK5 {
	constructor(map) {
		this.map = map;
	}

	getDataByMask(cadnum) {}
	getDataByMaskAsynch(cadnum) {
		var d = $.Deferred();
		getDataFromServer();

		function getDataFromServer() {
			function random() {
				return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16)
					.substring(1);
			}

			var urlOptions = {
				text: cadnum,
				tolerance: "16391",
				limit: 16,
				callback: "JQuery" + random() + random()
			};

			var array = [];
			var arrayWithOutCords = [];
			this[urlOptions.callback] = function(data) {};
			var text = `${Number(cadnum.split(":")[0]).toString()}:${Number(cadnum.split(":")[1]).toString()}:${Number(cadnum.split(":")[2]).toString()}:${Number(cadnum.split(":")[3]).toString()}`;
			$.ajax({
				url: "https://pkk5.rosreestr.ru/api/features/1/" + text,
				type: "GET",
				dataType: "jsonp",
				success: function(response) {
					if (
						response.feature !== undefined &&
						response.feature !== null
					) {
						if (
							response.feature.center &&
							response.feature.extent
						) {
							var cords = L.Projection.SphericalMercator.unproject(
								L.point(
									response.feature.center.x,
									response.feature.center.y
								)
							);
							var obj = {
								type: "Feature",
								geojson: {
									type: "Point",
									coordinates: [
										cords[Object.keys(cords)[1]],
										cords[Object.keys(cords)[0]]
									]
								}
							};
							obj.properties = response.feature.attrs;
							obj.properties.extent = response.feature.extent;
							obj.properties.center = response.feature.center;
							array.push(obj);
							d.resolve(array, "withCoords");
						} else {
							arrayWithOutCords.push({
								type: "Feature",
								properties: {
									cn: response.feature.attrs.cn,
									id: response.feature.attrs.id
								}
							});
							d.resolve(arrayWithOutCords, "withoutCoords");
						}
					} else {
						d.resolve([], "noObjects");
					}
				},
				error: function(error) {
					d.reject(" Failed: " + error);
				}
			});
		}
		return d.promise();
	}

	getPointsOfImageByMaskAsynch(cadnum, options) {
		var d = $.Deferred();
		var getDataFromServer = function() {
			var urlOptions = {
				dpi: "96",
				transparent: "true",
				format: "png32",
				layers: "show:6,7",
				bbox: options.bbox3857,
				bboxSR: options.bboxSR,
				imageSR: options.imageSR,
				size: options.size,
				layerDefs: JSON.stringify({
					"6": "ID = '" + cadnum + "'",
					"7": "ID = '" + cadnum + "'"
				}),
				f: "image"
			};
			var pstr = L.Util.getParamString(urlOptions);
			$.ajax({
				url: "http://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreSelected/MapServer/export?",
				type: "GET",
				data: urlOptions,
				success: function(data) {
					var image = new Image();
					image.setAttribute("crossOrigin", "anonymous");
					image.onload = function() {
						var pathPoints = MSQR(image, {
							tolerance: 1.5,
							path2D: true,
							maxShapes: 25
						});

						var c = document.createElement("canvas"),
							ctx;
						c.width = image.width;
						c.height = image.height;
						ctx = c.getContext("2d");
						ctx.drawImage(image, 0, 0);

						ctx.fillStyle = "rgb(255, 255, 0)";
						ctx.beginPath();
						for (var z = 0; z < pathPoints.length; z++) {
							if (pathPoints[z].length > 3) {
								for (var i = 0; i < pathPoints[z].length; i++) {
									if (i === 0) {
										ctx.moveTo(
											pathPoints[z][i].x,
											pathPoints[z][i].y
										);
									} else if (i === pathPoints[z].length) {
										ctx.lineTo(
											pathPoints[z][i].x,
											pathPoints[z][i].y
										);
									} else {
										ctx.lineTo(
											pathPoints[z][i].x,
											pathPoints[z][i].y
										);
									}
								}
							}
						}

						ctx.rect(0, 0, image.width, image.height);
						ctx.fill();

						var imgData = ctx.getImageData(
							0,
							0,
							image.width,
							image.height
						);
						for (var d = 0; d < imgData.data.length; d += 4) {
							if (imgData.data[d + 3] === 0) {
								imgData.data[d] = 255;
								imgData.data[d + 1] = 0;
								imgData.data[d + 2] = 0;
								imgData.data[d + 3] = 255;
							} else {
								imgData.data[d] = 0;
								imgData.data[d + 1] = 0;
								imgData.data[d + 2] = 0;
								imgData.data[d + 3] = 0;
							}
						}
						ctx.putImageData(imgData, 0, 0);

						var pinPoints = MSQR(ctx, {
							tolerance: 1.5,
							path2D: true,
							maxShapes: 100
						});
						var polygons = [];
						for (var pp = 0; pp < pathPoints.length; pp++) {
							if (pathPoints[pp].length > 2)
								polygons.push(pathPoints[pp]);
						}
						var holes = [];

						for (var pin = pinPoints.length - 1; pin >= 0; pin--) {
							if (pinPoints[pin].length > 2)
								holes.push(pinPoints[pin]);
						}

						d.resolve(
							polygons,
							holes,
							image.width,
							image.height,
							urlOptions.bbox
						);
					};
					image.src = this.url;
				},
				error: function(error) {
					d.reject(" Failed: " + error);
				}
			});
		};

		getDataFromServer();
		return d.promise();
	}

	getDataByLocationAsynch(lngLatString) {
		var d = $.Deferred();
		getDataFromServer();

		function getDataFromServer() {
			let random = () =>
				Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);

			var urlOptions = {
				text: lngLatString,
				tolerance: "16",
				limit: 11,
				callback: "JQuery" + random() + random()
			};

			var array = [];
			this[urlOptions.callback] = function(data) {};
			$.ajax({
				url: "https://pkk5.rosreestr.ru/api/features/1?",
				type: "GET",
				data: urlOptions,
				dataType: "jsonp",
				jsonpCallback: urlOptions.callback,
				crossDomain: true,
				success: function(response) {
					if (response.features.length > 0) {
						$.each(response.features, function(index, value) {
							var cords = L.Projection.SphericalMercator.unproject(
								L.point(value.center.x, value.center.y)
							);
							array.push({
								display_name: value.attrs.address,
								type: "Feature",
								geojson: {
									type: "Point",
									coordinates: [
										cords[Object.keys(cords)[1]],
										cords[Object.keys(cords)[0]]
									]
								},
								properties: {
									address: value.attrs.address,
									cn: value.attrs.cn,
									id: value.attrs.id,
									extent: value.extent,
									sort: value.sort,
									type: value.type
								}
							});
						});
						d.resolve(array);
					} else {
						d.resolve([]);
					}
				},
				error: function(error) {
					d.reject(" Failed: " + error);
				}
			});
		}
		return d.promise();
	}
}

export class CadastrSearchPPK5 {
	constructor(map, options) {
		this.map = map;
		this.options = options;
		this.pkk5Provider = new CadastrSearchProviderPPK5(this.map);
	}

	getGeoJsonByCadNum(cadNum) {
		var deferred = $.Deferred();
		var that = this;
		this.pkk5Provider.getDataByMaskAsynch(cadNum).then((data, type) => {
			var requestResult = data;
			if (type === "withCoords") {
				var bbox = [
					data[0].properties.extent.xmin,
					data[0].properties.extent.ymin,
					data[0].properties.extent.xmax,
					data[0].properties.extent.ymax
				];
				var strBbox = bbox.join();
				var bounds = new L.latLngBounds(
					L.Projection.SphericalMercator.unproject(new L.point(data[0].properties.extent.xmin, data[0].properties.extent.ymax)),
					L.Projection.SphericalMercator.unproject(new L.point(data[0].properties.extent.xmax, data[0].properties.extent.ymin))
				);

				var newBoundsNorthEast = that.map.getPixelBounds(bounds._northEast, 18);
				var newBoundsSouthWest = that.map.getPixelBounds(bounds._southWest, 18);
				var futureNE = {
					x: null,
					y: null
				};
				var futureSW = {
					x: null,
					y: null
				};
				futureNE.x = newBoundsNorthEast.min.x + that.map.getSize().x / 2;
				futureNE.y = newBoundsNorthEast.min.y + that.map.getSize().y / 2;
				futureSW.x = newBoundsSouthWest.min.x + that.map.getSize().x / 2;
				futureSW.y = newBoundsSouthWest.min.y + that.map.getSize().y / 2;
				var futureHight = futureSW.y - futureNE.y;
				var futureWidth = futureNE.x - futureSW.x;

				var kW, kH;
				(futureHight / 4096 > 1) ? kH = futureHight / 4096: kH = 1;
				(futureWidth / 4096 > 1) ? kW = futureWidth / 4096: kW = 1;

				var d = [kW, kH].sort();
				var size = [futureWidth / d[1], futureHight / d[1]];
				var strSize = size.join();

				that.pkk5Provider.getPointsOfImageByMaskAsynch(data[0].properties.id, {
					bbox3857: strBbox,
					bboxSR: "3857",
					imageSR: "3857",
					size: strSize
				}).then((data, holes) => {
					var geometry = {
						type: "MultiPolygon",
						coordinates: []
					};
					for (var v = 0; v < data.length; v++) {
						var polygon = [];
						var exterior = [];
						for (var m = 0; m < data[v].length; m++) {
							var point = L.point(
								data[v][m].x * d[1] + futureSW.x,
								data[v][m].y * d[1] + futureNE.y
							);
							exterior.push([
								that.map.unproject(point, 18).lng,
								that.map.unproject(point, 18).lat
							]);
						}
						if (data[v].length > 0) {
							var lastPoint = L.point(
								data[v][0].x * d[1] + futureSW.x,
								data[v][0].y * d[1] + futureNE.y
							);
							exterior.push([
								that.map.unproject(lastPoint, 18).lng,
								that.map.unproject(lastPoint, 18).lat
							]);
						}

						polygon.push(exterior);
						geometry.coordinates.push(polygon);
					}

					var arrayOfHoles = [];
					for (var h = 0; h < holes.length; h++) {
						var hole = [];
						for (
							var hh = 0; hh < holes[h].length; hh++
						) {
							var holePoint = L.point(
								holes[h][hh].x * d[1] + futureSW.x,
								holes[h][hh].y * d[1] + futureNE.y
							);
							hole.push([
								that.map.unproject(holePoint, 18)
								.lng,
								that.map.unproject(holePoint, 18)
								.lat
							]);
						}
						if (holes[h].length > 0) {
							var lastHolePoint = L.point(
								holes[h][0].x * d[1] + futureSW.x,
								holes[h][0].y * d[1] + futureNE.y
							);
							hole.push([
								that.map.unproject(
									lastHolePoint,
									18
								).lng,
								that.map.unproject(
									lastHolePoint,
									18
								).lat
							]);
						}

						arrayOfHoles.push(hole);
					}

					//проверка на пересечение
					//проверяем каждый полигон и каждый бублик на предмет пересечения.
					if (arrayOfHoles.length > 0) {
						for (var p = 0; p < geometry.coordinates.length; p++) {
							for (var ah = 0; ah < arrayOfHoles.length; ah++) {
								var intersectResult = TDMap.Utils.GeoUtil.intersectionByBBox(arrayOfHoles[ah], geometry.coordinates[p][0], that.map);
								if (intersectResult) {
									geometry.coordinates[p].push(arrayOfHoles[ah]);
								}
							}
						}
					}

					var o = {
						type: "Feature"
					};
					o.geometry = geometry;
					o.properties = requestResult[0].properties;
					if (o.properties.util_code === null)
						o.properties.util_code = 999;

					if (o.properties.fp === null)
						o.properties.fp = 999;

					if (o.properties.area_unit === null)
						o.properties.area_unit = 999;

					if (o.properties.cad_unit === null)
						o.properties.cad_unit = 999;

					if (o.properties.category_type === null)
						o.properties.category_type = 999;

					if (o.properties.util_code === null)
						o.properties.util_code = 999;

					if (o.properties.statecd === null)
						o.properties.statecd = 999;
					deferred.resolve(o, "withCoords");
				}, function(err) {
					deferred.resolve(err, "error");
				});
			} else if (type === "withoutCoords") {
				deferred.resolve(requestResult, "withoutCoords");
			} else if (type === "noObjects") {
				deferred.resolve(requestResult, "noObjects");
			}
		}, function(err) {
			deferred.resolve(err, "error");
		});

		return deferred.promise();
	}

	getFullListOflngLats(bounds) {
		var tolerance = this.options.step;
		var crs = this.options.crs;

		var boundedGeometry = this.getBboxOfPointsArray(bounds);
		var metricBbox = [];

		metricBbox.push(L.Projection.Mercator.project(new L.LatLng(boundedGeometry[0], boundedGeometry[1])));
		metricBbox.push(L.Projection.Mercator.project(new L.LatLng(boundedGeometry[2], boundedGeometry[3])));

		var allX = [];
		var allY = [];
		var allXY = [];
		var i = metricBbox[0].x;
		var j = metricBbox[0].y;
		do {
			allX.push(i);
			i += this.options.step;
		} while (i < metricBbox[1].x);

		do {
			allY.push(j);
			j += this.options.step;
		} while (j < metricBbox[1].y);

		for (var k = 0; k < allX.length; k++) {
			for (var l = 0; l < allY.length; l++) {
				allXY.push([allX[k], allY[l]]);
			}
		}

		return allXY;
	}

	getBboxOfPointsArray(bounds) {
		var bbox = [
			Number.POSITIVE_INFINITY,
			Number.POSITIVE_INFINITY,
			Number.NEGATIVE_INFINITY,
			Number.NEGATIVE_INFINITY
		];

		var arraysOfPointsSort = bounds.reduce(function(prev, coord) {
			return [
				Math.min(coord[0], prev[0]),
				Math.min(coord[1], prev[1]),
				Math.max(coord[0], prev[2]),
				Math.max(coord[1], prev[3])
			];
		}, bbox);

		return arraysOfPointsSort;
	}

	getArrayofPointsInsideGeometry(bounds) {
		var fullList = this.getFullListOflngLats(bounds);
		var boundedList = [];

		for (var i = 0; i < fullList.length; i++) {
			var checked = this.checkLngLatString(
				[
					L.Projection.Mercator.unproject(new L.Point(fullList[i][0], fullList[i][1])).lat,
					L.Projection.Mercator.unproject(new L.Point(fullList[i][0], fullList[i][1])).lng
				],
				bounds
			);
			if (checked === true) {
				boundedList.push([
					L.Projection.Mercator.unproject(new L.Point(fullList[i][0], fullList[i][1])).lat,
					L.Projection.Mercator.unproject(new L.Point(fullList[i][0], fullList[i][1])).lng
				]);
			}
		}

		return boundedList;
	}

	checkLngLatString(pointCoordinates, bboxCoords) {
		var x = pointCoordinates[0],
			y = pointCoordinates[1];

		var inside = false;

		for (
			var i = 0, j = bboxCoords.length - 1; i < bboxCoords.length; j = i++
		) {
			var xi = bboxCoords[i][0],
				yi = bboxCoords[i][1];
			var xj = bboxCoords[j][0],
				yj = bboxCoords[j][1];

			var intersect =
				yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;

			if (intersect) {
				inside = !inside;
			}
		}

		return inside;
	}
}