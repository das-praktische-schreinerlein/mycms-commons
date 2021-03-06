import {
    ObjectDetectionDetectedObjectType,
    ObjectDetectionRequestType,
    ObjectDetectionResponseType
} from './objectdetection-model';
import {ObjectDetectionEntityDatastoreConfiguration} from './common-sql-object-detection.model';

export interface RequestImageDataType {
    id: string;
    recordId: number;
    fileName: string;
    fileDir: string;
    filePath: string;
    detectors: [string];
}

export interface ObjectDetectionMaxIdPerDetectorType {
    maxId: number;
    detector: string;
}

export interface CommonObjectDetectionProcessingDatastore {
    getObjectDetectionConfiguration(input: ObjectDetectionRequestType): ObjectDetectionEntityDatastoreConfiguration;

    readMaxIdAlreadyDetectedPerDetector(entityType: string, detectorFilterNames: string[]): Promise<ObjectDetectionMaxIdPerDetectorType[]>;

    readRequestImageDataType(entityType: string, detector: string, maxId: number, maxPerRun: number): Promise<RequestImageDataType[]>;

    deleteOldDetectionRequests(detectionRequest: ObjectDetectionRequestType, onlyNotSucceeded: boolean): Promise<any>;

    createDetectionRequest(detectionRequest: ObjectDetectionRequestType, detector: string): Promise<any>;

    createDetectionError(detectionResponse: ObjectDetectionResponseType, detector: string): Promise<any>;

    createDefaultObject(): Promise<any>;

    processDetectionWithResult(detector: string, detectionResult: ObjectDetectionDetectedObjectType,
                               tableConfig: ObjectDetectionEntityDatastoreConfiguration): Promise<any>;

    processDetectionWithoutResult(detector: string, tableConfig: ObjectDetectionEntityDatastoreConfiguration): Promise<any>;
}

