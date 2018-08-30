import { GenericSearchForm } from '../model/forms/generic-searchform';
export interface AdapterQuery {
    where?: {};
    additionalWhere?: {};
    spatial?: {
        geo_loc_p: {
            nearby: string;
        };
    };
    loadTrack: any;
}
export interface AdapterOpts {
    limit?: number;
    offset?: number;
    originalSearchForm?: GenericSearchForm;
    showFacets?: any;
}
export declare class AdapterFilterActions {
    static LIKEI: string;
    static LIKE: string;
    static EQ1: string;
    static EQ2: string;
    static GT: string;
    static GE: string;
    static LT: string;
    static LE: string;
    static IN: string;
    static IN_NUMBER: string;
    static IN_CSV: string;
    static LIKEIN: string;
    static NOTIN: string;
}
export declare class MapperUtils {
    mapToAdapterFieldName(mapping: {}, fieldName: string): string;
    getMappedAdapterValue(mapping: {}, adapterDocument: any, adapterFieldName: string, defaultValue: any): string;
    getMappedAdapterNumberValue(mapping: {}, adapterDocument: any, adapterFieldName: string, defaultValue: any): number;
    getMappedAdapterDateTimeValue(mapping: {}, adapterDocument: any, adapterFieldName: string, defaultValue: any): number;
    getAdapterValue(adapterDocument: any, adapterFieldName: string, defaultValue: any): string;
    getAdapterNumberValue(adapterDocument: any, adapterFieldName: string, defaultValue: any): number;
    getAdapterDateTimeValue(adapterDocument: any, adapterFieldName: string, defaultValue: any): number;
    getAdapterCoorValue(adapterDocument: any, adapterFieldName: string, defaultValue: any): string;
    prepareEscapedSingleValue(value: any, splitter: string, joiner: string): string;
    prepareSingleValue(value: any, joiner: string): string;
    prepareValueToArray(value: any, splitter: string): string[];
    escapeAdapterValue(value: any): string;
    splitPairs(arr: Array<any>): Array<Array<any>>;
}
