import {AdapterFilterActions, AdapterOpts, AdapterQuery, MapperUtils} from './mapper.utils';
import {LogUtils} from '../../commons/utils/log.utils';

export interface ItemsJsSelectSpatialQueryData {
    lat: number;
    lng: number;
    distance: number;
}

export interface ItemsJsSelectQueryData {
    page: number;
    per_page: number;
    sort?: string;
    filters?: {};
    spatialQuery?: ItemsJsSelectSpatialQueryData;
    query: string;
}

export interface ItemsJsConfig {
    searchableFields: string[];
    aggregations: {};
    sortings: {};
    filterMapping: {};
    fieldMapping: {};
    spatialField?: string;
    spatialSortKey?: string;
}

export class ItemsJsQueryBuilder {
    protected mapperUtils = new MapperUtils();

    public queryTransformToAdapterSelectQuery(itemsJsConfig: ItemsJsConfig, method: string, adapterQuery: AdapterQuery,
                                              adapterOpts: AdapterOpts): ItemsJsSelectQueryData {

        const query = this.createAdapterSelectQuery(itemsJsConfig, method, adapterQuery, adapterOpts);

        // for debug only: const facetParams = this.getFacetParams(itemsJsConfig, adapterOpts);
        // for debug only: const spatialParams = this.getSpatialParams(itemsJsConfig, adapterQuery);

        const spatialParams = this.getSpatialParams(itemsJsConfig, adapterQuery);
        if (spatialParams !== undefined) {
            query.spatialQuery = spatialParams;
        }

        const sorts = this.getSortParams(itemsJsConfig, method, adapterQuery, adapterOpts);
        if (sorts !== undefined && sorts.length > 0) {
            query.sort = sorts;
        }

        // console.log('itemsJsQuery:', query);

        return query;
    }

    public isSpatialQuery(itemsJsConfig: ItemsJsConfig, adapterQuery: AdapterQuery): boolean {
        if (adapterQuery !== undefined && adapterQuery.spatial !== undefined && adapterQuery.spatial.geo_loc_p !== undefined &&
            adapterQuery.spatial.geo_loc_p.nearby !== undefined && itemsJsConfig.spatialField !== undefined) {
            return true;
        }

        return false;
    }

    protected createAdapterSelectQuery(itemsJsConfig: ItemsJsConfig, method: string, adapterQuery: AdapterQuery,
                                       adapterOpts: AdapterOpts): ItemsJsSelectQueryData {
        // console.log('createAdapterSelectQuery adapterQuery:', adapterQuery);
        // console.log('createAdapterSelectQuery adapterOpts:', adapterOpts);

        const newParams = {};
        if (adapterQuery.where) {
            for (const fieldName of Object.getOwnPropertyNames(adapterQuery.where)) {
                const filter = adapterQuery.where[fieldName];
                const action = Object.getOwnPropertyNames(filter)[0];
                const value = adapterQuery.where[fieldName][action];
                Object.assign(newParams, this.mapFilterToAdapterQuery(itemsJsConfig, fieldName, action, value));
            }
        }
        if (adapterQuery.additionalWhere) {
            for (const fieldName of Object.getOwnPropertyNames(adapterQuery.additionalWhere)) {
                const filter = adapterQuery.additionalWhere[fieldName];
                const action = Object.getOwnPropertyNames(filter)[0];
                const value = adapterQuery.additionalWhere[fieldName][action];
                Object.assign(newParams, this.mapFilterToAdapterQuery(itemsJsConfig, fieldName, action, value));
            }
        }

        const query: ItemsJsSelectQueryData = {
            query: '',
            page: adapterOpts.offset + 1,
            per_page: adapterOpts.limit,
            filters: newParams
        };

        // console.log('createAdapterSelectQuery result:', query);
        return query;
    }

    protected getSortParams(itemsJsConfig: ItemsJsConfig, method: string, adapterQuery: AdapterQuery,
                            adapterOpts: AdapterOpts): string {
        const form = adapterOpts.originalSearchForm;
        const sortMapping = itemsJsConfig.sortings;
        let sortKey: string;
        if (form && form.sort) {
            sortKey = form.sort;
        }
        // ignore distance-sort if not spatial-search
        if (!this.isSpatialQuery(itemsJsConfig, adapterQuery) && itemsJsConfig.spatialField !== undefined &&
            itemsJsConfig.spatialSortKey === sortKey) {
            sortKey = 'relevance';
        }
        if (sortKey === undefined || sortKey.length < 1)  {
            sortKey = 'relevance';
        }

        if (!sortMapping.hasOwnProperty(sortKey)) {
            sortKey = 'relevance';
        }

        return sortKey;
    }

