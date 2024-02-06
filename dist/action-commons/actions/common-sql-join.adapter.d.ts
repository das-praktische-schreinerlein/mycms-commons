import { ChangelogDataConfig, SqlQueryBuilder } from '../../search-commons/services/sql-query.builder';
import { BaseJoinRecordType } from '../../search-commons/model/records/basejoin-record';
export interface JoinFieldMappingConfigJoinType {
    [key: string]: string;
}
export interface JoinModelConfigTableType {
    baseTableIdField: string;
    joinTable: string;
    joinFieldMappings: JoinFieldMappingConfigJoinType;
    changelogConfig?: ChangelogDataConfig;
}
export interface JoinModelConfigTablesType {
    [key: string]: JoinModelConfigTableType;
}
export interface JoinModelConfigType {
    name: string;
    tables: JoinModelConfigTablesType;
}
export interface JoinModelConfigsType {
    [key: string]: JoinModelConfigType;
}
export declare class CommonSqlJoinAdapter {
    private config;
    private readonly knex;
    private sqlQueryBuilder;
    private readonly joinModelConfig;
    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, joinModelConfig: JoinModelConfigsType);
    saveJoins(joinKey: string, baseTableKey: string, dbId: number, joinRecords: BaseJoinRecordType[], opts: any): Promise<any>;
}
