import { BaseEntityRecord, BaseEntityRecordFactory, BaseEntityRecordFieldConfig, BaseEntityRecordType, BaseEntityRecordValidator } from './base-entity-record';
export interface BaseMediaMetaRecordType extends BaseEntityRecordType {
    dur?: number;
    fileCreated?: Date | string;
    fileName?: string;
    fileSize?: number;
    metadata?: string;
    recordingDate?: Date | string;
    resolution?: string;
}
export declare class BaseMediaMetaRecord extends BaseEntityRecord implements BaseMediaMetaRecordType {
    static mediametaFields: {
        dur: BaseEntityRecordFieldConfig;
        fileCreated: BaseEntityRecordFieldConfig;
        fileName: BaseEntityRecordFieldConfig;
        fileSize: BaseEntityRecordFieldConfig;
        metadata: BaseEntityRecordFieldConfig;
        resolution: BaseEntityRecordFieldConfig;
        recordingDate: BaseEntityRecordFieldConfig;
        mdoc_id: BaseEntityRecordFieldConfig;
    };
    dur: number;
    fileCreated: Date | string;
    fileName: string;
    fileSize: number;
    metadata: string;
    recordingDate: Date | string;
    resolution: string;
    toString(): string;
}
export declare class BaseMediaMetaRecordFactory extends BaseEntityRecordFactory {
    static instance: BaseMediaMetaRecordFactory;
    static createSanitized(values: {}): BaseMediaMetaRecord;
    static cloneSanitized(doc: BaseMediaMetaRecord): BaseMediaMetaRecord;
    getSanitizedValues(values: {}, result: {}): {};
}
export declare class MediaDocMediaMetaRecordValidator extends BaseEntityRecordValidator {
    static instance: MediaDocMediaMetaRecordValidator;
    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean;
}
