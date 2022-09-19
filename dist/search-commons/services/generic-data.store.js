"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// DataStore is mostly recommended for use in the browser
var js_data_1 = require("js-data");
var facets_1 = require("../model/container/facets");
var GenericDataStore = /** @class */ (function () {
    function GenericDataStore(updateRelations) {
        this.updateRelations = updateRelations;
        this.mappers = new Map();
        this.mapperAdapters = new Map();
        var me = this;
        this.store = new js_data_1.DataStore({
            usePendingFindAll: false,
            usePendingFind: false,
            addToCache: function (name_, data, opts) {
                // disabled js-data-cache in generic-datastore because of objects with different loadDetailsProfiles loaded
                return data;
            },
            mapperDefaults: {
                // Override the original to make sure the date properties are actually Date
                // objects
                createRecord: function (props, opts) {
                    var result = undefined;
                    for (var key in props) {
                        if (props.hasOwnProperty(key) && props[key] === null) {
                            props[key] = undefined;
                        }
                    }
                    try {
                        result = this.constructor.prototype.createRecord.call(this, props, opts);
                    }
                    catch (err) {
                        // console.error('validation failed for', props);
                        console.log('validation errors', err.errors);
                        throw err;
                    }
                    /**                    if (Array.isArray(result)) {
                        result.forEach(this.convertToDate);
                    } else if (this.is(result)) {
                        GenericDataStore.convertToDate(result);
                    }
                     **/
                    return result;
                },
                beforeCreate: function (props, opts) {
                    opts.realSource = props;
                    return js_data_1.utils.resolve(props);
                },
                afterCreate: function (props, opts, result) {
                    if (opts.realResult) {
                        result = opts.realResult;
                    }
                    return js_data_1.utils.resolve(result);
                },
                beforeUpdate: function (id, props, opts) {
                    opts.realSource = props;
                    return js_data_1.utils.resolve(props);
                },
                afterUpdate: function (id, props, opts, result) {
                    var _a;
                    if (opts.realResult) {
                        result = opts.realResult;
                    }
                    // update relations
                    for (var _i = 0, _b = me.updateRelations; _i < _b.length; _i++) {
                        var mapperKey = _b[_i];
                        if (result.get(mapperKey)) {
                            var obj = result.get(mapperKey);
                            me.store.add(mapperKey, obj);
                            result.set(mapperKey, obj);
                        }
                        else {
                            me.store.removeAll(mapperKey, { where: { 'cdoc_id': { 'contains': result.id } } });
                            me.store.removeAll(mapperKey, { where: (_a = {}, _a['cdoc_id'] = { 'contains': [result.id] }, _a) });
                            me.store.removeAll(mapperKey, { where: { 'cdoc_id': { 'contains': [result.id] } } });
                            result.set(mapperKey, undefined);
                        }
                    }
                    return js_data_1.utils.resolve(result);
                }
            }
        });
    }
    GenericDataStore.convertToDate = function (record) {
        if (typeof record.created_at === 'string') {
            record.created_at = new Date(record.created_at);
        }
        if (typeof record.updated_at === 'string') {
            record.updated_at = new Date(record.updated_at);
        }
    };
    GenericDataStore.prototype.defineMapper = function (mapperName, recordClass, schema, relations) {
        this.mappers.set(mapperName, this.store.defineMapper(mapperName, {
            recordClass: recordClass,
            applySchema: true,
            schema: schema,
            relations: relations
        }));
        return this.mappers.get(mapperName);
    };
    GenericDataStore.prototype.setAdapter = function (adapterName, adapter, mapperName, options) {
        if (mapperName === undefined || mapperName === '') {
            this.store.registerAdapter(adapterName, adapter, { 'default': true });
            this.mapperAdapters.set('', adapter);
        }
        else {
            this.mappers.get(mapperName).registerAdapter(adapterName, adapter, { 'default': true });
            this.mapperAdapters.set(mapperName, adapter);
        }
    };
    GenericDataStore.prototype.count = function (mapperName, query, opts) {
        if (this.getAdapterForMapper(mapperName) === undefined || (opts && opts.forceLocalStore)) {
            return js_data_1.utils.Promise.resolve(this.store.filter(mapperName, query).length);
        }
        else {
            return this.getAdapterForMapper(mapperName).count(this.store.getMapper(mapperName), query, opts);
        }
    };
    GenericDataStore.prototype.createRecord = function (mapperName, props, opts) {
        return this.store.createRecord(mapperName, props, opts);
    };
    GenericDataStore.prototype.create = function (mapperName, record, opts) {
        if (this.getAdapterForMapper(mapperName) === undefined || (opts && opts.forceLocalStore)) {
            return js_data_1.utils.Promise.resolve(this.store.add(mapperName, record, opts));
        }
        else {
            return this.store.create(mapperName, record, opts);
        }
    };
    GenericDataStore.prototype.createMany = function (mapperName, records, opts) {
        if (this.getAdapterForMapper(mapperName) === undefined || (opts && opts.forceLocalStore)) {
            return js_data_1.utils.Promise.resolve(this.store.add(mapperName, records, opts));
        }
        else {
            return this.store.createMany(mapperName, records, opts);
        }
    };
    GenericDataStore.prototype.destroy = function (mapperName, id, opts) {
        if (this.getAdapterForMapper(mapperName) === undefined || (opts && opts.forceLocalStore)) {
            return js_data_1.utils.Promise.resolve(this.store.remove(mapperName, id, opts));
        }
        else {
            return this.store.destroy(mapperName, id, opts);
        }
    };
    GenericDataStore.prototype.doActionTag = function (mapperName, record, actionTagForm, opts) {
        var _this = this;
        var me = this;
        var result = new Promise(function (resolve, reject) {
            if (_this.getAdapterForMapper(mapperName) === undefined ||
                (typeof me.getAdapterForMapper(mapperName)['doActionTag'] !== 'function')) {
                return reject('doActionTag not supported');
            }
            else {
                var mapper = _this.store.getMapper(mapperName);
                var adapter = me.getAdapterForMapper(mapperName);
                me.store.remove(mapperName, record['id']);
                adapter.doActionTag(mapper, record, actionTagForm, opts)
                    .then(function doneActionTag(genericResult) {
                    return resolve(genericResult);
                }).catch(function errorHandling(reason) {
                    console.error('doActionTag failed:', reason, actionTagForm);
                    return reject(reason);
                });
            }
        });
        return result;
    };
    GenericDataStore.prototype.clearLocalStore = function (mapperName) {
        this.store.removeAll(mapperName);
    };
    GenericDataStore.prototype.facets = function (mapperName, query, opts) {
        if (this.getAdapterForMapper(mapperName) === undefined ||
            (typeof this.getAdapterForMapper(mapperName)['facets'] !== 'function') ||
            (opts && opts.forceLocalStore)) {
            return js_data_1.utils.Promise.resolve(undefined);
        }
        else {
            opts = opts || {};
            // bypass cache
            opts.force = true;
            var mapper = this.store.getMapper(mapperName);
            var adapter = this.getAdapterForMapper(mapperName);
            return adapter.facets(mapper, query, opts);
        }
    };
    GenericDataStore.prototype.getFromLocalStore = function (mapperName, id) {
        return this.store.get(mapperName, id);
    };
    GenericDataStore.prototype.find = function (mapperName, id, opts) {
        if (this.getAdapterForMapper(mapperName) === undefined || (opts && opts.forceLocalStore)) {
            return js_data_1.utils.Promise.resolve(this.store.get(mapperName, id));
        }
        else {
            return this.store.find(mapperName, id, opts);
        }
    };
    GenericDataStore.prototype.findAll = function (mapperName, query, opts) {
        if (this.getAdapterForMapper(mapperName) === undefined || (opts && opts.forceLocalStore)) {
            return js_data_1.utils.Promise.resolve(this.store.filter(mapperName, query));
        }
        else {
            opts = opts || {};
            // bypass cache
            opts.force = true;
            return this.store.findAll(mapperName, query, opts);
        }
    };
    GenericDataStore.prototype.search = function (mapperName, searchForm, opts) {
        var _this = this;
        var query = this.createQueryFromForm(searchForm);
        // console.log('search for form', searchForm);
        var searchResult = this.createSearchResult(searchForm, 0, [], new facets_1.Facets());
        var me = this;
        var result = new Promise(function (resolve, reject) {
            var options = {
                originalSearchForm: searchForm,
                showFacets: opts && opts['showFacets'] !== undefined ? opts['showFacets'] : true,
                loadTrack: opts && opts['loadTrack'] !== undefined ? opts['loadTrack'] : false,
                showForm: opts && opts['showForm'] !== undefined ? opts['showForm'] : true,
                loadDetailsMode: (opts && opts['loadDetailsMode'] !== undefined) ? opts['loadDetailsMode'] : undefined,
                force: false,
                limit: searchForm.perPage,
                offset: searchForm.pageNum - 1,
                // We want the newest posts first
                orderBy: [['created_at', 'descTxt']]
            };
            if (_this.getAdapterForMapper(mapperName) === undefined ||
                (typeof me.getAdapterForMapper(mapperName)['search'] !== 'function') ||
                (opts && opts.forceLocalStore)) {
                // the resolve / reject functions control the fate of the promise
                me.findAll(mapperName, query, options).then(function doneFindAll(documents) {
                    searchResult.currentRecords = documents;
                    return me.count(mapperName, query, options);
                }).then(function doneCount(count) {
                    searchResult.recordCount = count;
                    return me.facets(mapperName, query, options);
                }).then(function doneFacets(facets) {
                    searchResult.facets = facets;
                    return resolve(searchResult);
                }).catch(function errorHandling(reason) {
                    console.error('search failed:', reason, searchForm);
                    return reject(reason);
                });
            }
            else {
                opts = opts || {};
                options.force = true;
                var mapper = _this.store.getMapper(mapperName);
                var adapter = me.getAdapterForMapper(mapperName);
                adapter.search(mapper, query, options)
                    .then(function doneSearch(genericSearchResult) {
                    searchResult.facets = genericSearchResult.facets;
                    searchResult.currentRecords = genericSearchResult.currentRecords;
                    searchResult.recordCount = genericSearchResult.recordCount;
                    return resolve(searchResult);
                }).catch(function errorHandling(reason) {
                    console.error('search failed:', reason, searchForm);
                    return reject(reason);
                });
            }
        });
        return result;
    };
    GenericDataStore.prototype.export = function (mapperName, searchForm, format, opts) {
        var _this = this;
        var query = this.createQueryFromForm(searchForm);
        // console.log('export for form', searchForm);
        var me = this;
        var result = new Promise(function (resolve, reject) {
            var options = {
                originalSearchForm: searchForm
            };
            if (_this.getAdapterForMapper(mapperName) === undefined ||
                (typeof me.getAdapterForMapper(mapperName)['export'] !== 'function') ||
                (opts && opts.forceLocalStore)) {
                // the resolve / reject functions control the fate of the promise
                var reason = 'export not supported';
                console.error('export failed:', reason, searchForm);
                return reject(reason);
            }
            else {
                opts = opts || {};
                var mapper = _this.store.getMapper(mapperName);
                var adapter = me.getAdapterForMapper(mapperName);
                adapter.export(mapper, query, format, options)
                    .then(function doneExport(genericExportResult) {
                    return resolve(genericExportResult);
                }).catch(function errorHandling(reason) {
                    console.error('export failed:', reason, searchForm);
                    return reject(reason);
                });
            }
        });
        return result;
    };
    GenericDataStore.prototype.update = function (mapperName, id, record, opts) {
        if (this.getAdapterForMapper(mapperName) === undefined || (opts && opts.forceLocalStore)) {
            if (id === undefined || id === null) {
                return js_data_1.utils.Promise.reject('cant update records without id');
            }
            var readRecord = this.store.get(mapperName, id);
            if (readRecord === undefined || readRecord === null) {
                return js_data_1.utils.Promise.resolve(null);
            }
            record.id = id;
            return js_data_1.utils.Promise.resolve(this.store.add(mapperName, record, opts));
        }
        else {
            return this.store.update(mapperName, id, record, opts);
        }
    };
    GenericDataStore.prototype.updateAll = function (mapperName, props, query, opts) {
        if (this.getAdapterForMapper(mapperName) === undefined || (opts && opts.forceLocalStore)) {
            return js_data_1.utils.Promise.reject('cant do update all without adapter');
        }
        else {
            return this.store.updateAll(mapperName, props, query, opts);
        }
    };
    GenericDataStore.prototype.updateMany = function (mapperName, records, opts) {
        if (this.getAdapterForMapper(mapperName) === undefined || (opts && opts.forceLocalStore)) {
            return js_data_1.utils.Promise.reject('cant do update many without adapter');
        }
        else {
            return this.store.updateMany(mapperName, records, opts);
        }
    };
    GenericDataStore.prototype.getMapper = function (mapperName) {
        return this.mappers.get(mapperName);
    };
    GenericDataStore.prototype.getAdapterForMapper = function (mapperName) {
        if (this.mapperAdapters.get(mapperName) !== undefined) {
            return this.mapperAdapters.get(mapperName);
        }
        return this.mapperAdapters.get('');
    };
    return GenericDataStore;
}());
exports.GenericDataStore = GenericDataStore;
//# sourceMappingURL=generic-data.store.js.map