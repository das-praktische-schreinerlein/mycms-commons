"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringUtils = /** @class */ (function () {
    function StringUtils() {
    }
    StringUtils.trimKeywords = function (src) {
        if (src === undefined) {
            return '';
        }
        return src.replace(/[^-a-zA-Z_0-9äöüßÄÖÜ,:.]+/g, '')
            .replace(/^[,;]*/g, '')
            .replace(/[,;]*$/g, '');
    };
    StringUtils.uniqueKeywords = function (src) {
        var keywordsList = [];
        StringUtils.trimKeywords(src)
            .split(/[,;]+/)
            .map(function (keyword) {
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
                    replacementConfig.push([new RegExp(replacement[0], 'g'), replacement[1]]);
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
    StringUtils.replaceUmlauts = function (src) {
        return src
            .replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, function (a) {
            var big = StringUtils.UMLAUTMAP[a.slice(0, 1)];
            return big.charAt(0) + big.charAt(1).toLowerCase() + a.slice(1);
        })
            .replace(new RegExp('[' + Object.keys(StringUtils.UMLAUTMAP).join('|') + ']', "g"), function (a) { return StringUtils.UMLAUTMAP[a]; });
    };
    StringUtils.generateTechnicalName = function (name) {
        return name
            ? StringUtils.replaceUmlauts(name)
                .replace(/[^-a-zA-Z0-9]+/g, ' ')
                .replace(/[^-a-zA-Z0-9]+/g, ' ')
                .replace(/ +/g, ' ')
                .replace(/ /g, '-')
                .trim()
                .toLowerCase()
            : '';
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
    StringUtils.padStart = function (source, paddingValue) {
        return String(paddingValue + source).slice(-paddingValue.length);
    };
    ;
    StringUtils.formatToShortFileNameDate = function (date, dateSeparator) {
        return [date.getFullYear(),
            dateSeparator,
            StringUtils.padStart((date.getMonth() + 1).toString(), '00'),
            dateSeparator,
            StringUtils.padStart(date.getDate().toString(), '00')].join('');
    };
    StringUtils.normalizeWhiteSpaceForParser = function (src) {
        if (src === undefined || src.length === 0) {
            return src;
        }
        return src.replace(/[\r\n]+/g, '\n')
            .replace(/\n \n/g, '\n')
            .replace(/[ ]+/g, ' ');
    };
    StringUtils.removeWhitespaces = function (src) {
        if (src === undefined || src.length === 0) {
            return src;
        }
        return src.replace(/[ \r\n\t]+/g, '');
    };
    StringUtils.nullSafeStringCompare = function (a, b) {
        if (a !== undefined && b !== undefined) {
            return a.localeCompare(b);
        }
        if (a === undefined && b === undefined) {
            return 0;
        }
        if (a === undefined) {
            return -1;
        }
        return 1;
    };
    StringUtils.UMLAUTMAP = {
        '\u00dc': 'UE',
        '\u00c4': 'AE',
        '\u00d6': 'OE',
        '\u00fc': 'ue',
        '\u00e4': 'ae',
        '\u00f6': 'oe',
        '\u00df': 'ss',
    };
    return StringUtils;
}());
exports.StringUtils = StringUtils;
//# sourceMappingURL=string.utils.js.map