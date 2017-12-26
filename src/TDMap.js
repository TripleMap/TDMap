// utils
import {GeoUtil} from "./utils/TDMap.Utils.GeoUtil.js";

import {
	MeasurmentUtils,
	Measurment
} from "./utils/TDMap.Utils.Measurment.js";

import {Promises} from "./utils/TDMap.Utils.Promises.js";
import {CadastrSearchProviderPPK5} from "./utils/TDMap.Utils.rosreesrtParse.js";
import {CadastrSearchPPK5} from "./utils/TDMap.Utils.rosreesrtParse.js";

import {
	SpatialFilterUtils,
	SpatialFilter
} from "./utils/TDMap.Utils.SpatialFilter.js";

// routing
import {Routing} from "./routing/TDMap.Routing.Router.js";


// layers

import {GeoJSONServiceLayer} from "./service/TDMap.Service.GeoJSONServiceLayer.js";
import {googleMutant} from "./service/TDMap.Service.GoogleMutant.js";
import {YandexProvider} from "./service/TDMap.Service.YandexProvider.js";
import {RosreestrProvider} from "./service/TDMap.Service.RosreestrProvider.js";

class TDMapConstructor {
	constructor() {
		this.Service = {
			GeoJSONServiceLayer,
			YandexProvider,
			RosreestrProvider,
			googleMutant
		};
		this.Layers = {};
		this.Utils = {
			GeoUtil,
			MeasurmentUtils,
			Measurment,
			Promises,
			SpatialFilterUtils,
			SpatialFilter,
			CadastrSearchProviderPPK5,
			CadastrSearchPPK5
		};
		this.Routing = Routing;
	}
}

export var TDMap = new TDMapConstructor();
window.TDMap = TDMap;