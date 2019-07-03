export interface SqlParts {
    tables: string[];
    tableAliases: string[];
    fields: string[];
    fieldAliases: string[];
}

export class SqlUtils {
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

}

