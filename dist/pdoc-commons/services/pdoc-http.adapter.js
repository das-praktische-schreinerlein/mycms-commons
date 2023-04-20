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
var pdoc_record_1 = require("../model/records/pdoc-record");
var generic_search_http_adapter_1 = require("../../search-commons/services/generic-search-http.adapter");
var pdoc_adapter_response_mapper_1 = require("./pdoc-adapter-response.mapper");
var PDocHttpAdapter = /** @class */ (function (_super) {
    __extends(PDocHttpAdapter, _super);
    function PDocHttpAdapter(config) {
        var _this = _super.call(this, config) || this;
        _this.responseMapper = new pdoc_adapter_response_mapper_1.PDocAdapterResponseMapper(config);
        return _this;
    }
    PDocHttpAdapter.prototype.create = function (mapper, record, opts) {
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('create');
        if (opts.realSource) {
            record = opts.realSource;
        }
        var props = this.mapRecordToAdapterValues(mapper, record);
        return _super.prototype.create.call(this, mapper, props, opts);
    };
    PDocHttpAdapter.prototype.update = function (mapper, id, record, opts) {
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('update');
        if (opts.realSource) {
            record = opts.realSource;
        }
        var props = this.mapRecordToAdapterValues(mapper, record);
        return _super.prototype.update.call(this, mapper, id, props, opts);
    };
    PDocHttpAdapter.prototype.getHttpEndpoint = function (method, format) {
        var findMethods = ['find', 'findAll'];
        var updateMethods = ['create', 'destroy', 'update'];
        if (findMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'pdoc';
        }
        if (updateMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'pdocwrite';
        }
        if (method.toLowerCase() === 'doactiontag') {
            return 'pdocaction';
        }
        if (method.toLowerCase() === 'export') {
            return 'pdocexport/' + format;
        }
        return 'pdocsearch';
    };
    PDocHttpAdapter.prototype.mapRecordToAdapterValues = function (mapper, values) {
        var record = values;
        if (!(record instanceof pdoc_record_1.PDocRecord)) {
            record = this.responseMapper.mapValuesToRecord(mapper, values);
        }
        return this.responseMapper.mapToAdapterDocument({}, record);
    };
    return PDocHttpAdapter;
}(generic_search_http_adapter_1.GenericSearchHttpAdapter));
exports.PDocHttpAdapter = PDocHttpAdapter;
//# sourceMappingURL=pdoc-http.adapter.js.map