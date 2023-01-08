"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tzlookup = require("tz-lookup/tz");
var GeoDateUtils = /** @class */ (function () {
    function GeoDateUtils() {
    }
    GeoDateUtils.getLocalDateTimeForLatLng = function (pos) {
        if (!pos || !pos['time']) {
            return undefined;
        }
        var timezone = GeoDateUtils.getTimezone(pos);
        if (!timezone) {
            return pos['time'];
        }
        return GeoDateUtils.getDateForTimezone(pos['time'], timezone);
    };
    GeoDateUtils.getTimezone = function (pos) {
        if (!pos) {
            return undefined;
        }
        return tzlookup(pos.lat, pos.lng);
    };
    GeoDateUtils.getDateForTimezone = function (date, timezone) {
        if (!date) {
            return undefined;
        }
        var dateString = date.toLocaleString('en-US', { timeZone: timezone });
        return new Date(dateString);
    };
    GeoDateUtils.getTimeOffsetToUtc = function (pos) {
        var origDate = pos['time'];
        if (!origDate) {
            return undefined;
        }
        var localDate = GeoDateUtils.getLocalDateTimeForLatLng(pos);
        var utcDate = GeoDateUtils.getDateForTimezone(origDate, 'Europe/London');
        return new Date(localDate.getTime() - utcDate.getTime()).getTime() / 60 / 60 / 1000;
    };
    return GeoDateUtils;
}());
exports.GeoDateUtils = GeoDateUtils;
//# sourceMappingURL=geodate.utils.js.map