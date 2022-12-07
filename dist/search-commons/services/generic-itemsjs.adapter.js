"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = require("js-data");
var generic_searchresult_1 = require("../model/container/generic-searchresult");
var js_data_adapter_1 = require("js-data-adapter");
var facets_1 = require("../model/container/facets");
var itemsjs_query_builder_1 = require("./itemsjs-query.builder");
var itemsjs = require("itemsjs/src/index.js");
var GenericItemsJsAdapter = /** @class */ (function (_super) {
    __extends(GenericItemsJsAdapter, _super);
    function GenericItemsJsAdapter(config, mapper, data, itemJsConfig) {
        var _this = _super.call(this, config) || this;
        _this.itemsJsQueryBuilder = new itemsjs_query_builder_1.ItemsJsQueryBuilder();
        _this.mapper = mapper;
        _this.itemJs = itemsjs(data, itemJsConfig);
        return _this;
    }
    GenericItemsJsAdapter.prototype.create = function (mapper, props, opts) {
        throw new Error('create not implemented');
    };
    GenericItemsJsAdapter.prototype.createMany = function (mapper, props, opts) {
        throw new Error('createMany not implemented');
    };
    GenericItemsJsAdapter.prototype.destroy = function (mapper, id, opts) {
        throw new Error('destroy not implemented');
    };
    GenericItemsJsAdapter.prototype.destroyAll = function (mapper, query, opts) {
        throw new Error('destroyAll not implemented');
    };
    GenericItemsJsAdapter.prototype.export = function (mapper, query, format, opts) {
        throw new Error('export not implemented');
    };
    GenericItemsJsAdapter.prototype.find = function (mapper, id, opts) {
        var adapterQuery = {
            loadTrack: false,
            where: {
                id: {
                    'in_number': [id]
                }
            }
        };
        var me = this;
        return new Promise(function (resolve, reject) {
            me._findAll(mapper, adapterQuery, opts).then(function (value) {
                var records = value;
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
    };
    GenericItemsJsAdapter.prototype.sum = function (mapper, field, query, opts) {
        throw new Error('sum not implemented');
    };
    GenericItemsJsAdapter.prototype.update = function (mapper, id, props, opts) {
        throw new Error('update not implemented');
    };
    GenericItemsJsAdapter.prototype.updateAll = function (mapper, props, query, opts) {
        throw new Error('updateAll not implemented');
    };
    GenericItemsJsAdapter.prototype.updateMany = function (mapper, records, opts) {
        throw new Error('updateMany not implemented');
    };
    GenericItemsJsAdapter.prototype.count = function (mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        return _super.prototype.count.call(this, mapper, query, opts);
    };
    GenericItemsJsAdapter.prototype.findAll = function (mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        return _super.prototype.findAll.call(this, mapper, query, opts);
    };
    GenericItemsJsAdapter.prototype.facets = function (mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        opts.adapterFacet = true;
        return this._facets(mapper, query, opts);
    };
    GenericItemsJsAdapter.prototype.search = function (mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        opts.adapterFacet = true;
        return this._search(mapper, query, opts);
    };
    GenericItemsJsAdapter.prototype.afterCount = function (mapper, props, opts, result) {
        return js_data_1.utils.Promise.resolve(result);
    };
    GenericItemsJsAdapter.prototype._facets = function (mapper, query, opts) {
        opts.adapterQuery = true;
        var me = this;
        var queryData = me.queryTransformToAdapterQuery(mapper, query, opts);
        if (queryData === undefined) {
            return js_data_1.utils.reject('got no adapter-query for query:' + query);
        }
        opts.queryData = queryData;
        queryData['skipFacetting'] = false;
        var result = this.doQuery(queryData);
        var facets = this.extractFacetsFromRequestResult(mapper, result);
        return js_data_1.utils.Promise.resolve(facets);
    };
    GenericItemsJsAdapter.prototype._search = function (mapper, query, opts) {
        opts.adapterQuery = true;
        var me = this;
        var queryData = me.queryTransformToAdapterQuery(mapper, query, opts);
        if (queryData === undefined) {
            return js_data_1.utils.reject('got no adapter-query for query:' + query);
        }
        opts.queryData = queryData;
        queryData['skipFacetting'] = !opts.showFacets;
        var result = this.doQuery(queryData);
        var count = this.extractCountFromRequestResult(mapper, result);
        var records = this.extractRecordsFromRequestResult(mapper, result);
        var facets = this.extractFacetsFromRequestResult(mapper, result);
        var searchResult = new generic_searchresult_1.GenericSearchResult(undefined, count, records, facets);
        return js_data_1.utils.Promise.resolve(searchResult);
    };
    GenericItemsJsAdapter.prototype._count = function (mapper, query, opts) {
        opts.adapterQuery = true;
        var me = this;
        var queryData = me.queryTransformToAdapterQuery(mapper, query, opts);
        if (queryData === undefined) {
            return js_data_1.utils.resolve([0]);
        }
        opts.queryData = queryData;
        queryData['skipFacetting'] = true;
        var result = this.doQuery(queryData);
        return Promise.resolve(this.extractCountFromRequestResult(mapper, result));
    };
    GenericItemsJsAdapter.prototype._findAll = function (mapper, query, opts) {
        opts.adapterQuery = true;
        var me = this;
        var queryData = me.queryTransformToAdapterQuery(mapper, query, opts);
        if (queryData === undefined) {
            return js_data_1.utils.resolve([[]]);
        }
        opts.queryData = queryData;
        queryData['skipFacetting'] = !opts.showFacets;
        var result = this.doQuery(queryData);
        var records = this.extractRecordsFromRequestResult(mapper, result);
        if (!(Array.isArray(records))) {
            return js_data_1.utils.Promise.reject('generic-solr-adapter.afterFind: no array as result');
        }
        return js_data_1.utils.Promise.resolve(records);
    };
    GenericItemsJsAdapter.prototype.deserializeResponse = function (mapper, response, opts) {
        // console.log('deserializeResponse:', response);
        // check response
        if (response === undefined) {
            return undefined;
        }
        if (response.data === undefined) {
            return undefined;
        }
        if (response.pagination === undefined) {
            return undefined;
        }
        // count
        if (opts.itemsJsCount) {
            return this.extractCountFromRequestResult(mapper, response);
        }
        // facet
        if (opts.itemsJsFacet) {
            if (response.data.aggregations === undefined) {
                return undefined;
            }
            return this.extractFacetsFromRequestResult(mapper, response);
        }
        // search records
        if (response.data.items === undefined) {
            return undefined;
        }
        return this.extractRecordsFromRequestResult(mapper, response);
    };
    GenericItemsJsAdapter.prototype.extractCountFromRequestResult = function (mapper, result) {
        return result.pagination.total;
    };
    GenericItemsJsAdapter.prototype.extractRecordsFromRequestResult = function (mapper, result) {
        // got documents
        var docs = result.data.items;
        var recordIds = {};
        var afterRecordIds = {};
        var records = [];
        for (var _i = 0, docs_1 = docs; _i < docs_1.length; _i++) {
            var doc = docs_1[_i];
            if (recordIds[doc['id']]) {
                console.error('DUPLICATION id not unique on itemsjs-result', doc['id'], doc);
                continue;
            }
            recordIds[doc['id']] = true;
            // remap fields
            var docCopy = __assign({}, doc);
            for (var _a = 0, _b = ['keywords', 'objects', 'persons', 'playlists']; _a < _b.length; _a++) {
                var filterBase = _b[_a];
                docCopy[filterBase + '_txt'] = docCopy[filterBase + '_ss'];
            }
            var record = this.mapResponseDocument(mapper, docCopy, this.getItemsJsConfig());
            if (afterRecordIds[record['id']]) {
                console.error('DUPLICATION id not unique after itemsjs-mapping', record['id'], record);
                continue;
            }
            afterRecordIds[record['id']] = true;
            records.push(record);
        }
        // console.log('extractRecordsFromRequestResult:', records);
        return records;
    };
    GenericItemsJsAdapter.prototype.extractFacetsFromRequestResult = function (mapper, result) {
        if (result.data === undefined ||
            result.data.aggregations === undefined) {
            return new facets_1.Facets();
        }
        var facets = new facets_1.Facets();
        for (var name_1 in result.data.aggregations) {
            var aggregation = result.data.aggregations[name_1];
            var buckets = aggregation.buckets;
            var facet_1 = new facets_1.Facet();
            facet_1.facet = [];
            for (var j = 0; j < buckets.length; j++) {
                facet_1.facet.push([buckets[j].key, buckets[j].doc_count]);
            }
            facets.facets.set(aggregation.name, facet_1);
        }
        var sorts = Object.keys(this.getItemsJsConfig().sortings);
        var facet = new facets_1.Facet();
        facet.facet = sorts.map(function (value) {
            return [value, 0];
        });
        facets.facets.set('sorts', facet);
        return facets;
    };
    GenericItemsJsAdapter.prototype.mapResponseDocument = function (mapper, doc, itemsJsConfig) {
        return this.mapper.mapResponseDocument(mapper, doc, itemsJsConfig.fieldMapping);
    };
    GenericItemsJsAdapter.prototype.doQuery = function (query) {
        if (query.filters && query.filters['UNDEFINED_FILTER']) {
            console.debug('WARN return empty result for query with UNDEFINED_FILTER', query);
            return {
                data: {
                    items: [],
                    aggregations: []
                },
                pagination: {
                    page: query.page,
                    per_page: query.per_page,
                    total: 0
                }
            };
        }
        var result = this.itemJs.search(query);
        if (result && result['timings']) {
            console.debug('timings for itemsjs-call', result['timings'], query);
        }
        return result;
    };
    GenericItemsJsAdapter.prototype.queryTransformToAdapterQuery = function (mapper, params, opts) {
        return this.queryTransformToAdapterQueryWithMethod(undefined, mapper, params, opts);
    };
    GenericItemsJsAdapter.prototype.queryTransformToAdapterQueryWithMethod = function (method, mapper, params, opts) {
        // map html to fulltext
        var adapterQuery = params;
        var fulltextQuery = '';
        var specialAggregations = {};
        if (adapterQuery.where) {
            if (adapterQuery.where['html']) {
                var action = Object.getOwnPropertyNames(adapterQuery.where['html'])[0];
                fulltextQuery = adapterQuery.where['html'][action];
                delete adapterQuery.where['html'];
            }
            for (var _i = 0, _a = []; _i < _a.length; _i++) {
                var filterBase = _a[_i];
                if (adapterQuery.where[filterBase + '_txt']) {
                    var action = Object.getOwnPropertyNames(adapterQuery.where[filterBase + '_txt'])[0];
                    specialAggregations[filterBase + '_ss'] = adapterQuery.where[filterBase + '_txt'][action];
                    delete adapterQuery.where[filterBase + '_txt'];
                }
            }
        }
        var queryData = this.itemsJsQueryBuilder.queryTransformToAdapterSelectQuery(this.getItemsJsConfig(), method, params, opts);
        queryData.query = fulltextQuery;
        if (!queryData.filters) {
            queryData.filters = {};
        }
        queryData.filters = __assign({}, queryData.filters, specialAggregations);
        console.log('itemsjs query:', queryData);
        return queryData;
    };
    return GenericItemsJsAdapter;
}(js_data_adapter_1.Adapter));
exports.GenericItemsJsAdapter = GenericItemsJsAdapter;
//# sourceMappingURL=generic-itemsjs.adapter.js.map