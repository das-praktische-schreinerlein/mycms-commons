import { SqlQueryBuilder } from '../../search-commons/services/sql-query.builder';
import { ObjectDetectionDetectedObjectType, ObjectDetectionRequestType, ObjectDetectionResponseType } from '../model/objectdetection-model';
import { CommonObjectDetectionProcessingDatastore, ObjectDetectionMaxIdPerDetectorType, RequestImageDataType } from '../model/common-object-detection-processing-datastore';
import { ObjectDetectionModelConfigType, ObjectDetectionSqlTableConfiguration } from '../model/common-sql-object-detection.model';
export declare class CommonSqlObjectDetectionProcessingAdapter implements CommonObjectDetectionProcessingDatastore {
    protected readonly config: any;
    protected readonly knex: any;
    protected readonly sqlQueryBuilder: SqlQueryBuilder;
    private readonly objectDetectionModelConfig;
    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, objectDetectionModelConfig: ObjectDetectionModelConfigType);
    getObjectDetectionConfiguration(input: ObjectDetectionRequestType): ObjectDetectionSqlTableConfiguration;
    readMaxIdAlreadyDetectedPerDetector(entityType: string, detectorFilterNames: string[]): Promise<ObjectDetectionMaxIdPerDetectorType[]>;
    readRequestImageDataType(entityType: string, detector: string, maxIdAlreadyDetected: number, maxPerRun: number): Promise<RequestImageDataType[]>;
    deleteOldDetectionRequests(detectionRequest: ObjectDetectionRequestType, onlyNotSucceeded: boolean): Promise<any>;
    createDetectionRequest(detectionRequest: ObjectDetectionRequestType, detector: string): Promise<any>;
    createDetectionError(detectionResponse: ObjectDetectionResponseType, detector: string): Promise<any>;
    createDefaultObject(): Promise<any>;
    processDetectionWithResult(detector: string, detectionResult: ObjectDetectionDetectedObjectType, tableConfig: ObjectDetectionSqlTableConfiguration): Promise<any>;
    processDetectionWithoutResult(detector: string, tableConfig: ObjectDetectionSqlTableConfiguration): Promise<any>;
    protected transformToSqlDialect(sql: string): string;
}
