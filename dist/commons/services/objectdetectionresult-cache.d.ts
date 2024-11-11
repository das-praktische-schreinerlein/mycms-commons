import { ObjectDetectionDetectedObjectType } from '../model/objectdetection-model';
export interface DetectorResultCacheEntry {
    imagePath: string;
    updateDate: Date;
    results: ObjectDetectionDetectedObjectType[];
}
export interface DetectorResultCacheEntries {
    [index: string]: DetectorResultCacheEntry;
}
export interface DetectorResultsCacheEntry {
    detectorId: string;
    updateDate: Date;
    images: DetectorResultCacheEntries;
}
export interface DetectorResultsCacheEntries {
    [index: string]: DetectorResultsCacheEntry;
}
export interface DetectorResultsCacheType {
    version: string;
    updateDate: Date;
    detectors: DetectorResultsCacheEntries;
}
export declare abstract class AbstractDetectorResultCacheService {
    protected readonly readonly: boolean;
    protected readonly forceUpdate: boolean;
    constructor(readOnly: boolean, forceUpdate: boolean);
    abstract readImageCache(imagePath: string, returnEmtyIfNotExists: boolean): Promise<DetectorResultsCacheType>;
    abstract writeImageCache(imagePath: string, detectorResultCache: DetectorResultsCacheType): Promise<boolean>;
    getImageCacheEntry(detectorResultCache: DetectorResultsCacheType, detectorId: string, imagePath: string): DetectorResultCacheEntry;
    setImageCacheEntry(detectorResultCache: DetectorResultsCacheType, detectorId: string, imagePath: string, detectedObjects: ObjectDetectionDetectedObjectType[]): DetectorResultsCacheType;
}
