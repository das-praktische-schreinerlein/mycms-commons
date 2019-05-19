import {BaseEntityRecordFieldConfig} from './base-entity-record';
import {GenericValidatorDatatypes, NameValidationRule, NumberValidationRule} from '../forms/generic-validator.util';
import {BaseImageRecord, BaseImageRecordType} from './baseimage-record';
import {ObjectDetectionDetectedObjectType, ObjectDetectionState} from '../../../commons/model/objectdetection-model';

export interface BaseObjectDetectionImageObjectRecordType extends BaseImageRecordType, ObjectDetectionDetectedObjectType {
}

export class BaseObjectDetectionImageObjectRecord extends BaseImageRecord implements BaseObjectDetectionImageObjectRecordType {
    static objectDetectionImageObjectFields = {
        category: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true)),
        detector: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true)),
        key: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true)),
        keySuggestion: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        keyCorrection: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        state: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true)),
        imgWidth: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, 0, 999999, 0)),
        imgHeight: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, 0, 999999, 0)),
        objX: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, 0, 999999, 0)),
        objY: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, 0, 999999, 0)),
        objWidth: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, 0, 999999, 0)),
        objHeight: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, 0, 999999, 0)),
        precision: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, 0, 999999, 0))
    };

    category: string;
    detector: string;
    key: string;
    keySuggestion: string;
    keyCorrection: string;
    state: ObjectDetectionState;
    imgWidth: number;
    imgHeight: number;
    objX: number;
    objY: number;
    objWidth: number;
    objHeight: number;
    precision: number;

    toString() {
        return 'BaseObjectDetectionImageObjectRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  detector: ' + this.detector + ',\n' +
            '  category: ' + this.category + ',\n' +
            '  key: ' + this.key + ',\n' +
            '  pos: ' + this.objX + ',' + this.objY + '(' + this.objWidth + ',' + this.objHeight + ')\n' +
            '}';
    }
}
