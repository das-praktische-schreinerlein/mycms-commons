import {
    BaseEntityRecord,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordRelationsType
} from '../../../search-commons/model/records/base-entity-record';
import {
    CommonDocRecord,
    CommonDocRecordFactory,
    CommonDocRecordType,
    CommonDocRecordValidator
} from "../../../search-commons/model/records/cdoc-entity-record";
import {isArray} from 'util';
import {
    GenericValidatorDatatypes,
    HtmlValidationRule, IdCsvValidationRule,
    IdValidationRule, KeywordValidationRule,
    MarkdownValidationRule
} from '../../../search-commons/model/forms/generic-validator.util';

export interface PDocRecordType extends CommonDocRecordType {
    css: string;
    descTxt: string;
    descMd: string;
    descHtml: string;

    heading: string;
    image: string;
    key: string;
    langkeys: string;
    name: string;
    subSectionIds: string;
    teaser: string;
    theme: string;
    type: string;

    pageId: number;

    flags?: string;
    profiles?: string;
}

export let PDocRecordRelation: BaseEntityRecordRelationsType = {
    hasOne: {
    },
    hasMany: {
    }
};

export class PDocRecord extends CommonDocRecord implements PDocRecordType{
    blocked: number;
    dateshow: Date;
    subtype: string;

    css: string;
    descTxt: string;
    descMd: string;
    descHtml: string;
    flags?: string;
    heading: string;
    key: string;
    image: string;
    langkeys: string;
    name: string;
    profiles: string;
    subSectionIds: string;
    teaser: string;
    theme: string;
    type: string;

    pageId: number;

    static pdocRelationNames = []
        .concat(PDocRecordRelation.hasOne ? Object.keys(PDocRecordRelation.hasOne).map(key => {
            return PDocRecordRelation.hasOne[key].localField;
        }) : [])
        .concat(PDocRecordRelation.hasMany ? Object.keys(PDocRecordRelation.hasMany).map(key => {
            return PDocRecordRelation.hasMany[key].localField;
        }) : []);

    static pdocValidationRelationNames = []
        .concat(PDocRecordRelation.hasOne ? Object.keys(PDocRecordRelation.hasOne).map(key => {
            return PDocRecordRelation.hasOne[key].localField;
        }) : []);

    static pdocFields = {
        css: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.HTML, new HtmlValidationRule(false)),
        flags: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new KeywordValidationRule(false)),
        heading: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.MARKDOWN, new MarkdownValidationRule(false)),
        key: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(true)),
        langkeys: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new KeywordValidationRule(true)),
        pageId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false)),
        profiles: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new KeywordValidationRule(true)),
        subSectionIds: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new KeywordValidationRule(false)),
        teaser: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.MARKDOWN, new MarkdownValidationRule(false)),
        theme: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false)),
    };

    static cloneToSerializeToJsonObj(baseRecord: PDocRecord, anonymizeMedia?: boolean): {}  {
        const record  = {};
        for (const key in baseRecord) {
            record[key] = baseRecord[key];
        }
        for (const relationName of PDocRecord.pdocRelationNames) {
            record[relationName] = baseRecord.get(relationName);
        }

        if (anonymizeMedia === true) {
            let relationName = 'pdocimages';
            if (isArray(record[relationName])) {
                for (const media of record[relationName]) {
                    media.fileName = 'anonymized.JPG';
                }
            }
            relationName = 'pdocvideos';
            if (isArray(record[relationName])) {
                for (const media of record[relationName]) {
                    media.fileName = 'anonymized.MP4';
                }
            }
        }

        return record;
    }

    toString() {
        return 'PDocRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  heading: ' + this.name + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  theme: ' + this.theme + '' +
            '  type: ' + this.type + '' +
            '}';
    }


    toSerializableJsonObj(anonymizeMedia?: boolean): {} {
        return PDocRecord.cloneToSerializeToJsonObj(this, anonymizeMedia);
    }

    isValid(): boolean {
        return PDocRecordValidator.instance.isValid(this);
    }
}

export class PDocRecordFactory extends CommonDocRecordFactory {
    public static instance = new PDocRecordFactory();

    static createSanitized(values: {}): PDocRecord {
        const sanitizedValues = PDocRecordFactory.instance.getSanitizedValues(values, {});
        return new PDocRecord(sanitizedValues);
    }

    static cloneSanitized(doc: PDocRecord): PDocRecord {
        const sanitizedValues = PDocRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new PDocRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, PDocRecord.pdocFields, result, '');
        return result;
    }

    getSanitizedRelationValues(relation: string, values: {}): {} {
        switch (relation) {
            default:
                return super.getSanitizedRelationValues(relation, values);
        }
    };

}

export class PDocRecordValidator extends CommonDocRecordValidator {
    public static instance = new PDocRecordValidator();

    isValid(doc: BaseEntityRecord, errFieldPrefix?: string): boolean {
        return this.validate(doc, errFieldPrefix).length === 0;
    }

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, PDocRecord.pdocFields, fieldPrefix, errors, errFieldPrefix) && state;
    }

    validateMyValueRelationRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        return this.validateValueRelationRules(values, PDocRecord.pdocValidationRelationNames, errors, fieldPrefix, errFieldPrefix);
    }

    validateMyRelationRules(doc: BaseEntityRecord, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        return this.validateRelationRules(doc, PDocRecord.pdocRelationNames, errors, fieldPrefix, errFieldPrefix);
    }

    protected validateRelationDoc(relation: string, doc: BaseEntityRecord, errFieldPrefix?: string): string[] {
        switch (relation) {
            default:
                return super.validateRelationDoc(relation, doc, errFieldPrefix);
        }
    };

    protected validateValueRelationDoc(relation: string, values: {}, fieldPrefix?: string, errFieldPrefix?: string): string[] {
        switch (relation) {
            default:
                return super.validateValueRelationDoc(relation, values, fieldPrefix, errFieldPrefix);
        }
    };
}

