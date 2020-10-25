import { BaseMediaRecord, BaseMediaRecordFactory, BaseMediaRecordType, BaseMediaRecordValidator } from './basemedia-record';
import { BaseEntityRecordFieldConfig } from './base-entity-record';
export interface BaseVideoRecordType extends BaseMediaRecordType {
    toString(): string;
}
export declare class BaseVideoRecord extends BaseMediaRecord implements BaseVideoRecordType {
    static baseVideoFields: {
        dur: BaseEntityRecordFieldConfig;
    };
    dur: number;
    toString(): string;
}
export declare class BaseVideoRecordFactory extends BaseMediaRecordFactory {
    static instance: BaseVideoRecordFactory;
    static createSanitized(values: {}): BaseVideoRecord;
    static cloneSanitized(doc: BaseVideoRecord): BaseVideoRecord;
    getSanitizedValues(values: {}, result: {}): {};
}
export declare class BaseVideoRecordValidator extends BaseMediaRecordValidator {
    static instance: BaseVideoRecordValidator;
    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean;
}
