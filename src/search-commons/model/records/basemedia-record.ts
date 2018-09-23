import {
    BaseEntityRecord,
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
    PathValidationRule
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
        fileName: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.FILENAME, new PathValidationRule(true))
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

export class BaseMediaRecordFactory {
    static getSanitizedValues(values: {}): any {
        const sanitizedValues: any = {};
        sanitizedValues.id = BaseEntityRecord.genericFields.id.validator.sanitize(values['id']) || undefined;
        sanitizedValues.descTxt = BaseMediaRecord.baseMediaFields.descTxt.validator.sanitize(values['descTxt']) || undefined;
        sanitizedValues.descMd = BaseMediaRecord.baseMediaFields.descMd.validator.sanitize(values['descMd']) || undefined;
        sanitizedValues.descHtml = BaseMediaRecord.baseMediaFields.descHtml.validator.sanitize(values['descHtml']) || undefined;
        sanitizedValues.name = BaseMediaRecord.baseMediaFields.name.validator.sanitize(values['name']) || undefined;
        sanitizedValues.fileName = BaseMediaRecord.baseMediaFields.fileName.validator.sanitize(values['fileName']) || undefined;

        return sanitizedValues;
    }

    static getSanitizedValuesFromObj(doc: BaseMediaRecord): any {
        return BaseMediaRecordFactory.getSanitizedValues(doc);
    }
}

export class BaseMediaRecordValidator extends BaseEntityRecordValidator {
    public static instance = new BaseMediaRecordValidator();

    validateMyRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        let state = super.validateMyRules(values, errors, fieldPrefix, errFieldPrefix);

        state = this.validateRule(values, BaseMediaRecord.baseMediaFields.descTxt.validator, fieldPrefix + 'descTxt', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseMediaRecord.baseMediaFields.descMd.validator, fieldPrefix + 'descMd', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseMediaRecord.baseMediaFields.descHtml.validator, fieldPrefix + 'descHtml', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseMediaRecord.baseMediaFields.name.validator, fieldPrefix + 'name', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseMediaRecord.baseMediaFields.fileName.validator, fieldPrefix + 'fileName', errors, errFieldPrefix) && state;

        return state;
    }
}
