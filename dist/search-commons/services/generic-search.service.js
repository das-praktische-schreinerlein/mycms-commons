"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GenericSearchService = /** @class */ (function () {
    function GenericSearchService(dataStore, mapperName) {
        this.maxPerRun = 99;
        this.dataStore = dataStore;
        this.searchMapperName = mapperName;
    }
    GenericSearchService.prototype.getMapper = function (mapperName) {
        return this.dataStore.getMapper(mapperName);
    };
    GenericSearchService.prototype.getAdapterForMapper = function (mapperName) {
        return this.dataStore.getAdapterForMapper(mapperName);
    };
    GenericSearchService.prototype.clearLocalStore = function () {
        this.dataStore.clearLocalStore(this.searchMapperName);
    };
    GenericSearchService.prototype.getAll = function (opts) {
        var allForm = this.createDefaultSearchForm();
        allForm.perPage = -1;
        return this.findCurList(allForm, opts);
    };
    GenericSearchService.prototype.findCurList = function (searchForm, opts) {
        // console.log('findCurList for form', searchForm);
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            _this.search(searchForm, opts).then(function doneSearch(searchResultData) {
                // console.log('findCurList searchResultData', searchResultData);
                return resolve(searchResultData.currentRecords);
            }, function errorSearch(reason) {
                console.error('findCurList failed:', reason);
                return reject(reason);
            });
        });
        return result;
    };
    GenericSearchService.prototype.search = function (searchForm, opts) {
        // console.log('search for form', searchForm);
        var searchResultObs = this.dataStore.search(this.searchMapperName, searchForm, opts);
        var me = this;
        var result = new Promise(function (resolve, reject) {
            searchResultObs.then(function doneSearch(searchResultData) {
                // console.log('search searchResultData', searchResultData);
                return resolve(searchResultData);
            }, function errorSearch(reason) {
                console.error('search failed:', reason);
                return reject(reason);
            });
        });
        return result;
    };
    GenericSearchService.prototype.getById = function (id, opts) {
        return this.dataStore.find(this.searchMapperName, id, opts);
    };
    GenericSearchService.prototype.getByIdFromLocalStore = function (id) {
        return this.dataStore.getFromLocalStore(this.searchMapperName, id);
    };
    return GenericSearchService;
}());
exports.GenericSearchService = GenericSearchService;
//# sourceMappingURL=generic-search.service.js.map