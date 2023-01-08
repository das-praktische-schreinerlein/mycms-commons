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
var generic_searchresult_1 = require("../model/container/generic-searchresult");
var generic_search_http_adapter_1 = require("./generic-search-http.adapter");
var mapper_utils_1 = require("./mapper.utils");
var solr_query_builder_1 = require("./solr-query.builder");
var GenericSolrAdapter = /** @class */ (function (_super) {
    __extends(GenericSolrAdapter, _super);
    function GenericSolrAdapter(config, mapper) {
        var _this = _super.call(this, config) || this;
        _this.mapperUtils = new mapper_utils_1.MapperUtils();
        _this.solrQueryBuilder = new solr_query_builder_1.SolrQueryBuilder();
        _this.mapper = mapper;
        return _this;
    }
    GenericSolrAdapter.prototype.count = function (mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('count');
        opts.adapterQuery = true;
        opts.adapterCount = true;
        var me = this;
        opts['queryTransform'] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return me.queryTransformToAdapterSelectQuery.apply(me, args);
        };
        return _super.prototype.count.call(this, mapper, query, opts);
    };
    GenericSolrAdapter.prototype.create = function (mapper, props, opts) {
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('create');
        opts.adapterQuery = true;
        opts.params = this.getParams(opts);
        opts.params = this.queryTransform(mapper, opts.params, opts);
        opts.suffix = this.getSuffix(mapper, opts);
        var query = {
            add: {
                doc: this.mapToAdapterDocument(props)
            },
            commit: {}
        };
        return _super.prototype.create.call(this, mapper, query, opts);
    };
    GenericSolrAdapter.prototype.createMany = function (mapper, props, opts) {
        throw new Error('createMany not implemented');
    };
    GenericSolrAdapter.prototype.destroy = function (mapper, id, opts) {
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('destroy');
        opts.adapterQuery = true;
        opts.params = this.getParams(opts);
        opts.params = this.queryTransform(mapper, opts.params, opts);
        opts.suffix = this.getSuffix(mapper, opts);
        var query = {
            delete: {
                id: id
            },
            commit: {}
        };
        opts.adapterDeletequery = query;
        return _super.prototype.destroy.call(this, mapper, id, opts);
    };
    GenericSolrAdapter.prototype.destroyAll = function (mapper, query, opts) {
        throw new Error('destroyAll not implemented');
    };
    GenericSolrAdapter.prototype.export = function (mapper, query, format, opts) {
        throw new Error('export not implemented');
    };
    GenericSolrAdapter.prototype.find = function (mapper, id, opts) {
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('find');
        opts.adapterQuery = true;
        var me = this;
        opts.params = opts.params || {};
        opts.params.where = opts.params.where || {};
        opts.params.where.id = { '==': id };
        opts.offset = 0;
        opts.limit = 10;
        opts['queryTransform'] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return me.queryTransformToAdapterSelectQuery.apply(me, args);
        };
        return _super.prototype.find.call(this, mapper, id, opts);
    };
    GenericSolrAdapter.prototype.findAll = function (mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('findAll');
        opts.adapterQuery = true;
        var me = this;
        opts['queryTransform'] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return me.queryTransformToAdapterSelectQuery.apply(me, args);
        };
        return _super.prototype.findAll.call(this, mapper, query, opts);
    };
    GenericSolrAdapter.prototype.facets = function (mapper, query, opts) {
        var _this = this;
        var op;
        query = query || {};
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('findAll');
        opts.adapterQuery = true;
        opts.adapterFacet = true;
        var me = this;
        opts['queryTransform'] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return me.queryTransformToAdapterSelectQuery.apply(me, args);
        };
        opts.params = this.getParams(opts);
        opts.params.count = true;
        opts.suffix = this.getSuffix(mapper, opts);
        js_data_1.utils.deepMixIn(opts.params, query);
        opts.params = this.queryTransform(mapper, opts.params, opts);
        // beforeCount lifecycle hook
        op = opts.op = 'beforeFacets';
        return js_data_1.utils.resolve(this[op](mapper, query, opts))
            .then(function () {
            // Allow for re-assignment from lifecycle hook
            op = opts.op = 'count';
            _this.dbg(op, mapper, query, opts);
            return js_data_1.utils.resolve(_this._count(mapper, query, opts));
        })
            .then(function (results) {
            var data = results[0], result = results[1];
            result = result || {};
            var response = new generic_search_http_adapter_1.Response(data, result, op);
            response = _this.respond(response, opts);
            // afterCount lifecycle hook
            op = opts.op = 'afterFacets';
            return js_data_1.utils.resolve(_this[op](mapper, query, opts, response))
                .then(function (_response) { return _response === undefined ? response : _response; });
        });
    };
    GenericSolrAdapter.prototype.search = function (mapper, query, opts) {
        var _this = this;
        var op;
        query = query || {};
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('findAll');
        opts.adapterQuery = true;
        opts.adapterFacet = true;
        var me = this;
        opts['queryTransform'] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return me.queryTransformToAdapterSelectQuery.apply(me, args);
        };
        opts.params = this.getParams(opts);
        opts.params.count = true;
        opts.suffix = this.getSuffix(mapper, opts);
        js_data_1.utils.deepMixIn(opts.params, query);
        opts.params = this.queryTransform(mapper, opts.params, opts);
        // beforeCount lifecycle hook
        op = opts.op = 'beforeSearch';
        return js_data_1.utils.resolve(this[op](mapper, query, opts))
            .then(function () {
            // Allow for re-assignment from lifecycle hook
            op = opts.op = 'count';
            _this.dbg(op, mapper, query, opts);
            return js_data_1.utils.resolve(_this._count(mapper, query, opts));
        })
            .then(function (results) {
            var data = results[0], result = results[1];
            result = result || {};
            var response = new generic_search_http_adapter_1.Response(data, result, op);
            response = _this.respond(response, opts);
            // afterCount lifecycle hook
            op = opts.op = 'afterSearch';
            return js_data_1.utils.resolve(_this[op](mapper, query, opts, response))
                .then(function (_response) { return _response === undefined ? response : _response; });
        });
    };
    GenericSolrAdapter.prototype.sum = function (mapper, field, query, opts) {
        throw new Error('sum not implemented');
    };
    GenericSolrAdapter.prototype.update = function (mapper, id, props, opts) {
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('update');
        opts.adapterQuery = true;
        opts.params = this.getParams(opts);
        opts.params = this.queryTransform(mapper, opts.params, opts);
        opts.suffix = this.getSuffix(mapper, opts);
        var query = {
            add: {
                doc: this.mapToAdapterDocument(props)
            },
            commit: {}
        };
        return _super.prototype.update.call(this, mapper, id, query, opts);
    };
    GenericSolrAdapter.prototype.updateAll = function (mapper, props, query, opts) {
        throw new Error('updateAll not implemented');
    };
    GenericSolrAdapter.prototype.updateMany = function (mapper, records, opts) {
        throw new Error('updateMany not implemented');
    };
    GenericSolrAdapter.prototype.afterSearch = function (mapper, props, opts, result) {
        var count = this.extractCountFromRequestResult(mapper, result);
        var records = this.extractRecordsFromRequestResult(mapper, result);
        var facets = this.extractFacetsFromRequestResult(mapper, result);
        var searchResult = new generic_searchresult_1.GenericSearchResult(undefined, count, records, facets);
        return js_data_1.utils.Promise.resolve(searchResult);
    };
    GenericSolrAdapter.prototype.afterCount = function (mapper, props, opts, result) {
        return js_data_1.utils.Promise.resolve(result);
    };
    GenericSolrAdapter.prototype.afterCreate = function (mapper, props, opts, result) {
        return this.find(mapper, props['add']['doc']['id'], opts);
    };
    GenericSolrAdapter.prototype.afterUpdate = function (mapper, id, opts, result) {
        return this.find(mapper, id, opts);
    };
    GenericSolrAdapter.prototype.afterFind = function (mapper, id, opts, result) {
        if (!(Array.isArray(result))) {
            return js_data_1.utils.Promise.reject('generic-solr-adapter.afterFind: no array as result');
        }
        if (result.length !== 1) {
            return js_data_1.utils.Promise.reject('generic-solr-adapter.afterFind: result is not unique');
        }
        return js_data_1.utils.Promise.resolve(result[0]);
    };
    GenericSolrAdapter.prototype.afterDestroy = function (mapper, id, opts, result) {
        return js_data_1.utils.Promise.resolve(undefined);
    };
    GenericSolrAdapter.prototype._create = function (mapper, props, opts) {
        var _this = this;
        var url = this.getPath('create', mapper, props, opts);
        url = url + '&stream.body=' + encodeURIComponent(JSON.stringify(props));
        opts.contentType = 'application/json';
        return this.GET(url, opts).then(function (response) { return _this._end(mapper, opts, response); });
    };
    GenericSolrAdapter.prototype._doActionTag = function (mapper, record, actionTagForm, opts) {
        return js_data_1.utils.reject('not supported');
    };
    GenericSolrAdapter.prototype._destroy = function (mapper, id, opts) {
        var _this = this;
        var url = this.getPath('delete', mapper, id, opts);
        url = url + '&stream.body=' + encodeURIComponent(JSON.stringify(opts.adapterDeletequery));
        opts.contentType = 'application/json';
        return this.GET(url, opts).then(function (response) { return _this._end(mapper, opts, response); });
    };
    GenericSolrAdapter.prototype._update = function (mapper, id, props, opts) {
        var _this = this;
        var url = this.getPath('update', mapper, id, opts);
        url = url + '&stream.body=' + encodeURIComponent(JSON.stringify(props));
        opts.contentType = 'application/json';
        return this.GET(url, opts).then(function (response) { return _this._end(mapper, opts, response); });
    };
    GenericSolrAdapter.prototype.deserialize = function (mapper, response, opts) {
        if (opts.adapterQuery) {
            if (response && (typeof response.data === 'string') && response.data.startsWith('JSONP_CALLBACK(')) {
                var json = response.data.substring('JSONP_CALLBACK('.length, response.data.length - 2);
                response.data = JSON.parse(json);
            }
            return this.deserializeResponse(mapper, response, opts);
        }
        // do default behavior
        return _super.prototype.deserialize.call(this, mapper, response, opts);
    };
    GenericSolrAdapter.prototype.getPath = function (method, mapper, id, opts) {
        var path;
        if (opts.adapterQuery) {
            path = this.getAdapterPath(method, mapper, id, opts);
        }
        else {
            path = _super.prototype.getPath.call(this, method, mapper, id, opts);
        }
        return path;
    };
    GenericSolrAdapter.prototype.deserializeResponse = function (mapper, response, opts) {
        // console.log('deserializeResponse:', response);
        // check response
        if (response === undefined) {
            return _super.prototype.deserialize.call(this, mapper, response, opts);
        }
        if (response.data === undefined) {
            return _super.prototype.deserialize.call(this, mapper, response, opts);
        }
        // check for adapter-response
        if (response.data.responseHeader === undefined) {
            return _super.prototype.deserialize.call(this, mapper, response, opts);
        }
        if (response.data.responseHeader.status !== 0) {
            return undefined;
        }
        if (response.data.response === undefined) {
            return undefined;
        }
        // count
        if (opts.adapterCount) {
            return this.extractCountFromRequestResult(mapper, response.data);
        }
        // facet
        if (opts.adapterFacet) {
            if (response.data.facet_counts === undefined) {
                return undefined;
            }
            if (response.data.facet_counts.facet_queries === undefined) {
                return undefined;
            }
            if (response.data.facet_counts.facet_queries.facet_fields === undefined) {
                return undefined;
            }
            return this.extractFacetsFromRequestResult(mapper, response.data);
        }
        // search records
        if (response.data.response.docs === undefined) {
            return undefined;
        }
        return this.extractRecordsFromRequestResult(mapper, response.data);
    };
    GenericSolrAdapter.prototype.extractCountFromRequestResult = function (mapper, result) {
        return result.response.numFound;
    };
    GenericSolrAdapter.prototype.extractRecordsFromRequestResult = function (mapper, result) {
        // got documents
        var docs = result.response.docs;
        var records = [];
        for (var _i = 0, docs_1 = docs; _i < docs_1.length; _i++) {
            var doc = docs_1[_i];
            records.push(this.mapResponseDocument(mapper, doc));
        }
        // console.log('extractRecordsFromRequestResult:', records);
        return records;
    };
    GenericSolrAdapter.prototype.extractFacetsFromRequestResult = function (mapper, result) {
        if (result.facet_counts === undefined ||
            result.facet_counts.facet_fields === undefined) {
            return new facets_1.Facets();
        }
        var facets = new facets_1.Facets();
        for (var field in result.facet_counts.facet_fields) {
            var values = this.mapperUtils.splitPairs(result.facet_counts.facet_fields[field]);
            var facet = new facets_1.Facet();
            facet.facet = values;
            facets.facets.set(field, facet);
        }
        var sortFacet = new facets_1.Facet();
        sortFacet.facet = [];
        for (var sortKey in this.getSolrConfig().sortMapping) {
            sortFacet.facet.push([sortKey, 0]);
        }
        facets.facets.set('sorts', sortFacet);
        return facets;
    };
    GenericSolrAdapter.prototype.mapResponseDocument = function (mapper, doc) {
        return this.mapper.mapResponseDocument(mapper, doc, {});
    };
    GenericSolrAdapter.prototype.getAdapterPath = function (method, mapper, id, opts) {
        var path = [
            opts.basePath === undefined ? (mapper['basePath'] === undefined ? this['basePath'] : mapper['basePath']) : opts.basePath,
            this.getEndpoint(mapper, null, opts)
        ].join('/').replace(/([^:\/]|^)\/{2,}/g, '$1/');
        path = this.buildUrl(path, opts.params);
        // console.log('solrurl:', path);
        return path;
    };
    GenericSolrAdapter.prototype.buildUrl = function (url, params) {
        return this.solrQueryBuilder.buildUrl(url, params);
    };
    GenericSolrAdapter.prototype.queryTransformToAdapterSelectQuery = function (mapper, params, opts) {
        return this.queryTransformToAdapterSelectQueryWithMethod(undefined, mapper, params, opts);
    };
    GenericSolrAdapter.prototype.queryTransformToAdapterSelectQueryWithMethod = function (method, mapper, params, opts) {
        return this.solrQueryBuilder.queryTransformToAdapterSelectQuery(this.getSolrConfig(), method, params, opts);
    };
    return GenericSolrAdapter;
}(generic_search_http_adapter_1.GenericSearchHttpAdapter));
exports.GenericSolrAdapter = GenericSolrAdapter;
//# sourceMappingURL=generic-solr.adapter.js.map