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
var js_data_adapter_1 = require("js-data-adapter");
require("rxjs/add/operator/toPromise");
require("rxjs/add/operator/map");
var GenericInMemoryAdapter = /** @class */ (function (_super) {
    __extends(GenericInMemoryAdapter, _super);
    function GenericInMemoryAdapter(config) {
        return _super.call(this, config) || this;
    }
    GenericInMemoryAdapter.prototype._count = function (mapper, query, opts) {
        return Promise.resolve(mapper['datastore'].filter(mapper.name, query, opts));
    };
    GenericInMemoryAdapter.prototype._create = function (mapper, props, opts) {
        return Promise.resolve(mapper['datastore'].add(mapper.name, props));
    };
    GenericInMemoryAdapter.prototype._createMany = function (mapper, props, opts) {
        return Promise.resolve(mapper['datastore'].add(mapper.name, props));
    };
    GenericInMemoryAdapter.prototype._destroy = function (mapper, id, opts) {
        return Promise.resolve(mapper['datastore'].remove(mapper.name, id, opts));
    };
    GenericInMemoryAdapter.prototype._destroyAll = function (mapper, query, opts) {
        return Promise.reject('destroyAll not implemented');
    };
    GenericInMemoryAdapter.prototype._find = function (mapper, id, opts) {
        return Promise.resolve([mapper['datastore'].get(mapper.name, id)]);
    };
    GenericInMemoryAdapter.prototype._findAll = function (mapper, query, opts) {
        return Promise.resolve([mapper['datastore'].getAll(mapper.name, query)]);
    };
    GenericInMemoryAdapter.prototype._sum = function (mapper, field, query, opts) {
        return Promise.reject('sum not implemented');
    };
    GenericInMemoryAdapter.prototype._update = function (mapper, id, props, opts) {
        if (id === undefined || id === null) {
            return Promise.reject('cant update records without id');
        }
        var readRecord = mapper['datastore'].get(mapper.name, id);
        if (readRecord === undefined || readRecord === null) {
            return Promise.resolve(null);
        }
        props.id = id;
        return Promise.resolve(mapper['datastore'].add(mapper.name, props, opts));
    };
    GenericInMemoryAdapter.prototype._updateAll = function (mapper, props, query, opts) {
        return Promise.reject('updateAll not implemented');
    };
    GenericInMemoryAdapter.prototype._updateMany = function (mapper, records, opts) {
        return Promise.reject('updateMany not implemented');
    };
    return GenericInMemoryAdapter;
}(js_data_adapter_1.Adapter));
exports.GenericInMemoryAdapter = GenericInMemoryAdapter;
//# sourceMappingURL=generic-inmemory.adapter.js.map