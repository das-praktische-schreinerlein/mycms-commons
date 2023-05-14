"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mapper_utils_1 = require("./mapper.utils");
var log_utils_1 = require("../../commons/utils/log.utils");
var ItemsJsQueryBuilder = /** @class */ (function () {
    function ItemsJsQueryBuilder() {
        this.mapperUtils = new mapper_utils_1.MapperUtils();
    }
    ItemsJsQueryBuilder.prototype.queryTransformToAdapterSelectQuery = function (itemsJsConfig, method, adapterQuery, adapterOpts) {
        var query = this.createAdapterSelectQuery(itemsJsConfig, method, adapterQuery, adapterOpts);
        // for debug only: const facetParams = this.getFacetParams(itemsJsConfig, adapterOpts);
        // for debug only: const spatialParams = this.getSpatialParams(itemsJsConfig, adapterQuery);
        var spatialParams = this.getSpatialParams(itemsJsConfig, adapterQuery);
        if (spatialParams !== undefined) {
            query.spatialQuery = spatialParams;
        }
        var sorts = this.getSortParams(itemsJsConfig, method, adapterQuery, adapterOpts);
        if (sorts !== undefined && sorts.length > 0) {
            query.sort = sorts;
        }
        // console.log('itemsJsQuery:', query);
        return query;
    };
    ItemsJsQueryBuilder.prototype.isSpatialQuery = function (itemsJsConfig, adapterQuery) {
        if (adapterQuery !== undefined && adapterQuery.spatial !== undefined && adapterQuery.spatial.geo_loc_p !== undefined &&
            adapterQuery.spatial.geo_loc_p.nearby !== undefined && itemsJsConfig.spatialField !== undefined) {
            return true;
        }
        return false;
    };
    ItemsJsQueryBuilder.prototype.createAdapterSelectQuery = function (itemsJsConfig, method, adapterQuery, adapterOpts) {
        // console.log('createAdapterSelectQuery adapterQuery:', adapterQuery);
        // console.log('createAdapterSelectQuery adapterOpts:', adapterOpts);
        var newParams = {};
        if (adapterQuery.where) {
            for (var _i = 0, _a = Object.getOwnPropertyNames(adapterQuery.where); _i < _a.length; _i++) {
                var fieldName = _a[_i];
                var filter = adapterQuery.where[fieldName];
                var action = Object.getOwnPropertyNames(filter)[0];
                var value = adapterQuery.where[fieldName][action];
                Object.assign(newParams, this.mapFilterToAdapterQuery(itemsJsConfig, fieldName, action, value));
            }
        }
        if (adapterQuery.additionalWhere) {
            for (var _b = 0, _c = Object.getOwnPropertyNames(adapterQuery.additionalWhere); _b < _c.length; _b++) {
                var fieldName = _c[_b];
                var filter = adapterQuery.additionalWhere[fieldName];
                var action = Object.getOwnPropertyNames(filter)[0];
                var value = adapterQuery.additionalWhere[fieldName][action];
                Object.assign(newParams, this.mapFilterToAdapterQuery(itemsJsConfig, fieldName, action, value));
            }
        }
        var query = {
            query: '',
            page: adapterOpts.offset + 1,
            per_page: adapterOpts.limit,
            filters: newParams
        };
        // console.log('createAdapterSelectQuery result:', query);
        return query;
    };
    ItemsJsQueryBuilder.prototype.getSortParams = function (itemsJsConfig, method, adapterQuery, adapterOpts) {
        var form = adapterOpts.originalSearchForm;
        var sortMapping = itemsJsConfig.sortings;
        var sortKey;
        if (form && form.sort) {
            sortKey = form.sort;
        }
        // ignore distance-sort if not spatial-search
        if (!this.isSpatialQuery(itemsJsConfig, adapterQuery) && itemsJsConfig.spatialField !== undefined &&
            itemsJsConfig.spatialSortKey === sortKey) {
            sortKey = 'relevance';
        }
        if (sortKey === undefined || sortKey.length < 1) {
            sortKey = 'relevance';
        }
        if (!sortMapping.hasOwnProperty(sortKey)) {
            sortKey = 'relevance';
        }
        return sortKey;
    };
    ItemsJsQueryBuilder.prototype.getSpatialParams = function (itemsJsConfig, adapterQuery) {
        if (!this.isSpatialQuery(itemsJsConfig, adapterQuery)) {
            return undefined;
        }
        var _a = this.mapperUtils.escapeAdapterValue(adapterQuery.spatial.geo_loc_p.nearby).split(/_/), lat = _a[0], lng = _a[1], distance = _a[2];
        var spatialParams = {
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            distance: parseFloat(distance)
        };
        return spatialParams;
    };
    ItemsJsQueryBuilder.prototype.getAdapterSelectFields = function (itemsJsConfig, method, adapterQuery) {
        var fields = itemsJsConfig.searchableFields.slice(0);
        if (adapterQuery !== undefined && adapterQuery.spatial !== undefined && adapterQuery.spatial.geo_loc_p !== undefined &&
            adapterQuery.spatial.geo_loc_p.nearby !== undefined) {
            fields.push('distance');
        }
        if (adapterQuery.loadTrack === true) {
            fields.push('gpstrack_src_s');
        }
        return fields;
    };
    ItemsJsQueryBuilder.prototype.getFacetParams = function (itemsJsConfig, adapterOpts) {
        var facetConfigs = itemsJsConfig.aggregations;
        var facetParams = new Map();
        var facets = [];
        for (var key in facetConfigs) {
            if (adapterOpts.showFacets === true || (adapterOpts.showFacets instanceof Array && adapterOpts.showFacets.indexOf(key) >= 0)) {
                facets.push(key);
                for (var paramKey in facetConfigs[key]) {
                    facetParams.set(paramKey, facetConfigs[key][paramKey]);
                }
            }
        }
        if (facets.length > 0) {
            facetParams.set('facet', 'on');
            facetParams.set('facet.field', facets);
        }
        return facetParams;
    };
    ItemsJsQueryBuilder.prototype.mapToAdapterFieldName = function (itemsJsConfig, fieldName) {
        switch (fieldName) { // NOSONAR: is template for depended
            default:
                break;
        }
        return this.mapperUtils.mapToAdapterFieldName(itemsJsConfig.fieldMapping, fieldName);
    };
    ItemsJsQueryBuilder.prototype.mapFilterToAdapterQuery = function (itemsJsConfig, fieldName, action, value) {
        var realFieldName = undefined;
        if (itemsJsConfig.aggregations.hasOwnProperty(fieldName)) {
            if (itemsJsConfig.aggregations[fieldName].noFacet === true) {
                return undefined;
            }
            realFieldName = itemsJsConfig.aggregations[fieldName].selectField || itemsJsConfig.aggregations[fieldName].filterField;
            action = itemsJsConfig.aggregations[fieldName].action || action;
        }
        else {
            console.debug('WARNING: UNDEFINED_FILTER for itemsjsquery', fieldName, itemsJsConfig);
            realFieldName = 'UNDEFINED_FILTER';
        }
        if (realFieldName === undefined && itemsJsConfig.filterMapping.hasOwnProperty(fieldName)) {
            realFieldName = itemsJsConfig.filterMapping[fieldName];
        }
        if (realFieldName === undefined) {
            realFieldName = this.mapToAdapterFieldName(itemsJsConfig, fieldName);
        }
        return this.generateFilter(realFieldName, action, value);
    };
    ItemsJsQueryBuilder.prototype.generateFilter = function (fieldName, action, value, throwOnUnknown) {
        var query = {};
        if (action === mapper_utils_1.AdapterFilterActions.LIKEI || action === mapper_utils_1.AdapterFilterActions.LIKE) {
            throw new Error('not implemented: ' + log_utils_1.LogUtils.sanitizeLogMsg(action));
        }
        else if (action === mapper_utils_1.AdapterFilterActions.EQ1 || action === mapper_utils_1.AdapterFilterActions.EQ2) {
            query[fieldName] = value;
        }
        else if (action === mapper_utils_1.AdapterFilterActions.GT) {
            throw new Error('not implemented: ' + log_utils_1.LogUtils.sanitizeLogMsg(action));
        }
        else if (action === mapper_utils_1.AdapterFilterActions.GE) {
            throw new Error('not implemented: ' + log_utils_1.LogUtils.sanitizeLogMsg(action));
        }
        else if (action === mapper_utils_1.AdapterFilterActions.LT) {
            throw new Error('not implemented: ' + log_utils_1.LogUtils.sanitizeLogMsg(action));
        }
        else if (action === mapper_utils_1.AdapterFilterActions.LE) {
            throw new Error('not implemented: ' + log_utils_1.LogUtils.sanitizeLogMsg(action));
        }
        else if (action === mapper_utils_1.AdapterFilterActions.IN || action === mapper_utils_1.AdapterFilterActions.IN_NUMBER) {
            query[fieldName] = value;
        }
        else if (action === mapper_utils_1.AdapterFilterActions.NOTIN) {
            throw new Error('not implemented: ' + log_utils_1.LogUtils.sanitizeLogMsg(action));
        }
        else if (action === mapper_utils_1.AdapterFilterActions.LIKEIN) {
            throw new Error('not implemented: ' + log_utils_1.LogUtils.sanitizeLogMsg(action));
        }
        else if (action === mapper_utils_1.AdapterFilterActions.IN_CSV) {
            throw new Error('not implemented:' + log_utils_1.LogUtils.sanitizeLogMsg(action));
        }
        else if (throwOnUnknown) {
            throw new Error('unknown actiontype: ' + log_utils_1.LogUtils.sanitizeLogMsg(action));
        }
        return query;
    };
    return ItemsJsQueryBuilder;
}());
exports.ItemsJsQueryBuilder = ItemsJsQueryBuilder;
//# sourceMappingURL=itemsjs-query.builder.js.map