import {GenericSearchOptions, GenericSearchService} from './generic-search.service';
import {DateUtils} from '../../commons/utils/date.utils';
import {utils} from 'js-data';
import {CommonDocRecord} from '../model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '../model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '../model/container/cdoc-searchresult';
import {GenericDataStore} from './generic-data.store';
import * as Promise_serial from 'promise-serial';

export interface ProcessingOptions {
    ignoreErrors: number;
    parallel: number
}

export abstract class CommonDocSearchService<R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>> extends GenericSearchService <R, F, S> {

    protected maxParallelMultiSearches = 5;

    protected constructor(dataStore: GenericDataStore<R, F, S>, mapperName: string) {
        super(dataStore, mapperName);
    }

    public doMultiSearch(searchForm: F, ids: string[]): Promise<S> {
        const me = this;
        if (ids.length <= 0 || ids[0] === '') {
            return utils.resolve(this.newSearchResult(searchForm, 0, [], undefined));
        }

        const idTypeMap = {};
        for (const id of ids) {
            let [type] = id.split('_');
            type = type.toLowerCase();
            if (idTypeMap[type] === undefined) {
                idTypeMap[type] = { ids: [], records: {}};
            }
            idTypeMap[type]['ids'].push(id);
        }

        const promises = [];
        for (const type in idTypeMap) {
            for (let page = 1; page <= (idTypeMap[type]['ids'].length / this.maxPerRun) + 1; page ++) {
                const typeSearchForm = this.newSearchForm({});
                const start = (page - 1) * this.maxPerRun;
                const end = Math.min(start + this.maxPerRun, idTypeMap[type]['ids'].length);
                const idTranche = idTypeMap[type]['ids'].slice(start, end);
                typeSearchForm.moreFilter = 'id:' + idTranche.join(',');
                typeSearchForm.type = type;
                typeSearchForm.perPage = this.maxPerRun;
                typeSearchForm.pageNum = 1;
                typeSearchForm.sort = 'dateAsc';

                const searchOptions: GenericSearchOptions = {
                    showFacets: false,
                    showForm: false,
                    loadDetailsMode: 'full',
                    loadTrack: true};

                promises.push(function () {
                    return me.search(typeSearchForm, searchOptions);
                });

            }
        }

        return new Promise<S>((resolve, reject) => {
            return Promise_serial(promises, {parallelize: me.maxParallelMultiSearches}).then(function doneSearch(docSearchResults: S[]) {
                const records: R[] = [];
                docSearchResults.forEach(result => {
                    for (const doc of result.currentRecords) {
                        let [type] = doc.id.split('_');
                        type = type.toLowerCase();
                        idTypeMap[type]['records'][doc.id] = doc;
                    }
                });
                for (const id of ids) {
                    let [type] = id.split('_');
                    type = type.toLowerCase();
                    if (idTypeMap[type]['records'][id] !== undefined) {
                        records.push(idTypeMap[type]['records'][id]);
                    }
                }

                me.sortRecords(records, searchForm.sort);

                const docSearchResult = me.newSearchResult(searchForm, records.length, records, undefined);
                return resolve(docSearchResult);
            }).catch(function errorSearch(reason) {
                return reject(reason);
            });
        });
    }

