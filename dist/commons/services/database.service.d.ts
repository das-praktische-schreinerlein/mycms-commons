import { SqlQueryBuilder } from '../../search-commons/services/sql-query.builder';
export declare class DatabaseService {
    protected knex: any;
    protected sqlQueryBuilder: SqlQueryBuilder;
    static extractSqlFileOnScriptPath(sqlFile: string, splitter: string): string[];
    constructor(knex: any, sqlQueryBuilder: SqlQueryBuilder);
    executeSqls(sqls: string[]): Promise<boolean>;
    transformToSqlDialect(sql: string): string;
}
