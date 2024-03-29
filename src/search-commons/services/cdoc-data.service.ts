import {ActionTagForm} from '../../commons/utils/actiontag.utils';
import {Mapper, utils} from 'js-data';
import {Adapter} from 'js-data-adapter';
import {Facets} from '../model/container/facets';
import {GenericDataStore} from './generic-data.store';
import {CommonDocRecord} from '../model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '../model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '../model/container/cdoc-searchresult';
import {GenericSearchOptions, GenericSearchService} from './generic-search.service';
import {GenericAdapterResponseMapper} from './generic-adapter-response.mapper';
import {CommonDocSearchService, ProcessingOptions} from './cdoc-search.service';

export abstract class CommonDocDataService<R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>> {
    private writable = false;

    public typeMapping = {};
    public idMappings = [];
    public idMappingAliases = {};

    constructor(protected dataStore: GenericDataStore<R, F, S>, protected searchService: CommonDocSearchService<R, F, S>,
                protected responseMapper: GenericAdapterResponseMapper) {
        this.defineDatastoreMapper();
        this.typeMapping = this.defineTypeMappings();
        this.idMappings = this.defineIdMappings();
        this.idMappingAliases = this.defineIdMappingAlliases();
    }

    public abstract createRecord(props, opts): R;

    public getBaseMapperName(): string {
        return this.searchService.getBaseMapperName();
    }

    public isRecordInstanceOf(record: any): boolean {
        return this.searchService.isRecordInstanceOf(record);
    }

    public newRecord(values: {}): R {
        return this.searchService.newRecord(values);
    }

    public newSearchForm(values: {}): F {
        return this.searchService.newSearchForm(values);
    }

    public newSearchResult(searchForm: F, recordCount: number,
                           currentRecords: R[], facets: Facets): S {
        return this.searchService.newSearchResult(searchForm, recordCount, currentRecords, facets);
    }

    public createSanitizedSearchForm(values: {}): F {
        return this.searchService.createSanitizedSearchForm(values);
    }

    public cloneSanitizedSearchForm(src: F): F {
        return this.searchService.cloneSanitizedSearchForm(src);
    }


    public getMapper(mapperName: string): Mapper {
        return this.searchService.getMapper(mapperName);
    }

    public getAdapterForMapper(mapperName: string): Adapter {
        return this.searchService.getAdapterForMapper(mapperName);
    }

    public getSearchService(): GenericSearchService<R, F, S> {
        return this.searchService;
    }

    public generateNewId(): string {
        return (new Date()).getTime().toString();
    }

    public createDefaultSearchForm(): F {
        return this.searchService.createDefaultSearchForm();
    }

    getAll(opts?: any): Promise<R[]> {
        return this.searchService.getAll(opts);
    }

    findCurList(searchForm: F, opts?: any): Promise<R[]> {
    return this.searchService.findCurList(searchForm, opts);
    }

    doMultiSearch(searchForm: F, ids: string[]): Promise<S> {
        return this.searchService.doMultiSearch(searchForm, ids);
    }

    batchProcessSearchResult(searchForm: F, cb: (cdoc: R) => Promise<{}>[], opts: GenericSearchOptions,
                             processingOptions: ProcessingOptions): Promise<{}> {
        return this.searchService.batchProcessSearchResult(searchForm, cb,  opts, processingOptions);
    }

    export(searchForm: F, format: string, opts?: GenericSearchOptions): Promise<string> {
        return this.searchService.export(searchForm, format, opts);
    }

    search(searchForm: F, opts?: GenericSearchOptions): Promise<S> {
        return this.searchService.search(searchForm, opts);
    }

    getById(id: string, opts?: any): Promise<R> {
        return this.searchService.getById(id, opts);
    }

    getByIdFromLocalStore(id: string): R {
        return this.searchService.getByIdFromLocalStore(id);
    }

    public clearLocalStore(): void {
        this.searchService.clearLocalStore();
    }

    add(values: {}, opts?: any): Promise<R> {
        if (!this.isWritable()) {
            throw new Error('CommonDocDataService configured: not writable');
        }

        let record: R;
        if (! (this.isRecordInstanceOf(values))) {
            record = <R>this.responseMapper.mapValuesToRecord(this.dataStore.getMapper(this.getBaseMapperName()), values);
        } else {
            record = <R>values;
        }

        if (record === undefined || !record.isValid()) {
            return utils.reject('doc-values not valid');
        }

        return this.dataStore.create(this.getBaseMapperName(), record, opts);
    }

