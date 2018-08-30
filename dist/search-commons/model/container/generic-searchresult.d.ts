import { Record } from 'js-data';
import { GenericSearchForm } from '../forms/generic-searchform';
import { Facets } from './facets';
export declare class GenericSearchResult<R extends Record, F extends GenericSearchForm> {
    currentRecords: R[];
    recordCount: number;
    searchForm: F;
    facets: Facets;
    constructor(searchForm: F, recordCount: number, currentRecords: R[], facets: Facets);
    toString(): string;
}
