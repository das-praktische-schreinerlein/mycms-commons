import { FacetCacheUsageConfigurations, SqlQueryBuilder, TableConfig, TableConfigs } from './sql-query.builder';
import { FacetCacheConfiguration } from '../../facetcache-commons/model/facetcache.configuration';
export declare class FacetCacheUtils {
    static createCommonFacetCacheConfigurations(sqlQueryBuilder: SqlQueryBuilder, tableConfigs: TableConfigs, facetCacheUsageConfigurations: FacetCacheUsageConfigurations): FacetCacheConfiguration[];
    static createCommonFacetCacheConfiguration(sqlQueryBuilder: SqlQueryBuilder, tableConfig: TableConfig, facetKey: string, facetCacheUsageConfigurations: FacetCacheUsageConfigurations): FacetCacheConfiguration;
}
