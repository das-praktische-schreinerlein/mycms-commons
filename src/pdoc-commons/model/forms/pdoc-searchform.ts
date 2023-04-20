import {
    CommonDocSearchForm,
    CommonDocSearchFormFactory,
    CommonDocSearchFormValidator
} from "../../../search-commons/model/forms/cdoc-searchform";

export class PDocSearchForm extends CommonDocSearchForm {

    // TODO filter by locale
    // TODO filter by profiles
    // TODO filter by permissions

    static pdocFields = {
    };

    constructor(values: {}) {
        super(values);
    }

    toString() {
        return 'PDocSearchForm {\n' +
            '  what: ' + this.what + '\n' +
            '  fulltext: ' + this.fulltext + '\n' +
            '  type: ' + this.type + '\n' +
            '  sort: ' + this.sort + '\n' +
            '  perPage: ' + this.perPage + '\n' +
            '  pageNum: ' + this.pageNum + '' +
            '}';
    }
}

export class PDocSearchFormFactory {
    static getSanitizedValues(values: {}): any  {
        const sanitizedValues = CommonDocSearchFormFactory.getSanitizedValues(values);

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

        return state;
    }

    static isValid(searchForm: PDocSearchForm): boolean {
        return PDocSearchFormValidator.isValidValues(searchForm);
    }
}
