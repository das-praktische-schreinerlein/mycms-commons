import {CommonDocRecord} from '../model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '../model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '../model/container/cdoc-searchresult';
import {CommonDocPlaylistService} from './cdoc-playlist.service';
import {GenericAdapterResponseMapper} from './generic-adapter-response.mapper';
import {ProcessingOptions} from './cdoc-search.service';
import {CommonDocDataService} from './cdoc-data.service';
import * as fs from 'fs';
import {GenericSearchOptions} from './generic-search.service';

export interface ExportProcessingOptions {
    directoryProfile: string;
    fileNameProfile: string;
    exportBasePath: string;
    exportBaseFileName: string;
    jsonBaseElement?: string; // TODO make it required in next major-version
}

export interface ExportProcessingMediaFileResultMappingType {
    audioFile?: string,
    imageFile?: string
    videoFile?: string
}

export interface ExportProcessingResultMediaFileMappingsType {
    [key: string]: ExportProcessingMediaFileResultMappingType;
}

export interface ExportProcessingResultRecordFieldMappingType {
    [key: string]: any;
}

export interface ExportProcessingResultRecordFieldMappingsType {
    [key: string]: ExportProcessingResultRecordFieldMappingType;
}

export interface ExportProcessingResult<R extends CommonDocRecord> {
    exportFileEntry: string;
    record: R;
    mediaFileMappings: ExportProcessingMediaFileResultMappingType;
    externalRecordFieldMappings: ExportProcessingResultRecordFieldMappingsType;
}

export abstract class CommonDocDocExportService<R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>, P extends CommonDocPlaylistService<R>> {
    protected readonly playlistService: P;
    protected readonly dataService: D;
    protected readonly responseMapper: GenericAdapterResponseMapper;

    protected constructor(backendConfig, dataService: D, playlistService: P, responseMapper: GenericAdapterResponseMapper) {
        this.playlistService = playlistService;
        this.dataService = dataService;
        this.responseMapper = responseMapper;
    }

    public exportMediaFiles(searchForm: F, processingOptions: ProcessingOptions & ExportProcessingOptions): Promise<{}> {
        const me = this;
        const exportResults: ExportProcessingResult<R>[]  = [];
        const callback = function(mdoc: R): Promise<{}>[] {
            return [
                me.exportMediaRecordFiles(mdoc, processingOptions, exportResults)
            ];
        };

        return this.dataService.batchProcessSearchResult(searchForm, callback, {
            loadDetailsMode: 'full',
            loadTrack: false,
            showFacets: false,
            showForm: false
        }, processingOptions).then(() => {
            return me.generatePlaylistForExportResults(processingOptions, exportResults).then(() => {
                return me.exportRelatedDocsForExportedMediaFiles(processingOptions, searchForm, exportResults);
            });
        });
    }

    public abstract exportMediaRecordFiles(mdoc: R, processingOptions: ExportProcessingOptions,
                                           exportResults: ExportProcessingResult<R>[])
        : Promise<ExportProcessingResult<R>>;

    public searchAndExportRelatedDocs(processingOptions: ProcessingOptions & ExportProcessingOptions,
                                      baseSearchForm: F): Promise<any> {
        if (!processingOptions.exportBaseFileName) {
            console.error('no recordexport', processingOptions.exportBaseFileName);
            return Promise.resolve('');
        }

        const readAllRecordsForSearchForm = function (recursiveSearchForm: F, results: R[])
            : Promise<R[]> {
            const searchOptions: GenericSearchOptions = {
                showFacets: false,
                showForm: false,
                loadDetailsMode: 'full',
                loadTrack: true};
            return me.dataService.search(recursiveSearchForm, searchOptions).then(
                function searchDone(searchResult: S) {
                    results = results.concat(searchResult.currentRecords);
                    console.log('DONE ' + recursiveSearchForm.pageNum
                        + ' from ' + (searchResult.recordCount / recursiveSearchForm.perPage + 1)
                        + ' for: ' + searchResult.recordCount, recursiveSearchForm);
                    recursiveSearchForm.pageNum++;
                    if (recursiveSearchForm.pageNum < (searchResult.recordCount / recursiveSearchForm.perPage + 1)) {
                        return readAllRecordsForSearchForm(recursiveSearchForm, results);
                    } else {
                        return Promise.resolve(results);
                    }
                }
            ).catch(function searchError(error) {
                console.error('error thrown: ', error);
                return Promise.reject(error);
            });
        };

        const me = this;
        return readAllRecordsForSearchForm(baseSearchForm, []).then(records => {
            return me.exportRelatedDocs(processingOptions, baseSearchForm, records,
                function (mdoc: {}) {
                    return mdoc;
                }).then(value => {
                return Promise.resolve(value);
            });
        });
    }

    protected generatePlaylistForExportResults(processingOptions: ProcessingOptions & ExportProcessingOptions,
                                               exportResults: ExportProcessingResult<R>[]): Promise<{}> {
        if (!processingOptions.exportBaseFileName) {
            console.error('no playlistexport', processingOptions.exportBaseFileName);
            return Promise.resolve('');
        }

        const me = this;
        const playlist = [me.playlistService.generateM3uHeader()].concat(
            exportResults.map(exportResult => {
                return me.generatePlaylistEntry(exportResult.record, exportResult.exportFileEntry);
            })
        ).join('\n');

        const m3uPath = processingOptions.exportBasePath + '/' + processingOptions.exportBaseFileName + '.m3u';
        if (fs.existsSync(m3uPath) && !fs.statSync(m3uPath).isFile()) {
            return Promise.reject('exportBaseFileName must be file');
        }

        fs.writeFileSync(m3uPath, playlist);
        console.error('wrote playlist', m3uPath);

        return Promise.resolve(playlist);
    }

