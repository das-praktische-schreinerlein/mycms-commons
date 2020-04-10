"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var SqlUtils = /** @class */ (function () {
    function SqlUtils() {
    }
    SqlUtils.transformToSqliteDialect = function (sql) {
        var replace = ' CONCAT(';
        while (sql.indexOf(replace) > 0) {
            var start = sql.indexOf(replace);
            var end = sql.indexOf(')', start);
            var sqlPre = sql.substr(0, start + 1);
            var sqlAfter = sql.substr(end + 1);
            var toBeConverted = sql.substr(start + replace.length, end - start - replace.length);
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
        return sql;
    };
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
    SqlUtils.concatRawSqlQueryData = function (part1, joiner, part2) {
        if (part1 === undefined || part1.sql === undefined || part1.sql.length <= 0) {
            return { sql: part2.sql, parameters: __spreadArrays(part2.parameters) };
        }
        if (part2 === undefined || part2.sql === undefined || part2.sql.length <= 0) {
            return { sql: part1.sql, parameters: __spreadArrays(part1.parameters) };
        }
        return { sql: part1.sql + joiner + part2.sql, parameters: __spreadArrays(part1.parameters).concat(part2.parameters) };
    };
    SqlUtils.mapParametersToPlaceholders = function (parameters) {
        return parameters.map(function () { return '?'; });
    };
    SqlUtils.mapParametersToPlaceholderString = function (parameters) {
        return SqlUtils.mapParametersToPlaceholders(parameters).join(', ');
    };
    SqlUtils.executeRawSqlQueryData = function (knex, query) {
        return knex.raw(query.sql, query.parameters);
    };
    return SqlUtils;
}());
exports.SqlUtils = SqlUtils;
//# sourceMappingURL=sql-utils.js.map