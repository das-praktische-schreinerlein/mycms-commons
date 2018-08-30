import { Facets } from '../model/container/facets';
export declare class SearchParameterUtils {
    constructor();
    extractFacetValues(facets: Facets, facetName: string, valuePrefix: string, labelPrefix: string): any[];
    extractFacetSelectLimit(facets: Facets, facetName: string): number;
    splitValuesByPrefixes(src: string, splitter: string, prefixes: string[]): Map<string, string[]>;
    joinValuesAndReplacePrefix(values: string[], prefix: string, joiner: string): string;
    replacePlaceHolder(value: any, regEx: RegExp, replacement: string): any;
    useValueDefaultOrFallback(value: any, defaultValue: any, fallback: any): any;
    useValueOrDefault(value: any, defaultValue: any): any;
    joinParamsToOneRouteParameter(paramsToJoin: Map<string, string>, joiner: string): string;
    escapeHtml(unsafe: any): string;
}
