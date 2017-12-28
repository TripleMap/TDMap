// utils
import { GeoUtil } from "./utils/TDMap.Utils.GeoUtil.js";
import { Promises } from "./utils/TDMap.Utils.Promises.js";
import { CadastrSearchProviderPPK5 } from "./utils/TDMap.Utils.rosreesrtParse.js";
import { CadastrSearchPPK5 } from "./utils/TDMap.Utils.rosreesrtParse.js";

// tools
import { MeasurmentUtils, Measurment } from "./tools/TDMap.Tools.Measurment.js";
import {
	SpatialFilterUtils,
	SpatialFilter
} from "./tools/TDMap.Tools.SpatialFilter.js";

// routing
import { Routing } from "./routing/TDMap.Routing.Router.js";

// services
import { GeoJSONService } from "./providers/TDMap.Provider.GeoJSONProvider/TDMap.Service.GeoJSONService.js";

// layers
import { GoogleProvider } from "./providers/TDMap.Provider.GoogleProvider.js";
import { YandexProvider } from "./providers/TDMap.Provider.YandexProvider.js";
import { RosreestrProvider } from "./providers/TDMap.Provider.RosreestrProvider.js";

// complete
class TDMapConstructor {
	constructor() {
		this.Service = {
			GeoJSONService
		};
		this.Layers = {
			GoogleProvider,
			YandexProvider,
			RosreestrProvider
		};
		this.Tools = {
			MeasurmentUtils,
			Measurment,
			SpatialFilterUtils,
			SpatialFilter
		};
		this.Utils = {
			GeoUtil,
			Promises,
			CadastrSearchProviderPPK5,
			CadastrSearchPPK5
		};
		this.Routing = Routing;
	}
}

export var TDMap = new TDMapConstructor();
window.TDMap = TDMap;




// manager 
import { Manager } from "./mapping/TDMap.Mapping.Manager.js";


class TDMapManagerConstructor extends Manager {
	constructor(mapDivId, center, zoom) {
		this.super(mapDivId, center, zoom);
	}
}

export var TDMapManager = TDMapManagerConstructor;
