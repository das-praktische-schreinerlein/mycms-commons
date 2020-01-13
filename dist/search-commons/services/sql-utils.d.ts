import * as knex from 'knex';
export interface SqlParts {
    tables: string[];
    tableAliases: string[];
    fields: string[];
    fieldAliases: string[];
}
export interface RawSqlQueryData {
    sql: string;
    parameters: any[];
}
export declare class SqlUtils {
    static transformToSqliteDialect(sql: string): string;
    static extractDbResult(dbresult: any, client: string): any;
    static analyzeSimpleSql(sql: string): SqlParts;
    static concatRawSqlQueryData(part1: RawSqlQueryData, joiner: String, part2: RawSqlQueryData): RawSqlQueryData;
    static mapParametersToPlaceholders(parameters: any[]): String[];
    static mapParametersToPlaceholderString(parameters: any[]): String;
    static executeRawSqlQueryData(knex: knex, query: RawSqlQueryData): Promise<any>;
}
