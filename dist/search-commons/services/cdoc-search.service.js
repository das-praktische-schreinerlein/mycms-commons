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
var generic_search_service_1 = require("./generic-search.service");
var date_utils_1 = require("../../commons/utils/date.utils");
var js_data_1 = require("js-data");
var CommonDocSearchService = /** @class */ (function (_super) {
    __extends(CommonDocSearchService, _super);
    function CommonDocSearchService(dataStore, mapperName) {
        return _super.call(this, dataStore, mapperName) || this;
    }
    CommonDocSearchService.prototype.doMultiSearch = function (searchForm, ids) {
        var me = this;
        if (ids.length <= 0 || ids[0] === '') {
            return js_data_1.utils.resolve(this.newSearchResult(searchForm, 0, [], undefined));
        }
        var idTypeMap = {};
        for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
            var id = ids_1[_i];
            var type = id.split('_')[0];
            type = type.toLowerCase();
            if (idTypeMap[type] === undefined) {
                idTypeMap[type] = { ids: [], records: {} };
            }
            idTypeMap[type]['ids'].push(id);
        }
        var promises = [];
        for (var type in idTypeMap) {
            for (var page = 1; page <= (idTypeMap[type]['ids'].length / this.maxPerRun) + 1; page++) {
                var typeSearchForm = this.newSearchForm({});
                var start = (page - 1) * this.maxPerRun;
                var end = Math.min(start + this.maxPerRun, idTypeMap[type]['ids'].length);
                var idTranche = idTypeMap[type]['ids'].slice(start, end);
                typeSearchForm.moreFilter = 'id:' + idTranche.join(',');
                typeSearchForm.type = type;
                typeSearchForm.perPage = this.maxPerRun;
                typeSearchForm.pageNum = 1;
                typeSearchForm.sort = 'dateAsc';
                promises.push(me.search(typeSearchForm, {
                    showFacets: false,
                    loadTrack: true,
                    showForm: false
                }));
            }
        }
        return new Promise(function (resolve, reject) {
            Promise.all(promises).then(function doneSearch(docSearchResults) {
                var records = [];
                docSearchResults.forEach(function (docSearchResult) {
                    for (var _i = 0, _a = docSearchResult.currentRecords; _i < _a.length; _i++) {
                        var doc = _a[_i];
                        var type = doc.id.split('_')[0];
                        type = type.toLowerCase();
                        idTypeMap[type]['records'][doc.id] = doc;
                    }
                });
                for (var _i = 0, ids_2 = ids; _i < ids_2.length; _i++) {
                    var id = ids_2[_i];
                    var type = id.split('_')[0];
                    type = type.toLowerCase();
                    if (idTypeMap[type]['records'][id] !== undefined) {
                        records.push(idTypeMap[type]['records'][id]);
                    }
                }
                me.sortRecords(records, searchForm.sort);
                var docSearchResult = me.newSearchResult(searchForm, records.length, records, undefined);
                resolve(docSearchResult);
            }).catch(function errorSearch(reason) {
                reject(reason);
            });
        });
    };
    CommonDocSearchService.prototype.sortRecords = function (records, sortType) {
        if (sortType === 'relevance') {
        }
        else if (sortType === 'dateAsc' || sortType === 'dateDesc') {
            var retLt_1 = sortType === 'dateAsc' ? -1 : 1;
            records.sort(function (a, b) {
                var dateA = date_utils_1.DateUtils.parseDate(a.dateshow);
                var dateB = date_utils_1.DateUtils.parseDate(b.dateshow);
                var nameA = (dateA !== undefined ? dateA.getTime() : 0);
                var nameB = (dateB !== undefined ? dateB.getTime() : 0);
                if (nameA < nameB) {
                    return retLt_1;
                }
                if (nameA > nameB) {
                    return -retLt_1;
                }
                return 0;
            });
        }
        else if (sortType === 'name') {
            records.sort(function (a, b) {
                var nameA = (a.name !== undefined ? a.name : '');
                var nameB = (b.name !== undefined ? b.name : '');
                return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
            });
        }
        else if (sortType === 'type') {
            records.sort(function (a, b) {
                var nameA = (a.type !== undefined ? a.type : '');
                var nameB = (b.type !== undefined ? b.type : '');
                return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
            });
        }
        else if (sortType === 'subtype') {
            records.sort(function (a, b) {
                var nameA = (a.subtype !== undefined ? a.subtype : '');
                var nameB = (b.subtype !== undefined ? b.subtype : '');
                return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
            });
        }
        else {
            console.warn('unknown sortType', sortType);
        }
    };
    CommonDocSearchService.prototype.getAvailableSorts = function () {
        return ['relevance', 'dateAsc', 'dateDesc', 'name', 'type', 'subtype'];
    };
    return CommonDocSearchService;
}(generic_search_service_1.GenericSearchService));
exports.CommonDocSearchService = CommonDocSearchService;
//# sourceMappingURL=cdoc-search.service.js.map