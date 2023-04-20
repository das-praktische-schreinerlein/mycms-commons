"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PDocSqlUtils = /** @class */ (function () {
    function PDocSqlUtils() {
    }
    PDocSqlUtils.generateDoubletteNameSql = function (field) {
        return 'REGEXP_REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(' + field + '), "ß", "ss"),' +
            ' "ö", "oe"),' +
            ' "ü", "ue"),' +
            ' "ä", "ae"),' +
            ' "[^a-z0-9]", "")';
    };
    PDocSqlUtils.transformToSqliteDialect = function (sql) {
        // dirty workaround because sqlite has no functions as mysql
        sql = sql.replace(/REGEXP_REPLACE\(/g, 'REPLACE(');
        return sql;
    };
    return PDocSqlUtils;
}());
exports.PDocSqlUtils = PDocSqlUtils;
//# sourceMappingURL=pdoc-sql.utils.js.map