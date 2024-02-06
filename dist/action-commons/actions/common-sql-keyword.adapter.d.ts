import { ChangelogDataConfig, SqlQueryBuilder } from '../../search-commons/services/sql-query.builder';
export interface KeywordModelConfigJoinType {
    joinTable: string;
    fieldReference: string;
    table: string;
    changelogConfig?: ChangelogDataConfig;
}
export interface KeywordModelConfigJoinsType {
    [key: string]: KeywordModelConfigJoinType;
}
export interface KeywordModelConfigType {
    fieldId: string;
    fieldName: string;
    joins: KeywordModelConfigJoinsType;
    table: string;
}
export declare class CommonSqlKeywordAdapter {
    private config;
    private readonly knex;
    private sqlQueryBuilder;
    private readonly keywordModelConfig;
    private keywordValidationRule;
    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, keywordModelConfig: KeywordModelConfigType);
    setGenericKeywords(joinTableKey: string, dbId: number, keywords: string, opts: any, deleteOld: boolean): Promise<any>;
    unsetGenericKeywords(joinTableKey: string, dbId: number, keywords: string, opts: any): Promise<any>;
}