    protected getSpatialParams(itemsJsConfig: ItemsJsConfig, adapterQuery: AdapterQuery): ItemsJsSelectSpatialQueryData {
        if (!this.isSpatialQuery(itemsJsConfig, adapterQuery)) {
            return undefined;
        }

        const [lat, lng, distance] = this.mapperUtils.escapeAdapterValue(adapterQuery.spatial.geo_loc_p.nearby).split(/_/);
        const spatialParams = {
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            distance: parseFloat(distance)
        };

        return spatialParams;
    }

    protected getAdapterSelectFields(itemsJsConfig: ItemsJsConfig, method: string, adapterQuery: AdapterQuery): string[] {
        const fields = itemsJsConfig.searchableFields.slice(0);

        if (adapterQuery !== undefined && adapterQuery.spatial !== undefined && adapterQuery.spatial.geo_loc_p !== undefined &&
            adapterQuery.spatial.geo_loc_p.nearby !== undefined) {
            fields.push('distance');
        }
        if (adapterQuery.loadTrack === true) {
            fields.push('gpstrack_src_s');
        }

        return fields;
    }

    protected getFacetParams(itemsJsConfig: ItemsJsConfig, adapterOpts: AdapterOpts): Map<string, any> {
        const facetConfigs = itemsJsConfig.aggregations;

        const facetParams = new Map<string, any>();
        const facets = [];
        for (const key in facetConfigs) {
            if (adapterOpts.showFacets === true || (adapterOpts.showFacets instanceof Array && adapterOpts.showFacets.indexOf(key) >= 0)) {
                facets.push(key);
                for (const paramKey in facetConfigs[key]) {
                    facetParams.set(paramKey, facetConfigs[key][paramKey]);
                }
            }
        }

        if (facets.length > 0) {
            facetParams.set('facet', 'on');
            facetParams.set('facet.field', facets);
        }

        return facetParams;
    }

    protected mapToAdapterFieldName(itemsJsConfig: ItemsJsConfig, fieldName: string): string {
        switch (fieldName) { // NOSONAR: is template for depended
            default:
                break;
        }

        return this.mapperUtils.mapToAdapterFieldName(itemsJsConfig.fieldMapping, fieldName);
    }

    protected mapFilterToAdapterQuery(itemsJsConfig: ItemsJsConfig, fieldName: string, action: string, value: any): {} {
        let realFieldName = undefined;

        if (itemsJsConfig.aggregations.hasOwnProperty(fieldName)) {
            if (itemsJsConfig.aggregations[fieldName].noFacet === true) {
                return undefined;
            }

            realFieldName = itemsJsConfig.aggregations[fieldName].selectField || itemsJsConfig.aggregations[fieldName].filterField;
            action = itemsJsConfig.aggregations[fieldName].action || action;
        } else {
            console.debug('WARNING: UNDEFINED_FILTER for itemsjsquery', fieldName, itemsJsConfig);
            realFieldName = 'UNDEFINED_FILTER';
        }

        if (realFieldName === undefined && itemsJsConfig.filterMapping.hasOwnProperty(fieldName)) {
            realFieldName = itemsJsConfig.filterMapping[fieldName];
        }

        if (realFieldName === undefined) {
            realFieldName = this.mapToAdapterFieldName(itemsJsConfig, fieldName);
        }


        return this.generateFilter(realFieldName, action, value);
    }

    protected generateFilter(fieldName: string, action: string, value: any | AdapterFilterActions, throwOnUnknown?: boolean): {} {
        const query = {};

        if (action === AdapterFilterActions.LIKEI || action === AdapterFilterActions.LIKE) {
            throw new Error ('not implemented: ' + LogUtils.sanitizeLogMsg(action));
        } else if (action === AdapterFilterActions.EQ1 || action === AdapterFilterActions.EQ2) {
            query[fieldName] = value;
        } else if (action === AdapterFilterActions.GT) {
            throw new Error ('not implemented: ' + LogUtils.sanitizeLogMsg(action));
        } else if (action === AdapterFilterActions.GE) {
            throw new Error ('not implemented: ' + LogUtils.sanitizeLogMsg(action));
        } else if (action === AdapterFilterActions.LT) {
            throw new Error ('not implemented: ' + LogUtils.sanitizeLogMsg(action));
        } else if (action === AdapterFilterActions.LE) {
            throw new Error ('not implemented: ' + LogUtils.sanitizeLogMsg(action));
        } else if (action === AdapterFilterActions.IN || action === AdapterFilterActions.IN_NUMBER) {
            query[fieldName] = value;
        } else if (action === AdapterFilterActions.NOTIN) {
            throw new Error ('not implemented: ' + LogUtils.sanitizeLogMsg(action));
        } else if (action === AdapterFilterActions.LIKEIN) {
            throw new Error ('not implemented: ' + LogUtils.sanitizeLogMsg(action));
        } else if (action === AdapterFilterActions.IN_CSV) {
            throw new Error ('not implemented:' + LogUtils.sanitizeLogMsg(action));
        } else if (throwOnUnknown) {
            throw new Error('unknown actiontype: ' + LogUtils.sanitizeLogMsg(action));
        }

        return query;
    }
}

