"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sql_page_config_1 = require("../model/repository/sql-page.config");
var PDocSqlConfig = /** @class */ (function () {
    function PDocSqlConfig() {
    }
    PDocSqlConfig.prototype.getTableConfigForTableKey = function (table) {
        return PDocSqlConfig.tableConfigs[table];
    };
    PDocSqlConfig.prototype.getActionTagAssignConfig = function () {
        return PDocSqlConfig.actionTagAssignConfig;
    };
    PDocSqlConfig.prototype.getActionTagAssignJoinConfig = function () {
        return PDocSqlConfig.actionTagAssignJoinConfig;
    };
    PDocSqlConfig.prototype.getActionTagReplaceConfig = function () {
        return PDocSqlConfig.actionTagReplaceConfig;
    };
    PDocSqlConfig.tableConfigs = {
        'page': sql_page_config_1.SqlPageConfig.tableConfig
    };
    PDocSqlConfig.actionTagAssignConfig = {
        tables: {
            'page': sql_page_config_1.SqlPageConfig.actionTagAssignConfig
        }
    };
    PDocSqlConfig.actionTagAssignJoinConfig = {
        tables: {}
    };
    PDocSqlConfig.actionTagReplaceConfig = {
        tables: {
            'page': sql_page_config_1.SqlPageConfig.actionTagReplaceConfig
        }
    };
    return PDocSqlConfig;
}());
exports.PDocSqlConfig = PDocSqlConfig;
//# sourceMappingURL=pdoc-sql.config.js.map