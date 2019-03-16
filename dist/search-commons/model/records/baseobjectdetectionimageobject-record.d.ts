import { BaseEntityRecordFieldConfig } from './base-entity-record';
import { BaseImageRecord, BaseImageRecordType } from './baseimage-record';
export declare enum BaseObjectDetectionState {
    UNKNOWN = "UNKNOWN",
    OPEN = "OPEN",
    ERROR = "ERROR",
    RUNNING_SUGGESTED = "RUNNING_SUGGESTED",
    RUNNING_MANUAL_APPROVED = "RUNNING_MANUAL_APPROVED",
    RUNNING_MANUAL_REJECTED = "RUNNING_MANUAL_REJECTED",
    RUNNING_MANUAL_CORRECTION_NEEDED = "RUNNING_MANUAL_CORRECTION_NEEDED",
    RUNNING_MANUAL_CORRECTED = "RUNNING_MANUAL_CORRECTED",
    DONE_APPROVAL_PROCESSED = "DONE_APPROVAL_PROCESSED",
    DONE_REJECTION_PROCESSED = "DONE_REJECTION_PROCESSED",
    DONE_CORRECTION_PROCESSED = "DONE_CORRECTION_PROCESSED",
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
    precision: number;
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
        precision: BaseEntityRecordFieldConfig;
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
    precision: number;
    toString(): string;
}
