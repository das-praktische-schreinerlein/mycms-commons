import { BaseEntityRecordFieldConfig } from './base-entity-record';
import { BaseImageRecord, BaseImageRecordType } from './baseimage-record';
import { ObjectDetectionDetectedObjectType, ObjectDetectionState } from '../../../commons/model/objectdetection-model';
export interface BaseObjectDetectionImageObjectRecordType extends BaseImageRecordType, ObjectDetectionDetectedObjectType {
}
export declare class BaseObjectDetectionImageObjectRecord extends BaseImageRecord implements BaseObjectDetectionImageObjectRecordType {
    static objectDetectionImageObjectFields: {
        category: BaseEntityRecordFieldConfig;
        detector: BaseEntityRecordFieldConfig;
        key: BaseEntityRecordFieldConfig;
        keySuggestion: BaseEntityRecordFieldConfig;
        keyCorrection: BaseEntityRecordFieldConfig;
        state: BaseEntityRecordFieldConfig;
        imgWidth: BaseEntityRecordFieldConfig;
        imgHeight: BaseEntityRecordFieldConfig;
        imgOrientation: BaseEntityRecordFieldConfig;
        objX: BaseEntityRecordFieldConfig;
        objY: BaseEntityRecordFieldConfig;
        objWidth: BaseEntityRecordFieldConfig;
        objHeight: BaseEntityRecordFieldConfig;
        precision: BaseEntityRecordFieldConfig;
    };
    category: string;
    detector: string;
    key: string;
    keySuggestion: string;
    keyCorrection: string;
    state: ObjectDetectionState;
    imgWidth: number;
    imgHeight: number;
    imgOrientation: string;
    objX: number;
    objY: number;
    objWidth: number;
    objHeight: number;
    precision: number;
    toString(): string;
}
