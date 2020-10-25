import { CommonDocRecord } from '../model/records/cdoc-entity-record';
import { CommonDocSearchForm } from '../model/forms/cdoc-searchform';
import { CommonDocSearchResult } from '../model/container/cdoc-searchresult';
import { CommonDocPlaylistService } from './cdoc-playlist.service';
import { GenericAdapterResponseMapper } from './generic-adapter-response.mapper';
import { ProcessingOptions } from './cdoc-search.service';
import { CommonDocDataService } from './cdoc-data.service';
export interface ExportProcessingOptions {
    directoryProfile: string;
    fileNameProfile: string;
    exportBasePath: string;
    exportBaseFileName: string;
}
export interface ExportProcessingMediaFileResultMappingType {
    audioFile?: string;
    imageFile?: string;
    videoFile?: string;
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
export declare abstract class CommonDocDocExportService<R extends CommonDocRecord, F extends CommonDocSearchForm, S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>, P extends CommonDocPlaylistService<R>> {
    protected readonly playlistService: P;
    protected readonly dataService: D;
    protected readonly responseMapper: GenericAdapterResponseMapper;
    protected constructor(backendConfig: any, dataService: D, playlistService: P, responseMapper: GenericAdapterResponseMapper);
    exportMediaFiles(searchForm: F, processingOptions: ProcessingOptions & ExportProcessingOptions): Promise<{}>;
    abstract exportMediaRecordFiles(mdoc: R, processingOptions: ExportProcessingOptions, exportResults: ExportProcessingResult<R>[]): Promise<ExportProcessingResult<R>>;
    searchAndExportRelatedDocs(processingOptions: ProcessingOptions & ExportProcessingOptions, baseSearchForm: F): Promise<any>;
    protected generatePlaylistForExportResults(processingOptions: ProcessingOptions & ExportProcessingOptions, exportResults: ExportProcessingResult<R>[]): Promise<{}>;
    protected abstract generatePlaylistEntry(mdoc: R, file: string): string;
    protected exportRelatedDocsForExportedMediaFiles(processingOptions: ProcessingOptions & ExportProcessingOptions, baseSearchForm: F, exportResults: ExportProcessingResult<R>[]): Promise<any>;
    protected exportRelatedDocs(processingOptions: ProcessingOptions & ExportProcessingOptions, baseSearchForm: F, baseSearchRecords: R[], recordConverter: (mdoc: {}) => {}): Promise<any>;
    protected generateRelatedExportDocs(baseSearchForm: F, baseSearchRecords: R[], writerCallback: (output: string) => void, recordConverter: (mdoc: {}) => {}): Promise<any>;
    protected abstract checkIdToRead(doc: R, idsRead: {}): any[];
    protected abstract convertAdapterDocValues(mdoc: {}, idMediaFileMappings: ExportProcessingResultMediaFileMappingsType, idRecordFieldMappings: ExportProcessingResultRecordFieldMappingsType): {};
}
