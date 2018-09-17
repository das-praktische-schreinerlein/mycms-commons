import { CommonDocRecord } from '../model/records/cdoc-entity-record';
export declare enum CommonDocPlaylistServiceExportType {
    USEASSETSONLY = 0,
    USEPATHONLY = 1,
    PREFERASSETS = 2,
    PREFERPATH = 3,
}
export declare abstract class CommonDocPlaylistService<R extends CommonDocRecord> {
    generateM3uForRecords(pathPrefix: string, records: R[]): string;
    generateM3uEntryForRecord(pathPrefix: string, record: R): string;
    abstract generateM3uEntityPath(pathPrefix: string, record: R): string;
    generateM3uEntityInfo(record: R): string;
}
