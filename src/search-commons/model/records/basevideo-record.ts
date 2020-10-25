import {
    BaseMediaRecord,
    BaseMediaRecordFactory,
    BaseMediaRecordType,
    BaseMediaRecordValidator
} from './basemedia-record';
import {BaseEntityRecordFieldConfig} from './base-entity-record';
import {GenericValidatorDatatypes, NumberValidationRule} from '../forms/generic-validator.util';

export interface BaseVideoRecordType extends BaseMediaRecordType {
    toString(): string;
}

export class BaseVideoRecord extends BaseMediaRecord implements BaseVideoRecordType {
    static baseVideoFields = {
        dur: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 999999, undefined))
    };
    dur: number;

    toString() {
        return 'BaseVideoRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '}';
    }
}

export class BaseVideoRecordFactory extends BaseMediaRecordFactory {
    public static instance = new BaseVideoRecordFactory();

    static createSanitized(values: {}): BaseVideoRecord {
        const sanitizedValues = BaseVideoRecordFactory.instance.getSanitizedValues(values, {});
        return new BaseVideoRecord(sanitizedValues);
    }

    static cloneSanitized(doc: BaseVideoRecord): BaseVideoRecord {
        const sanitizedValues = BaseVideoRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new BaseVideoRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, BaseVideoRecord.baseVideoFields, result, '');
        return result;
    }
}

export class BaseVideoRecordValidator extends BaseMediaRecordValidator {
    public static instance = new BaseVideoRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, BaseVideoRecord.baseVideoFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}
