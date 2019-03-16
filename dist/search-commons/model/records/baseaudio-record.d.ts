import { BaseMediaRecord, BaseMediaRecordFactory, BaseMediaRecordType, BaseMediaRecordValidator } from './basemedia-record';
import { BaseEntityRecordFieldConfig } from './base-entity-record';
export interface BaseAudioRecordType extends BaseMediaRecordType {
    dur: number;
}
export declare class BaseAudioRecord extends BaseMediaRecord implements BaseAudioRecordType {
    static baseAudioFields: {
        dur: BaseEntityRecordFieldConfig;
    };
    dur: number;
    getMediaId(): string;
    toString(): string;
}
export declare class BaseAudioRecordFactory extends BaseMediaRecordFactory {
    static instance: BaseAudioRecordFactory;
    static createSanitized(values: {}): BaseAudioRecord;
    static cloneSanitized(doc: BaseAudioRecord): BaseAudioRecord;
    getSanitizedValues(values: {}, result: {}): {};
}
export declare class BaseAudioRecordValidator extends BaseMediaRecordValidator {
    static instance: BaseAudioRecordValidator;
    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean;
}
