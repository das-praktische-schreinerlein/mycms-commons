export declare type FacetValueType = 'number' | 'date' | 'string';
export declare class Facet {
    facet: Array<Array<any>>;
    selectLimit?: number;
}
export declare class Facets {
    facets: Map<string, Facet>;
}
export declare class FacetUtils {
    static calcFacetValueType(valueType: FacetValueType): FacetValueType;
    static generateFacetCacheKey(tableKey: string, facetKey: string): string;
}
