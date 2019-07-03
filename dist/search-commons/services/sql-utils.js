"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SqlUtils = /** @class */ (function () {
    function SqlUtils() {
    }
    SqlUtils.extractDbResult = function (dbresult, client) {
        if (client === 'mysql') {
            return dbresult[0];
        }
        return dbresult;
    };
    SqlUtils.analyzeSimpleSql = function (sql) {
        var sqlParts = {
            fieldAliases: [],
            fields: [],
            tableAliases: [],
            tables: []
        };
        var fieldPartsMatcher = sql.match(/^SELECT (.*)? FROM /i);
        var tablePartsMatcher = sql.match(/^SELECT .*? FROM (.*)? (WHERE |ORDER BY|GROUP BY)*/i);
        if (fieldPartsMatcher.length > 1) {
            var fields = fieldPartsMatcher[1].trim().split(', ');
            for (var j = 0; j < fields.length; j++) {
                var field = fields[j].trim().split(/ AS /i);
                sqlParts.fields.push(field[0].trim());
                if (field.length === 2) {
                    sqlParts.fieldAliases.push(field[1].trim());
                }
            }
        }
        if (tablePartsMatcher.length > 1) {
            var tableParts = tablePartsMatcher[1].trim().split(/ INNER JOIN | LEFT JOIN | RIGHT JOIN | JOIN /i);
            for (var j = 0; j < tableParts.length; j++) {
                var tables = tableParts[j].trim().split(/ ON /i);
                var table = tables[0].trim().split(' ');
                sqlParts.tables.push(table[0].trim());
                if (table.length === 2) {
                    sqlParts.tableAliases.push(table[1].trim());
                }
            }
        }
        return sqlParts;
    };
    return SqlUtils;
}());
exports.SqlUtils = SqlUtils;
//# sourceMappingURL=sql-utils.js.map