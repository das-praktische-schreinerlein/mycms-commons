import { GenericSearchForm } from '../model/forms/generic-searchform';
export interface HumanReadableFilter {
    id: string;
    prefix: string;
    values: string[];
}
export interface GenericSearchFormConverter<F extends GenericSearchForm> {
    searchFormToUrl(baseUrl: string, searchForm: F): string;
    paramsToSearchForm(params: any, defaults: {}, searchForm: F, queryParams?: {}): void;
    isValid(searchForm: F): boolean;
    newSearchForm(valzes: {}): F;
    searchFormToHumanReadableFilter(searchForm: F): HumanReadableFilter[];
    searchFormToValueMap(searchForm: F): {
        [key: string]: string;
    };
    getHrdIds(): {};
}
