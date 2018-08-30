import { GenericSearchForm, GenericSearchFormFieldConfig } from './generic-searchform';
export declare class CommonDocSearchForm extends GenericSearchForm {
    static cdocFields: {
        when: GenericSearchFormFieldConfig;
        what: GenericSearchFormFieldConfig;
        moreFilter: GenericSearchFormFieldConfig;
        playlists: GenericSearchFormFieldConfig;
        theme: GenericSearchFormFieldConfig;
        type: GenericSearchFormFieldConfig;
    };
    when: string;
    what: string;
    moreFilter: string;
    playlists: string;
    theme: string;
    type: string;
    constructor(values: {});
    toString(): string;
}
export declare class CommonDocSearchFormFactory {
    static createSanitized(values: {}): CommonDocSearchForm;
    static cloneSanitized(searchForm: CommonDocSearchForm): CommonDocSearchForm;
}
export declare class CommonDocSearchFormValidator {
    static isValidValues(values: {}): boolean;
    static isValid(searchForm: CommonDocSearchForm): boolean;
}
