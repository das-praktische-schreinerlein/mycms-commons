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
var pdoc_searchresult_1 = require("../model/container/pdoc-searchresult");
var generic_search_service_1 = require("../../search-commons/services/generic-search.service");
var pdoc_searchform_1 = require("../model/forms/pdoc-searchform");
var PDocSearchService = /** @class */ (function (_super) {
    __extends(PDocSearchService, _super);
    function PDocSearchService(dataStore) {
        return _super.call(this, dataStore, 'pdoc') || this;
    }
    PDocSearchService.prototype.createDefaultSearchForm = function () {
        return new pdoc_searchform_1.PDocSearchForm({ pageNum: 1, perPage: 10 });
    };
    PDocSearchService.prototype.getBaseMapperName = function () {
        return 'pdoc';
    };
    PDocSearchService.prototype.isRecordInstanceOf = function (record) {
        return record instanceof pdoc_record_1.PDocRecord;
    };
    PDocSearchService.prototype.createRecord = function (props, opts) {
        return this.dataStore.createRecord(this.getBaseMapperName(), props, opts);
    };
    PDocSearchService.prototype.newRecord = function (values) {
        return new pdoc_record_1.PDocRecord(values);
    };
    PDocSearchService.prototype.newSearchForm = function (values) {
        return new pdoc_searchform_1.PDocSearchForm(values);
    };
    PDocSearchService.prototype.newSearchResult = function (pdocSearchForm, recordCount, currentRecords, facets) {
        return new pdoc_searchresult_1.PDocSearchResult(pdocSearchForm, recordCount, currentRecords, facets);
    };
    PDocSearchService.prototype.cloneSanitizedSearchForm = function (src) {
        return undefined;
    };
    PDocSearchService.prototype.createSanitizedSearchForm = function (values) {
        return undefined;
    };
    PDocSearchService.prototype.doMultiSearch = function (searchForm, ids) {
        return undefined;
    };
    return PDocSearchService;
}(generic_search_service_1.GenericSearchService));
exports.PDocSearchService = PDocSearchService;
//# sourceMappingURL=pdoc-search.service.js.map