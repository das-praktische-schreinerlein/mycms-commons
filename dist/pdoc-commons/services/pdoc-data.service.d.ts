import { PDocRecord } from '../model/records/pdoc-record';
import { PDocDataStore } from './pdoc-data.store';
import { PDocSearchService } from './pdoc-search.service';
export declare class PDocDataService extends PDocSearchService {
    private writable;
    constructor(dataStore: PDocDataStore);
    generateNewId(): string;
    createRecord(props: any, opts: any): PDocRecord;
    add(pdoc: PDocRecord, opts?: any): Promise<PDocRecord>;
    addMany(pdocs: PDocRecord[], opts?: any): Promise<PDocRecord[]>;
    deleteById(id: string, opts?: any): Promise<PDocRecord>;
    updateById(id: string, values?: Object, opts?: any): Promise<PDocRecord>;
    getSubDocuments(pdoc: PDocRecord): PDocRecord[];
    setWritable(writable: boolean): void;
    isWritable(): boolean;
}
