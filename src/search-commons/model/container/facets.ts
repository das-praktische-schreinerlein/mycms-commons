export type FacetValueType = 'number' | 'date' | 'string';
export class Facet {
    public facet: Array<Array<any>> = [];
    public selectLimit?: number;
}

export class Facets {
    public facets: Map<string, Facet> = new Map<string, Facet>();
}

export class FacetUtils {
    public static calcFacetValueType(valueType: FacetValueType): FacetValueType {
        if (valueType === undefined || valueType === null) {
            return 'string'
        }

        return valueType;
    }

    public static generateFacetCacheKey(tableKey: string, facetKey: string): string {
        return tableKey + '_' + facetKey;
    }
}


