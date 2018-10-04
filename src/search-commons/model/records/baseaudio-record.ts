import {
    BaseMediaRecord,
    BaseMediaRecordFactory,
    BaseMediaRecordType,
    BaseMediaRecordValidator
} from "./basemedia-record";
import {BaseEntityRecordFieldConfig} from "./base-entity-record";
import {GenericValidatorDatatypes, NumberValidationRule} from "../forms/generic-validator.util";

export interface BaseAudioRecordType extends BaseMediaRecordType {
    dur: number;
}

export class BaseAudioRecord extends BaseMediaRecord implements BaseAudioRecordType {
    static baseAudioFields = {
        dur: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 999999, undefined))
    };
    dur: number;

    getMediaId(): string {
        return 'notimplemented';
    }
    toString() {
        return 'BaseAudioRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '}';
    }
}

export class BaseAudioRecordFactory extends BaseMediaRecordFactory {
    public static instance = new BaseAudioRecordFactory();

    static createSanitized(values: {}): BaseAudioRecord {
        const sanitizedValues = BaseAudioRecordFactory.instance.getSanitizedValues(values, {});
        return new BaseAudioRecord(sanitizedValues);
    }

    static cloneSanitized(doc: BaseAudioRecord): BaseAudioRecord {
        const sanitizedValues = BaseAudioRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new BaseAudioRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, BaseAudioRecord.baseAudioFields, result, '');
        return result;
    }
}

export class BaseAudioRecordValidator extends BaseMediaRecordValidator {
    public static instance = new BaseAudioRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, BaseAudioRecord.baseAudioFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}