    addMany(docs: R[], opts?: any): Promise<R[]> {
        if (!this.isWritable()) {
            throw new Error('CommonDocDataService configured: not writable');
        }
        return this.dataStore.createMany(this.getBaseMapperName(), docs, opts);
    }

    deleteById(id: string, opts?: any): Promise<R> {
        if (!this.isWritable()) {
            throw new Error('CommonDocDataService configured: not writable');
        }
        return this.dataStore.destroy(this.getBaseMapperName(), id, opts);
    }

    updateById(id: string, values: {}, opts?: any): Promise<R> {
        if (!this.isWritable()) {
            throw new Error('CommonDocDataService configured: not writable');
        }

        let record: R;
        if (! (this.isRecordInstanceOf(values))) {
            record = <R>this.responseMapper.mapValuesToRecord(this.dataStore.getMapper(this.getBaseMapperName()), values);
        } else {
            record = <R>values;
        }

        if (record === undefined || !record.isValid()) {
            return utils.reject('doc-values not valid');
        }

        return this.dataStore.update(this.getBaseMapperName(), id, record, opts);
    }

    doActionTag(docRecord: R, actionTagForm: ActionTagForm, opts?: any): Promise<R> {
        if (!this.isWritable()) {
            throw new Error('CommonDocDataService configured: not writable');
        }

        return this.dataStore.doActionTag(this.getBaseMapperName(), docRecord, actionTagForm, opts);
    }

    doActionTags(docRecord: R, actionTagForms: ActionTagForm[], opts?: any): Promise<R> {
        if (!this.isWritable()) {
            throw new Error('CommonDocDataService configured: not writable');
        }

        let curCdocRecord = docRecord;
        const me = this;
        const promises = actionTagForms.map(actionTagForm => {
            return me.doActionTag(curCdocRecord, actionTagForm, opts)
                .then(function onDone(newCdocRecord: R) {
                    curCdocRecord = newCdocRecord;
                    return utils.resolve(newCdocRecord);
                }).catch(function onError(error) {
                    return utils.reject(error);
                });
        });
        const results = Promise.all(promises);

        return results.then(data => {
            return utils.resolve(curCdocRecord);
        }).catch(errors => {
            return utils.reject(errors);
        });
    }

    importRecord(record: R, recordIdMapping: {}, recordRecoverIdMapping: {}, opts?: any): Promise<R> {
        opts = opts || {};

        const mapper: Mapper = this.searchService.getMapper(this.getBaseMapperName());
        const adapter: Adapter = this.searchService.getAdapterForMapper(this.getBaseMapperName());
        if (!this.isWritable()) {
            throw new Error('CommonDocDataService configured: not writable');
        }

        const query = this.generateImportRecordQuery(record);
        const logName = this.generateImportRecordName(record);

        const myMappings = {};
        const me = this;
        return adapter.findAll(mapper, query, opts)
            .then(searchResult => {
                if (!searchResult || searchResult.length <= 0) {
                    return utils.resolve(undefined);
                }
                return utils.resolve(searchResult[0]);
            }).then(function recordsDone(docRecord: R) {
                if (docRecord !== undefined) {
                    console.log('EXISTING - record', logName);
                    const idFieldName = me.typeMapping[record.type.toLowerCase()];
                    myMappings[idFieldName] = record[idFieldName];
                    return utils.resolve(docRecord);
                    // console.log('UPDATE - record', record.name);
                    // return dataService.updateById(docRecord.id, record);
                }

                // new record: map refIds
                me.onImportRecordNewRecordProcessDefaults(record, recordIdMapping, recordRecoverIdMapping);
                for (const refIdFieldName of me.idMappings) {
                    const refIdMapping = recordIdMapping[refIdFieldName];
                    const refId = record[refIdFieldName];
                    if (refId !== undefined && refIdMapping && refIdMapping[refId]) {
                        console.log('orig: ' + record.type + ' id:' + record.id + ' map ref ' + refIdFieldName + ' ' + refId
                            + '->' + refIdMapping[refId]);
                        record[refIdFieldName] = refIdMapping[refId];
                    } else if (refId && !(refId === null || refId === undefined)) {
                        console.log('orig: ' + record.type + ' id:' + record.id + ' save ref ' + refIdFieldName + ' ' + refId);
                        myMappings[refIdFieldName] = refId;
                        record[refIdFieldName] = undefined;
                    }
                }

                console.log('ADD - record', logName);
                return me.add(record).then(function onFullfilled(newCdocRecord: R) {
                    docRecord = newCdocRecord;
                    return me.doImportActionTags(record, docRecord, opts);

                });
            }).then(function recordsDone(newCdocRecord: R) {
                const idFieldName = me.typeMapping[record.type.toLowerCase()];

                if (!recordIdMapping.hasOwnProperty(idFieldName)) {
                    recordIdMapping[idFieldName] = {};
                }
                console.log('new: ' + newCdocRecord.id + ' save recordIdMapping ' + idFieldName + ' ' + myMappings[idFieldName]
                    + '->' + newCdocRecord[idFieldName]);
                console.log('new: ' + newCdocRecord.id + ' save recordRecoverIdMapping for ' + ':', myMappings);
                recordIdMapping[idFieldName][myMappings[idFieldName]] = newCdocRecord[idFieldName];
                recordRecoverIdMapping[newCdocRecord.id] = myMappings;

                return utils.resolve(newCdocRecord);
            }).catch(function onError(error) {
                return utils.reject(error);
            });
    }

