import { CommonDocRecord } from '../model/records/cdoc-entity-record';
export interface CommonDocPlaylistCsvExportProfile {
    profileName: string;
    headerNames: string[];
    fieldNames: string[];
}
export interface CommonDocPlaylistCsvExportProfiles {
    [key: string]: CommonDocPlaylistCsvExportProfile;
}
export declare abstract class CommonDocPlaylistService<R extends CommonDocRecord> {
    protected exportProfiles: CommonDocPlaylistCsvExportProfiles;
    generateM3uForRecords(pathPrefix: string, records: R[]): string;
    generateM3uHeader(): string;
    generateM3uEntryForRecord(pathPrefix: string, record: R): string;
    abstract generateM3uEntityPath(pathPrefix: string, record: R): string;
    generateM3uEntityInfo(record: R): string;
    generateCsvForRecords(profileConfig: CommonDocPlaylistCsvExportProfile, pathPrefix: string, records: R[]): string;
    generateCsvHeader(profileConfig: CommonDocPlaylistCsvExportProfile): string;
    generateCsvEntryForRecord(profileConfig: CommonDocPlaylistCsvExportProfile, pathPrefix: string, record: R): string;
    protected generateFieldValue(pathPrefix: string, record: R, csvFieldName: string): string;
    getCsvExportProfile(profile: string): CommonDocPlaylistCsvExportProfile;
}
