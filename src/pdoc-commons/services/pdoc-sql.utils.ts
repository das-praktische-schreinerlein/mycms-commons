export class PDocSqlUtils {
    public static generateDoubletteNameSql(field: string): string {
        return 'REGEXP_REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(' + field + '), "ß", "ss"),' +
            ' "ö", "oe"),' +
            ' "ü", "ue"),' +
            ' "ä", "ae"),' +
            ' "[^a-z0-9]", "")';
    }

    public static transformToSqliteDialect(sql: string): string {
        // dirty workaround because sqlite has no functions as mysql
        sql = sql.replace(/REGEXP_REPLACE\(/g, 'REPLACE(');

        return sql;
    }
}

