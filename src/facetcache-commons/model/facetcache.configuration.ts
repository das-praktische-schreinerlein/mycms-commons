export interface FacetCacheConfiguration {
    longKey: string;
    shortKey: string;
    name: string;
    facetSql: string;
    withLabel: boolean;
    withId: boolean;
    orderBy: string;
    valueType: 'string' | 'number' | 'date';
    triggerTables: string[];
}

export interface FacetCacheServiceConfiguration {
    datastore: {
        scriptPath: string;
    };
    facets: FacetCacheConfiguration[];
    checkInterval: number;
}

