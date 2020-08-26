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
    StringUtils.createReplacementsFromConfigArray = function (config) {
        var replacementConfig = [];
        if (Array.isArray(config)) {
            for (var _i = 0, config_1 = config; _i < config_1.length; _i++) {
                var replacement = config_1[_i];
                if (Array.isArray(replacement) && replacement.length === 2) {
                    replacementConfig.push([new RegExp(replacement[0]), replacement[1]]);
                }
            }
        }
        return replacementConfig;
    };
    StringUtils.doReplacements = function (src, nameReplacements) {
        if (src === undefined || src === null || !nameReplacements || !Array.isArray(nameReplacements)) {
            return src;
        }
        var name = src;
        for (var _i = 0, nameReplacements_1 = nameReplacements; _i < nameReplacements_1.length; _i++) {
            var replacement = nameReplacements_1[_i];
            name = name.replace(replacement[0], replacement[1]);
        }
        return name;
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