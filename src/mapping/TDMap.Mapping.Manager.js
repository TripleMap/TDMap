export class Manager {

	constructor(params) {
		this.options = params;
		this.createLeafletMap(params.mapDivId || 'map', params.center || [60, 30], params.zoom || 12, params.zoomControl || false, params.editable || false);
		if (params.memorize) {
			this.restoreMapPosition();
		}
	}

	createLeafletMap(mapDivId, center, zoom, zoomControl, editable) {
		this._map = L.map(mapDivId, {
			editable,
			center,
			zoom,
			zoomControl
		});
	}

	restoreMapPosition() {
		let zoom, lat, lng;

		const zoomState = window.localStorage.getItem("MAP_STATE_ZOOM");
		const latState = window.localStorage.getItem("MAP_STATE_COORDINATES_LAT");
		const lngState = window.localStorage.getItem("MAP_STATE_COORDINATES_LNG");

		if (zoomState) {
			zoom = Number(zoomState);
		}

		if (latState && lngState) {
			lat = Number(latState);
			lng = Number(lngState);
		}

		if (zoom && lat && lng) {
			this._map.setView([lat, lng], zoom);
		}

		let saveMapState = () => {
			window.localStorage.setItem("MAP_STATE_ZOOM", this._map.getZoom());
			window.localStorage.setItem("MAP_STATE_COORDINATES_LAT", this._map.getCenter().lat);
			window.localStorage.setItem("MAP_STATE_COORDINATES_LNG", this._map.getCenter().lng);
		};

		window.addEventListener("beforeunload", saveMapState);
	}

	updateMapPosition(latLng, zoom) {
		this._map.setView(latLng, zoom);
		return this;
	}

}