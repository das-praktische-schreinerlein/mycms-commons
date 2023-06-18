"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var string_utils_1 = require("./string.utils");
var geodate_utils_1 = require("../../geo-commons/services/geodate.utils");
var DateUtils = /** @class */ (function () {
    function DateUtils() {
    }
    DateUtils.parseDate = function (date, timezone) {
        if (date === undefined || date === null || (util_1.isString(date) && date.toString() === '')) {
            return undefined;
        }
        if (!util_1.isDate(date)) {
            if (util_1.isNumber(date)) {
                date = new Date(date);
            }
            else if (util_1.isString(date)) {
                if (timezone) {
                    return DateUtils.parseDateStringWithLocaltime(date, timezone);
                }
                else {
                    return DateUtils.parseDateStringWithLocaltime(date);
                }
            }
            else {
                return undefined;
            }
        }
        return date;
    };
    DateUtils.parseDateStringWithLocaltime = function (dateSrc, timezone) {
        if (dateSrc === undefined || dateSrc === null
            || (util_1.isString(dateSrc) && dateSrc.toString() === '')
            || !util_1.isString(dateSrc)) {
            return undefined;
        }
        // parse Date for localtime ISO
        var dateParts = dateSrc.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):{0,1}(\d{2}){0,1}$/);
        if (dateParts !== null) {
            dateParts = dateParts.slice(1);
            var date = DateUtils.createDateForTimezone(dateParts[0], dateParts[1], dateParts[2], dateParts[3], dateParts[4], dateParts.length > 5 && dateParts[5] !== undefined
                ? Number(dateParts[5])
                : 0, timezone);
            return date;
        }
        // parse Date for localtime German
        dateParts = dateSrc.match(/^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})$/);
        if (dateParts !== null) {
            dateParts = dateParts.slice(1);
            var date = DateUtils.createDateForTimezone(dateParts[2], dateParts[1], dateParts[0], dateParts[3], dateParts[4], dateParts[5], timezone);
            return date;
        }
        // parse Date for localtime German with timezone
        dateParts = dateSrc.match(/^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2}) \(UTC([-+0-9])+\)$/);
        if (dateParts !== null) {
            dateParts = dateParts.slice(1);
            var tmpDate = new Date();
            tmpDate.setFullYear(Number(dateParts[2]), Number(dateParts[1]), Number(dateParts[0]));
            var timezoneOffset = Number(dateParts[6]);
            var hour = Number(dateParts[3]) + timezoneOffset - tmpDate.getTimezoneOffset() / 60; // add with date.timezoneOffset and local.timezoneOffset
            var date = DateUtils.createDateForTimezone(dateParts[2], dateParts[1], dateParts[1], hour, dateParts[4], dateParts.length > 5 && dateParts[5] !== undefined
                ? Number(dateParts[5])
                : 0, timezone);
            return date;
        }
        return new Date(Date.parse(dateSrc));
    };
    DateUtils.dateToLocalISOString = function (src) {
        var date = DateUtils.parseDate(src);
        if (date === undefined || date === null || !util_1.isDate(date)) {
            return undefined;
        }
        var ten = function (i) {
            return (i < 10 ? '0' : '') + i;
        }, YYYY = date.getFullYear(), MM = ten(date.getMonth() + 1), DD = ten(date.getDate()), HH = ten(date.getHours()), II = ten(date.getMinutes()), SS = ten(date.getSeconds());
        return YYYY + '-' + MM + '-' + DD + 'T' +
            HH + ':' + II + ':' + SS;
    };
    DateUtils.formatDateRange = function (start, end) {
        var formatOptionsShort = { day: '2-digit' };
        var formatOptionsLong = { year: 'numeric', month: '2-digit', day: '2-digit' };
        var datestart = start.toLocaleString('de-DE', formatOptionsLong);
        var dateend = end.toLocaleString('de-DE', formatOptionsLong);
        if (datestart !== dateend) {
            return start.toLocaleString('de-DE', formatOptionsShort)
                + '-' + dateend;
        }
        else {
            return dateend;
        }
    };
    DateUtils.formatDateTime = function (start) {
        var formatOptionsLong = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
            second: '2-digit' };
        return start.toLocaleString('de-DE', formatOptionsLong);
    };
    DateUtils.formatToFileNameDate = function (date, dateSeparator, dateTimeSeparator, timeSeparator) {
        return [date.getFullYear(),
            dateSeparator,
            string_utils_1.StringUtils.padStart((date.getMonth() + 1).toString(), '00'),
            dateSeparator,
            string_utils_1.StringUtils.padStart(date.getDate().toString(), '00'),
            dateTimeSeparator,
            string_utils_1.StringUtils.padStart(date.getHours().toString(), '00'),
            timeSeparator,
            string_utils_1.StringUtils.padStart(date.getMinutes().toString(), '00'),
            timeSeparator,
            string_utils_1.StringUtils.padStart(date.getSeconds().toString(), '00')].join('');
    };
    DateUtils.createDateForTimezone = function (year, month, day, hour, minute, second, timezone) {
        var date = new Date();
        month = (Number(month) - 1);
        date.setFullYear(Number(year), Number(month), Number(day));
        if (timezone) {
            var offset = geodate_utils_1.GeoDateUtils.getTimeOffset(timezone, date);
            var utcHour = Number(hour) + (offset) / 60;
            date = new Date(Date.UTC(Number(year), Number(month), Number(day), Number(utcHour), Number(minute), second !== undefined
                ? Number(second)
                : 0));
        }
        else {
            date.setHours(Number(hour), Number(minute), second > 5 && second !== undefined
                ? Number(second)
                : 0);
            date.setMilliseconds(0);
        }
        return date;
    };
    return DateUtils;
}());
exports.DateUtils = DateUtils;
//# sourceMappingURL=date.utils.js.map