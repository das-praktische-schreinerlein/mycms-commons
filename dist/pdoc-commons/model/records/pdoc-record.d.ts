import { BaseEntityRecord, BaseEntityRecordFieldConfig, BaseEntityRecordRelationsType } from '../../../search-commons/model/records/base-entity-record';
import { CommonDocRecord, CommonDocRecordFactory, CommonDocRecordType, CommonDocRecordValidator } from '../../../search-commons/model/records/cdoc-entity-record';
export interface PDocRecordType extends CommonDocRecordType {
    css: string;
    flags?: string;
    heading: string;
    image: string;
    key: string;
    langkeys: string;
    profiles?: string;
    sortkey: string;
    subSectionIds: string;
    teaser: string;
    theme: string;
    pageId: number;
}
export declare let PDocRecordRelation: BaseEntityRecordRelationsType;
export declare class PDocRecord extends CommonDocRecord implements PDocRecordType {
    css: string;
    flags?: string;
    heading: string;
    image: string;
    key: string;
    langkeys: string;
    profiles: string;
    sortkey: string;
    subSectionIds: string;
    teaser: string;
    theme: string;
    pageId: number;
    static pdocRelationNames: any[];
    static pdocValidationRelationNames: any[];
    static pdocFields: {
        css: BaseEntityRecordFieldConfig;
        flags: BaseEntityRecordFieldConfig;
        heading: BaseEntityRecordFieldConfig;
        image: BaseEntityRecordFieldConfig;
        key: BaseEntityRecordFieldConfig;
        langkeys: BaseEntityRecordFieldConfig;
        pageId: BaseEntityRecordFieldConfig;
        profiles: BaseEntityRecordFieldConfig;
        sortkey: BaseEntityRecordFieldConfig;
        subSectionIds: BaseEntityRecordFieldConfig;
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
