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
    return StringUtils;
}());
exports.StringUtils = StringUtils;
//# sourceMappingURL=string.utils.js.map