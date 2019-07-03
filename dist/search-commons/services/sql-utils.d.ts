export interface SqlParts {
    tables: string[];
    tableAliases: string[];
    fields: string[];
    fieldAliases: string[];
}
export declare class SqlUtils {
    static extractDbResult(dbresult: any, client: string): any;
    static analyzeSimpleSql(sql: string): SqlParts;
}
