"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractDetectorResultCacheService = /** @class */ (function () {
    function AbstractDetectorResultCacheService(readOnly, forceUpdate) {
        this.readonly = readOnly;
        this.forceUpdate = forceUpdate;
    }
    AbstractDetectorResultCacheService.prototype.getImageCacheEntry = function (detectorResultCache, detectorId, imagePath) {
        if (this.forceUpdate) {
            return;
        }
        if (!detectorResultCache) {
            return null;
        }
        if (detectorResultCache.detectors[detectorId] && detectorResultCache.detectors[detectorId].images[imagePath]) {
            return detectorResultCache.detectors[detectorId].images[imagePath];
        }
        return null;
    };
    AbstractDetectorResultCacheService.prototype.setImageCacheEntry = function (detectorResultCache, detectorId, imagePath, detectedObjects) {
        if (this.readonly) {
            return;
        }
        if (!detectorResultCache) {
            return null;
        }
        if (!detectorResultCache.detectors[detectorId]) {
            detectorResultCache.detectors[detectorId] = {
                detectorId: detectorId,
                updateDate: new Date(),
                images: {}
            };
        }
        if (!detectorResultCache.detectors[detectorId].images[imagePath]) {
            detectorResultCache.detectors[detectorId].images[imagePath] = {
                imagePath: imagePath,
                updateDate: new Date(),
                results: []
            };
        }
        detectorResultCache.detectors[detectorId].updateDate = new Date();
        detectorResultCache.detectors[detectorId].images[imagePath].updateDate = new Date();
        detectorResultCache.detectors[detectorId].images[imagePath].results = detectedObjects;
        return null;
    };
    return AbstractDetectorResultCacheService;
}());
exports.AbstractDetectorResultCacheService = AbstractDetectorResultCacheService;
//# sourceMappingURL=objectdetectionresult-cache.js.map