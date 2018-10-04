import { BaseEntityRecord, BaseEntityRecordFactory, BaseEntityRecordFieldConfig, BaseEntityRecordType, BaseEntityRecordValidator } from './base-entity-record';
export interface BaseMediaRecordType extends BaseEntityRecordType {
    descTxt: string;
    descMd: string;
    descHtml: string;
    fileName: string;
    name: string;
    getMediaId(): string;
}
export declare class BaseMediaRecord extends BaseEntityRecord implements BaseMediaRecordType {
    static baseMediaFields: {
        descTxt: BaseEntityRecordFieldConfig;
        descMd: BaseEntityRecordFieldConfig;
        descHtml: BaseEntityRecordFieldConfig;
        name: BaseEntityRecordFieldConfig;
        fileName: BaseEntityRecordFieldConfig;
    };
    descTxt: string;
    descMd: string;
    descHtml: string;
    fileName: string;
    name: string;
    getMediaId(): string;
    toString(): string;
}
export declare class BaseMediaRecordFactory extends BaseEntityRecordFactory {
    static instance: BaseMediaRecordFactory;
    static createSanitized(values: {}): BaseMediaRecord;
    static cloneSanitized(doc: BaseMediaRecord): BaseMediaRecord;
    getSanitizedValues(values: {}, result: {}): {};
}
export declare class BaseMediaRecordValidator extends BaseEntityRecordValidator {
    static instance: BaseMediaRecordValidator;
    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean;
}
