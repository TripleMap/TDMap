export class Manager {

	constructor(mapDivId, center, zoom, memorize) {
		this.createLeafletMap(mapDivId, center, zoom);
		if (memorize) {
			this.restoreMapPosition();
		}
	}

	createLeafletMap(mapDivId, center, zoom) {
		this._map = L.map(mapElementId, {
			editable: true,
			center: center,
			zoom: zoom,
			zoomControl: false
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

}