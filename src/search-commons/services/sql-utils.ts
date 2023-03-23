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

export class SqlUtils {
    public static transformToSqliteDialect(sql: string): string {
        const replace = ' CONCAT(';
        while (sql.indexOf(replace) >= 0) {
            const start = sql.indexOf(replace);
            const end = sql.indexOf(')', start);
            const sqlPre = sql.substr(0, start + 1);
            const sqlAfter = sql.substr(end + 1);
            const toBeConverted = sql.substr(start + replace.length, end - start - replace.length);
            // TODO: check security
            sql = sqlPre + toBeConverted.replace(/, /g, ' || ') + sqlAfter;
        }

        sql = sql.replace(/GREATEST\(/g, 'MAX(');
        sql = sql.replace(/SUBSTRING_INDEX\(/g, 'SUBSTR(');
        sql = sql.replace(/CHAR_LENGTH\(/g, 'LENGTH(');
        sql = sql.replace(/GROUP_CONCAT\(DISTINCT CONCAT\((.*?)\) SEPARATOR (.*?)\)/g, 'GROUP_CONCAT( CONCAT($1), $2)');
        sql = sql.replace(/GROUP_CONCAT\(DISTINCT (.*?) ORDER BY (.*?) SEPARATOR (.*?)\)/g, 'GROUP_CONCAT($1, $3)');
        sql = sql.replace(/GROUP_CONCAT\(DISTINCT (.*?) SEPARATOR (.*?)\)/g, 'GROUP_CONCAT($1, $2)');
        sql = sql.replace(/GROUP_CONCAT\((.*?) SEPARATOR (.*?)\)/g, 'GROUP_CONCAT($1, $2)');
        sql = sql.replace(/MONTH\((.*?)\)/g, 'CAST(STRFTIME("%m", $1) AS INT)');
        sql = sql.replace(/WEEK\((.*?)\)/g, 'CAST(STRFTIME("%W", $1) AS INT)');
        sql = sql.replace(/YEAR\((.*?)\)/g, 'CAST(STRFTIME("%Y", $1) AS INT)');
        sql = sql.replace(/DATE_FORMAT\((.+?), GET_FORMAT\(DATE, "ISO"\)\)/g, 'DATETIME($1)');
        sql = sql.replace(/TIME_TO_SEC\(TIMEDIFF\((.*?), (.*?)\)\)\/3600/g, '(JULIANDAY($1) - JULIANDAY($2)) * 24');
        sql = sql.replace(/ FROM DUAL /gi, ' ');

        return  sql;
    }

    public static extractDbResult(dbresult: any, client: string): any {
        if (client === 'mysql') {
            return dbresult[0];
        }

        return dbresult;
    }

    public static analyzeSimpleSql(sql: string): SqlParts {
        const sqlParts: SqlParts = {
            fieldAliases: [],
            fields: [],
            tableAliases: [],
            tables: []
        };

        const fieldPartsMatcher = sql.match(/^SELECT (.*)? FROM /i);
        const tablePartsMatcher = sql.match(/^SELECT .*? FROM (.*)? (WHERE |ORDER BY|GROUP BY)*/i);
        if (fieldPartsMatcher.length > 1) {
            const fields = fieldPartsMatcher[1].trim().split(', ');
            for (let j = 0; j < fields.length; j++) {
                const field = fields[j].trim().split(/ AS /i);
                sqlParts.fields.push(field[0].trim());
                if (field.length === 2) {
                    sqlParts.fieldAliases.push(field[1].trim());
                }
            }
        }
        if (tablePartsMatcher.length > 1) {
            const tableParts = tablePartsMatcher[1].trim().split(/ INNER JOIN | LEFT JOIN | RIGHT JOIN | JOIN /i);
            for (let j = 0; j < tableParts.length; j++) {
                const tables = tableParts[j].trim().split(/ ON /i);
                const table = tables[0].trim().split(' ');
                sqlParts.tables.push(table[0].trim());
                if (table.length === 2) {
                    sqlParts.tableAliases.push(table[1].trim());
                }
            }
        }

        return sqlParts;

    }

    public static concatRawSqlQueryData(part1: RawSqlQueryData, joiner: string, part2: RawSqlQueryData): RawSqlQueryData {
        if (part1 === undefined || part1.sql === undefined || part1.sql.length <= 0) {
            return { sql: part2.sql, parameters: [...part2.parameters]};
        }
        if (part2 === undefined || part2.sql === undefined || part2.sql.length <= 0) {
            return { sql: part1.sql, parameters: [...part1.parameters]};
        }

        return { sql: part1.sql + joiner + part2.sql, parameters: [...part1.parameters].concat(part2.parameters)};
    }

    public static mapParametersToPlaceholders(parameters: any[]): string[] {
        return parameters.map(() => '?');
    }

    public static mapParametersToPlaceholderString(parameters: any[]): string {
        return SqlUtils.mapParametersToPlaceholders(parameters).join(', ');
    }

    public static executeRawSqlQueryData(db: knex.Client, query: RawSqlQueryData): Promise<any> {
        return db.raw(query.sql, query.parameters);
    }
}

