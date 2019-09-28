"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = require("js-data");
var AbstractFacetCacheManagerCommand = /** @class */ (function () {
    function AbstractFacetCacheManagerCommand() {
    }
    AbstractFacetCacheManagerCommand.prototype.process = function (argv) {
        var _this = this;
        var facetCacheManager = this.configureCommonFacetCacheService(argv);
        var action = argv['action'];
        var promise;
        switch (action) {
            case 'prepareAndStartDatabaseManagedFacets':
                try {
                    promise = facetCacheManager.stopAndDropDatabaseManagedFacets().then(function () {
                        return facetCacheManager.dropDatabaseRequirements();
                    }).then(function () {
                        return facetCacheManager.createDatabaseRequirements();
                    }).then(function () {
                        return facetCacheManager.createAndStartDatabaseManagedFacets();
                    }).then(function () {
                        // clear facetcache-database
                        process.on('SIGTERM', function () {
                            console.error('closing cache server: removing database-requirements');
                            return _this.clearFacetCacheOnShutdown(facetCacheManager);
                        });
                        // wait till sighup
                        return new Promise(function () { });
                    });
                }
                catch (err) {
                    // cleaning database
                    return this.clearFacetCacheOnShutdown(facetCacheManager).then(function () {
                        return js_data_1.utils.reject(err);
                    }).catch(function (reason) {
                        console.error('error while closing cachserver', reason);
                        return js_data_1.utils.reject(err);
                    });
                }
                break;
            case 'prepareAndStartServerManagedFacets':
                try {
                    promise = facetCacheManager.dropServerManagedFacets().then(function () {
                        return facetCacheManager.dropDatabaseRequirements();
                    }).then(function () {
                        return facetCacheManager.createDatabaseRequirements();
                    }).then(function () {
                        return facetCacheManager.createAndStartServerManagedFacets();
                    }).then(function () {
                        // clear facetcache-database
                        process.on('SIGTERM', function () {
                            console.error('closing cache server: removing database-requirements');
                            return _this.clearFacetCacheOnShutdown(facetCacheManager);
                        });
                        // wait till sighup
                        return new Promise(function () { });
                    });
                }
                catch (err) {
                    // cleaning database
                    return this.clearFacetCacheOnShutdown(facetCacheManager).then(function () {
                        return js_data_1.utils.reject(err);
                    }).catch(function (reason) {
                        console.error('error while closing cachserver', reason);
                        return js_data_1.utils.reject(err);
                    });
                }
                break;
            case 'dropDatabaseRequirements':
                try {
                    promise = facetCacheManager.dropDatabaseRequirements();
                }
                catch (err) {
                    return js_data_1.utils.reject(err);
                }
                break;
            case 'createDatabaseRequirements':
                try {
                    promise = facetCacheManager.createDatabaseRequirements();
                }
                catch (err) {
                    return js_data_1.utils.reject(err);
                }
                break;
            case 'showCreateDatabaseRequirementsSql':
                try {
                    console.log(facetCacheManager.showCreateDatabaseRequirements());
                    promise = js_data_1.utils.resolve(true);
                }
                catch (err) {
                    return js_data_1.utils.reject(err);
                }
                break;
            case 'showDropDatabaseRequirementsSql':
                try {
                    console.log(facetCacheManager.showDropDatabaseRequirements());
                    promise = js_data_1.utils.resolve(true);
                }
                catch (err) {
                    return js_data_1.utils.reject(err);
                }
                break;
            case 'stopAndDropDatabaseManagedFacets':
                try {
                    promise = facetCacheManager.stopAndDropDatabaseManagedFacets();
                }
                catch (err) {
                    return js_data_1.utils.reject(err);
                }
                break;
            case 'showStopAndDropDatabaseManagedFacets':
                try {
                    console.log(facetCacheManager.showStopAndDropDatabaseManagedFacets());
                    promise = js_data_1.utils.resolve(true);
                }
                catch (err) {
                    return js_data_1.utils.reject(err);
                }
                break;
            case 'createAndStartDatabaseManagedFacets':
                try {
                    promise = facetCacheManager.createAndStartDatabaseManagedFacets().then(function () {
                        // clear facetcache-database
                        process.on('SIGTERM', function () {
                            console.error('closing cache server: removing facets');
                            return _this.clearFacetsOnShutdown(facetCacheManager);
                        });
                        // wait till sighup
                        return new Promise(function () { });
                    });
                }
                catch (err) {
                    return this.clearFacetsOnShutdown(facetCacheManager).then(function () {
                        return js_data_1.utils.reject(err);
                    }).catch(function (reason) {
                        console.error('error while closing cacheserver', reason);
                        return js_data_1.utils.reject(err);
                    });
                }
                break;
            case 'showCreateAndStartDatabaseManagedFacets':
                try {
                    console.log(facetCacheManager.showCreateAndStartDatabaseManagedFacets());
                    promise = js_data_1.utils.resolve(true);
                }
                catch (err) {
                    return js_data_1.utils.reject(err);
                }
                break;
            case 'dropServerManagedFacets':
                try {
                    promise = facetCacheManager.dropServerManagedFacets();
                }
                catch (err) {
                    return js_data_1.utils.reject(err);
                }
                break;
            case 'showDropDatabaseManagedFacets':
                try {
                    console.log(facetCacheManager.showDropServerManagedFacets());
                    promise = js_data_1.utils.resolve(true);
                }
                catch (err) {
                    return js_data_1.utils.reject(err);
                }
                break;
            case 'createAndStartServerManagedFacets':
                try {
                    promise = facetCacheManager.createAndStartServerManagedFacets().then(function () {
                        // clear facetcache-database
                        process.on('SIGTERM', function () {
                            console.error('closing cache server: removing facets');
                            return _this.clearFacetsOnShutdown(facetCacheManager);
                        });
                        // wait till sighup
                        return new Promise(function () { });
                    });
                }
                catch (err) {
                    return this.clearFacetsOnShutdown(facetCacheManager).then(function () {
                        return js_data_1.utils.reject(err);
                    }).catch(function (reason) {
                        console.error('error while closing cacheserver', reason);
                        return js_data_1.utils.reject(err);
                    });
                }
                break;
            case 'startServerManagedFacets':
                try {
                    promise = facetCacheManager.startServerManagedFacets();
                }
                catch (err) {
                    return js_data_1.utils.reject(err);
                }
                break;
            case 'showCreateServerManagedFacets':
                try {
                    console.log(facetCacheManager.showCreateServerManagedFacets());
                    promise = js_data_1.utils.resolve(true);
                }
                catch (err) {
                    return js_data_1.utils.reject(err);
                }
                break;
            case 'removedFacetsCacheConfigs':
                try {
                    promise = facetCacheManager.removeFacetsCacheConfigs();
                }
                catch (err) {
                    return js_data_1.utils.reject(err);
                }
                break;
            case 'createFacetsCacheConfigs':
                try {
                    promise = facetCacheManager.createFacetsCacheConfigs();
                }
                catch (err) {
                    return js_data_1.utils.reject(err);
                }
                break;
            default:
                console.error('unknown action:', argv);
                promise = js_data_1.utils.reject('unknown action');
        }
        return promise;
    };
    AbstractFacetCacheManagerCommand.prototype.clearFacetCacheOnShutdown = function (facetCacheManager) {
        try {
            return this.clearFacetsOnShutdown(facetCacheManager).then(function () {
                return facetCacheManager.dropDatabaseRequirements();
            });
        }
        catch (err) {
            return js_data_1.utils.reject(err);
        }
    };
    AbstractFacetCacheManagerCommand.prototype.clearFacetsOnShutdown = function (facetCacheManager) {
        try {
            return facetCacheManager.stopAndDropDatabaseManagedFacets();
        }
        catch (err) {
            return js_data_1.utils.reject(err);
        }
    };
    return AbstractFacetCacheManagerCommand;
}());
exports.AbstractFacetCacheManagerCommand = AbstractFacetCacheManagerCommand;
//# sourceMappingURL=abstract-facetcache.command.js.map