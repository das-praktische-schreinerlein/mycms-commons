import {
    BaseEntityRecord,
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordType,
    BaseEntityRecordValidator
} from './base-entity-record';
import {
    DateValidationRule,
    DescValidationRule,
    GenericValidatorDatatypes,
    IdValidationRule,
    NameValidationRule,
    NumberValidationRule,
    SimpleInsecurePathValidationRule
} from '../forms/generic-validator.util';

export interface BaseMediaMetaRecordType extends BaseEntityRecordType {
    dur?: number;
    fileCreated?: Date | string;
    fileName?: string,
    fileSize?: number;
    metadata?: string;
    recordingDate?: Date | string;
    resolution?: string;
}

export class BaseMediaMetaRecord extends BaseEntityRecord implements BaseMediaMetaRecordType {
    static mediametaFields = {
        dur: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 999999, undefined)),
        fileCreated: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.DATE, new DateValidationRule(false)),
        fileName: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.FILENAME, new SimpleInsecurePathValidationRule(false)),
        fileSize: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 999999999, undefined)),
        metadata: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.TEXT, new DescValidationRule(false)),
        resolution: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        recordingDate: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.DATE, new DateValidationRule(false)),
        mdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    dur: number;
    fileCreated: Date | string;
    fileName: string;
    fileSize: number;
    metadata: string;
    recordingDate: Date | string;
    resolution: string;

    toString() {
        return 'BaseMediaMetaRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileCreated: ' + this.fileCreated + ',\n' +
            '  fileName: ' + this.fileName + ',\n' +
            '  fileSize: ' + this.fileSize + ',\n' +
            '  dur: ' + this.dur +
            '}';
    }
}

export class BaseMediaMetaRecordFactory extends BaseEntityRecordFactory {
    public static instance = new BaseMediaMetaRecordFactory();

    static createSanitized(values: {}): BaseMediaMetaRecord {
        const sanitizedValues = BaseMediaMetaRecordFactory.instance.getSanitizedValues(values, {});
        return new BaseMediaMetaRecord(sanitizedValues);
    }

    static cloneSanitized(doc: BaseMediaMetaRecord): BaseMediaMetaRecord {
        const sanitizedValues = BaseMediaMetaRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new BaseMediaMetaRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, BaseMediaMetaRecord.mediametaFields, result, '');
        return result;
    }
}

export class MediaDocMediaMetaRecordValidator extends BaseEntityRecordValidator {
    public static instance = new MediaDocMediaMetaRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, BaseMediaMetaRecord.mediametaFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}
