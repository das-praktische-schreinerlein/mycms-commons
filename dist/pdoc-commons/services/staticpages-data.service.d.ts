import { PDocRecord } from '../model/records/pdoc-record';
import { CommonDocDataService } from "../../search-commons/services/cdoc-data.service";
import { PDocSearchForm } from "../model/forms/pdoc-searchform";
import { PDocSearchResult } from "../model/container/pdoc-searchresult";
import { BaseJoinRecord } from "../../search-commons/model/records/basejoin-record";
import { ActionTagForm } from "../../commons/utils/actiontag.utils";
import { StaticPagesDataStore } from "./staticpages-data.store";
export declare class StaticPagesDataService extends CommonDocDataService<PDocRecord, PDocSearchForm, PDocSearchResult> {
    constructor(dataStore: StaticPagesDataStore);
    createRecord(props: any, opts: any): PDocRecord;
    protected defineDatastoreMapper(): void;
    protected defineIdMappingAlliases(): {};
    protected defineIdMappings(): string[];
    protected defineTypeMappings(): {};
    protected onImportRecordNewRecordProcessDefaults(record: PDocRecord, recordIdMapping?: {}, recordRecoverIdMapping?: {}): void;
    protected remapBaseJoins(baseJoins: BaseJoinRecord[], refIdFieldName: any, recordIdMapping?: {}, recordRecoverIdMapping?: {}): void;
    protected generateImportRecordQuery(record: PDocRecord): {};
    getSubDocuments(pdoc: PDocRecord): PDocRecord[];
    protected addAdditionalActionTagForms(origRecord: PDocRecord, newRecord: PDocRecord, actionTagForms: ActionTagForm[]): void;
}
