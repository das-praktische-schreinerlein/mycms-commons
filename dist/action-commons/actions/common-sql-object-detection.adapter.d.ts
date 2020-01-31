import { SqlQueryBuilder } from '../../search-commons/services/sql-query.builder';
import { ObjectDetectionModelConfigType } from '../../commons/model/common-sql-object-detection.model';
export declare class CommonSqlObjectDetectionAdapter {
    protected readonly config: any;
    protected readonly knex: any;
    protected readonly sqlQueryBuilder: SqlQueryBuilder;
    private readonly objectDetectionModelConfig;
    private readonly keywordValidationRule;
    private readonly precisionValidationRule;
    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, objectDetectionModelConfig: ObjectDetectionModelConfigType);
    protected transformToSqlDialect(sql: string): string;
    setObjects(table: string, id: number, objectKey: string, precision: number, detector: string, set: boolean, opts: any): Promise<any>;
    setObjectsState(table: string, id: number, state: string, opts: any): Promise<any>;
    updateObjectsKey(table: string, id: number, detector: string, objectkey: string, objectname: string, objectcategory: string, action: string, state: string, opts: any): Promise<any>;
}
