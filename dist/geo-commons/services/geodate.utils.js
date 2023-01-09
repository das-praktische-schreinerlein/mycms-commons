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
    GeoDateUtils.getTimeOffset = function (timeZone, date) {
        if (!date) {
            date = new Date(Date.UTC(1970, 1, 1));
        }
        var timeZoneObj = Intl.DateTimeFormat("ia", {
            timeZoneName: "short",
            timeZone: timeZone,
        });
        return GeoDateUtils.getOffset(timeZoneObj, date);
    };
    GeoDateUtils.getOffset = function (timeZoneObj, date) {
        var timeZoneParts = timeZoneObj.formatToParts(date);
        var timeZoneName = timeZoneParts.find(function (i) { return i.type === "timeZoneName"; }).value;
        var offset = timeZoneName.slice(3);
        if (!offset) {
            return 0;
        }
        var matchData = offset.match(/([+-])(\d+)(?::(\d+))?/);
        if (!matchData)
            throw "cannot parse timezone name: " + timeZoneName;
        var sign = matchData[1], hour = matchData[2], minute = matchData[3];
        var result = parseInt(hour) * 60;
        if (sign === "+") {
            result *= -1;
        }
        if (minute) {
            result += parseInt(minute);
        }
        return result;
    };
    return GeoDateUtils;
}());
exports.GeoDateUtils = GeoDateUtils;
//# sourceMappingURL=geodate.utils.js.map