import {PDocRecord, PDocRecordRelation} from '../model/records/pdoc-record';
import {PDocSearchService} from './pdoc-search.service';
import {PDocRecordSchema} from '../model/schemas/pdoc-record-schema';
import {CommonDocDataService} from "../../search-commons/services/cdoc-data.service";
import {PDocSearchForm} from "../model/forms/pdoc-searchform";
import {PDocSearchResult} from "../model/container/pdoc-searchresult";
import {BaseJoinRecord} from "../../search-commons/model/records/basejoin-record";
import {PDocAdapterResponseMapper} from "./pdoc-adapter-response.mapper";
import {ActionTagForm} from "../../commons/utils/actiontag.utils";
import {StaticPagesDataStore} from "./staticpages-data.store";

export class StaticPagesDataService extends CommonDocDataService<PDocRecord, PDocSearchForm, PDocSearchResult> {
    constructor(dataStore: StaticPagesDataStore) {
        super(dataStore, new PDocSearchService(dataStore), new PDocAdapterResponseMapper({}));
    }

    public createRecord(props, opts): PDocRecord {
        return <PDocRecord>this.dataStore.createRecord(this.getBaseMapperName(), props, opts);
    }

    protected defineDatastoreMapper(): void {
        this.dataStore.defineMapper('pdoc', PDocRecord, PDocRecordSchema, PDocRecordRelation);
    }

    protected defineIdMappingAlliases(): {} {
        return {
        };
    }

    protected defineIdMappings(): string[] {
        return [];
    }

    protected defineTypeMappings(): {} {
        return {};
    }

    protected onImportRecordNewRecordProcessDefaults(record: PDocRecord, recordIdMapping?: {}, recordRecoverIdMapping?: {}): void {
    }

    protected remapBaseJoins(baseJoins: BaseJoinRecord[], refIdFieldName: any, recordIdMapping?: {}, recordRecoverIdMapping?: {}): void {
        if (baseJoins) {
            for (const join of baseJoins) {
                const refIdMapping = recordIdMapping[refIdFieldName];
                const refId = join.refId;
                if (refIdMapping && refIdMapping[refId]) {
                    console.log('orig join: ' + join.id + ' map join ref ' + refIdFieldName + ' ' + refId
                        + '->' + refIdMapping[refId]);
                    join.refId = refIdMapping[refId] + '';
                } else {
                    console.warn('WARNING NO Id-Mapping orig join: ' + join.id + ' map baseJoin ref ' + refIdFieldName + ' ' + refId
                        + '->' + refIdMapping[refId]);
                }
            }
        }
    }

    protected generateImportRecordQuery(record: PDocRecord): {} {
        return {
            where: {
                name_s: {
                    'in': [record.name]
                },
                type_txt: {
                    'in': [record.type.toLowerCase()]
                }
            }
        };
    }

    getSubDocuments(pdoc: PDocRecord): PDocRecord[] {
        const sections: PDocRecord[] = [];
        if (!pdoc) {
            return [];
        }

        const ids = pdoc.subSectionIds !== undefined ? pdoc.subSectionIds.split(/,/) : [];
        for (const id of ids) {
            if (id === undefined || id.length === 0) {
                continue;
            }

            const section = this.getByIdFromLocalStore(id);
            if (section !== undefined) {
                sections.push(section);
            } else {
                // console.warn('getSubSections: section not found:', LogUtils.sanitizeLogMsg(id));
            }
        }

        return sections;
    }

    protected addAdditionalActionTagForms(origRecord: PDocRecord, newRecord: PDocRecord, actionTagForms: ActionTagForm[]) {
    }

}
