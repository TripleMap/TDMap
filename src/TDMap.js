// utils
import { GeoUtil } from "./utils/TDMap.Utils.GeoUtil.js";
import { Promises } from "./utils/TDMap.Utils.Promises.js";

// tools
import { MeasurmentUtils, Measurment } from "./tools/TDMap.Tools.Measurment.js";
import { SpatialFilterUtils, SpatialFilter } from "./tools/TDMap.Tools.SpatialFilter.js";
import { PulseMarker, IconPulse } from "./tools/TDMap.Tools.PulseMarker.js";

// routing
import { Routing } from "./routing/TDMap.Routing.Router.js";

// services
import { GeoJSONService } from "./providers/TDMap.Provider.GeoJSONProvider/TDMap.Service.GeoJSONService.js";

// layers
import { GoogleProvider } from "./providers/TDMap.Provider.GoogleProvider.js";
import { YandexProvider } from "./providers/TDMap.Provider.YandexProvider.js";
import { RosreestrProvider } from "./providers/TDMap.Provider.RosreestrProvider.js";

// cadastralUtils
import { CadastralSearchDataService } from './cadastralTools/TDMap.CadastralTools.DataService.js';

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
            SpatialFilter,
            IconPulse,
            PulseMarker
        };
        this.Utils = {
            GeoUtil,
            Promises
        };
        this.CadastralUtils = {
            CadastralSearchDataService
        }
        this.Routing = Routing;
    }
}

export const TDMap = new TDMapConstructor();
window.TDMap = TDMap;
// manager 
import { BaseManager } from "./mapping/TDMap.Mapping.Manager.js";

/*
 	params {
		mapDivId: divid,
	{	center: [number, number]
		zoom: number,
		editable: boolean,
		zoomControl: boolea,}

		{memorize: boolean}
	}
*/
class TDMapManagerConstructor extends BaseManager {
    constructor(mapId, mapOptions, managerOptions) {
        super(mapId, mapOptions, managerOptions);
    }
}

export const TDMapManager = TDMapManagerConstructor;
window.TDMapManager = TDMapManager;