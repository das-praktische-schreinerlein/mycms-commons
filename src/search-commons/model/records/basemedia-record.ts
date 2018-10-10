import {
    BaseEntityRecord,
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordType,
    BaseEntityRecordValidator
} from './base-entity-record';
import {
    DescValidationRule,
    GenericValidatorDatatypes,
    HtmlValidationRule,
    MarkdownValidationRule,
    NameValidationRule,
    SimpleInsecurePathValidationRule
} from "../forms/generic-validator.util";

export interface BaseMediaRecordType extends BaseEntityRecordType {
    descTxt: string;
    descMd: string;
    descHtml: string;
    fileName: string;
    name: string;
    getMediaId(): string;
}

export class BaseMediaRecord extends BaseEntityRecord implements BaseMediaRecordType {
    static baseMediaFields = {
        descTxt: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.TEXT, new DescValidationRule(false)),
        descMd: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.MARKDOWN, new MarkdownValidationRule(false)),
        descHtml: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.HTML, new HtmlValidationRule(false)),
        name: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true)),
        fileName: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.FILENAME, new SimpleInsecurePathValidationRule(true))
    };
    descTxt: string;
    descMd: string;
    descHtml: string;
    fileName: string;
    name: string;

    getMediaId(): string {
        return 'notimplemented';
    }
    toString() {
        return 'BaseImageRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '}';
    }
}

export class BaseMediaRecordFactory extends BaseEntityRecordFactory {
    public static instance = new BaseMediaRecordFactory();

    static createSanitized(values: {}): BaseMediaRecord {
        const sanitizedValues = BaseMediaRecordFactory.instance.getSanitizedValues(values, {});
        return new BaseMediaRecord(sanitizedValues);
    }

    static cloneSanitized(doc: BaseMediaRecord): BaseMediaRecord {
        const sanitizedValues = BaseMediaRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new BaseMediaRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, BaseMediaRecord.baseMediaFields, result, '');
        return result;
    }
}

export class BaseMediaRecordValidator extends BaseEntityRecordValidator {
    public static instance = new BaseMediaRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, BaseMediaRecord.baseMediaFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}
