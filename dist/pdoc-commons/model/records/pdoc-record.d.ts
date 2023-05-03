import { BaseEntityRecord, BaseEntityRecordFieldConfig, BaseEntityRecordRelationsType } from '../../../search-commons/model/records/base-entity-record';
import { CommonDocRecord, CommonDocRecordFactory, CommonDocRecordType, CommonDocRecordValidator } from "../../../search-commons/model/records/cdoc-entity-record";
export interface PDocRecordType extends CommonDocRecordType {
    css: string;
    descTxt: string;
    descMd: string;
    descHtml: string;
    flgShowSearch?: boolean;
    flgShowNews?: boolean;
    flgShowTopTen?: boolean;
    flgShowAdminArea?: boolean;
    flgShowDashboard?: boolean;
    flags?: string[];
    heading: string;
    image: string;
    key: string;
    keywords: string;
    langkey: string;
    name: string;
    subSectionIds: string;
    teaser: string;
    theme: string;
    type: string;
    pageId: number;
}
export declare let PDocRecordRelation: BaseEntityRecordRelationsType;
export declare class PDocRecord extends CommonDocRecord implements PDocRecordType {
    blocked: number;
    dateshow: Date;
    playlists: string;
    subtype: string;
    css: string;
    descTxt: string;
    descMd: string;
    descHtml: string;
    flgShowSearch?: boolean;
    flgShowNews?: boolean;
    flgShowTopTen?: boolean;
    flgShowAdminArea?: boolean;
    flgShowDashboard?: boolean;
    flags?: string[];
    heading: string;
    key: string;
    image: string;
    keywords: string;
    langkey: string;
    name: string;
    subSectionIds: string;
    teaser: string;
    theme: string;
    type: string;
    pageId: number;
    static pdocRelationNames: any[];
    static pdocValidationRelationNames: any[];
    static pdocFields: {
        css: BaseEntityRecordFieldConfig;
        heading: BaseEntityRecordFieldConfig;
        key: BaseEntityRecordFieldConfig;
        langkey: BaseEntityRecordFieldConfig;
        pageId: BaseEntityRecordFieldConfig;
        teaser: BaseEntityRecordFieldConfig;
        theme: BaseEntityRecordFieldConfig;
    };
    static cloneToSerializeToJsonObj(baseRecord: PDocRecord, anonymizeMedia?: boolean): {};
    toString(): string;
    toSerializableJsonObj(anonymizeMedia?: boolean): {};
    isValid(): boolean;
}
export declare class PDocRecordFactory extends CommonDocRecordFactory {
    static instance: PDocRecordFactory;
    static createSanitized(values: {}): PDocRecord;
    static cloneSanitized(doc: PDocRecord): PDocRecord;
    getSanitizedValues(values: {}, result: {}): {};
    getSanitizedRelationValues(relation: string, values: {}): {};
}
export declare class PDocRecordValidator extends CommonDocRecordValidator {
    static instance: PDocRecordValidator;
    isValid(doc: BaseEntityRecord, errFieldPrefix?: string): boolean;
    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean;
    validateMyValueRelationRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean;
    validateMyRelationRules(doc: BaseEntityRecord, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean;
    protected validateRelationDoc(relation: string, doc: BaseEntityRecord, errFieldPrefix?: string): string[];
    protected validateValueRelationDoc(relation: string, values: {}, fieldPrefix?: string, errFieldPrefix?: string): string[];
}