    public sortRecords(records: R[], sortType: string): void {
        if (sortType === 'relevance') {
            // NOOP
        } else if (sortType === 'dateAsc' || sortType === 'dateDesc') {
            const retLt = sortType === 'dateAsc' ? -1 : 1;
            records.sort((a, b) => {
                const dateA = DateUtils.parseDate(a.dateshow);
                const dateB = DateUtils.parseDate(b.dateshow);
                const nameA = (dateA !== undefined ? dateA.getTime() : 0);
                const nameB = (dateB !== undefined ? dateB.getTime() : 0);

                if (nameA < nameB) {
                    return retLt;
                }
                if (nameA > nameB) {
                    return -retLt;
                }

                return 0;
            });
        } else if (sortType === 'name') {
            records.sort((a, b) => {
                const nameA = (a.name !== undefined ? a.name : '');
                const nameB = (b.name !== undefined ? b.name : '');

                return nameA.localeCompare(nameB, undefined, {numeric: true, sensitivity: 'base'});
            });
        } else if (sortType === 'type') {
            records.sort((a, b) => {
                const nameA = (a.type !== undefined ? a.type : '');
                const nameB = (b.type !== undefined ? b.type : '');

                return nameA.localeCompare(nameB, undefined, {numeric: true, sensitivity: 'base'});
            });
        } else if (sortType === 'subtype') {
            records.sort((a, b) => {
                const nameA = (a.subtype !== undefined ? a.subtype : '');
                const nameB = (b.subtype !== undefined ? b.subtype : '');

                return nameA.localeCompare(nameB, undefined, {numeric: true, sensitivity: 'base'});
            });
        } else {
            console.warn('unknown sortType', sortType);
        }
    }

    public batchProcessSearchResult(searchForm: F, cb: (cdoc: R) => Promise<{}>[], opts: GenericSearchOptions,
                                       processingOptions: ProcessingOptions): Promise<{}> {
        searchForm.perPage = processingOptions.parallel;
        searchForm.pageNum = Number.isInteger(searchForm.pageNum) ? searchForm.pageNum : 1;

        const me = this;
        const startTime = (new Date()).getTime();
        let errorCount = 0;
        const readNextPage = function(): Promise<any> {
            const startTime2 = (new Date()).getTime();
            return me.search(searchForm, opts).then(
                function searchDone(searchResult: S) {
                    let promises: Promise<any>[] = [];
                    for (const cdoc of searchResult.currentRecords) {
                        promises = promises.concat(cb(cdoc));
                    }

                    const processResults = function(): Promise<any> {
                        const durWhole = ((new Date()).getTime() - startTime + 1) / 1000 ;
                        const dur = ((new Date()).getTime() - startTime2 + 1) / 1000;
                        const alreadyDone = searchForm.pageNum * searchForm.perPage;
                        const performance = searchResult.currentRecords.length / dur;
                        const performanceWhole = alreadyDone / durWhole;
                        console.log('DONE processed page ' +
                            searchForm.pageNum +
                            ' [' + ((searchForm.pageNum - 1) * searchForm.perPage + 1) +
                            '-' + alreadyDone + ']' +
                            ' / ' + Math.round(searchResult.recordCount / searchForm.perPage + 1) +
                            ' [' + searchResult.recordCount + ']' +
                            ' in ' + Math.round(dur + 1) + ' (' + Math.round(durWhole + 1) + ') s' +
                            ' with ' + Math.round(performance + 1) + ' ('  + Math.round(performanceWhole + 1) + ') per s' +
                            ' approximately ' + Math.round(((searchResult.recordCount - alreadyDone) / performance + 1) / 60) + 'min left'
                        );
                        searchForm.pageNum++;

                        if (searchForm.pageNum < (searchResult.recordCount / searchForm.perPage + 1)) {
                            return readNextPage();
                        } else {
                            return utils.resolve('WELL DONE');
                        }
                    };

                    return Promise.all(promises).then(() => {
                        return processResults();
                    }).catch(reason => {
                        errorCount = errorCount + 1;
                        if (processingOptions.ignoreErrors > errorCount) {
                            console.warn('SKIP ERROR: ' + errorCount + ' of possible ' + processingOptions.ignoreErrors, reason);
                            return processResults();
                        }

                        console.error('UNSKIPPABLE ERROR: ' + errorCount + ' of possible ' + processingOptions.ignoreErrors, reason);
                        return utils.reject(reason);
                    });
                }
            ).catch(function searchError(error) {
                console.error('error thrown: ', error);
                return utils.reject(error);
            });
        };

        return readNextPage();
    }

    public getAvailableSorts(): string[] {
        return ['relevance', 'dateAsc', 'dateDesc', 'name', 'type', 'subtype'];
    }
}
