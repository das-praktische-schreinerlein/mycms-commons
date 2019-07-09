"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringUtils = /** @class */ (function () {
    function StringUtils() {
    }
    StringUtils.trimKeywords = function (src) {
        if (src === undefined) {
            return '';
        }
        return src.replace(/[^-a-zA-Z_0-9äöüßÄÖÜ,:.]+/g, '').replace(/^[,;]*/g, '').replace(/[,;]*$/g, '');
    };
    StringUtils.uniqueKeywords = function (src) {
        var keywordsList = [];
        StringUtils.trimKeywords(src).split(/[,;]+/).map(function (keyword) {
            if (keyword !== '' && keywordsList.indexOf(keyword) < 0) {
                keywordsList.push(keyword);
            }
        });
        return keywordsList;
    };
    StringUtils.mergeKeywords = function (src, mergerSrc, subtract) {
        var keywordsList = StringUtils.uniqueKeywords(src);
        var mergerList = StringUtils.uniqueKeywords(mergerSrc);
        mergerList.map(function (keyword) {
            if (subtract) {
                while (keywordsList.indexOf(keyword) >= 0) {
                    keywordsList.splice(keywordsList.indexOf(keyword), 1);
                }
            }
            else {
                if (keywordsList.indexOf(keyword) < 0) {
                    keywordsList.push(keyword);
                }
            }
        });
        return keywordsList.join(',');
    };
    StringUtils.calcCharCodeForListIndex = function (code) {
        var baseChar = ('A').charCodeAt(0);
        var res = '';
        do {
            code -= 1;
            res = String.fromCharCode(baseChar + (code % 26)) + res;
            code = (code / 26) >> 0;
        } while (code > 0);
        return res;
    };
    StringUtils.generateTechnicalName = function (name) {
        return name ? name.replace(/[^-a-zA-Z0-9.+]+/g, ' ')
            .replace(/ +/g, ' ')
            .replace(/ /g, '-')
            .trim()
            .toLowerCase() : '';
    };
    StringUtils.findNeedle = function (source, needle, findIdx) {
        var lastPos = -needle.length;
        var curPos = -1;
        var idx = -1;
        do {
            curPos = source.indexOf(needle, lastPos + needle.length);
            if (curPos >= 0) {
                lastPos = curPos;
                idx++;
            }
        } while (curPos >= 0 && idx < findIdx);
        return lastPos >= 0 && idx === findIdx ? lastPos : -1;
    };
    return StringUtils;
}());
exports.StringUtils = StringUtils;
//# sourceMappingURL=string.utils.js.map