    protected abstract generatePlaylistEntry(mdoc: R, file: string): string;

    protected exportRelatedDocsForExportedMediaFiles(processingOptions: ProcessingOptions & ExportProcessingOptions,
                                                     baseSearchForm: F,
                                                     exportResults: ExportProcessingResult<R>[]): Promise<any> {
        const me = this;
        const baseSearchRecords = [];
        const idMediaFileMappings: ExportProcessingResultMediaFileMappingsType = {};
        const idRecordFieldMappings: ExportProcessingResultRecordFieldMappingsType = {};
        exportResults.map(entry => {
            if (entry.record !== undefined) {
                baseSearchRecords.push(entry.record);
                idMediaFileMappings[entry.record.id] = entry.mediaFileMappings;
                if (entry.externalRecordFieldMappings !== undefined) {
                    Object.keys(entry.externalRecordFieldMappings).map(id => {
                        if (!idRecordFieldMappings[id] === undefined) {
                            idRecordFieldMappings[id] = {};
                        }
                        idRecordFieldMappings[id] = {
                            ...idRecordFieldMappings[id],
                            ...entry.externalRecordFieldMappings[id]
                        };
                    });
                }
            }
        })
        const converter = function (mdoc: {}) {
            return me.convertAdapterDocValues(mdoc, idMediaFileMappings, idRecordFieldMappings);
        };

        return this.exportRelatedDocs(processingOptions, baseSearchForm, baseSearchRecords, converter);
    }

    protected exportRelatedDocs(processingOptions: ProcessingOptions & ExportProcessingOptions,
                                baseSearchForm: F, baseSearchRecords: R[],
                                recordConverter: (mdoc: {}) => {}): Promise<any> {
        if (!processingOptions.exportBaseFileName) {
            console.error('no recordexport', processingOptions.exportBaseFileName);
            return Promise.resolve('');
        }

        const jsonBaseElement = processingOptions.jsonBaseElement
            ? processingOptions.jsonBaseElement
            : 'mdocs';
        const nameBase = processingOptions.jsonBaseElement
            ? processingOptions.jsonBaseElement
            : 'mdoc';
        const m3uPath = processingOptions.exportBasePath + '/' + processingOptions.exportBaseFileName + '.' + nameBase + 'export.json';
        if (fs.existsSync(m3uPath) && !fs.statSync(m3uPath).isFile()) {
            return Promise.reject('exportBaseFileName must be file');
        }
        const writerCallback = function (output) {
            fs.appendFileSync(m3uPath, output);
        };

        const me = this;
        fs.writeFileSync(m3uPath, '{"' + jsonBaseElement + '": [');
        return me.generateRelatedExportDocs(baseSearchForm, baseSearchRecords, writerCallback, recordConverter).then(value => {
            writerCallback(']}');
            return Promise.resolve(value);
        });
    }

    protected generateRelatedExportDocs(baseSearchForm: F, baseSearchRecords: R[],
                                        writerCallback: (output: string) => void, recordConverter: (mdoc: {}) => {}): Promise<any> {
        const me = this;
        const idsRead = {};
        let first = true;
        const replacer = function(key, value) {
            if (value === null) {
                return undefined;
            }

            return value;
        };

        const processAndExportSearchResult = function (recursiveSearchForm: F, results: R[]): Promise<{}> {
            console.log('processAndExportSearchResult resultCount: ' + results.length +
                ' ids:' + Object.getOwnPropertyNames(idsRead).length);
            // write searchResult
            let output = '';
            for (const doc of results) {
                output += (first ? '\n  ' : ',\n  ') +
                    JSON.stringify(
                        recordConverter(me.responseMapper.mapToAdapterDocument({}, doc)),
                        replacer);
                first = false;
            }
            writerCallback(output);

            // extract ids from searchResult
            let idsToRead = [];
            for (const doc of results) {
                if (idsRead[doc.type] === undefined) {
                    idsRead[doc.type] = {};
                }
                idsRead[doc.type][doc.id] = true;
            }

            for (const doc of results) {
                idsToRead = idsToRead.concat(me.checkIdToRead(doc, idsRead));
            }
            const unique = [];
            idsToRead.forEach( v => unique[v] = true );
            idsToRead = Object.keys(unique);
            if (idsToRead.length > 0 ) {
                console.log('processAndExportSearchResult doSearch: ' + idsToRead.length);
                return me.dataService.doMultiSearch(baseSearchForm, idsToRead).then(searchResult => {
                    console.log('processAndExportSearchResult doneSearch: ' + searchResult.recordCount);
                    return processAndExportSearchResult(recursiveSearchForm, searchResult.currentRecords);
                })
            } else {
                return Promise.resolve({});
            }
        };

        return processAndExportSearchResult(baseSearchForm, baseSearchRecords);
    }

    protected abstract checkIdToRead(doc: R, idsRead: {}): any[];
    protected abstract convertAdapterDocValues(mdoc: {},
                                               idMediaFileMappings: ExportProcessingResultMediaFileMappingsType,
                                               idRecordFieldMappings: ExportProcessingResultRecordFieldMappingsType): {};
}
