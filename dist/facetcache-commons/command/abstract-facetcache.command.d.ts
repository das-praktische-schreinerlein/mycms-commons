import { FacetCacheService } from '../service/facetcache.service';
export declare abstract class AbstractFacetCacheManagerCommand {
    process(argv: any): Promise<any>;
    protected clearFacetCacheOnShutdown(facetCacheManager: FacetCacheService): Promise<any>;
    protected clearFacetsOnShutdown(facetCacheManager: FacetCacheService): Promise<any>;
    protected abstract configureCommonFacetCacheService(argv: string[]): FacetCacheService;
}
