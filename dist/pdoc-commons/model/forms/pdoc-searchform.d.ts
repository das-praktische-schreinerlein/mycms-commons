import { CommonDocSearchForm } from "../../../search-commons/model/forms/cdoc-searchform";
export declare class PDocSearchForm extends CommonDocSearchForm {
    static pdocFields: {};
    constructor(values: {});
    toString(): string;
}
export declare class PDocSearchFormFactory {
    static getSanitizedValues(values: {}): any;
    static getSanitizedValuesFromForm(searchForm: PDocSearchForm): any;
    static createSanitized(values: {}): PDocSearchForm;
    static cloneSanitized(searchForm: PDocSearchForm): PDocSearchForm;
}
export declare class PDocSearchFormValidator {
    static isValidValues(values: {}): boolean;
    static isValid(searchForm: PDocSearchForm): boolean;
}
