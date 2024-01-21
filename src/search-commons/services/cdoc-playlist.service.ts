import {CommonDocRecord} from '../model/records/cdoc-entity-record';

export interface CommonDocPlaylistCsvExportProfile {
    profileName: string;
    headerNames: string[];
    fieldNames: string[];
}

export interface CommonDocPlaylistCsvExportProfiles {
    [key: string]: CommonDocPlaylistCsvExportProfile;
}

export abstract class CommonDocPlaylistService<R extends CommonDocRecord> {

    protected exportProfiles: CommonDocPlaylistCsvExportProfiles = {
        'default': {
            profileName: 'default',
            headerNames: ['id', 'name'],
            fieldNames: ['id', 'name']
        }
    };

    public generateM3uForRecords(pathPrefix: string, records: R[]): string {
        const values: string[] = [this.generateM3uHeader()];
        if (records) {
            records.forEach(record => {
                values.push(this.generateM3uEntryForRecord(pathPrefix, record));
            });
        }

        return values.filter(value => {
            return value !== undefined && value !== '';
        }).join('\n');

    }

    public generateM3uHeader(): string {
        return '#EXTM3U';
    }

    public generateM3uEntryForRecord(pathPrefix: string, record: R): string {
        if (!record) {
            return undefined;
        }

        const path = this.generateM3uEntityPath(pathPrefix, record);
        if (!path) {
            return undefined;
        }
        const values: string[] = [
            this.generateM3uEntityInfo(record),
            path
        ];

        return values.filter(value => {
            return value !== undefined && value !== '';
        }).join('\n');
    }

    public abstract generateM3uEntityPath(pathPrefix: string, record: R): string;

    public generateM3uEntityInfo(record: R): string {
        if (!record || !record.name) {
            return undefined;
        }

        return '#EXTINF:-1,' + record.name;
    }

    public generateCsvForRecords(profileConfig: CommonDocPlaylistCsvExportProfile, pathPrefix: string, records: R[]): string {
        const values: string[] = [this.generateCsvHeader(profileConfig)];
        if (records) {
            records.forEach(record => {
                values.push(this.generateCsvEntryForRecord(profileConfig, pathPrefix, record));
            });
        }

        return values.filter(value => {
            return value !== undefined && value !== '';
        }).join('\n');

    }

    public generateCsvHeader(profileConfig: CommonDocPlaylistCsvExportProfile): string {
        return profileConfig.headerNames.join('\t');
    }

    public generateCsvEntryForRecord(profileConfig: CommonDocPlaylistCsvExportProfile, pathPrefix: string, record: R): string {
        if (!record) {
            return undefined;
        }

        return profileConfig.fieldNames.map(csvFieldName => {
            return this.generateFieldValue(pathPrefix, record, csvFieldName);
        }).join('\t');
    }

    protected generateFieldValue(pathPrefix: string, record: R, csvFieldName: string): string {
        return record[csvFieldName] !== undefined && record[csvFieldName] !== null
            ? record[csvFieldName]
            : '';
    }

    public getCsvExportProfile(profile: string): CommonDocPlaylistCsvExportProfile {
        return this.exportProfiles[profile];
    }

}
