import {
    CommonDocSearchForm,
    CommonDocSearchFormFactory,
    CommonDocSearchFormValidator
} from "../../../search-commons/model/forms/cdoc-searchform";
import {GenericSearchFormFieldConfig} from '../../../search-commons/model/forms/generic-searchform';
import {
    GenericValidatorDatatypes,
    IdCsvValidationRule
} from '../../../search-commons/model/forms/generic-validator.util';

export class PDocSearchForm extends CommonDocSearchForm {

    static pdocFields = {
        flags: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        key: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        langkeys: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        profiles: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        subtype: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false))
    };

    flags: string;
    key: string;
    langkeys: string;
    profiles: string;
    subtype: string;

    constructor(values: {}) {
        super(values);
        this.flags = values['flags'] || '';
        this.key = values['key'] || '';
        this.langkeys = values['langkeys'] || '';
        this.profiles = values['profiles'] || '';
        this.subtype = values['subtype'] || '';
    }

    toString() {
        return 'PDocSearchForm {\n' +
            '  what: ' + this.what + '\n' +
            '  fulltext: ' + this.fulltext + '\n' +
            '  type: ' + this.type + '\n' +
            '  subtype: ' + this.subtype + '\n' +
            '  sort: ' + this.sort + '\n' +
            '  perPage: ' + this.perPage + '\n' +
            '  pageNum: ' + this.pageNum + '' +
            '}';
    }
}

export class PDocSearchFormFactory {
    static getSanitizedValues(values: {}): any  {
        const sanitizedValues = CommonDocSearchFormFactory.getSanitizedValues(values);

        sanitizedValues.flags = PDocSearchForm.pdocFields.flags.validator.sanitize(values['flags']) || '';
        sanitizedValues.key = PDocSearchForm.pdocFields.key.validator.sanitize(values['key']) || '';
        sanitizedValues.langkeys = PDocSearchForm.pdocFields.langkeys.validator.sanitize(values['langkeys']) || '';
        sanitizedValues.profiles = PDocSearchForm.pdocFields.profiles.validator.sanitize(values['profiles']) || '';
        sanitizedValues.subtype = PDocSearchForm.pdocFields.subtype.validator.sanitize(values['subtype']) || '';

        return sanitizedValues;
    }

    static getSanitizedValuesFromForm(searchForm: PDocSearchForm): any {
        return PDocSearchFormFactory.getSanitizedValues(searchForm);
    }

    static createSanitized(values: {}): PDocSearchForm {
        const sanitizedValues = PDocSearchFormFactory.getSanitizedValues(values);

        return new PDocSearchForm(sanitizedValues);
    }

    static cloneSanitized(searchForm: PDocSearchForm): PDocSearchForm {
        const sanitizedValues = PDocSearchFormFactory.getSanitizedValuesFromForm(searchForm);

        return new PDocSearchForm(sanitizedValues);
    }
}

export class PDocSearchFormValidator {
    static isValidValues(values: {}): boolean {
        let state = CommonDocSearchFormValidator.isValidValues(values);

        state = PDocSearchForm.pdocFields.flags.validator.isValid(values['flags']) && state;
        state = PDocSearchForm.pdocFields.key.validator.isValid(values['key']) && state;
        state = PDocSearchForm.pdocFields.langkeys.validator.isValid(values['langkeys']) && state;
        state = PDocSearchForm.pdocFields.profiles.validator.isValid(values['profiles']) && state;
        state = PDocSearchForm.pdocFields.subtype.validator.isValid(values['subtype']) && state;

        return state;
    }

    static isValid(searchForm: PDocSearchForm): boolean {
        return PDocSearchFormValidator.isValidValues(searchForm);
    }
}
