import {CommonDocRecord} from '../model/records/cdoc-entity-record';

export abstract class CommonDocPlaylistService<R extends CommonDocRecord> {

    public generateM3uForRecords(pathPrefix: string, records: R[]): string {
        const values: string[] = ['#EXTM3U'];
        if (records) {
            records.forEach(record => {
                values.push(this.generateM3uEntryForRecord(pathPrefix, record));
            });
        }

        return values.filter(value => {
            return value !== undefined && value !== '';
        }).join('\n');

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
}
