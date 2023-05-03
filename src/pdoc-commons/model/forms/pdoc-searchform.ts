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

    // TODO filter by profile
    // TODO filter by permissions
    static pdocFields = {
        key: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        langkey: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        subtype: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false))
    };

    key: string;
    langkey: string;
    subtype: string;

    constructor(values: {}) {
        super(values);
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

        state = PDocSearchForm.pdocFields.subtype.validator.isValid(values['subtype']) && state;

        return state;
    }

    static isValid(searchForm: PDocSearchForm): boolean {
        return PDocSearchFormValidator.isValidValues(searchForm);
    }
}
