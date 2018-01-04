let random = () => Math.floor((1 + Math.random()) * 0x10000)
	.toString(16)
	.substring(1);


export class CadastrSearchProviderPPK5 {
	constructor(map) {
		this.map = map;
	}
	getDataByMaskAsynch(cadNum) {
		var d = $.Deferred();
		var urlOptions = {
			text: cadNum,
			tolerance: "16391",
			limit: 16,
			callback: `JQuery${random()}${random()}`
		};

		this[urlOptions.callback] = function(data) {};
		$.ajax({
			url: `https://pkk5.rosreestr.ru/api/features/1/${cadNum.split(':').map(elem => Number(elem)).join(':')}`,
			type: "GET",
			dataType: "jsonp",
			success: function(response) {
				if (!response.feature) {
					d.resolve([], "noObjects");
					return
				}
				if (response.feature.center && response.feature.extent) {
					let cords = L.Projection.SphericalMercator.unproject(
						L.point(response.feature.center.x, response.feature.center.y)
					);
					let obj = {
						type: "Feature",
						geojson: {
							type: "Point",
							coordinates: [
								cords[Object.keys(cords)[1]],
								cords[Object.keys(cords)[0]]
							]
						},
						properties: response.feature.attrs
					};
					obj.properties.extent = response.feature.extent;
					obj.properties.center = response.feature.center;
					d.resolve([obj], "withCoords");
				} else {
					d.resolve([{
						type: "Feature",
						properties: {
							cn: response.feature.attrs.cn,
							id: response.feature.attrs.id
						}
					}], "withoutCoords");
				}
			},
			error: function(error) {
				d.reject(" Failed: " + error);
			}
		});

		return d.promise();
	}

	getPointsOfImageByMaskAsynch(cadnum, options) {
		var d = $.Deferred();
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
				"6": `ID = '${cadnum}'`,
				"7": `ID = '${cadnum}'`
			}),
			f: "image"
		};

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

					let c = document.createElement("canvas");
					c.width = image.width;
					c.height = image.height;

					let ctx = c.getContext("2d");
					ctx.drawImage(image, 0, 0);
					ctx.fillStyle = "rgb(255, 255, 0)";
					ctx.beginPath();

					for (var z = 0; z < pathPoints.length; z++) {
						if (pathPoints[z].length > 3) {
							for (var i = 0; i < pathPoints[z].length; i++) {
								if (i === 0) {
									ctx.moveTo(pathPoints[z][i].x, pathPoints[z][i].y);
								} else if (i === pathPoints[z].length) {
									ctx.lineTo(pathPoints[z][i].x, pathPoints[z][i].y);
								} else {
									ctx.lineTo(pathPoints[z][i].x, pathPoints[z][i].y);
								}
							}
						}
					}

					ctx.rect(0, 0, image.width, image.height);
					ctx.fill();

					var imgData = ctx.getImageData(0, 0, image.width, image.height);
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

					var polygons = pathPoints.filter(item => item.length > 2 ? item : false);
					var holes = pinPoints.filter(item => item.length > 2 ? item : false);

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
		return d.promise();
	}

	getDataByLocationAsynch(lngLatString) {
		var d = $.Deferred();
		getDataFromServer();

		function getDataFromServer() {
			var urlOptions = {
				text: lngLatString,
				tolerance: "16",
				limit: 11,
				callback: "JQuery" + random() + random()
			};

			this[urlOptions.callback] = function(data) {};
			$.ajax({
				url: "https://pkk5.rosreestr.ru/api/features/1?",
				type: "GET",
				data: urlOptions,
				dataType: "jsonp",
				jsonpCallback: urlOptions.callback,
				crossDomain: true,
				success: function(response) {
					if (!response.features.length) {
						d.resolve([]);
						return;
					}
					let result = response.features.map((item) => {
						let cords = L.Projection.SphericalMercator.unproject(
							L.point(item.center.x, item.center.y)
						);
						return {
							display_name: item.attrs.address,
							type: "Feature",
							geojson: {
								type: "Point",
								coordinates: [cords[Object.keys(cords)[1]], cords[Object.keys(cords)[0]]]
							},
							properties: {
								address: item.attrs.address,
								cn: item.attrs.cn,
								id: item.attrs.id,
								extent: item.extent,
								type: item.type
							}
						};
					});

					d.resolve(result);
				},
				error: function(error) {
					d.reject(error);
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
		var d = $.Deferred();
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
					x: newBoundsNorthEast.min.x + that.map.getSize().x / 2,
					y: newBoundsNorthEast.min.y + that.map.getSize().y / 2
				};
				var futureSW = {
					x: newBoundsSouthWest.min.x + that.map.getSize().x / 2,
					y: newBoundsSouthWest.min.y + that.map.getSize().y / 2
				};

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
							hole.push([that.map.unproject(holePoint, 18).lng, that.map.unproject(holePoint, 18).lat]);
						}
						if (holes[h].length > 0) {
							var lastHolePoint = L.point(
								holes[h][0].x * d[1] + futureSW.x,
								holes[h][0].y * d[1] + futureNE.y
							);
							hole.push([
								that.map.unproject(lastHolePoint, 18).lng,
								that.map.unproject(lastHolePoint, 18).lat
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
						type: "Feature",
						geometry: geometry,
						properties: requestResult[0].properties
					};
					d.resolve(o, "withCoords");
				}, function(err) {
					d.resolve(err, "error");
				});
			} else if (type === "withoutCoords") {
				d.resolve(requestResult, "withoutCoords");
			} else if (type === "noObjects") {
				d.resolve(requestResult, "noObjects");
			}
		}, function(err) {
			d.resolve(err, "error");
		});

		return d.promise();
	}
}