"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_utils_1 = require("../../commons/utils/log.utils");
var CommonGeoLoader = /** @class */ (function () {
    function CommonGeoLoader(http, parser) {
        this.http = http;
        this.parser = parser;
    }
    CommonGeoLoader.prototype.loadDataFromUrl = function (url, options) {
        var me = this;
        return new Promise(function (resolve, reject) {
            me.http.makeHttpRequest({ method: 'get', url: url, withCredentials: true })
                .then(function onLoaded(res) {
                return resolve(me.parser.parse(res.text(), options));
            }).catch(function onError(error) {
                console.error('loading geofeature failed:' + log_utils_1.LogUtils.sanitizeLogMsg(url), error);
                return reject(error);
            });
        });
    };
    CommonGeoLoader.prototype.loadData = function (src, options) {
        var _this = this;
        return new Promise(function (resolve) {
            return resolve(_this.parser.parse(src, options));
        });
    };
    CommonGeoLoader.prototype.isResponsibleForSrc = function (src) {
        return this.parser.isResponsibleForSrc(src);
    };
    CommonGeoLoader.prototype.isResponsibleForFile = function (fileName) {
        return this.parser.isResponsibleForFile(fileName);
    };
    return CommonGeoLoader;
}());
exports.CommonGeoLoader = CommonGeoLoader;
//# sourceMappingURL=geo.loader.js.map