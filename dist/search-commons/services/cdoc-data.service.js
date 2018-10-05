"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = require("js-data");
var CommonDocDataService = /** @class */ (function () {
    function CommonDocDataService(dataStore, searchService, responseMapper) {
        this.dataStore = dataStore;
        this.searchService = searchService;
        this.responseMapper = responseMapper;
        this.writable = false;
        this.typeMapping = {};
        this.idMappings = [];
        this.idMappingAliases = {};
        this.defineDatastoreMapper();
        this.typeMapping = this.defineTypeMappings();
        this.idMappings = this.defineIdMappings();
        this.idMappingAliases = this.defineIdMappingAlliases();
    }
    CommonDocDataService.prototype.getBaseMapperName = function () {
        return this.searchService.getBaseMapperName();
    };
    CommonDocDataService.prototype.isRecordInstanceOf = function (record) {
        return this.searchService.isRecordInstanceOf(record);
    };
    CommonDocDataService.prototype.newRecord = function (values) {
        return this.searchService.newRecord(values);
    };
    CommonDocDataService.prototype.newSearchForm = function (values) {
        return this.searchService.newSearchForm(values);
    };
    CommonDocDataService.prototype.newSearchResult = function (searchForm, recordCount, currentRecords, facets) {
        return this.searchService.newSearchResult(searchForm, recordCount, currentRecords, facets);
    };
    CommonDocDataService.prototype.createSanitizedSearchForm = function (values) {
        return this.searchService.createSanitizedSearchForm(values);
    };
    CommonDocDataService.prototype.cloneSanitizedSearchForm = function (src) {
        return this.searchService.cloneSanitizedSearchForm(src);
    };
    CommonDocDataService.prototype.getMapper = function (mapperName) {
        return this.searchService.getMapper(mapperName);
    };
    CommonDocDataService.prototype.getAdapterForMapper = function (mapperName) {
        return this.searchService.getAdapterForMapper(mapperName);
    };
    CommonDocDataService.prototype.getSearchService = function () {
        return this.searchService;
    };
    CommonDocDataService.prototype.generateNewId = function () {
        return (new Date()).getTime().toString();
    };
    CommonDocDataService.prototype.createDefaultSearchForm = function () {
        return this.searchService.createDefaultSearchForm();
    };
    CommonDocDataService.prototype.getAll = function (opts) {
        return this.searchService.getAll(opts);
    };
    CommonDocDataService.prototype.findCurList = function (searchForm, opts) {
        return this.searchService.findCurList(searchForm, opts);
    };
    CommonDocDataService.prototype.doMultiSearch = function (searchForm, ids) {
        return this.searchService.doMultiSearch(searchForm, ids);
    };
    CommonDocDataService.prototype.export = function (searchForm, format, opts) {
        return this.searchService.export(searchForm, format, opts);
    };
    CommonDocDataService.prototype.search = function (searchForm, opts) {
        return this.searchService.search(searchForm, opts);
    };
    CommonDocDataService.prototype.getById = function (id, opts) {
        return this.searchService.getById(id, opts);
    };
    CommonDocDataService.prototype.getByIdFromLocalStore = function (id) {
        return this.getByIdFromLocalStore(id);
    };
    CommonDocDataService.prototype.clearLocalStore = function () {
        this.searchService.clearLocalStore();
    };
    CommonDocDataService.prototype.add = function (values, opts) {
        if (!this.isWritable()) {
            throw new Error('CommonDocDataService configured: not writable');
        }
        var record;
        if (!(this.isRecordInstanceOf(values))) {
            record = this.responseMapper.mapValuesToRecord(this.dataStore.getMapper(this.getBaseMapperName()), values);
        }
        else {
            record = values;
        }
        if (record === undefined || !record.isValid()) {
            return js_data_1.utils.reject('doc-values not valid');
        }
        return this.dataStore.create(this.getBaseMapperName(), record, opts);
    };
    CommonDocDataService.prototype.addMany = function (docs, opts) {
        if (!this.isWritable()) {
            throw new Error('CommonDocDataService configured: not writable');
        }
        return this.dataStore.createMany(this.getBaseMapperName(), docs, opts);
    };
    CommonDocDataService.prototype.deleteById = function (id, opts) {
        if (!this.isWritable()) {
            throw new Error('CommonDocDataService configured: not writable');
        }
        return this.dataStore.destroy(this.getBaseMapperName(), id, opts);
    };
    CommonDocDataService.prototype.updateById = function (id, values, opts) {
        if (!this.isWritable()) {
            throw new Error('CommonDocDataService configured: not writable');
        }
        var record;
        if (!(this.isRecordInstanceOf(values))) {
            record = this.responseMapper.mapValuesToRecord(this.dataStore.getMapper(this.getBaseMapperName()), values);
        }
        else {
            record = values;
        }
        if (record === undefined || !record.isValid()) {
            return js_data_1.utils.reject('doc-values not valid');
        }
        return this.dataStore.update(this.getBaseMapperName(), id, record, opts);
    };
    CommonDocDataService.prototype.doActionTag = function (docRecord, actionTagForm, opts) {
        if (!this.isWritable()) {
            throw new Error('CommonDocDataService configured: not writable');
        }
        return this.dataStore.doActionTag(this.getBaseMapperName(), docRecord, actionTagForm, opts);
    };
    CommonDocDataService.prototype.doActionTags = function (docRecord, actionTagForms, opts) {
        if (!this.isWritable()) {
            throw new Error('CommonDocDataService configured: not writable');
        }
        var curCdocRecord = docRecord;
        var me = this;
        var promises = actionTagForms.map(function (actionTagForm) {
            return me.doActionTag(curCdocRecord, actionTagForm, opts)
                .then(function onDone(newCdocRecord) {
                curCdocRecord = newCdocRecord;
                return js_data_1.utils.resolve(newCdocRecord);
            }).catch(function onError(error) {
                return js_data_1.utils.reject(error);
            });
        });
        var results = Promise.all(promises);
        return results.then(function (data) {
            return js_data_1.utils.resolve(curCdocRecord);
        }).catch(function (errors) {
            return js_data_1.utils.reject(errors);
        });
    };
    CommonDocDataService.prototype.importRecord = function (record, recordIdMapping, recordRecoverIdMapping, opts) {
        opts = opts || {};
        var mapper = this.searchService.getMapper(this.getBaseMapperName());
        var adapter = this.searchService.getAdapterForMapper(this.getBaseMapperName());
        if (!this.isWritable()) {
            throw new Error('CommonDocDataService configured: not writable');
        }
        var query = this.generateImportRecordQuery(record);
        var logName = this.generateImportRecordName(record);
        var myMappings = {};
        var me = this;
        return adapter.findAll(mapper, query, opts)
            .then(function (searchResult) {
            if (!searchResult || searchResult.length <= 0) {
                return js_data_1.utils.resolve(undefined);
            }
            return js_data_1.utils.resolve(searchResult[0]);
        }).then(function recordsDone(docRecord) {
            if (docRecord !== undefined) {
                console.log('EXISTING - record', logName);
                var idFieldName = me.typeMapping[record.type.toLowerCase()];
                myMappings[idFieldName] = record[idFieldName];
                return js_data_1.utils.resolve(docRecord);
                // console.log('UPDATE - record', record.name);
                // return dataService.updateById(docRecord.id, record);
            }
            // new record: map refIds
            record.subtype = record.subtype ? record.subtype.replace(/[-a-zA-Z_]+/g, '') : '';
            me.onImportRecordNewRecordProcessDefaults(record);
            for (var _i = 0, _a = me.idMappings; _i < _a.length; _i++) {
                var refIdFieldName = _a[_i];
                if (recordIdMapping[refIdFieldName] && recordIdMapping[refIdFieldName][record[refIdFieldName]]) {
                    console.log('orig: ' + record.id + ' map ref ' + refIdFieldName + ' ' + record[refIdFieldName]
                        + '->' + recordIdMapping[refIdFieldName][record[refIdFieldName]]);
                    record[refIdFieldName] = recordIdMapping[refIdFieldName][record[refIdFieldName]];
                }
                else if (record[refIdFieldName] && !(record[refIdFieldName] === null || record[refIdFieldName] === undefined)) {
                    console.log('orig: ' + record.id + ' save ref ' + refIdFieldName + ' ' + record[refIdFieldName]);
                    myMappings[refIdFieldName] = record[refIdFieldName];
                    record[refIdFieldName] = undefined;
                }
            }
            console.log('ADD - record', logName);
            return me.add(record).then(function onFullfilled(newCdocRecord) {
                docRecord = newCdocRecord;
                return me.doImportActionTags(record, docRecord, opts);
            });
        }).then(function recordsDone(newCdocRecord) {
            var idFieldName = me.typeMapping[record.type.toLowerCase()];
            if (!recordIdMapping.hasOwnProperty(idFieldName)) {
                recordIdMapping[idFieldName] = {};
            }
            console.log('new: ' + newCdocRecord.id + ' save recordIdMapping ' + idFieldName + ' ' + myMappings[idFieldName]
                + '->' + newCdocRecord[idFieldName]);
            console.log('new: ' + newCdocRecord.id + ' save recordRecoverIdMapping for ' + ':', myMappings);
            recordIdMapping[idFieldName][myMappings[idFieldName]] = newCdocRecord[idFieldName];
            recordRecoverIdMapping[newCdocRecord.id] = myMappings;
            return js_data_1.utils.resolve(newCdocRecord);
        }).catch(function onError(error) {
            return js_data_1.utils.reject(error);
        });
    };
    CommonDocDataService.prototype.postProcessImportRecord = function (record, recordIdMapping, recordRecoverIdMapping, opts) {
        opts = opts || {};
        if (!recordRecoverIdMapping[record.id]) {
            console.log('new: ' + record.id + ' no ids to recover');
            return js_data_1.utils.resolve(record);
        }
        // recover refIds
        var updateNeeded = false;
        for (var _i = 0, _a = this.idMappings; _i < _a.length; _i++) {
            var refIdFieldName = _a[_i];
            var mappingName = this.idMappingAliases[refIdFieldName] || refIdFieldName;
            var fieldId = recordRecoverIdMapping[record.id][refIdFieldName];
            if (fieldId && recordIdMapping[mappingName] && recordIdMapping[mappingName][fieldId]
                && record[refIdFieldName] !== recordIdMapping[mappingName][fieldId]) {
                console.log('new: ' + record.id + ' recover ref ' + refIdFieldName + ' ' + fieldId
                    + '->' + mappingName + ':' + recordIdMapping[mappingName][fieldId]);
                record[refIdFieldName] = recordIdMapping[mappingName][fieldId];
                updateNeeded = true;
            }
        }
        if (!updateNeeded) {
            console.log('new: ' + record.id + ' no ids to recover');
            return js_data_1.utils.resolve(record);
        }
        record.subtype = record.subtype ? record.subtype.replace(/[-a-zA-Z_]+/g, '') : '';
        return this.updateById(record.id, record, opts).then(function recordsDone(newCdocRecord) {
            return js_data_1.utils.resolve(newCdocRecord);
        }).catch(function onError(error) {
            return js_data_1.utils.reject(error);
        });
    };
    CommonDocDataService.prototype.setWritable = function (writable) {
        this.writable = writable;
    };
    CommonDocDataService.prototype.isWritable = function () {
        return this.writable;
    };
    CommonDocDataService.prototype.doImportActionTags = function (origRecord, newRecord, opts) {
        if (newRecord.type.toLowerCase() !== 'image' && newRecord.type.toLowerCase() !== 'video') {
            return js_data_1.utils.resolve(newRecord);
        }
        // map data of orig-record to new record
        var actionTagForms = [];
        for (var _i = 0, _a = (origRecord.playlists ? origRecord.playlists.split(',') : []); _i < _a.length; _i++) {
            var playlist = _a[_i];
            playlist = playlist.trim();
            var actionTagForm = {
                type: 'tag',
                recordId: newRecord.id,
                key: 'playlists_' + playlist,
                payload: {
                    playlistkey: playlist,
                    set: true
                }
            };
            actionTagForms.push(actionTagForm);
        }
        this.addAdditionalActionTagForms(origRecord, newRecord, actionTagForms);
        if (actionTagForms.length <= 0) {
            return js_data_1.utils.resolve(newRecord);
        }
        console.log('ACTIONTAGS - record', origRecord.type + ' ' + origRecord.name, actionTagForms);
        return this.doActionTags(newRecord, actionTagForms, opts);
    };
    CommonDocDataService.prototype.generateImportRecordQuery = function (record) {
        return {
            where: {
                name_s: {
                    'in': [record.name]
                },
                type_txt: {
                    'in': [record.type.toLowerCase()]
                }
            }
        };
    };
    CommonDocDataService.prototype.generateImportRecordName = function (record) {
        return record.type + ' ' + record.name;
    };
    return CommonDocDataService;
}());
exports.CommonDocDataService = CommonDocDataService;
//# sourceMappingURL=cdoc-data.service.js.map