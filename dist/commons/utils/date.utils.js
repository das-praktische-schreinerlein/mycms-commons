"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
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
        // parse Date for locatime
        var dateParts = date.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):{0,1}(\d{2}){0,1}$/);
        if (dateParts !== null) {
            dateParts = dateParts.slice(1);
            dateParts[1] -= 1; // months are zero-based
            date = new Date();
            date.setFullYear(dateParts[0], dateParts[1], dateParts[2]);
            date.setHours(dateParts[3], dateParts[4], dateParts.length > 5 && dateParts[5] !== undefined ? dateParts[5] : 0);
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
    return DateUtils;
}());
exports.DateUtils = DateUtils;
//# sourceMappingURL=date.utils.js.map