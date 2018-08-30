import { GenericSearchForm, GenericSearchFormFieldConfig } from '../../../search-commons/model/forms/generic-searchform';
export declare class PDocSearchForm extends GenericSearchForm {
    static pdocFields: {
        what: GenericSearchFormFieldConfig;
        moreFilter: GenericSearchFormFieldConfig;
        type: GenericSearchFormFieldConfig;
    };
    what: string;
    moreFilter: string;
    type: string;
    constructor(values: {});
    toString(): string;
}
