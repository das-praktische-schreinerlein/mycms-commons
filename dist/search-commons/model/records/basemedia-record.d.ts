import { BaseEntityRecord, BaseEntityRecordFieldConfig, BaseEntityRecordType, BaseEntityRecordValidator } from './base-entity-record';
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
export declare class BaseMediaRecordFactory {
    static getSanitizedValues(values: {}): any;
    static getSanitizedValuesFromObj(doc: BaseMediaRecord): any;
}
export declare class BaseMediaRecordValidator extends BaseEntityRecordValidator {
    static instance: BaseMediaRecordValidator;
    validateMyRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean;
}
