"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GeoCalcUtils = /** @class */ (function () {
    function GeoCalcUtils() {
    }
    GeoCalcUtils.calcDistance = function (degLat1, degLng1, degLat2, degLng2) {
        var radius = 6371;
        var diffLat = this.deg2Rad(degLat2 - degLat1);
        var diffLng = this.deg2Rad(degLng2 - degLng1);
        var lat1 = this.deg2Rad(degLat1);
        var lat2 = this.deg2Rad(degLat2);
        var a = Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
            Math.sin(diffLng / 2) * Math.sin(diffLng / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return radius * c;
    };
    GeoCalcUtils.calcDegDistance = function (degLat1, degLng1, degLat2, degLng2) {
        return this.calcRadDistance(this.deg2Rad(degLat1), this.deg2Rad(degLng1), this.deg2Rad(degLat2), this.deg2Rad(degLng2));
    };
    GeoCalcUtils.calcRadDistance = function (lat1, lng1, lat2, lng2) {
        var radius = 6371;
        var diffLat = lat2 - lat1;
        var diffLng = lng2 - lng1;
        var a = Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
            Math.sin(diffLng / 2) * Math.sin(diffLng / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return radius * c;
    };
    GeoCalcUtils.deg2Rad = function (degValue) {
        return degValue * Math.PI / 180;
    };
    return GeoCalcUtils;
}());
exports.GeoCalcUtils = GeoCalcUtils;
//# sourceMappingURL=geo-calcutils.js.map