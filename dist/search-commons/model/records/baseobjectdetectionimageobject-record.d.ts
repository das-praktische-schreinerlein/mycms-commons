import { BaseEntityRecordFieldConfig } from './base-entity-record';
import { BaseImageRecord, BaseImageRecordType } from './baseimage-record';
export declare enum BaseObjectDetectionState {
    'UNKNOWN' = 0,
    'OPEN' = 1,
    'ERROR' = 2,
    'RUNNING_SUGGESTED' = 3,
    'RUNNING_MANUAL_APPROVED' = 4,
    'RUNNING_MANUAL_REJECTED' = 5,
    'RUNNING_MANUAL_CORRECTION_NEEDED' = 6,
    'RUNNING_MANUAL_CORRECTED' = 7,
    'DONE_APPROVAL_PROCESSED' = 8,
    'DONE_REJECTION_PROCESSED' = 9,
    'DONE_CORRECTION_PROCESSED' = 10,
}
export interface BaseObjectDetectionImageObjectRecordType extends BaseImageRecordType {
    detector: string;
    key: string;
    keySuggestion: string;
    keyCorrection: string;
    state: BaseObjectDetectionState;
    imgWidth: number;
    imgHeight: number;
    objX: number;
    objY: number;
    objWidth: number;
    objHeight: number;
}
export declare class BaseObjectDetectionImageObjectRecord extends BaseImageRecord implements BaseObjectDetectionImageObjectRecordType {
    static objectDetectionImageObjectFields: {
        detector: BaseEntityRecordFieldConfig;
        key: BaseEntityRecordFieldConfig;
        keySuggestion: BaseEntityRecordFieldConfig;
        keyCorrection: BaseEntityRecordFieldConfig;
        state: BaseEntityRecordFieldConfig;
        imgWidth: BaseEntityRecordFieldConfig;
        imgHeight: BaseEntityRecordFieldConfig;
        objX: BaseEntityRecordFieldConfig;
        objY: BaseEntityRecordFieldConfig;
        objWidth: BaseEntityRecordFieldConfig;
        objHeight: BaseEntityRecordFieldConfig;
    };
    detector: string;
    key: string;
    keySuggestion: string;
    keyCorrection: string;
    state: BaseObjectDetectionState;
    imgWidth: number;
    imgHeight: number;
    objX: number;
    objY: number;
    objWidth: number;
    objHeight: number;
    toString(): string;
}