    postProcessImportRecord(record: R, recordIdMapping: {}, recordRecoverIdMapping: {}, opts?: any): Promise<R> {
        opts = opts || {};

        if (!recordRecoverIdMapping[record.id]) {
            console.log('new: ' + record.id + ' no ids to recover');
            return utils.resolve(record);
        }

        // recover refIds
        let updateNeeded = false;
        for (const refIdFieldName of this.idMappings) {
            const mappingName = this.idMappingAliases[refIdFieldName] || refIdFieldName;
            const fieldId = recordRecoverIdMapping[record.id][refIdFieldName];
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
            return utils.resolve(record);
        }

        this.postProcessImportRecordRemapFields(record);

        return this.updateById(record.id, record, opts).then(function recordsDone(newCdocRecord: R) {
            return utils.resolve(newCdocRecord);
        }).catch(function onError(error) {
            return utils.reject(error);
        });
    }

    setWritable(writable: boolean) {
        this.writable = writable;
    }

    isWritable(): boolean {
        return this.writable;
    }

    protected postProcessImportRecordRemapFields(record: R) {
        record.subtype = record.subtype
            ? record.subtype.replace(/[-a-zA-Z_]+/g, '')
            : '';
    }

    protected doImportActionTags(origRecord: R, newRecord: R, opts?: {}): Promise<R> {
        if (newRecord.type.toLowerCase() !== 'image' && newRecord.type.toLowerCase() !== 'video') {
            return utils.resolve(newRecord);
        }

        // map data of orig-record to new record
        const actionTagForms: ActionTagForm[] = [];
        for (let playlist of (origRecord.playlists ? origRecord.playlists.split(',') : [])) {
            playlist = playlist.trim();
            const actionTagForm: ActionTagForm =  {
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
            return utils.resolve(newRecord);
        }

        console.log('ACTIONTAGS - record', origRecord.type + ' ' + origRecord.name, actionTagForms);
        return this.doActionTags(newRecord, actionTagForms, opts);
    }

    protected generateImportRecordQuery(record: R): {} {
        return {
            where: {
                name_s: {
                    'in': [record.name]
                },
                type_ss: {
                    'in': [record.type.toLowerCase()]
                }
            }
        };
    }

    protected generateImportRecordName(record: R): {} {
        return record.type + ' ' + record.id + ' ' + record.name;
    }

    protected abstract defineDatastoreMapper(): void;

    protected abstract defineIdMappings(): string[];

    protected abstract defineIdMappingAlliases(): {};

    protected abstract defineTypeMappings(): {};

    protected abstract onImportRecordNewRecordProcessDefaults(record: R, recordIdMapping?: {}, recordRecoverIdMapping?: {}): void;

    protected abstract addAdditionalActionTagForms(origRecord: R, newRecord: R, actionTagForms: ActionTagForm[]);

}
