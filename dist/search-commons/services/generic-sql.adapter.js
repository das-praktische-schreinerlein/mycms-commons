"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = require("js-data");
var facets_1 = require("../model/container/facets");
var js_data_adapter_1 = require("js-data-adapter");
var knex = require("knex");
var util_1 = require("util");
var mapper_utils_1 = require("./mapper.utils");
var sql_query_builder_1 = require("./sql-query.builder");
var log_utils_1 = require("../../commons/utils/log.utils");
var GenericSqlAdapter = /** @class */ (function (_super) {
    __extends(GenericSqlAdapter, _super);
    function GenericSqlAdapter(config, mapper, facetCacheConfig) {
        var _this = _super.call(this, config) || this;
        _this.mapperUtils = new mapper_utils_1.MapperUtils();
        _this.sqlQueryBuilder = new sql_query_builder_1.SqlQueryBuilder();
        _this.config = config;
        _this.knex = knex(config.knexOpts);
        _this.mapper = mapper;
        _this.facetCacheConfig = facetCacheConfig;
        return _this;
    }
    GenericSqlAdapter.prototype.create = function (mapper, props, opts) {
        props = props || {};
        opts = opts || {};
        return _super.prototype.create.call(this, mapper, props, opts);
    };
    GenericSqlAdapter.prototype.createMany = function (mapper, props, opts) {
        throw new Error('createMany not implemented');
    };
    GenericSqlAdapter.prototype.destroy = function (mapper, id, opts) {
        throw new Error('destroy not implemented');
    };
    GenericSqlAdapter.prototype.destroyAll = function (mapper, query, opts) {
        throw new Error('destroyAll not implemented');
    };
    GenericSqlAdapter.prototype.doActionTag = function (mapper, record, actionTagForm, opts) {
        var adapterQuery = {
            loadTrack: false,
            where: {
                id: {
                    'in_number': [actionTagForm.recordId]
                }
            }
        };
        var me = this;
        var result = new Promise(function (resolve, reject) {
            me._doActionTag(mapper, record, actionTagForm, opts).then(function (value) {
                return me._findAll(mapper, adapterQuery, opts);
            }).then(function (value) {
                var records = value[0];
                if (actionTagForm.deletes === true) {
                    if (records.length === 0) {
                        return resolve(record);
                    }
                    return js_data_1.utils.reject('result record must empty for deleting actionForm:' + records.length + ' for query:' + adapterQuery);
                }
                else if (records.length === 1) {
                    return resolve(records[0]);
                }
                else {
                    return js_data_1.utils.reject('records not found or not unique:' + records.length + ' for query:' + adapterQuery);
                }
            }).catch(function (reason) {
                console.error('doActionTag failed:', reason, actionTagForm);
                return reject(reason);
            });
        });
        return result;
    };
    GenericSqlAdapter.prototype.export = function (mapper, query, format, opts) {
        throw new Error('export not implemented');
    };
    GenericSqlAdapter.prototype.find = function (mapper, id, opts) {
        var adapterQuery = {
            loadTrack: false,
            where: {
                id: {
                    'in_number': [id]
                }
            }
        };
        var me = this;
        var result = new Promise(function (resolve, reject) {
            me._findAll(mapper, adapterQuery, opts).then(function (value) {
                var records = value[0];
                if (records.length === 1) {
                    return resolve(records[0]);
                }
                else {
                    return js_data_1.utils.reject('records not found or not unique:' + records.length + ' for query:' + adapterQuery);
                }
            }).catch(function (reason) {
                console.error('_find failed:', reason, id, adapterQuery);
                return reject(reason);
            });
        });
        return result;
    };
    GenericSqlAdapter.prototype.sum = function (mapper, field, query, opts) {
        throw new Error('sum not implemented');
    };
    GenericSqlAdapter.prototype.update = function (mapper, id, props, opts) {
        props = props || {};
        opts = opts || {};
        return _super.prototype.update.call(this, mapper, id, props, opts);
    };
    GenericSqlAdapter.prototype.updateAll = function (mapper, props, query, opts) {
        throw new Error('updateAll not implemented');
    };
    GenericSqlAdapter.prototype.updateMany = function (mapper, records, opts) {
        throw new Error('updateMany not implemented');
    };
    GenericSqlAdapter.prototype.count = function (mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        return _super.prototype.count.call(this, mapper, query, opts);
    };
    GenericSqlAdapter.prototype.findAll = function (mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        return _super.prototype.findAll.call(this, mapper, query, opts);
    };
    GenericSqlAdapter.prototype.facets = function (mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        opts.adapterFacet = true;
        return this._facets(mapper, query, opts);
    };
    GenericSqlAdapter.prototype.afterCount = function (mapper, props, opts, result) {
        return js_data_1.utils.Promise.resolve(result);
    };
    GenericSqlAdapter.prototype.afterCreate = function (mapper, props, opts, result) {
        opts.realResult = result;
        return js_data_1.utils.resolve(result);
    };
    GenericSqlAdapter.prototype.afterUpdate = function (mapper, id, props, opts, result) {
        opts.realResult = result;
        return js_data_1.utils.resolve(result);
    };
    GenericSqlAdapter.prototype.saveDetailData = function (method, mapper, id, props, opts) {
        return js_data_1.utils.resolve(true);
    };
    GenericSqlAdapter.prototype._create = function (mapper, props, opts) {
        if (opts.realSource) {
            props = opts.realSource;
        }
        props = props || {};
        opts = opts || {};
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        var me = this;
        var result = new Promise(function (allResolve, allReject) {
            var writeQuery = me.queryTransformToAdapterWriteQuery('create', mapper, props, opts);
            if (writeQuery) {
                var dbId_1 = undefined;
                var idField_1 = writeQuery.tableConfig.filterMapping['id'];
                sqlBuilder.insert([writeQuery.fields])
                    .into(writeQuery.from)
                    .returning(idField_1)
                    .then(function (values) {
                    dbId_1 = values[0];
                    return me.saveDetailData('create', mapper, dbId_1, props, opts);
                }).then(function (done) {
                    var query = {
                        where: {
                            type_txt: {
                                'in': [props.type.toLowerCase()]
                            }
                        }
                    };
                    query['where'][idField_1] = { 'in': [dbId_1] };
                    return me.findAll(mapper, query, opts);
                }).then(function (searchResult) {
                    if (!searchResult || searchResult.length !== 1) {
                        return allResolve(undefined);
                    }
                    return allResolve([searchResult[0]]);
                }).catch(function errorSearch(reason) {
                    console.error('_create failed:', reason, writeQuery);
                    return allReject(reason);
                });
            }
            else {
                return allReject('no query generated for props:' + props);
            }
        });
        return result;
    };
    GenericSqlAdapter.prototype._count = function (mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        opts.query = opts.query || query;
        opts.adapterQuery = true;
        var me = this;
        var queryData = me.queryTransformToAdapterSelectQuery('count', mapper, query, opts);
        if (queryData === undefined) {
            console.error('something went wrong - got no query for count', query);
            return js_data_1.utils.reject('something went wrong - got no query for count');
        }
        opts.queryData = queryData;
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        var sql = this.queryTransformToSql(queryData);
        // for debug only: const start = (new Date()).getTime();
        var raw = sqlBuilder.raw(sql);
        var result = new Promise(function (resolve, reject) {
            raw.then(function doneSearch(dbresults) {
                // for debug only: console.error("sql _count: " + ((new Date()).getTime() - start), sql);  // TODO SQL
                var response = me.extractDbResult(dbresults);
                var count = me.extractCountFromRequestResult(response);
                return resolve(count);
            }).catch(function errorSearch(reason) {
                console.error('_count failed:', reason, sql, queryData, query);
                return reject(reason);
            });
        });
        return result;
    };
    GenericSqlAdapter.prototype._doActionTag = function (mapper, record, actionTagForm, opts) {
        var tableConfig = this.getTableConfigForTableKey((record['type'] + '').toLowerCase());
        if (tableConfig === undefined) {
            return js_data_1.utils.reject('no table for actiontag:' + log_utils_1.LogUtils.sanitizeLogMsg(actionTagForm.key));
        }
        if (tableConfig.actionTags === undefined || tableConfig.actionTags[actionTagForm.key] === undefined) {
            return js_data_1.utils.reject('no actionConfig for actiontag:' + log_utils_1.LogUtils.sanitizeLogMsg(actionTagForm.key));
        }
        return js_data_1.utils.resolve(true);
    };
    GenericSqlAdapter.prototype._findAll = function (mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        opts.query = opts.query || query;
        opts.adapterQuery = true;
        var me = this;
        var queryData = me.queryTransformToAdapterSelectQuery('findAll', mapper, query, opts);
        if (queryData === undefined) {
            console.error('something went wrong - got no query for findAll', query);
            return js_data_1.utils.reject('something went wrong - got no query for findAll');
        }
        opts.queryData = queryData;
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        var sql = this.queryTransformToSql(queryData);
        // for debug only: const start = (new Date()).getTime();
        var raw = sqlBuilder.raw(sql);
        var result = new Promise(function (resolve, reject) {
            raw.then(function doneSearch(dbresults) {
                // for debug only: console.error("sql _findAll: " + ((new Date()).getTime() - start), sql);  // TODO SQL
                var response = me.extractDbResult(dbresults);
                var records = me.extractRecordsFromRequestResult(mapper, response, queryData);
                return js_data_1.utils.resolve(records);
            }).then(function doneSearch(records) {
                return me.loadDetailData('findAll', mapper, query, opts, records);
            }).then(function doneSearch(records) {
                return resolve([records]);
            }).catch(function errorSearch(reason) {
                console.error('_findAll failed:', reason, sql, queryData, query);
                return reject(reason);
            });
        });
        return result;
    };
    GenericSqlAdapter.prototype._facets = function (mapper, query, opts) {
        var _this = this;
        query = query || {};
        opts = opts || {};
        opts.query = opts.query || query;
        // init data with dummy-query
        opts.adapterQuery = true;
        var me = this;
        var queryData = me.queryTransformToAdapterSelectQuery('findAll', mapper, query, opts);
        if (queryData === undefined) {
            return js_data_1.utils.resolve(this.getDefaultFacets());
        }
        opts.query = queryData;
        var tableConfig = this.getTableConfig(query);
        var facetConfigs = tableConfig.facetConfigs;
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        var result = new Promise(function (allResolve, allReject) {
            var queries = me.getFacetSql(query, opts);
            var promises = [];
            queries.forEach(function (value, key) {
                var sql = _this.transformToSqlDialect(value);
                var raw = sqlBuilder.raw(sql);
                // for debug only: const start = (new Date()).getTime();
                promises.push(new Promise(function (resolve, reject) {
                    raw.then(function doneSearch(dbresults) {
                        // for debug only: console.error("sql _facets: " + ((new Date()).getTime() - start), sql);  // TODO SQL
                        var response = me.extractDbResult(dbresults);
                        var facet = me.extractFacetFromRequestResult(response);
                        if (!facet) {
                            facet = new facets_1.Facet();
                        }
                        if (facetConfigs[key] && facetConfigs[key].selectLimit > 0) {
                            facet.selectLimit = facetConfigs[key].selectLimit;
                        }
                        return resolve([key, facet]);
                    }, function errorSearch(reason) {
                        console.error('_facets failed:', reason, sql);
                        return reject(reason);
                    });
                }));
            });
            return Promise.all(promises).then(function doneSearch(facetResults) {
                var facets = new facets_1.Facets();
                facetResults.forEach(function (facet) {
                    facets.facets.set(facet[0], facet[1]);
                });
                var sortFacet = new facets_1.Facet();
                sortFacet.facet = [];
                for (var sortKey in tableConfig.sortMapping) {
                    // ignore distance if configured but no spatial query
                    if (!me.sqlQueryBuilder.isSpatialQuery(tableConfig, query) &&
                        tableConfig.spartialConfig !== undefined && tableConfig.spartialConfig.spatialSortKey === sortKey) {
                        continue;
                    }
                    sortFacet.facet.push([sortKey, 0]);
                }
                facets.facets.set('sorts', sortFacet);
                return allResolve(facets);
            }).catch(function errorSearch(reason) {
                console.error('_facets failed:', reason, queryData);
                return allReject(reason);
            });
        });
        return result;
    };
    GenericSqlAdapter.prototype._update = function (mapper, id, props, opts) {
        var _this = this;
        if (opts.realSource) {
            props = opts.realSource;
        }
        props = props || {};
        opts = opts || {};
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        var me = this;
        var result = new Promise(function (allResolve, allReject) {
            var writeQuery = me.queryTransformToAdapterWriteQuery('update', mapper, props, opts);
            if (writeQuery) {
                var dbId_2 = _this.mapperUtils.prepareSingleValue(id, '_').replace(/.*_/g, '');
                var idField_2 = writeQuery.tableConfig.filterMapping['id'];
                sqlBuilder.update(writeQuery.fields)
                    .table(writeQuery.from)
                    .where(idField_2, dbId_2)
                    .returning(idField_2)
                    .then(function (values) {
                    return me.saveDetailData('update', mapper, dbId_2, props, opts);
                }).then(function (done) {
                    var query = {
                        where: {
                            type_txt: {
                                'in': [props.type.toLowerCase()]
                            }
                        }
                    };
                    query['where'][idField_2] = { 'in': [dbId_2] };
                    return me._findAll(mapper, query, opts);
                }).then(function (findResult) {
                    var searchResult = findResult[0];
                    if (!searchResult || searchResult.length !== 1) {
                        return allResolve(undefined);
                    }
                    return allResolve([searchResult[0]]);
                }).catch(function errorSearch(reason) {
                    console.error('_update failed:', reason, id);
                    return allReject(reason);
                });
            }
            else {
                return allReject('no query generated for props:' + props);
            }
        });
        return result;
    };
    GenericSqlAdapter.prototype.deserialize = function (mapper, response, opts) {
        if (opts.adapterQuery) {
            if (response && (typeof response.data === 'string') && response.data.startsWith('JSONP_CALLBACK(')) {
                var json = response.data.substring('JSONP_CALLBACK('.length, response.data.length - 2);
                response.data = JSON.parse(json);
            }
            return this.deserializeResponse(mapper, response, opts);
        }
        // do default behavior
        return this.deserializeCommon(mapper, response, opts);
    };
    GenericSqlAdapter.prototype.getParams = function (opts) {
        opts = opts || {};
        if (opts.params === undefined) {
            return {};
        }
        return js_data_1.utils.copy(opts.params);
    };
    GenericSqlAdapter.prototype.deserializeCommon = function (mapper, response, opts) {
        opts = opts || {};
        if (js_data_1.utils.isFunction(opts.deserialize)) {
            return opts.deserialize(mapper, response, opts);
        }
        if (js_data_1.utils.isFunction(mapper.deserialize)) {
            return mapper.deserialize(mapper, response, opts);
        }
        if (response && response.hasOwnProperty('data')) {
            return response.data;
        }
        return response;
    };
    GenericSqlAdapter.prototype.deserializeResponse = function (mapper, response, opts) {
        // console.log('deserializeResponse:', response);
        // check response
        if (response === undefined) {
            return this.deserializeCommon(mapper, response, opts);
        }
        if (response.data === undefined) {
            return this.deserializeCommon(mapper, response, opts);
        }
        // count
        if (opts.adapterCount) {
            return this.extractCountFromRequestResult(response.data);
        }
        // facet
        if (opts.adapterFacet) {
            return this.extractFacetFromRequestResult(response.data);
        }
        return this.extractRecordsFromRequestResult(mapper, response.data, opts.queryData);
    };
    GenericSqlAdapter.prototype.extractCountFromRequestResult = function (result) {
        var docs = result;
        if (docs.length === 1) {
            for (var _i = 0, _a = Object.getOwnPropertyNames(docs[0]); _i < _a.length; _i++) {
                var fieldName = _a[_i];
                if (fieldName.startsWith('COUNT(')) {
                    return [docs[0][fieldName]];
                }
            }
        }
        return [0];
    };
    GenericSqlAdapter.prototype.extractRecordsFromRequestResult = function (mapper, result, queryData) {
        if (!util_1.isArray(result)) {
            return [];
        }
        // got documents
        var docs = result;
        var records = [];
        for (var _i = 0, docs_1 = docs; _i < docs_1.length; _i++) {
            var doc = docs_1[_i];
            records.push(this.mapResponseDocument(mapper, doc, queryData.tableConfig));
        }
        return records;
    };
    GenericSqlAdapter.prototype.extractFacetFromRequestResult = function (result) {
        if (!util_1.isArray(result)) {
            return undefined;
        }
        // got documents
        var values = [];
        var facet = new facets_1.Facet();
        for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
            var doc = result_1[_i];
            var facetValue = [doc['value'] + '', doc['count']];
            if (doc['label'] || doc['id']) {
                facetValue.push(doc['label']);
                facetValue.push(doc['id']);
            }
            values.push(facetValue);
        }
        facet.facet = values;
        return facet;
    };
    GenericSqlAdapter.prototype.mapResponseDocument = function (mapper, doc, tableConfig) {
        return this.mapper.mapResponseDocument(mapper, doc, tableConfig.fieldMapping);
    };
    GenericSqlAdapter.prototype.mapToAdapterDocument = function (tableConfig, props) {
        return this.mapper.mapToAdapterDocument(tableConfig.fieldMapping, props);
    };
    GenericSqlAdapter.prototype.loadDetailData = function (method, mapper, params, opts, records) {
        var _this = this;
        var tableConfig = this.getTableConfig(params);
        var loadDetailDataConfigs = tableConfig.loadDetailData;
        if (loadDetailDataConfigs === undefined || loadDetailDataConfigs.length <= 0 || records.length <= 0) {
            return js_data_1.utils.resolve(records);
        }
        var me = this;
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        var result = new Promise(function (allResolve, allReject) {
            var promises = [];
            records.forEach(function (record) {
                loadDetailDataConfigs.forEach(function (loadDetailDataConfig) {
                    if (loadDetailDataConfig.modes) {
                        if (!opts || !opts.loadDetailsMode) {
                            // mode required but no mode set on options
                            return;
                        }
                        if (loadDetailDataConfig.modes.indexOf(opts.loadDetailsMode) < 0) {
                            // mode not set on options
                            return;
                        }
                    }
                    var sql = _this.transformToSqlDialect(loadDetailDataConfig.sql);
                    loadDetailDataConfig.parameterNames.forEach(function (parameterName) {
                        var value = _this.mapperUtils.prepareSingleValue(record[parameterName], '_');
                        if (value !== undefined && parameterName === 'id') {
                            value = value.replace(/.*_/g, '');
                        }
                        sql = sql.replace(new RegExp(':' + parameterName, 'g'), value);
                    });
                    var raw = sqlBuilder.raw(sql);
                    // for debug only: const start = (new Date()).getTime();
                    promises.push(new Promise(function (resolve, reject) {
                        raw.then(function doneSearch(dbresults) {
                            // for debug only: console.error("sql loadDetailData: " + ((new Date()).getTime() - start), sql);  // TODO SQL
                            var response = me.extractDbResult(dbresults);
                            return resolve([loadDetailDataConfig.profile, record, response]);
                        }, function errorSearch(reason) {
                            console.error('loadDetailData failed:', reason);
                            return reject(reason);
                        });
                    }));
                });
            });
            return Promise.all(promises).then(function doneSearch(loadDetailsResults) {
                loadDetailsResults.forEach(function (loadDetailsResult) {
                    var profile = loadDetailsResult[0], record = loadDetailsResult[1], dbresults = loadDetailsResult[2];
                    me.mapper.mapDetailResponseDocuments(mapper, profile, record, dbresults);
                });
                return allResolve(records);
            }).catch(function errorSearch(reason) {
                console.error('loadDetailData failed:', reason);
                return allReject(reason);
            });
        });
        return result;
    };
    GenericSqlAdapter.prototype.extractTable = function (params) {
        if (params.where === undefined) {
            return undefined;
        }
        var tabKey;
        var types = params.where['type_txt'];
        if (types !== undefined && types.in !== undefined) {
            tabKey = this.extractSingleElement(types.in);
            if (tabKey !== undefined) {
                tabKey = tabKey.toLocaleLowerCase();
                if (this.getTableConfigForTableKey(tabKey) !== undefined) {
                    return tabKey;
                }
                return undefined;
            }
        }
        var ids = params.where['id'];
        if (ids !== undefined) {
            tabKey = this.extractSingleElement(ids.in_number);
            if (tabKey !== undefined) {
                tabKey = tabKey.replace(/_.*/g, '').toLocaleLowerCase();
                if (this.getTableConfigForTableKey(tabKey) !== undefined) {
                    return tabKey;
                }
                return undefined;
            }
            tabKey = this.extractSingleElement(ids.in);
            if (tabKey !== undefined) {
                tabKey = tabKey.replace(/_.*/g, '').toLocaleLowerCase();
                if (this.getTableConfigForTableKey(tabKey) !== undefined) {
                    return tabKey;
                }
                return undefined;
            }
        }
        return undefined;
    };
    GenericSqlAdapter.prototype.getFacetSql = function (adapterQuery, adapterOpts) {
        var tableConfig = this.getTableConfig(adapterQuery);
        if (tableConfig === undefined) {
            return undefined;
        }
        return this.sqlQueryBuilder.getFacetSql(tableConfig, this.facetCacheConfig, adapterOpts);
    };
    GenericSqlAdapter.prototype.queryTransformToSql = function (query) {
        var sql = this.sqlQueryBuilder.selectQueryTransformToSql(query);
        sql = this.transformToSqlDialect(sql);
        return sql;
    };
    GenericSqlAdapter.prototype.transformToSqlDialect = function (sql) {
        return this.sqlQueryBuilder.transformToSqlDialect(sql, this.config.knexOpts.client);
    };
    GenericSqlAdapter.prototype.extractDbResult = function (dbresult) {
        return this.sqlQueryBuilder.extractDbResult(dbresult, this.config.knexOpts.client);
    };
    GenericSqlAdapter.prototype.queryTransformToAdapterSelectQuery = function (method, mapper, params, opts) {
        var tableConfig = this.getTableConfig(params);
        if (tableConfig === undefined) {
            return undefined;
        }
        return this.sqlQueryBuilder.queryTransformToAdapterSelectQuery(tableConfig, method, params, opts);
    };
    GenericSqlAdapter.prototype.queryTransformToAdapterWriteQuery = function (method, mapper, props, opts) {
        if (props.type === undefined) {
            return undefined;
        }
        var tableKey = props.type.toLowerCase();
        var tableConfig = this.getTableConfigForTableKey(tableKey);
        if (tableConfig === undefined) {
            return undefined;
        }
        var mappedProps = this.mapToAdapterDocument(tableConfig, props);
        return this.sqlQueryBuilder.queryTransformToAdapterWriteQuery(tableConfig, method, mappedProps, opts);
    };
    GenericSqlAdapter.prototype.extractSingleElement = function (values) {
        if (values === undefined) {
            return undefined;
        }
        if (!Array.isArray(values)) {
            return values;
        }
        if (values.length === 1) {
            return values[0];
        }
        var realValues = [];
        values.map(function (value) {
            if (value !== undefined && value.trim().length > 0) {
                realValues.push(value.trim());
            }
        });
        if (realValues.length === 1) {
            return realValues[0];
        }
        return undefined;
    };
    return GenericSqlAdapter;
}(js_data_adapter_1.Adapter));
exports.GenericSqlAdapter = GenericSqlAdapter;
//# sourceMappingURL=generic-sql.adapter.js.map