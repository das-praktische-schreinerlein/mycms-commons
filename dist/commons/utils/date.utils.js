"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var string_utils_1 = require("./string.utils");
var DateUtils = /** @class */ (function () {
    function DateUtils() {
    }
    DateUtils.parseDate = function (date) {
        if (date === undefined || date === null || (util_1.isString(date) && date.toString() === '')) {
            return undefined;
        }
        if (!util_1.isDate(date)) {
            if (util_1.isNumber(date)) {
                date = new Date(date);
            }
            else if (util_1.isString(date)) {
                return DateUtils.parseDateStringWithLocaltime(date);
            }
            else {
                return undefined;
            }
        }
        return date;
    };
    DateUtils.parseDateStringWithLocaltime = function (date) {
        if (date === undefined || date === null || (util_1.isString(date) && date.toString() === '') || !util_1.isString(date)) {
            return undefined;
        }
        // parse Date for localtime ISO
        var dateParts = date.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):{0,1}(\d{2}){0,1}$/);
        if (dateParts !== null) {
            dateParts = dateParts.slice(1);
            dateParts[1] = (Number(dateParts[1]) - 1) + ''; // months are zero-based
            date = new Date();
            date.setFullYear(dateParts[0], dateParts[1], dateParts[2]);
            date.setHours(dateParts[3], dateParts[4], dateParts.length > 5 && dateParts[5] !== undefined ? dateParts[5] : 0);
            date.setMilliseconds(0);
            return date;
        }
        // parse Date for localtime German
        dateParts = date.match(/^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})$/);
        if (dateParts !== null) {
            dateParts = dateParts.slice(1);
            dateParts[1] = (Number(dateParts[1]) - 1) + ''; // months are zero-based
            date = new Date();
            date.setFullYear(dateParts[2], dateParts[1], dateParts[0]);
            date.setHours(dateParts[3], dateParts[4], dateParts[5]);
            date.setMilliseconds(0);
            return date;
        }
        // parse Date for localtime German with timezone
        dateParts = date.match(/^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2}) \(UTC([-+0-9])+\)$/);
        if (dateParts !== null) {
            dateParts = dateParts.slice(1);
            dateParts[1] = (Number(dateParts[1]) - 1) + ''; // months are zero-based
            date = new Date();
            date.setFullYear(dateParts[2], dateParts[1], dateParts[0]);
            var timezoneOffset = Number(dateParts[6]);
            var hour = Number(dateParts[3]) + timezoneOffset - date.getTimezoneOffset() / 60; // add with date.timezoneOffset and local.timezoneOffset
            date.setHours(hour, dateParts[4], dateParts[5]);
            date.setMilliseconds(0);
            return date;
        }
        return new Date(Date.parse(date));
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
        return [string_utils_1.StringUtils.padStart(date.getDate().toString(), '00'),
            dateSeparator,
            string_utils_1.StringUtils.padStart((date.getMonth() + 1).toString(), '00'),
            dateSeparator,
            date.getFullYear(),
            dateTimeSeparator,
            string_utils_1.StringUtils.padStart(date.getHours().toString(), '00'),
            timeSeparator,
            string_utils_1.StringUtils.padStart(date.getMinutes().toString(), '00'),
            timeSeparator,
            string_utils_1.StringUtils.padStart(date.getSeconds().toString(), '00')].join('');
    };
    return DateUtils;
}());
exports.DateUtils = DateUtils;
//# sourceMappingURL=date.utils.js.map