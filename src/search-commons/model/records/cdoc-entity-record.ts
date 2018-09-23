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
        blocked: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, -5, 5, undefined)),

        dateshow: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.DATE, new DateValidationRule(false)),
        descTxt: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.TEXT, new DescValidationRule(false)),
        descMd: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.MARKDOWN, new MarkdownValidationRule(false)),
        descHtml: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.HTML, new HtmlValidationRule(false)),
        keywords: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new KeywordValidationRule(false)),
        name: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true)),
        playlists: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false)),
        subtype: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(true)),
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

export class CommonDocRecordFactory {
    static getSanitizedValues(values: {}): any {
        const sanitizedValues: any = {};
        sanitizedValues.id = BaseEntityRecord.genericFields.id.validator.sanitize(values['id']) || undefined;
        sanitizedValues.blocked = CommonDocRecord.cdocFields.blocked.validator.sanitize(values['blocked']) || undefined;
        sanitizedValues.dateshow = CommonDocRecord.cdocFields.dateshow.validator.sanitize(values['dateshow']) || undefined;
        sanitizedValues.descTxt = CommonDocRecord.cdocFields.descTxt.validator.sanitize(values['descTxt']) || undefined;
        sanitizedValues.descMd = CommonDocRecord.cdocFields.descMd.validator.sanitize(values['descMd']) || undefined;
        sanitizedValues.descHtml = CommonDocRecord.cdocFields.descHtml.validator.sanitize(values['descHtml']) || undefined;
        sanitizedValues.keywords = CommonDocRecord.cdocFields.keywords.validator.sanitize(values['keywords']) || undefined;
        sanitizedValues.name = CommonDocRecord.cdocFields.name.validator.sanitize(values['name']) || undefined;
        sanitizedValues.playlists = CommonDocRecord.cdocFields.playlists.validator.sanitize(values['playlists']) || undefined;
        sanitizedValues.subtype = CommonDocRecord.cdocFields.subtype.validator.sanitize(values['subtype']) || undefined;
        sanitizedValues.type = CommonDocRecord.cdocFields.type.validator.sanitize(values['type']) || undefined;

        return sanitizedValues;
    }

    static getSanitizedValuesFromObj(doc: CommonDocRecord): any {
        return CommonDocRecordFactory.getSanitizedValues(doc);
    }
}

export class CommonDocRecordValidator extends BaseEntityRecordValidator {
    public static instance = new CommonDocRecordValidator();

    validateMyRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        let state = super.validateMyRules(values, errors, fieldPrefix, errFieldPrefix);

        state = this.validateRule(values, CommonDocRecord.cdocFields.blocked.validator, fieldPrefix + 'blocked', errors, errFieldPrefix) && state;
        state = this.validateRule(values, CommonDocRecord.cdocFields.dateshow.validator, fieldPrefix + 'dateshow', errors, errFieldPrefix) && state;
        state = this.validateRule(values, CommonDocRecord.cdocFields.descTxt.validator, fieldPrefix + 'descTxt', errors, errFieldPrefix) && state;
        state = this.validateRule(values, CommonDocRecord.cdocFields.descMd.validator, fieldPrefix + 'descMd', errors, errFieldPrefix) && state;
        state = this.validateRule(values, CommonDocRecord.cdocFields.descHtml.validator, fieldPrefix + 'descHtml', errors, errFieldPrefix) && state;
        state = this.validateRule(values, CommonDocRecord.cdocFields.keywords.validator, fieldPrefix + 'keywords', errors, errFieldPrefix) && state;
        state = this.validateRule(values, CommonDocRecord.cdocFields.name.validator, fieldPrefix + 'name', errors, errFieldPrefix) && state;
        state = this.validateRule(values, CommonDocRecord.cdocFields.playlists.validator, fieldPrefix + 'playlists', errors, errFieldPrefix) && state;
        state = this.validateRule(values, CommonDocRecord.cdocFields.subtype.validator, fieldPrefix + 'subtype', errors, errFieldPrefix) && state;
        state = this.validateRule(values, CommonDocRecord.cdocFields.type.validator, fieldPrefix + 'type', errors, errFieldPrefix) && state;

        return state;
    }
}
