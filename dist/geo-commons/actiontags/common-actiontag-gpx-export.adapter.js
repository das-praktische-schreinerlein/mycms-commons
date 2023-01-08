"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = require("js-data");
var CommonActiontagGpxExportAdapter = /** @class */ (function () {
    function CommonActiontagGpxExportAdapter(backendGeoService) {
        this.backendGeoService = backendGeoService;
    }
    CommonActiontagGpxExportAdapter.prototype.executeActionTagExportGpx = function (table, id, actionTagForm) {
        var _this = this;
        if (!js_data_1.utils.isInteger(id)) {
            return Promise.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        return this.backendGeoService.readGeoEntityForId(table, id).then(function (entity) {
            if (entity === undefined) {
                return Promise.reject('no valid entity for id:' + id);
            }
            return _this.backendGeoService.exportGpxToFile(entity, true);
        }).then(function () {
            return Promise.resolve(true);
        }).catch(function errorPlaylist(reason) {
            console.error('_doActionTag ExportGpx ' + table + ' failed:', reason);
            return Promise.reject(reason);
        });
    };
    return CommonActiontagGpxExportAdapter;
}());
exports.CommonActiontagGpxExportAdapter = CommonActiontagGpxExportAdapter;
//# sourceMappingURL=common-actiontag-gpx-export.adapter.js.map