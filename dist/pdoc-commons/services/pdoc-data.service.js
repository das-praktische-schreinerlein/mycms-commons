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
var pdoc_record_1 = require("../model/records/pdoc-record");
var pdoc_search_service_1 = require("./pdoc-search.service");
var pdoc_record_schema_1 = require("../model/schemas/pdoc-record-schema");
var PDocDataService = /** @class */ (function (_super) {
    __extends(PDocDataService, _super);
    function PDocDataService(dataStore) {
        var _this = _super.call(this, dataStore) || this;
        _this.writable = false;
        _this.dataStore.defineMapper('pdoc', pdoc_record_1.PDocRecord, pdoc_record_schema_1.PDocRecordSchema, pdoc_record_1.PDocRecordRelation);
        return _this;
    }
    PDocDataService.prototype.generateNewId = function () {
        return (new Date()).getTime().toString();
    };
    PDocDataService.prototype.createRecord = function (props, opts) {
        return this.dataStore.createRecord(this.searchMapperName, props, opts);
    };
    // Simulate POST /pdocs
    PDocDataService.prototype.add = function (pdoc, opts) {
        if (!this.isWritable()) {
            throw new Error('PDocDataService configured: not writable');
        }
        return this.dataStore.create('pdoc', pdoc, opts);
    };
    // Simulate POST /pdocs
    PDocDataService.prototype.addMany = function (pdocs, opts) {
        if (!this.isWritable()) {
            throw new Error('PDocDataService configured: not writable');
        }
        return this.dataStore.createMany('pdoc', pdocs, opts);
    };
    // Simulate DELETE /pdocs/:id
    PDocDataService.prototype.deleteById = function (id, opts) {
        if (!this.isWritable()) {
            throw new Error('PDocDataService configured: not writable');
        }
        return this.dataStore.destroy('pdoc', id, opts);
    };
    // Simulate PUT /pdocs/:id
    PDocDataService.prototype.updateById = function (id, values, opts) {
        if (values === void 0) { values = {}; }
        if (!this.isWritable()) {
            throw new Error('PDocDataService configured: not writable');
        }
        return this.dataStore.update('pdoc', id, values, opts);
    };
    PDocDataService.prototype.getSubDocuments = function (pdoc) {
        var sections = [];
        if (!pdoc) {
            return [];
        }
        var ids = pdoc.subSectionIds !== undefined ? pdoc.subSectionIds.split(/,/) : [];
        for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
            var id = ids_1[_i];
            if (id === undefined || id.length === 0) {
                continue;
            }
            var section = this.getByIdFromLocalStore(id);
            if (section !== undefined) {
                sections.push(section);
            }
            else {
                // console.warn('getSubSections: section not found:', LogUtils.sanitizeLogMsg(id));
            }
        }
        return sections;
    };
    PDocDataService.prototype.setWritable = function (writable) {
        this.writable = writable;
    };
    PDocDataService.prototype.isWritable = function () {
        return this.writable;
    };
    return PDocDataService;
}(pdoc_search_service_1.PDocSearchService));
exports.PDocDataService = PDocDataService;
//# sourceMappingURL=pdoc-data.service.js.map