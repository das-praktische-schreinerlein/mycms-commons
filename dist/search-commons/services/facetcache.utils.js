"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var facets_1 = require("../model/container/facets");
var FacetCacheUtils = /** @class */ (function () {
    function FacetCacheUtils() {
    }
    FacetCacheUtils.createCommonFacetCacheConfigurations = function (sqlQueryBuilder, tableConfigs, facetCacheUsageConfigurations) {
        var configs = [];
        if (facetCacheUsageConfigurations.active !== true) {
            return configs;
        }
        for (var tableKey in facetCacheUsageConfigurations.entities) {
            var tableConfig = tableConfigs[tableKey];
            if (tableConfig === undefined) {
                throw new Error('tableConfig not exists: ' + tableKey);
            }
            for (var facetKey in tableConfig.facetConfigs) {
                var config = FacetCacheUtils.createCommonFacetCacheConfiguration(sqlQueryBuilder, tableConfig, facetKey, facetCacheUsageConfigurations);
                if (config !== undefined) {
                    configs.push(config);
                }
            }
        }
        return configs;
    };
    FacetCacheUtils.createCommonFacetCacheConfiguration = function (sqlQueryBuilder, tableConfig, facetKey, facetCacheUsageConfigurations) {
        var found = false;
        for (var _i = 0, _a = facetCacheUsageConfigurations.entities[tableConfig.key].facetKeyPatterns; _i < _a.length; _i++) {
            var pattern = _a[_i];
            if (facetKey.match(new RegExp(pattern))) {
                found = true;
                break;
            }
        }
        if (found === false) {
            return;
        }
        var facetConfig = tableConfig.facetConfigs[facetKey];
        if (facetConfig === undefined) {
            throw new Error('facetConfig not exists: ' + tableConfig.key + ' facet:' + facetKey);
        }
        if (facetConfig.cache === undefined || facetConfig.cache.cachedSelectSql === undefined) {
            return;
        }
        var sql = facetConfig.selectSql || sqlQueryBuilder.generateFacetSqlForSelectField(tableConfig.tableName, facetConfig);
        if (sql === undefined) {
            return;
        }
        return {
            valueType: facetConfig.valueType,
            longKey: facets_1.FacetUtils.generateFacetCacheKey(tableConfig.key, facetKey),
            facetSql: sql,
            triggerTables: facetConfig.triggerTables,
            withLabel: facetConfig.withLabelField,
            withId: facetConfig.withIdField,
            orderBy: facetConfig.orderBy !== undefined
                ? facetConfig.orderBy
                : sqlQueryBuilder.generateFacetSqlSortForSelectField(facetConfig),
            name: facets_1.FacetUtils.generateFacetCacheKey(tableConfig.key, facetKey),
            shortKey: facetKey
        };
    };
    return FacetCacheUtils;
}());
exports.FacetCacheUtils = FacetCacheUtils;
//# sourceMappingURL=facetcache.utils.js.map