import { PDocRecord } from '../model/records/pdoc-record';
import { PDocDataStore } from './pdoc-data.store';
import { CommonDocDataService } from "../../search-commons/services/cdoc-data.service";
import { PDocSearchForm } from "../model/forms/pdoc-searchform";
import { PDocSearchResult } from "../model/container/pdoc-searchresult";
import { BaseJoinRecord } from "../../search-commons/model/records/basejoin-record";
import { ActionTagForm } from "../../commons/utils/actiontag.utils";
export declare class PDocDataService extends CommonDocDataService<PDocRecord, PDocSearchForm, PDocSearchResult> {
    constructor(dataStore: PDocDataStore);
    createRecord(props: any, opts: any): PDocRecord;
    protected defineDatastoreMapper(): void;
    protected defineIdMappingAlliases(): {};
    protected defineIdMappings(): string[];
    protected defineTypeMappings(): {};
    protected onImportRecordNewRecordProcessDefaults(record: PDocRecord, recordIdMapping?: {}, recordRecoverIdMapping?: {}): void;
    protected remapBaseJoins(baseJoins: BaseJoinRecord[], refIdFieldName: any, recordIdMapping?: {}, recordRecoverIdMapping?: {}): void;
    protected generateImportRecordQuery(record: PDocRecord): {};
    protected addAdditionalActionTagForms(origRecord: PDocRecord, newRecord: PDocRecord, actionTagForms: ActionTagForm[]): void;
}
