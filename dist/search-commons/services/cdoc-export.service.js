"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var CommonDocDocExportService = /** @class */ (function () {
    function CommonDocDocExportService(backendConfig, dataService, playlistService, responseMapper) {
        this.playlistService = playlistService;
        this.dataService = dataService;
        this.responseMapper = responseMapper;
    }
    CommonDocDocExportService.prototype.exportMediaFiles = function (searchForm, processingOptions) {
        var me = this;
        var exportResults = [];
        var callback = function (mdoc) {
            return [
                me.exportMediaRecordFiles(mdoc, processingOptions, exportResults)
            ];
        };
        return this.dataService.batchProcessSearchResult(searchForm, callback, {
            loadDetailsMode: 'full',
            loadTrack: false,
            showFacets: false,
            showForm: false
        }, processingOptions).then(function () {
            return me.generatePlaylistForExportResults(processingOptions, exportResults).then(function () {
                return me.exportRelatedDocsForExportedMediaFiles(processingOptions, searchForm, exportResults);
            });
        });
    };
    CommonDocDocExportService.prototype.searchAndExportRelatedDocs = function (processingOptions, baseSearchForm) {
        if (!processingOptions.exportBaseFileName) {
            console.error('no recordexport', processingOptions.exportBaseFileName);
            return Promise.resolve('');
        }
        var readAllRecordsForSearchForm = function (recursiveSearchForm, results) {
            return me.dataService.search(recursiveSearchForm, {
                showFacets: false,
                showForm: false,
                loadDetailsMode: 'full',
                loadTrack: true
            }).then(function searchDone(searchResult) {
                results = results.concat(searchResult.currentRecords);
                console.log('DONE ' + recursiveSearchForm.pageNum
                    + ' from ' + (searchResult.recordCount / recursiveSearchForm.perPage + 1)
                    + ' for: ' + searchResult.recordCount, recursiveSearchForm);
                recursiveSearchForm.pageNum++;
                if (recursiveSearchForm.pageNum < (searchResult.recordCount / recursiveSearchForm.perPage + 1)) {
                    return readAllRecordsForSearchForm(recursiveSearchForm, results);
                }
                else {
                    return Promise.resolve(results);
                }
            }).catch(function searchError(error) {
                console.error('error thrown: ', error);
                return Promise.reject(error);
            });
        };
        var me = this;
        return readAllRecordsForSearchForm(baseSearchForm, []).then(function (records) {
            return me.exportRelatedDocs(processingOptions, baseSearchForm, records, function (mdoc) {
                return mdoc;
            }).then(function (value) {
                return Promise.resolve(value);
            });
        });
    };
    CommonDocDocExportService.prototype.generatePlaylistForExportResults = function (processingOptions, exportResults) {
        if (!processingOptions.exportBaseFileName) {
            console.error('no playlistexport', processingOptions.exportBaseFileName);
            return Promise.resolve('');
        }
        var me = this;
        var playlist = [me.playlistService.generateM3uHeader()].concat(exportResults.map(function (exportResult) {
            return me.generatePlaylistEntry(exportResult.record, exportResult.exportFileEntry);
        })).join('\n');
        var m3uPath = processingOptions.exportBasePath + '/' + processingOptions.exportBaseFileName + '.m3u';
        if (fs.existsSync(m3uPath) && !fs.statSync(m3uPath).isFile()) {
            return Promise.reject('exportBaseFileName must be file');
        }
        fs.writeFileSync(m3uPath, playlist);
        console.error('wrote playlist', m3uPath);
        return Promise.resolve(playlist);
    };
    CommonDocDocExportService.prototype.exportRelatedDocsForExportedMediaFiles = function (processingOptions, baseSearchForm, exportResults) {
        var me = this;
        var baseSearchRecords = [];
        var idMediaFileMappings = {};
        var idRecordFieldMappings = {};
        exportResults.map(function (entry) {
            if (entry.record !== undefined) {
                baseSearchRecords.push(entry.record);
                idMediaFileMappings[entry.record.id] = entry.mediaFileMappings;
                if (entry.externalRecordFieldMappings !== undefined) {
                    Object.keys(entry.externalRecordFieldMappings).map(function (id) {
                        if (!idRecordFieldMappings[id] === undefined) {
                            idRecordFieldMappings[id] = {};
                        }
                        idRecordFieldMappings[id] = __assign({}, idRecordFieldMappings[id], entry.externalRecordFieldMappings[id]);
                    });
                }
            }
        });
        var converter = function (mdoc) {
            return me.convertAdapterDocValues(mdoc, idMediaFileMappings, idRecordFieldMappings);
        };
        return this.exportRelatedDocs(processingOptions, baseSearchForm, baseSearchRecords, converter);
    };
    CommonDocDocExportService.prototype.exportRelatedDocs = function (processingOptions, baseSearchForm, baseSearchRecords, recordConverter) {
        if (!processingOptions.exportBaseFileName) {
            console.error('no recordexport', processingOptions.exportBaseFileName);
            return Promise.resolve('');
        }
        var jsonBaseElement = processingOptions.jsonBaseElement
            ? processingOptions.jsonBaseElement
            : 'mdocs';
        var nameBase = processingOptions.jsonBaseElement
            ? processingOptions.jsonBaseElement
            : 'mdoc';
        var m3uPath = processingOptions.exportBasePath + '/' + processingOptions.exportBaseFileName + '.' + nameBase + 'export.json';
        if (fs.existsSync(m3uPath) && !fs.statSync(m3uPath).isFile()) {
            return Promise.reject('exportBaseFileName must be file');
        }
        var writerCallback = function (output) {
            fs.appendFileSync(m3uPath, output);
        };
        var me = this;
        fs.writeFileSync(m3uPath, '{"' + jsonBaseElement + '": [');
        return me.generateRelatedExportDocs(baseSearchForm, baseSearchRecords, writerCallback, recordConverter).then(function (value) {
            writerCallback(']}');
            return Promise.resolve(value);
        });
    };
    CommonDocDocExportService.prototype.generateRelatedExportDocs = function (baseSearchForm, baseSearchRecords, writerCallback, recordConverter) {
        var me = this;
        var idsRead = {};
        var first = true;
        var replacer = function (key, value) {
            if (value === null) {
                return undefined;
            }
            return value;
        };
        var processAndExportSearchResult = function (recursiveSearchForm, results) {
            console.log('processAndExportSearchResult resultCount: ' + results.length +
                ' ids:' + Object.getOwnPropertyNames(idsRead).length);
            // write searchResult
            var output = '';
            for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
                var doc = results_1[_i];
                output += (first ? '\n  ' : ',\n  ') +
                    JSON.stringify(recordConverter(me.responseMapper.mapToAdapterDocument({}, doc)), replacer);
                first = false;
            }
            writerCallback(output);
            // extract ids from searchResult
            var idsToRead = [];
            for (var _a = 0, results_2 = results; _a < results_2.length; _a++) {
                var doc = results_2[_a];
                if (idsRead[doc.type] === undefined) {
                    idsRead[doc.type] = {};
                }
                idsRead[doc.type][doc.id] = true;
            }
            for (var _b = 0, results_3 = results; _b < results_3.length; _b++) {
                var doc = results_3[_b];
                idsToRead = idsToRead.concat(me.checkIdToRead(doc, idsRead));
            }
            var unique = [];
            idsToRead.forEach(function (v) { return unique[v] = true; });
            idsToRead = Object.keys(unique);
            if (idsToRead.length > 0) {
                console.log('processAndExportSearchResult doSearch: ' + idsToRead.length);
                return me.dataService.doMultiSearch(baseSearchForm, idsToRead).then(function (searchResult) {
                    console.log('processAndExportSearchResult doneSearch: ' + searchResult.recordCount);
                    return processAndExportSearchResult(recursiveSearchForm, searchResult.currentRecords);
                });
            }
            else {
                return Promise.resolve({});
            }
        };
        return processAndExportSearchResult(baseSearchForm, baseSearchRecords);
    };
    return CommonDocDocExportService;
}());
exports.CommonDocDocExportService = CommonDocDocExportService;
//# sourceMappingURL=cdoc-export.service.js.map