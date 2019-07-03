"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Facet = /** @class */ (function () {
    function Facet() {
        this.facet = [];
    }
    return Facet;
}());
exports.Facet = Facet;
var Facets = /** @class */ (function () {
    function Facets() {
        this.facets = new Map();
    }
    return Facets;
}());
exports.Facets = Facets;
var FacetUtils = /** @class */ (function () {
    function FacetUtils() {
    }
    FacetUtils.calcFacetValueType = function (valueType) {
        if (valueType === undefined || valueType === null) {
            return 'string';
        }
        return valueType;
    };
    FacetUtils.generateFacetCacheKey = function (tableKey, facetKey) {
        return tableKey + '_' + facetKey;
    };
    return FacetUtils;
}());
exports.FacetUtils = FacetUtils;
//# sourceMappingURL=facets.js.map