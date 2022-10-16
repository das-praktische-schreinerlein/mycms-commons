"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SearchParameterUtils = /** @class */ (function () {
    function SearchParameterUtils() {
    }
    SearchParameterUtils.prototype.extractFacetValues = function (facets, facetName, valuePrefix, labelPrefix) {
        var values = [];
        if (facetName === undefined || facetName.length <= 0) {
            return values;
        }
        var facet = facets.facets.get(facetName);
        if (facet === undefined || facet.facet === undefined) {
            return values;
        }
        for (var idx in facet.facet) {
            var facetValue = facet.facet[idx];
            if (facetValue[0] === undefined || facetValue[0].toString().length <= 0) {
                continue;
            }
            var convertedValue = [labelPrefix, facetValue[0], valuePrefix, facetValue[1]];
            if (facetValue.length > 2 && facetValue[2] !== null && facetValue[2] !== 'null') {
                // label
                convertedValue.push(facetValue[2]);
            }
            else {
                // no label
                convertedValue.push(undefined);
            }
            if (facetValue.length > 3 && facetValue[3] !== null && facetValue[3] !== 'null') {
                // id
                convertedValue.push(facetValue[3]);
            }
            else {
                // no id
                convertedValue.push(undefined);
            }
            values.push(convertedValue);
        }
        return values;
    };
    SearchParameterUtils.prototype.extractFacetSelectLimit = function (facets, facetName) {
        if (facetName === undefined || facetName.length <= 0) {
            return 0;
        }
        var facet = facets.facets.get(facetName);
        if (facet === undefined || facet.selectLimit === undefined) {
            return 0;
        }
        return facet.selectLimit;
    };
    SearchParameterUtils.prototype.splitValuesByPrefixes = function (src, splitter, prefixes) {
        var result = new Map();
        if (src === undefined) {
            return result;
        }
        var values = src.split(splitter);
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
            var found = false;
            for (var _a = 0, prefixes_1 = prefixes; _a < prefixes_1.length; _a++) {
                var prefix = prefixes_1[_a];
                if (value.startsWith(prefix)) {
                    var list = void 0;
                    if (result.has(prefix)) {
                        list = result.get(prefix);
                    }
                    else {
                        list = [];
                    }
                    list.push(value);
                    result.set(prefix, list);
                    found = true;
                    continue;
                }
            }
            if (!found) {
                var prefix = 'unknown';
                var list = void 0;
                if (result.has(prefix)) {
                    list = result.get(prefix);
                }
                else {
                    list = [];
                }
                list.push(value);
                result.set(prefix, list);
            }
        }
        return result;
    };
    SearchParameterUtils.prototype.joinValuesAndReplacePrefix = function (values, prefix, joiner) {
        if (values === undefined) {
            return '';
        }
        return values.map(function (value) {
            return value.replace(prefix, '');
        }).join(joiner);
    };
    SearchParameterUtils.prototype.replacePlaceHolder = function (value, regEx, replacement) {
        if (value === undefined || (typeof value !== 'string')) {
            return value;
        }
        return value.replace(regEx, replacement);
    };
    SearchParameterUtils.prototype.useValueDefaultOrFallback = function (value, defaultValue, fallback) {
        return this.useValueOrDefault(value, (defaultValue ? defaultValue : fallback));
    };
    SearchParameterUtils.prototype.useValueOrDefault = function (value, defaultValue) {
        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }
        if (Array.isArray(value) && (value.length === 0 || (value.length === 1 && value[0] === ''))) {
            return defaultValue;
        }
        return value;
    };
    SearchParameterUtils.prototype.joinAndUseValueDefaultOrFallback = function (value, defaultValue, fallback) {
        return this.joinAndUseValueOrDefault(value, (defaultValue ? defaultValue : fallback));
    };
    SearchParameterUtils.prototype.joinAndUseValueOrDefault = function (value, defaultValue) {
        value = this.useValueOrDefault(value, defaultValue);
        if (Array.isArray(value)) {
            return value.join(',');
        }
        return value;
    };
    SearchParameterUtils.prototype.joinParamsToOneRouteParameter = function (paramsToJoin, joiner) {
        var _this = this;
        if (paramsToJoin === undefined) {
            return '';
        }
        var resultsParams = [];
        paramsToJoin.forEach(function (value, key) {
            if (_this.useValueOrDefault(value, undefined) !== undefined) {
                resultsParams.push(key + ':' + value);
            }
        });
        return resultsParams.join(joiner).replace(/[,]+/g, ',').replace(/(^,)|(,$)/g, '');
    };
    SearchParameterUtils.prototype.escapeHtml = function (unsafe) {
        return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/'/g, '&quot;').replace(/'/g, '&#039;');
    };
    return SearchParameterUtils;
}());
exports.SearchParameterUtils = SearchParameterUtils;
//# sourceMappingURL=searchparameter.utils.js.map