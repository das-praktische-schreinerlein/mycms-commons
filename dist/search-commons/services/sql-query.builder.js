"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mapper_utils_1 = require("./mapper.utils");
var util_1 = require("util");
var date_utils_1 = require("../../commons/utils/date.utils");
var log_utils_1 = require("../../commons/utils/log.utils");
var facets_1 = require("../model/container/facets");
var sql_utils_1 = require("./sql-utils");
var SqlQueryBuilder = /** @class */ (function () {
    function SqlQueryBuilder() {
        this.mapperUtils = new mapper_utils_1.MapperUtils();
    }
    SqlQueryBuilder.prototype.extendTableConfigs = function (tableConfigs) {
        for (var key in tableConfigs) {
            this.extendTableConfig(tableConfigs[key]);
        }
    };
    SqlQueryBuilder.prototype.extendTableConfig = function (tableConfig) {
        for (var facetKey in tableConfig.facetConfigs) {
            var facetConfig = tableConfig.facetConfigs[facetKey];
            var sql = facetConfig.selectSql || this.generateFacetSqlFromSelectField(tableConfig.tableName, facetConfig);
            if (facetConfig.valueType === undefined) {
                facetConfig.valueType = facets_1.FacetUtils.calcFacetValueType(facetConfig.valueType);
            }
            if (sql) {
                var sqlParts = sql_utils_1.SqlUtils.analyzeSimpleSql(sql);
                if (facetConfig.triggerTables === undefined) {
                    facetConfig.triggerTables = sqlParts.tables;
                }
                if (facetConfig.withLabelField === undefined) {
                    facetConfig.withLabelField =
                        sqlParts.fields.indexOf('label') >= 0 || sqlParts.fieldAliases.indexOf('label') >= 0;
                }
                if (facetConfig.withIdField === undefined) {
                    facetConfig.withIdField =
                        sqlParts.fields.indexOf('id') >= 0 || sqlParts.fieldAliases.indexOf('id') >= 0;
                }
                if (facetConfig.cache === undefined) {
                    facetConfig.cache = { cachedSelectSql: undefined, useCache: "IF_VALID" };
                }
                if (facetConfig.cache.cachedSelectSql === undefined) {
                    facetConfig.cache.cachedSelectSql = this.generateFacetCacheSql(tableConfig, facetKey, facetConfig);
                }
            }
        }
    };
    SqlQueryBuilder.prototype.transformToSqlDialect = function (sql, client) {
        if (client === 'sqlite3') {
            sql = sql_utils_1.SqlUtils.transformToSqliteDialect(sql);
        }
        // console.error("sql", sql);
        return sql;
    };
    SqlQueryBuilder.prototype.selectQueryTransformToSql = function (query) {
        var sql = 'select ' +
            (query.fields && query.fields.length > 0 ? query.fields.join(', ') : '') + ' ' +
            'from ' + query.from + ' ' +
            (query.where && query.where.length > 0 ? 'where ' + query.where.join(' AND ') : '') + ' ' +
            (query.groupByFields && query.groupByFields.length > 0 ? ' group by ' + query.groupByFields.join(', ') : '') + ' ' +
            (query.having && query.having.length > 0 ? 'having ' + query.having.join(' AND ') : '') + ' ' +
            (query.sort && query.sort.length > 0 ? 'order by ' + query.sort.join(', ') + ' ' : '') +
            (query.limit ? 'limit ' + (query.offset || 0) + ', ' + query.limit : '');
        // console.error("sql:", sql);
        return sql;
    };
    SqlQueryBuilder.prototype.queryTransformToAdapterWriteQuery = function (tableConfig, method, props, adapterOpts) {
        var query = {
            from: tableConfig.tableName,
            fields: {},
            tableConfig: tableConfig
        };
        for (var key in tableConfig.writeMapping) {
            var prop = tableConfig.writeMapping[key];
            var fieldName = key.replace(tableConfig.tableName + '.', '');
            var value = void 0;
            if (props[prop]) {
                value = props[prop];
            }
            else {
                // extract with :field:
                value = prop;
                var propValue = void 0;
                if (value !== undefined && value !== null) {
                    var replacers = prop.toString().match(/:.*?:/g);
                    if (replacers.length === 1) {
                        for (var _i = 0, replacers_1 = replacers; _i < replacers_1.length; _i++) {
                            var replacer = replacers_1[_i];
                            var propKey = replacer.replace(/^:(.*):$/, '$1');
                            if (props.hasOwnProperty(propKey) && props[propKey] !== undefined) {
                                propValue = props[propKey];
                                if (util_1.isDate(propValue)) {
                                    propValue = date_utils_1.DateUtils.dateToLocalISOString(propValue);
                                }
                                value = value.replace(replacer, propValue);
                            }
                            else {
                                value = undefined;
                                break;
                            }
                        }
                    }
                    else {
                        for (var _a = 0, replacers_2 = replacers; _a < replacers_2.length; _a++) {
                            var replacer = replacers_2[_a];
                            var propKey = replacer.replace(/^:(.*):$/, '$1');
                            value = value.replace(replacer, props[propKey]);
                            if (props.hasOwnProperty(propKey) && props[propKey] !== undefined) {
                                propValue = props[propKey];
                                if (util_1.isDate(propValue)) {
                                    propValue = date_utils_1.DateUtils.dateToLocalISOString(propValue);
                                }
                                value = value.replace(replacer, propValue);
                            }
                            else {
                                value = null;
                                break;
                            }
                        }
                    }
                }
            }
            if (value === undefined || value === 'undefined') {
                value = null;
            }
            query.fields[fieldName] = value;
        }
        // console.error("query", query.fields);
        return query;
    };
    SqlQueryBuilder.prototype.queryTransformToAdapterSelectQuery = function (tableConfig, method, adapterQuery, adapterOpts) {
        adapterQuery.loadTrack = adapterQuery.loadTrack || adapterOpts['loadTrack'];
        var query = this.createAdapterSelectQuery(tableConfig, method, adapterQuery, adapterOpts);
        if (query === undefined) {
            return undefined;
        }
        var fields = this.getAdapterSelectFields(tableConfig, method, adapterQuery);
        if (fields !== undefined && fields.length > 0) {
            query.fields = fields;
        }
        if (this.isSpatialQuery(tableConfig, adapterQuery)) {
            var spatialField = tableConfig.spartialConfig.spatialField;
            if (method === 'count') {
                spatialField = this.getSpatialSql(tableConfig, adapterQuery);
            }
            var spatialParams = this.getSpatialParams(tableConfig, adapterQuery, spatialField);
            if (spatialParams !== undefined && spatialParams.length > 0) {
                if (method === 'count') {
                    query.where.push(spatialParams);
                }
                else {
                    query.having.push(spatialParams);
                }
            }
        }
        var sortParams = this.getSortParams(tableConfig, method, adapterQuery, adapterOpts);
        if (sortParams !== undefined) {
            query.sort = sortParams;
        }
        query.from = this.getAdapterFrom(tableConfig);
        this.generateGroupByForQuery(tableConfig, method, query, adapterQuery);
        return query;
    };
    SqlQueryBuilder.prototype.getFacetSql = function (tableConfig, facetCacheUsageConfigurations, adapterOpts) {
        var facetConfigs = tableConfig.facetConfigs;
        var facets = new Map();
        var _loop_1 = function (key) {
            var facetConfig = facetConfigs[key];
            if (!facetConfig) {
                return "continue";
            }
            if (facetConfig.ignoreIfNotExplicitNamed === true &&
                !(adapterOpts.showFacets instanceof Array && adapterOpts.showFacets.indexOf(key) >= 0)) {
                return "continue";
            }
            if (adapterOpts.showFacets === true || (adapterOpts.showFacets instanceof Array && adapterOpts.showFacets.indexOf(key) >= 0)) {
                var useCacheSql = this_1.generateFacetUseCacheSql(facetCacheUsageConfigurations, tableConfig, key, facetConfig);
                if (useCacheSql !== undefined) {
                    facets.set(key, useCacheSql);
                }
                else if (facetConfig.selectField !== undefined) {
                    facets.set(key, this_1.generateFacetSqlFromSelectField(tableConfig.tableName, facetConfig));
                }
                else if (facetConfig.selectSql !== undefined) {
                    facets.set(key, facetConfig.selectSql);
                }
                else if (facetConfig.constValues !== undefined) {
                    var sqls_1 = [];
                    facetConfig.constValues.forEach(function (value) {
                        sqls_1.push('SELECT 0 AS count, "' + value + '" AS value');
                    });
                    facets.set(key, sqls_1.join(' UNION ALL '));
                }
            }
        };
        var this_1 = this;
        for (var key in facetConfigs) {
            _loop_1(key);
        }
        return facets;
    };
    ;
    SqlQueryBuilder.prototype.generateFacetSqlFromSelectField = function (tableName, tableFacetConfig) {
        if (tableFacetConfig.selectField === undefined) {
            console.error("no select");
            return;
        }
        var orderBy = tableFacetConfig.orderBy ? tableFacetConfig.orderBy : 'count desc';
        var from = tableFacetConfig.selectFrom !== undefined ? tableFacetConfig.selectFrom : tableName;
        console.error("found select");
        return 'SELECT count(*) AS count, ' + tableFacetConfig.selectField + ' AS value '
            + 'FROM ' + from + ' GROUP BY value ORDER BY ' + orderBy;
    };
    SqlQueryBuilder.prototype.generateFacetUseCacheSql = function (facetCacheUsageConfigurations, tableConfig, facetKey, tableFacetConfig) {
        if (facetCacheUsageConfigurations === undefined || tableFacetConfig.cache === undefined
            || facetCacheUsageConfigurations.active === false || facetCacheUsageConfigurations.entities === undefined
            || tableFacetConfig.cache.useCache === false || tableFacetConfig.cache.cachedSelectSql === undefined
            || facetCacheUsageConfigurations.entities[tableConfig.key] === undefined) {
            return undefined;
        }
        var found = false;
        for (var _i = 0, _a = facetCacheUsageConfigurations.entities[tableConfig.key].facetKeyPatterns; _i < _a.length; _i++) {
            var pattern = _a[_i];
            if (facetKey.match(new RegExp(pattern))) {
                found = true;
                break;
            }
        }
        return found ? tableFacetConfig.cache.cachedSelectSql : undefined;
    };
    SqlQueryBuilder.prototype.generateFacetCacheSql = function (tableConfig, facetKey, tableFacetConfig) {
        if (tableFacetConfig.cache === undefined || tableFacetConfig.cache.useCache === false) {
            return undefined;
        }
        var fields = ['count', 'value'];
        if (tableFacetConfig.withLabelField === true) {
            fields.push('label');
        }
        if (tableFacetConfig.withIdField === true) {
            fields.push('id');
        }
        var sql = 'SELECT ' + fields.join(', ') + ' FROM fc_real_' + facets_1.FacetUtils.generateFacetCacheKey(tableConfig.key, facetKey);
        return sql;
    };
    SqlQueryBuilder.prototype.isSpatialQuery = function (tableConfig, adapterQuery) {
        if (adapterQuery !== undefined && adapterQuery.spatial !== undefined && adapterQuery.spatial.geo_loc_p !== undefined &&
            adapterQuery.spatial.geo_loc_p.nearby !== undefined && tableConfig.spartialConfig !== undefined) {
            return true;
        }
        return false;
    };
    ;
    SqlQueryBuilder.prototype.generateFilter = function (fieldName, action, value, throwOnUnknown) {
        var _this = this;
        var query = '';
        var containsNull = false;
        var me = this;
        if (action === mapper_utils_1.AdapterFilterActions.LIKEI || action === mapper_utils_1.AdapterFilterActions.LIKE) {
            query = fieldName + ' LIKE "%'
                + this.sanitizeSqlFilterValuesToSingleValue(value, ' ', '%" AND ' + fieldName + ' LIKE "%') + '%" ';
        }
        else if (action === mapper_utils_1.AdapterFilterActions.EQ1 || action === mapper_utils_1.AdapterFilterActions.EQ2) {
            query = fieldName + ' = "'
                + this.sanitizeSqlFilterValuesToSingleValue(value, ' ', '" AND ' + fieldName + ' =  "') + '" ';
        }
        else if (action === mapper_utils_1.AdapterFilterActions.GT) {
            query = fieldName + ' > "'
                + this.sanitizeSqlFilterValuesToSingleValue(value, ' ', ' AND ' + fieldName + ' > ') + '"';
        }
        else if (action === mapper_utils_1.AdapterFilterActions.GE) {
            query = fieldName + ' >= "'
                + this.sanitizeSqlFilterValuesToSingleValue(value, ' ', ' AND ' + fieldName + ' >= ') + '"';
        }
        else if (action === mapper_utils_1.AdapterFilterActions.LT) {
            query = fieldName + ' < "'
                + this.sanitizeSqlFilterValuesToSingleValue(value, ' ', ' AND ' + fieldName + ' < ') + '"';
        }
        else if (action === mapper_utils_1.AdapterFilterActions.LE) {
            query = fieldName + ' <= "'
                + this.sanitizeSqlFilterValuesToSingleValue(value, ' ', ' AND ' + fieldName + ' <= ') + '"';
        }
        else if (action === mapper_utils_1.AdapterFilterActions.IN) {
            query = this.createInValueList(fieldName, value, ' IN ("', '", "', '")', ' OR ' + fieldName + ' IS NULL');
        }
        else if (action === mapper_utils_1.AdapterFilterActions.IN_NUMBER) {
            query = this.createInValueList(fieldName, value, ' IN (CAST("', '" AS INT), CAST("', '" AS INT))', ' OR ' + fieldName + ' IS NULL');
        }
        else if (action === mapper_utils_1.AdapterFilterActions.NOTIN) {
            query = this.createInValueList(fieldName, value, ' NOT IN ("', '", "', '")', ' AND ' + fieldName + ' IS NOT NULL');
        }
        else if (action === mapper_utils_1.AdapterFilterActions.LIKEIN) {
            query = '(' + value.map(function (inValue) {
                return fieldName + ' LIKE "%'
                    + _this.sanitizeSqlFilterValue(inValue.toString()) + '%" ';
            }).join(' OR ') + ')';
        }
        else if (action === mapper_utils_1.AdapterFilterActions.IN_CSV) {
            query = '(' + value.map(function (inValue) {
                return fieldName + ' LIKE "%,' + _this.sanitizeSqlFilterValue(inValue.toString()) + ',%" OR '
                    + fieldName + ' LIKE "%,' + _this.sanitizeSqlFilterValue(inValue.toString()) + '" OR '
                    + fieldName + ' LIKE "' + _this.sanitizeSqlFilterValue(inValue.toString()) + ',%" OR '
                    + fieldName + ' LIKE "' + _this.sanitizeSqlFilterValue(inValue.toString()) + '" ';
            }).join(' OR ') + ')';
        }
        else if (throwOnUnknown) {
            throw new Error('unknown actiontype:' + log_utils_1.LogUtils.sanitizeLogMsg(action));
        }
        return query;
    };
    SqlQueryBuilder.prototype.sanitizeSqlFilterValue = function (value) {
        // TODO: clean from all non letter....
        value = this.mapperUtils.escapeAdapterValue(value);
        return value;
    };
    SqlQueryBuilder.prototype.sanitizeSqlFilterValuesToSingleValue = function (value, splitter, joiner) {
        var _this = this;
        value = this.mapperUtils.prepareSingleValue(value, ' ');
        var values = this.mapperUtils.prepareValueToArray(value, splitter);
        value = values.map(function (inValue) { return _this.sanitizeSqlFilterValue(inValue); }).join(joiner);
        return value;
    };
    SqlQueryBuilder.prototype.extractDbResult = function (dbresult, client) {
        return sql_utils_1.SqlUtils.extractDbResult(dbresult, client);
    };
    SqlQueryBuilder.prototype.createInValueList = function (fieldName, fieldValues, prefix, joiner, suffix, nullAction) {
        var me = this;
        var containsNull = false;
        return ' ( ' + fieldName + ' ' +
            prefix + fieldValues.map(function (inValue) {
            containsNull = containsNull || inValue === null || inValue === 'null';
            return me.sanitizeSqlFilterValue(inValue !== null ? inValue.toString() : null);
        }).join(joiner) + suffix +
            (containsNull ? nullAction : '') +
            ')';
    };
    SqlQueryBuilder.prototype.createAdapterSelectQuery = function (tableConfig, method, adapterQuery, adapterOpts) {
        // console.error('createAdapterSelectQuery adapterQuery:', adapterQuery);
        // console.log('createAdapterSelectQuery adapterOpts:', adapterOpts);
        var newParams = [];
        if (adapterQuery.where) {
            for (var _i = 0, _a = Object.getOwnPropertyNames(adapterQuery.where); _i < _a.length; _i++) {
                var fieldName = _a[_i];
                var filter = adapterQuery.where[fieldName];
                var action = Object.getOwnPropertyNames(filter)[0];
                var value = adapterQuery.where[fieldName][action];
                var res = this.mapFilterToAdapterQuery(tableConfig, fieldName, action, value);
                if (res !== undefined) {
                    newParams.push(res);
                }
            }
        }
        if (adapterQuery.additionalWhere) {
            for (var _b = 0, _c = Object.getOwnPropertyNames(adapterQuery.additionalWhere); _b < _c.length; _b++) {
                var fieldName = _c[_b];
                var filter = adapterQuery.additionalWhere[fieldName];
                var action = Object.getOwnPropertyNames(filter)[0];
                var value = adapterQuery.additionalWhere[fieldName][action];
                var res = this.mapFilterToAdapterQuery(tableConfig, fieldName, action, value);
                if (res !== undefined) {
                    newParams.push(res);
                }
            }
        }
        var query = {
            where: newParams.length <= 0 ? [] : newParams,
            having: [],
            offset: undefined,
            limit: undefined,
            sort: [],
            tableConfig: tableConfig,
            from: 'dual',
            groupByFields: [],
            fields: []
        };
        if (method === 'findAll') {
            query.offset = adapterOpts.offset * adapterOpts.limit;
            query.limit = adapterOpts.limit;
        }
        // console.log('createAdapterSelectQuery result:', query);
        return query;
    };
    SqlQueryBuilder.prototype.getAdapterFrom = function (tableConfig) {
        return tableConfig.selectFrom || '';
    };
    SqlQueryBuilder.prototype.getSortParams = function (tableConfig, method, adapterQuery, adapterOpts) {
        if (method === 'count') {
            return undefined;
        }
        var form = adapterOpts.originalSearchForm;
        var sortMapping = tableConfig.sortMapping;
        var sortKey;
        if (form && form.sort) {
            sortKey = form.sort;
        }
        // ignore distance-sort if not spatial-search
        if (!this.isSpatialQuery(tableConfig, adapterQuery) && tableConfig.spartialConfig !== undefined &&
            tableConfig.spartialConfig.spatialSortKey === sortKey) {
            sortKey = 'relevance';
        }
        if (sortKey === undefined || sortKey.length < 1) {
            sortKey = 'relevance';
        }
        if (sortMapping.hasOwnProperty(sortKey)) {
            return [sortMapping[sortKey]];
        }
        return [sortMapping['relevance']];
    };
    ;
    SqlQueryBuilder.prototype.getSpatialParams = function (tableConfig, adapterQuery, spatialField) {
        if (this.isSpatialQuery(tableConfig, adapterQuery)) {
            var _a = this.mapperUtils.escapeAdapterValue(adapterQuery.spatial.geo_loc_p.nearby).split(/_/), lat = _a[0], lon = _a[1], distance = _a[2];
            return spatialField + ' <= ' + distance;
        }
        return undefined;
    };
    ;
    SqlQueryBuilder.prototype.getSpatialSql = function (tableConfig, adapterQuery) {
        if (this.isSpatialQuery(tableConfig, adapterQuery)) {
            var _a = this.mapperUtils.escapeAdapterValue(adapterQuery.spatial.geo_loc_p.nearby).split(/_/), lat = _a[0], lon = _a[1], distance = _a[2];
            var distanceSql = '(3959 ' +
                ' * ACOS (' +
                '     COS ( RADIANS(' + lat + ') )' +
                '     * COS( RADIANS(' + tableConfig.spartialConfig.lat + ') )' +
                '     * COS( RADIANS(' + tableConfig.spartialConfig.lon + ') - RADIANS(' + lon + ') )' +
                '     + SIN ( RADIANS(' + lat + ') )' +
                '     * SIN( RADIANS(' + tableConfig.spartialConfig.lat + ') )' +
                ' )' +
                ')';
            return distanceSql;
        }
        return undefined;
    };
    SqlQueryBuilder.prototype.getAdapterSelectFields = function (tableConfig, method, adapterQuery) {
        if (method === 'count') {
            return ['COUNT( DISTINCT ' + tableConfig.filterMapping['id'] + ')'];
        }
        var fields = [];
        for (var _i = 0, _a = tableConfig.selectFieldList; _i < _a.length; _i++) {
            var field = _a[_i];
            fields.push(field);
        }
        var distanceSql = this.getSpatialSql(tableConfig, adapterQuery);
        if (distanceSql !== undefined) {
            fields.push(distanceSql + ' AS geodist');
        }
        return fields;
    };
    SqlQueryBuilder.prototype.generateGroupByForQuery = function (tableConfig, method, query, adapterQuery) {
        var addFields = [];
        if (tableConfig.optionalGroupBy !== undefined) {
            for (var _i = 0, _a = tableConfig.optionalGroupBy; _i < _a.length; _i++) {
                var groupByConfig = _a[_i];
                for (var _b = 0, _c = groupByConfig.triggerParams; _b < _c.length; _b++) {
                    var fieldName = _c[_b];
                    if (adapterQuery.where.hasOwnProperty(fieldName)
                        || (adapterQuery.additionalWhere && adapterQuery.additionalWhere.hasOwnProperty(fieldName))
                        || (adapterQuery.loadTrack && fieldName === 'loadTrack')) {
                        query.from += ' ' + groupByConfig.from;
                        addFields = addFields.concat(groupByConfig.groupByFields);
                        break;
                    }
                }
            }
        }
        if (method === 'count') {
            return;
        }
        if (tableConfig.groupbBySelectFieldList !== true && addFields.length <= 0) {
            return;
        }
        var fields = query.fields;
        var groupFields = [];
        fields.forEach(function (field) {
            var newField = field.replace(/.*? AS /gi, '');
            if (tableConfig.groupbBySelectFieldListIgnore !== undefined &&
                tableConfig.groupbBySelectFieldListIgnore.indexOf(newField) >= 0) {
                return;
            }
            groupFields.push(newField);
        });
        if (groupFields !== undefined && groupFields.length > 0) {
            query.groupByFields = query.groupByFields.concat(groupFields);
        }
        query.fields = query.fields.concat(addFields);
    };
    SqlQueryBuilder.prototype.mapToAdapterFieldName = function (tableConfig, fieldName) {
        switch (fieldName) {
            default:
                break;
        }
        return this.mapperUtils.mapToAdapterFieldName(tableConfig.fieldMapping, fieldName);
    };
    SqlQueryBuilder.prototype.mapFilterToAdapterQuery = function (tableConfig, fieldName, action, value) {
        var realFieldName = undefined;
        if (fieldName === 'id') {
            var values = [];
            for (var _i = 0, _a = this.mapperUtils.prepareSingleValue(value, ',').split(','); _i < _a.length; _i++) {
                var singleValue = _a[_i];
                values.push(singleValue.trim()
                    .replace(tableConfig.key + '_', '')
                    .replace(tableConfig.key.toUpperCase() + '_', ''));
            }
            value = values;
        }
        if (tableConfig.facetConfigs.hasOwnProperty(fieldName)) {
            if (tableConfig.facetConfigs[fieldName].noFacet === true) {
                return undefined;
            }
            action = tableConfig.facetConfigs[fieldName].action || action;
            realFieldName = tableConfig.facetConfigs[fieldName].selectField || tableConfig.facetConfigs[fieldName].filterField;
            if (realFieldName === undefined && tableConfig.facetConfigs[fieldName].filterFields) {
                var filters = [];
                for (var _b = 0, _c = tableConfig.facetConfigs[fieldName].filterFields; _b < _c.length; _b++) {
                    realFieldName = _c[_b];
                    filters.push(this.generateFilter(realFieldName, action, value));
                }
                return '(' + filters.join(' OR ') + ')';
            }
        }
        if (realFieldName === undefined && tableConfig.filterMapping.hasOwnProperty(fieldName)) {
            realFieldName = tableConfig.filterMapping[fieldName];
        }
        if (realFieldName === undefined) {
            realFieldName = this.mapToAdapterFieldName(tableConfig, fieldName);
        }
        return this.generateFilter(realFieldName, action, value);
    };
    return SqlQueryBuilder;
}());
exports.SqlQueryBuilder = SqlQueryBuilder;
//# sourceMappingURL=sql-query.builder.js.map