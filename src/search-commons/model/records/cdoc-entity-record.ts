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
import {BaseEntityRecord, BaseEntityRecordFieldConfig, BaseEntityRecordType} from './base-entity-record';
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
        return CommonDocRecordValidator.isValid(this);
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
        const sanitizedValues: any = {};
        sanitizedValues.id = BaseEntityRecord.genericFields.id.validator.sanitize(doc.id) || undefined;
        sanitizedValues.blocked = CommonDocRecord.cdocFields.blocked.validator.sanitize(doc.blocked) || undefined;
        sanitizedValues.dateshow = CommonDocRecord.cdocFields.dateshow.validator.sanitize(doc.dateshow) || undefined;
        sanitizedValues.descTxt = CommonDocRecord.cdocFields.descTxt.validator.sanitize(doc.descTxt) || undefined;
        sanitizedValues.descMd = CommonDocRecord.cdocFields.descMd.validator.sanitize(doc.descMd) || undefined;
        sanitizedValues.descHtml = CommonDocRecord.cdocFields.descHtml.validator.sanitize(doc.descHtml) || undefined;
        sanitizedValues.keywords = CommonDocRecord.cdocFields.keywords.validator.sanitize(doc.keywords) || undefined;
        sanitizedValues.name = CommonDocRecord.cdocFields.name.validator.sanitize(doc.name) || undefined;
        sanitizedValues.playlists = CommonDocRecord.cdocFields.playlists.validator.sanitize(doc.playlists) || undefined;
        sanitizedValues.subtype = CommonDocRecord.cdocFields.subtype.validator.sanitize(doc.subtype) || undefined;
        sanitizedValues.type = CommonDocRecord.cdocFields.type.validator.sanitize(doc.type) || undefined;

        return sanitizedValues;
    }
}

export class CommonDocRecordValidator {
    static isValidValues(values: {}): boolean {
        return CommonDocRecordValidator.validateValues(values).length > 0;
    }

    static validateValues(values: {}): string[] {
        const errors = [];
        let state = true;
        state = !BaseEntityRecord.genericFields.id.validator.isValid(values['id']) ? errors.push('id') &&  false : true;

        state = !CommonDocRecord.cdocFields.blocked.validator.isValid(values['blocked']) ? errors.push('blocked') &&  false : true;
        state = !CommonDocRecord.cdocFields.dateshow.validator.isValid(values['dateshow']) ? errors.push('dateshow') &&  false : true;
        state = !CommonDocRecord.cdocFields.descTxt.validator.isValid(values['descTxt']) ? errors.push('descTxt') &&  false : true;
        state = !CommonDocRecord.cdocFields.descMd.validator.isValid(values['descMd']) ? errors.push('descMd') &&  false : true;
        state = !CommonDocRecord.cdocFields.descHtml.validator.isValid(values['descHtml']) ? errors.push('descHtml') &&  false : true;
        state = !CommonDocRecord.cdocFields.keywords.validator.isValid(values['keywords']) ? errors.push('keywords') &&  false : true;
        state = !CommonDocRecord.cdocFields.name.validator.isValid(values['name']) ? errors.push('name') &&  false : true;
        state = !CommonDocRecord.cdocFields.playlists.validator.isValid(values['playlists']) ? errors.push('playlists') &&  false : true;
        state = !CommonDocRecord.cdocFields.subtype.validator.isValid(values['subtype']) ? errors.push('subtype') &&  false : true;
        state = !CommonDocRecord.cdocFields.type.validator.isValid(values['type']) ? errors.push('type') &&  false : true;

        return errors;
    }

    static isValid(doc: CommonDocRecord): boolean {
        return CommonDocRecordValidator.validate(doc).length > 0;
    }

    static validate(doc: CommonDocRecord): string[] {
        const errors = [];
        let state = BaseEntityRecord.genericFields.id.validator.isValid(doc.id) ? errors.push('id') && false : true;

        state = !CommonDocRecord.cdocFields.blocked.validator.isValid(doc.blocked) ? errors.push('blocked') &&  false : true;
        state = !CommonDocRecord.cdocFields.dateshow.validator.isValid(doc.dateshow) ? errors.push('dateshow') &&  false : true;
        state = !CommonDocRecord.cdocFields.descTxt.validator.isValid(doc.descTxt) ? errors.push('descTxt') &&  false : true;
        state = !CommonDocRecord.cdocFields.descMd.validator.isValid(doc.descMd) ? errors.push('descMd') &&  false : true;
        state = !CommonDocRecord.cdocFields.descHtml.validator.isValid(doc.descHtml) ? errors.push('descHtml') &&  false : true;
        state = !CommonDocRecord.cdocFields.keywords.validator.isValid(doc.keywords) ? errors.push('keywords') &&  false : true;
        state = !CommonDocRecord.cdocFields.name.validator.isValid(doc.name) ? errors.push('name') &&  false : true;
        state = !CommonDocRecord.cdocFields.playlists.validator.isValid(doc.playlists) ? errors.push('playlists') &&  false : true;
        state = !CommonDocRecord.cdocFields.subtype.validator.isValid(doc.subtype) ? errors.push('subtype') &&  false : true;
        state = !CommonDocRecord.cdocFields.type.validator.isValid(doc.type) ? errors.push('type') &&  false : true;

        return errors;
    }
}
