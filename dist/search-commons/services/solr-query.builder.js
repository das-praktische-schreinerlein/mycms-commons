"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mapper_utils_1 = require("./mapper.utils");
var js_data_1 = require("js-data");
var SolrQueryBuilder = /** @class */ (function () {
    function SolrQueryBuilder() {
        this.mapperUtils = new mapper_utils_1.MapperUtils();
    }
    SolrQueryBuilder.prototype.buildUrl = function (url, params) {
        if (!params) {
            return url;
        }
        var parts = [];
        js_data_1.utils.forOwn(params, function (val, key) {
            if (val === null || typeof val === 'undefined') {
                return;
            }
            if (!js_data_1.utils.isArray(val)) {
                val = [val];
            }
            val.forEach(function (v) {
                if (typeof window !== 'undefined' && window.toString.call(v) === '[object Date]') {
                    v = v.toISOString().trim();
                }
                else if (js_data_1.utils.isObject(v)) {
                    v = js_data_1.utils.toJson(v).trim();
                }
                parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(v));
            });
        });
        if (parts.length > 0) {
            url += (url.indexOf('?') === -1 ? '?' : '&') + parts.join('&');
        }
        // console.error("url:" + url, params);
        return url;
    };
    SolrQueryBuilder.prototype.queryTransformToAdapterSelectQuery = function (solrConfig, method, adapterQuery, adapterOpts) {
        var query = this.createAdapterSelectQuery(solrConfig, method, adapterQuery, adapterOpts);
        var fields = this.getAdapterSelectFields(solrConfig, method, adapterQuery);
        if (fields !== undefined && fields.length > 0) {
            query.fl = fields.join(' ');
        }
        var facetParams = this.getFacetParams(solrConfig, adapterOpts);
        if (facetParams !== undefined && facetParams.size > 0) {
            facetParams.forEach(function (value, key) {
                query[key] = value;
            });
        }
        var spatialParams = this.getSpatialParams(solrConfig, adapterQuery);
        if (spatialParams !== undefined && spatialParams.size > 0) {
            spatialParams.forEach(function (value, key) {
                query[key] = value;
            });
        }
        var sortParams = this.getSortParams(solrConfig, method, adapterQuery, adapterOpts);
        if (sortParams !== undefined && sortParams.size > 0) {
            sortParams.forEach(function (value, key) {
                query[key] = value;
            });
        }
        // console.error('solQuery:', query);
        return query;
    };
    SolrQueryBuilder.prototype.isSpatialQuery = function (solrConfig, adapterQuery) {
        if (adapterQuery !== undefined && adapterQuery.spatial !== undefined && adapterQuery.spatial.geo_loc_p !== undefined &&
            adapterQuery.spatial.geo_loc_p.nearby !== undefined && solrConfig.spatialField !== undefined) {
            return true;
        }
        return false;
    };
    SolrQueryBuilder.prototype.createAdapterSelectQuery = function (solrConfig, method, adapterQuery, adapterOpts) {
        // console.log('createAdapterSelectQuery adapterQuery:', adapterQuery);
        // console.log('createAdapterSelectQuery adapterOpts:', adapterOpts);
        var newParams = [];
        if (adapterQuery.where) {
            for (var _i = 0, _a = Object.getOwnPropertyNames(adapterQuery.where); _i < _a.length; _i++) {
                var fieldName = _a[_i];
                var filter = adapterQuery.where[fieldName];
                var action = Object.getOwnPropertyNames(filter)[0];
                var value = adapterQuery.where[fieldName][action];
                newParams.push(this.mapFilterToAdapterQuery(solrConfig, fieldName, action, value));
            }
        }
        if (adapterQuery.additionalWhere) {
            for (var _b = 0, _c = Object.getOwnPropertyNames(adapterQuery.additionalWhere); _b < _c.length; _b++) {
                var fieldName = _c[_b];
                var filter = adapterQuery.additionalWhere[fieldName];
                var action = Object.getOwnPropertyNames(filter)[0];
                var value = adapterQuery.additionalWhere[fieldName][action];
                newParams.push(this.mapFilterToAdapterQuery(solrConfig, fieldName, action, value));
            }
        }
        var query = {
            q: '*:*',
            start: adapterOpts.offset * adapterOpts.limit,
            rows: adapterOpts.limit
        };
        if (newParams.length > 0) {
            query.q = '(' + newParams.join(' AND ') + ')';
        }
        // console.log('createAdapterSelectQuery result:', query);
        return query;
    };
    SolrQueryBuilder.prototype.getSortParams = function (solrConfig, method, adapterQuery, adapterOpts) {
        var form = adapterOpts.originalSearchForm;
        var sortMapping = solrConfig.sortMapping;
        var sortParams = new Map();
        var sortKey;
        if (form && form.sort) {
            sortKey = form.sort;
        }
        // ignore distance-sort if not spatial-search
        if (!this.isSpatialQuery(solrConfig, adapterQuery) && solrConfig.spatialField !== undefined &&
            solrConfig.spatialSortKey === sortKey) {
            sortKey = 'relevance';
        }
        if (sortKey === undefined || sortKey.length < 1) {
            sortKey = 'relevance';
        }
        for (var key in solrConfig.commonSortOptions) {
            sortParams.set(key, solrConfig.commonSortOptions[key]);
        }
        if (sortMapping.hasOwnProperty(sortKey)) {
            for (var key in sortMapping[sortKey]) {
                sortParams.set(key, sortMapping[sortKey][key]);
            }
        }
        return sortParams;
    };
    SolrQueryBuilder.prototype.getSpatialParams = function (solrConfig, adapterQuery) {
        var spatialParams = new Map();
        if (this.isSpatialQuery(solrConfig, adapterQuery)) {
            var _a = adapterQuery.spatial.geo_loc_p.nearby.split(/_/), lat = _a[0], lon = _a[1], distance = _a[2];
            spatialParams.set('fq', '{!geofilt cache=false}');
            spatialParams.set('sfield', solrConfig.spatialField);
            spatialParams.set('pt', lat + ',' + lon);
            spatialParams.set('d', distance);
        }
        return spatialParams;
    };
    SolrQueryBuilder.prototype.getAdapterSelectFields = function (solrConfig, method, adapterQuery) {
        var fields = solrConfig.fieldList.slice(0);
        if (adapterQuery !== undefined && adapterQuery.spatial !== undefined && adapterQuery.spatial.geo_loc_p !== undefined &&
            adapterQuery.spatial.geo_loc_p.nearby !== undefined) {
            fields.push('distance:geodist()');
        }
        if (adapterQuery.loadTrack === true) {
            fields.push('gpstrack_src_s');
        }
        return fields;
    };
    SolrQueryBuilder.prototype.getFacetParams = function (solrConfig, adapterOpts) {
        var facetConfigs = solrConfig.facetConfigs;
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
    SolrQueryBuilder.prototype.mapToAdapterFieldName = function (solrConfig, fieldName) {
        switch (fieldName) { // NOSONAR: is template for depended
            default:
                break;
        }
        return this.mapperUtils.mapToAdapterFieldName(solrConfig.fieldMapping, fieldName);
    };
    SolrQueryBuilder.prototype.mapFilterToAdapterQuery = function (solrConfig, fieldName, action, value) {
        var realFieldName = undefined;
        if (solrConfig.facetConfigs.hasOwnProperty(fieldName)) {
            if (solrConfig.facetConfigs[fieldName].noFacet === true) {
                return undefined;
            }
            realFieldName = solrConfig.facetConfigs[fieldName].selectField || solrConfig.facetConfigs[fieldName].filterField;
            action = solrConfig.facetConfigs[fieldName].action || action;
        }
        if (realFieldName === undefined && solrConfig.filterMapping.hasOwnProperty(fieldName)) {
            realFieldName = solrConfig.filterMapping[fieldName];
        }
        if (realFieldName === undefined) {
            realFieldName = this.mapToAdapterFieldName(solrConfig, fieldName);
        }
        return this.generateFilter(realFieldName, action, value);
    };
    SolrQueryBuilder.prototype.generateFilter = function (fieldName, action, value) {
        var _this = this;
        var query = '';
        if (action === mapper_utils_1.AdapterFilterActions.LIKEI || action === mapper_utils_1.AdapterFilterActions.LIKE) {
            query = fieldName + ':("' + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '" AND "') + '")';
        }
        else if (action === mapper_utils_1.AdapterFilterActions.EQ1 || action === mapper_utils_1.AdapterFilterActions.EQ2) {
            query = fieldName + ':("' + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '') + '")';
        }
        else if (action === mapper_utils_1.AdapterFilterActions.GT) {
            query = fieldName + ':{"' + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '') + '" TO *}';
        }
        else if (action === mapper_utils_1.AdapterFilterActions.GE) {
            query = fieldName + ':["' + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '') + '" TO *]';
        }
        else if (action === mapper_utils_1.AdapterFilterActions.LT) {
            query = fieldName + ':{ * TO "' + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '') + '"}';
        }
        else if (action === mapper_utils_1.AdapterFilterActions.LE) {
            query = fieldName + ':[ * TO "' + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '') + '"]';
        }
        else if (action === mapper_utils_1.AdapterFilterActions.IN || action === mapper_utils_1.AdapterFilterActions.IN_NUMBER) {
            query = fieldName + ':("' + value.map(function (inValue) { return _this.mapperUtils.escapeAdapterValue(inValue.toString()); }).join('" OR "') + '")';
        }
        else if (action === mapper_utils_1.AdapterFilterActions.NOTIN) {
            query = '-' + fieldName + ':("' + value.map(function (inValue) { return _this.mapperUtils.escapeAdapterValue(inValue.toString()); }).join('" OR "') + '")';
        }
        return query;
    };
    return SolrQueryBuilder;
}());
exports.SolrQueryBuilder = SolrQueryBuilder;
//# sourceMappingURL=solr-query.builder.js.map