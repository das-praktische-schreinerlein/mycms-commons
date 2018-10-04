import { BaseEntityRecord, BaseEntityRecordFactory, BaseEntityRecordFieldConfig, BaseEntityRecordType, BaseEntityRecordValidator } from './base-entity-record';
export interface CommonDocRecordType extends BaseEntityRecordType {
    blocked: number;
    dateshow: Date;
    descTxt: string;
    descMd: string;
    descHtml: string;
    keywords: string;
    name: string;
    playlists: string;
    subtype: string;
    type: string;
    toSerializableJsonObj(anonymizeMedia?: boolean): {};
}
export declare class CommonDocRecord extends BaseEntityRecord implements CommonDocRecordType {
    static cdocFields: {
        blocked: BaseEntityRecordFieldConfig;
        dateshow: BaseEntityRecordFieldConfig;
        descTxt: BaseEntityRecordFieldConfig;
        descMd: BaseEntityRecordFieldConfig;
        descHtml: BaseEntityRecordFieldConfig;
        keywords: BaseEntityRecordFieldConfig;
        name: BaseEntityRecordFieldConfig;
        playlists: BaseEntityRecordFieldConfig;
        subtype: BaseEntityRecordFieldConfig;
        type: BaseEntityRecordFieldConfig;
    };
    blocked: number;
    dateshow: Date;
    descTxt: string;
    descMd: string;
    descHtml: string;
    keywords: string;
    name: string;
    playlists: string;
    subtype: string;
    type: string;
    static cloneToSerializeToJsonObj(baseRecord: CommonDocRecord, anonymizeMedia?: boolean): {};
    toString(): string;
    toSerializableJsonObj(anonymizeMedia?: boolean): {};
    isValid(): boolean;
}
export declare class CommonDocRecordFactory extends BaseEntityRecordFactory {
    static instance: CommonDocRecordFactory;
    static createSanitized(values: {}): CommonDocRecord;
    static cloneSanitized(doc: CommonDocRecord): CommonDocRecord;
    getSanitizedValues(values: {}, result: {}): {};
}
export declare class CommonDocRecordValidator extends BaseEntityRecordValidator {
    static instance: CommonDocRecordValidator;
    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean;
}
