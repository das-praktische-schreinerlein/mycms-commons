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
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_http_1 = require("js-data-http");
var js_data_1 = require("js-data");
var facets_1 = require("../model/container/facets");
var generic_searchresult_1 = require("../model/container/generic-searchresult");
require("rxjs/add/operator/toPromise");
require("rxjs/add/operator/map");
function Response(data, meta, op) {
    meta = meta || {};
    this.data = data;
    js_data_1.utils.fillIn(this, meta);
    this.op = op;
}
exports.Response = Response;
var GenericSearchHttpAdapter = /** @class */ (function (_super) {
    __extends(GenericSearchHttpAdapter, _super);
    function GenericSearchHttpAdapter(config) {
        return _super.call(this, config) || this;
    }
    GenericSearchHttpAdapter.prototype.create = function (mapper, props, opts) {
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('create');
        return _super.prototype.create.call(this, mapper, props, opts);
    };
    GenericSearchHttpAdapter.prototype.update = function (mapper, id, props, opts) {
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('update');
        return _super.prototype.update.call(this, mapper, id, props, opts);
    };
    GenericSearchHttpAdapter.prototype.doActionTag = function (mapper, record, actionTagForm, opts) {
        var me = this;
        var result = new Promise(function (resolve, reject) {
            me._doActionTag(mapper, record, actionTagForm, opts).then(function (resultRecord) {
                if (resultRecord === undefined) {
                    return reject('record not found');
                }
                else {
                    return resolve(resultRecord);
                }
            }).catch(function (reason) {
                console.error('doActionTag failed:', reason);
                return reject(reason);
            });
        });
        return result;
    };
    GenericSearchHttpAdapter.prototype.facets = function (mapper, query, opts) {
        var _this = this;
        var op;
        query = query || {};
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('search');
        var me = this;
        opts['queryTransform'] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return me.queryTransformToHttpQuery.apply(me, args);
        };
        opts.params = this.getParams(opts);
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
            var response = new Response(data, result, op);
            response = _this.respond(response, opts);
            // afterCount lifecycle hook
            op = opts.op = 'afterFacets';
            return js_data_1.utils.resolve(_this[op](mapper, query, opts, response))
                .then(function (_response) { return _response === undefined ? response : _response; });
        });
    };
    GenericSearchHttpAdapter.prototype.search = function (mapper, query, opts) {
        var _this = this;
        var op;
        query = query || {};
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('search');
        var me = this;
        opts['queryTransform'] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return me.queryTransformToHttpQuery.apply(me, args);
        };
        opts.params = this.getParams(opts);
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
            var response = new Response(data, result, op);
            response = _this.respond(response, opts);
            // afterCount lifecycle hook
            op = opts.op = 'afterSearch';
            return js_data_1.utils.resolve(_this[op](mapper, query, opts, response))
                .then(function (_response) { return _response === undefined ? response : _response; });
        });
    };
    GenericSearchHttpAdapter.prototype.export = function (mapper, query, format, opts) {
        query = query || {};
        opts = opts || {};
        var me = this;
        opts.params = this.getParams(opts);
        opts.suffix = this.getSuffix(mapper, opts);
        js_data_1.utils.deepMixIn(opts.params, query);
        opts.params = me.queryTransformToHttpQuery(mapper, opts.params, opts);
        var result = new Promise(function (resolve, reject) {
            me._export(mapper, query, format, opts).then(function (result) {
                return resolve(result);
            }).catch(function (reason) {
                console.error('export failed:', reason);
                return reject(reason);
            });
        });
        return result;
    };
    GenericSearchHttpAdapter.prototype.beforeFacets = function (mapper, query, opts) {
        return js_data_1.utils.Promise.resolve(true);
    };
    GenericSearchHttpAdapter.prototype.beforeSearch = function (mapper, query, opts) {
        return js_data_1.utils.Promise.resolve(true);
    };
    GenericSearchHttpAdapter.prototype.afterFacets = function (mapper, props, opts, result) {
        return js_data_1.utils.Promise.resolve(this.extractFacetsFromRequestResult(mapper, result));
    };
    GenericSearchHttpAdapter.prototype.afterSearch = function (mapper, props, opts, result) {
        var count = this.extractCountFromRequestResult(mapper, result);
        var records = this.extractRecordsFromRequestResult(mapper, result);
        var facets = this.extractFacetsFromRequestResult(mapper, result);
        var searchForm = result.searchForm;
        var searchResult = new generic_searchresult_1.GenericSearchResult(searchForm, count, records, facets);
        return js_data_1.utils.Promise.resolve(searchResult);
    };
    GenericSearchHttpAdapter.prototype.afterCreate = function (mapper, props, opts, result) {
        var record = mapper.createRecord(result);
        opts.realResult = result;
        return js_data_1.utils.Promise.resolve(record);
    };
    GenericSearchHttpAdapter.prototype.afterUpdate = function (mapper, id, opts, result) {
        opts.realResult = result;
        return this.find(mapper, id, opts);
    };
    GenericSearchHttpAdapter.prototype.afterFind = function (mapper, id, opts, result) {
        return js_data_1.utils.Promise.resolve(result);
    };
    GenericSearchHttpAdapter.prototype.afterDestroy = function (mapper, id, opts, result) {
        return js_data_1.utils.Promise.resolve(undefined);
    };
    GenericSearchHttpAdapter.prototype.deserialize = function (mapper, response, opts) {
        if (response && (typeof response.data === 'string') && response.data.startsWith('JSONP_CALLBACK(')) {
            var json = response.data.substring('JSONP_CALLBACK('.length, response.data.length - 2);
            response.data = JSON.parse(json);
        }
        // do default behavior
        return _super.prototype.deserialize.call(this, mapper, response, opts);
    };
    GenericSearchHttpAdapter.prototype.extractCountFromRequestResult = function (mapper, result) {
        return result.recordCount;
    };
    GenericSearchHttpAdapter.prototype.extractRecordsFromRequestResult = function (mapper, result) {
        return result.currentRecords;
    };
    GenericSearchHttpAdapter.prototype.extractFacetsFromRequestResult = function (mapper, result) {
        var facets = new facets_1.Facets();
        var facetsValues = result.facets.facets;
        var selectLimits = result.facets.selectLimits;
        for (var key in facetsValues) {
            if (facetsValues.hasOwnProperty(key)) {
                var facet = new facets_1.Facet();
                facet.facet = facetsValues[key];
                if (selectLimits.hasOwnProperty(key)) {
                    facet.selectLimit = selectLimits[key];
                }
                facets.facets.set(key, facet);
            }
        }
        return facets;
    };
    GenericSearchHttpAdapter.prototype._doActionTag = function (mapper, record, actionTagForm, opts) {
        var me = this;
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('doActionTag');
        return _super.prototype.PUT.call(this, this.getPath('doActionTag', mapper, undefined, opts), actionTagForm, undefined)
            .then(function (response) {
            if (response && (typeof response.data === 'string')) {
                var json = response.data.substring('JSONP_CALLBACK('.length, response.data.length - 2);
                var data = JSON.parse(json);
                return js_data_1.utils.resolve(data);
            }
            else if (response && response.data) {
                return js_data_1.utils.resolve(response.data);
            }
            else {
                return js_data_1.utils.reject('doActionTag no valid response');
            }
        }).catch(function (reason) {
            return js_data_1.utils.reject('doActionTag something went wrong' + reason);
        });
    };
    GenericSearchHttpAdapter.prototype._export = function (mapper, query, format, opts) {
        var me = this;
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('export', format);
        opts.responseType = 'text';
        return _super.prototype.GET.call(this, this.getPath('export', mapper, opts.params, opts), opts, opts)
            .then(function (response) {
            if (response) {
                return js_data_1.utils.resolve(response.text());
            }
            else {
                return js_data_1.utils.reject('export no valid response');
            }
        }).catch(function (reason) {
            return js_data_1.utils.reject('export something went wrong' + reason);
        });
    };
    GenericSearchHttpAdapter.prototype.queryTransformToHttpQuery = function (mapper, params, opts) {
        var ret = {};
        for (var i in opts.originalSearchForm) {
            if (opts.originalSearchForm.hasOwnProperty(i)) {
                ret[i] = opts.originalSearchForm[i];
            }
        }
        ret['showForm'] = opts.showForm || false;
        ret['showFacets'] = opts.showFacets || false;
        ret['loadTrack'] = opts.loadTrack || false;
        return ret;
    };
    GenericSearchHttpAdapter.prototype.buildUrl = function (url, params) {
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
        return url;
    };
    return GenericSearchHttpAdapter;
}(js_data_http_1.HttpAdapter));
exports.GenericSearchHttpAdapter = GenericSearchHttpAdapter;
//# sourceMappingURL=generic-search-http.adapter.js.map