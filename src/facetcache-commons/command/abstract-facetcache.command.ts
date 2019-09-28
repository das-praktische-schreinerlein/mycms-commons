import {utils} from 'js-data';
import {FacetCacheService} from '../service/facetcache.service';

export abstract class AbstractFacetCacheManagerCommand {
    public process(argv): Promise<any> {
        const facetCacheManager = this.configureCommonFacetCacheService(argv);
        const action = argv['action'];

        let promise: Promise<any>;
        switch (action) {
            case 'prepareAndStartDatabaseManagedFacets':
                try {
                    promise = facetCacheManager.stopAndDropDatabaseManagedFacets().then(() => {
                        return facetCacheManager.dropDatabaseRequirements();
                    }).then(() => {
                        return facetCacheManager.createDatabaseRequirements();
                    }).then(() => {
                        return facetCacheManager.createAndStartDatabaseManagedFacets();
                    }).then(() => {
                        // clear facetcache-database
                        process.on('SIGTERM', () => {
                            console.error('closing cache server: removing database-requirements');
                            return this.clearFacetCacheOnShutdown(facetCacheManager);
                        });

                        // wait till sighup
                        return new Promise<boolean>(() => {});
                    });
                } catch (err) {
                    // cleaning database
                    return this.clearFacetCacheOnShutdown(facetCacheManager).then(() => {
                        return utils.reject(err);
                    }).catch(reason => {
                        console.error('error while closing cachserver', reason);
                        return utils.reject(err);
                    });
                }

                break;
            case 'prepareAndStartServerManagedFacets':
                try {
                    promise = facetCacheManager.dropServerManagedFacets().then(() => {
                        return facetCacheManager.dropDatabaseRequirements();
                    }).then(() => {
                        return facetCacheManager.createDatabaseRequirements();
                    }).then(() => {
                        return facetCacheManager.createAndStartServerManagedFacets();
                    }).then(() => {
                        // clear facetcache-database
                        process.on('SIGTERM', () => {
                            console.error('closing cache server: removing database-requirements');
                            return this.clearFacetCacheOnShutdown(facetCacheManager);
                        });

                        // wait till sighup
                        return new Promise<boolean>(() => {});
                    });
                } catch (err) {
                    // cleaning database
                    return this.clearFacetCacheOnShutdown(facetCacheManager).then(() => {
                        return utils.reject(err);
                    }).catch(reason => {
                        console.error('error while closing cachserver', reason);
                        return utils.reject(err);
                    });
                }

                break;
            case 'dropDatabaseRequirements':
                try {
                    promise = facetCacheManager.dropDatabaseRequirements();
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'createDatabaseRequirements':
                try {
                    promise = facetCacheManager.createDatabaseRequirements();
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'showCreateDatabaseRequirementsSql':
                try {
                    console.log(facetCacheManager.showCreateDatabaseRequirements());
                    promise = utils.resolve(true);
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'showDropDatabaseRequirementsSql':
                try {
                    console.log(facetCacheManager.showDropDatabaseRequirements());
                    promise = utils.resolve(true);
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'stopAndDropDatabaseManagedFacets':
                try {
                    promise = facetCacheManager.stopAndDropDatabaseManagedFacets();
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'showStopAndDropDatabaseManagedFacets':
                try {
                    console.log(facetCacheManager.showStopAndDropDatabaseManagedFacets());
                    promise = utils.resolve(true);
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'createAndStartDatabaseManagedFacets':
                try {
                    promise = facetCacheManager.createAndStartDatabaseManagedFacets().then(() => {
                        // clear facetcache-database
                        process.on('SIGTERM', () => {
                            console.error('closing cache server: removing facets');
                            return this.clearFacetsOnShutdown(facetCacheManager);
                        });

                        // wait till sighup
                        return new Promise<boolean>(() => {});
                    });
                } catch (err) {
                    return this.clearFacetsOnShutdown(facetCacheManager).then(() => {
                        return utils.reject(err);
                    }).catch(reason => {
                        console.error('error while closing cacheserver', reason);
                        return utils.reject(err);
                    });
                }
                break;
            case 'showCreateAndStartDatabaseManagedFacets':
                try {
                    console.log(facetCacheManager.showCreateAndStartDatabaseManagedFacets());
                    promise = utils.resolve(true);
                } catch (err) {
                    return utils.reject(err);
                }

                break;



            case 'dropServerManagedFacets':
                try {
                    promise = facetCacheManager.dropServerManagedFacets();
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'showDropDatabaseManagedFacets':
                try {
                    console.log(facetCacheManager.showDropServerManagedFacets());
                    promise = utils.resolve(true);
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'createAndStartServerManagedFacets':
                try {
                    promise = facetCacheManager.createAndStartServerManagedFacets().then(() => {
                        // clear facetcache-database
                        process.on('SIGTERM', () => {
                            console.error('closing cache server: removing facets');
                            return this.clearFacetsOnShutdown(facetCacheManager);
                        });

                        // wait till sighup
                        return new Promise<boolean>(() => {});
                    });
                } catch (err) {
                    return this.clearFacetsOnShutdown(facetCacheManager).then(() => {
                        return utils.reject(err);
                    }).catch(reason => {
                        console.error('error while closing cacheserver', reason);
                        return utils.reject(err);
                    });
                }
                break;
            case 'startServerManagedFacets':
                try {
                    promise = facetCacheManager.startServerManagedFacets();
                } catch (err) {
                    return utils.reject(err);
                }
                break;
            case 'showCreateServerManagedFacets':
                try {
                    console.log(facetCacheManager.showCreateServerManagedFacets());
                    promise = utils.resolve(true);
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'removedFacetsCacheConfigs':
                try {
                    promise = facetCacheManager.removeFacetsCacheConfigs();
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'createFacetsCacheConfigs':
                try {
                    promise = facetCacheManager.createFacetsCacheConfigs();
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            default:
                console.error('unknown action:', argv);
                promise = utils.reject('unknown action');
        }

        return promise;
    }

    protected clearFacetCacheOnShutdown(facetCacheManager: FacetCacheService): Promise<any> {
        try {
            return this.clearFacetsOnShutdown(facetCacheManager).then(() => {
                return facetCacheManager.dropDatabaseRequirements();
            });
        } catch (err) {
            return utils.reject(err);
        }
    }

    protected clearFacetsOnShutdown(facetCacheManager: FacetCacheService): Promise<any> {
        try {
            return facetCacheManager.stopAndDropDatabaseManagedFacets();
        } catch (err) {
            return utils.reject(err);
        }
    }

    protected abstract configureCommonFacetCacheService(argv: string[]): FacetCacheService;
}
