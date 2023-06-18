import {
    DateValidationRule,
    DescValidationRule,
    GenericValidatorDatatypes,
    HtmlValidationRule,
    IdValidationRule,
    KeywordValidationRule,
    MarkdownValidationRule,
    NameValidationRule,
    NumberValidationRule,
    TextValidationRule
} from '../forms/generic-validator.util';
import {
    BaseEntityRecord,
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordType,
    BaseEntityRecordValidator
} from './base-entity-record';
import {isArray} from 'util';

export interface CommonDocRecordType extends BaseEntityRecordType {
    blocked: number;
    dateshow: Date;
    descTxt: string;
    descMd: string;
    descHtml: string;
    keywords: string;
    name: string;
    playlists: string;
    subtype: string;
    type: string;

    toSerializableJsonObj(anonymizeMedia?: boolean): {};
}

export class CommonDocRecord extends BaseEntityRecord implements CommonDocRecordType {
    static cdocFields = {
        blocked: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, -99, 99, undefined)),
        dateshow: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.DATE, new DateValidationRule(false)),
        descTxt: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.TEXT, new DescValidationRule(false)),
        descMd: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.MARKDOWN, new MarkdownValidationRule(false)),
        descHtml: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.HTML, new HtmlValidationRule(false)),
        keywords: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new KeywordValidationRule(false)),
        name: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true)),
        playlists: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false)),
        subtype: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false)),
        type: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(true))
    };

    blocked: number;
    dateshow: Date;
    descTxt: string;
    descMd: string;
    descHtml: string;
    keywords: string;
    name: string;
    playlists: string;
    subtype: string;
    type: string;

    static cloneToSerializeToJsonObj(baseRecord: CommonDocRecord, anonymizeMedia?: boolean): {}  {
        const record  = {};
        for (const key in baseRecord) {
                record[key] = baseRecord[key];
        }

        if (anonymizeMedia === true) {
            if (isArray(record['cdocimages'])) {
                for (const media of record['cdocimages']) {
                    media.fileName = 'anonymized.JPG';
                }
            }
            if (isArray(record['cdocvideos'])) {
                for (const media of record['cdocvideos']) {
                    media.fileName = 'anonymized.MP4';
                }
            }
        }

        return record;
    }

    toString() {
        return 'CommonDocRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  type: ' + this.type + '' +
            '}';
    }

    toSerializableJsonObj(anonymizeMedia?: boolean): {} {
        return CommonDocRecord.cloneToSerializeToJsonObj(this, anonymizeMedia);
    }

    isValid(): boolean {
        return CommonDocRecordValidator.instance.isValid(this);
    }
}

export class CommonDocRecordFactory extends BaseEntityRecordFactory {
    public static instance = new CommonDocRecordFactory();

    static createSanitized(values: {}): CommonDocRecord {
        const sanitizedValues = CommonDocRecordFactory.instance.getSanitizedValues(values, {});
        return new CommonDocRecord(sanitizedValues);
    }

    static cloneSanitized(doc: CommonDocRecord): CommonDocRecord {
        const sanitizedValues = CommonDocRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new CommonDocRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, CommonDocRecord.cdocFields, result, '');
        return result;
    }
}

export class CommonDocRecordValidator extends BaseEntityRecordValidator {
    public static instance = new CommonDocRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, CommonDocRecord.cdocFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}
