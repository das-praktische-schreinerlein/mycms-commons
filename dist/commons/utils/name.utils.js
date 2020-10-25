"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NameUtils = /** @class */ (function () {
    function NameUtils() {
    }
    NameUtils.normalizeNames = function (src, defaultValue) {
        var res = src && src.length > 0 ? src : '';
        res = res.replace(/\s+/g, ' ').trim();
        if (res.length > 0) {
            return res;
        }
        else {
            return defaultValue;
        }
    };
    NameUtils.normalizeTechnicalNames = function (src) {
        return NameUtils.normalizeKwNames(src).toLocaleLowerCase();
    };
    NameUtils.normalizeFileNames = function (src) {
        var res = src && src.length > 0 ? NameUtils.normalizeNames(src, '') : '';
        res = NameUtils.normalizeNames(res.replace(/[^-_ a-zA-Z0-9äöüßÄÖÜ]+/g, ' ').trim(), '');
        if (res.length > 0) {
            return res;
        }
        else {
            return '';
        }
    };
    NameUtils.normalizeKwNames = function (src) {
        var res = src && src.length > 0 ? NameUtils.normalizeNames(src, '') : '';
        res = NameUtils.normalizeNames(res.replace(/[ ;:'"´`()/&$!]+/g, '').trim(), '');
        if (res.length > 0) {
            return res;
        }
        else {
            return '';
        }
    };
    NameUtils.remapData = function (mappings, type, remapSubType, key, value) {
        if (mappings[type] !== undefined && mappings[type][key.toLocaleLowerCase()]
            && mappings[type][key.toLocaleLowerCase()][remapSubType]) {
            return mappings[type][key.toLocaleLowerCase()][remapSubType];
        }
        return value;
    };
    return NameUtils;
}());
exports.NameUtils = NameUtils;
//# sourceMappingURL=name.utils.js.map