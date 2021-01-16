"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var database_service_1 = require("../../commons/services/database.service");
var MysqlFacetCacheAdapter = /** @class */ (function () {
    function MysqlFacetCacheAdapter(sqlScriptPath) {
        this.sqlScriptPath = sqlScriptPath;
    }
    MysqlFacetCacheAdapter.prototype.supportsDatabaseManagedUpdate = function () {
        return true;
    };
    MysqlFacetCacheAdapter.prototype.generateCreateTableTriggerSql = function (table, triggerSql) {
        var sqls = [];
        sqls.push('CREATE TRIGGER trigger_aft_upd_' + table + ' AFTER UPDATE ON ' + table + ' FOR EACH ROW\n' +
            'BEGIN\n' + triggerSql + 'END');
        sqls.push('CREATE TRIGGER trigger_aft_ins_' + table + ' AFTER INSERT ON ' + table + ' FOR EACH ROW\n' +
            'BEGIN\n' + triggerSql + 'END');
        sqls.push('CREATE TRIGGER trigger_aft_del_' + table + ' AFTER DELETE ON ' + table + ' FOR EACH ROW\n' +
            'BEGIN\n' + triggerSql + 'END');
        return sqls;
    };
    MysqlFacetCacheAdapter.prototype.generateDropTableTriggerSql = function (table) {
        var sqls = [];
        sqls.push('DROP TRIGGER IF EXISTS trigger_aft_upd_' + table);
        sqls.push('DROP TRIGGER IF EXISTS trigger_aft_ins_' + table);
        sqls.push('DROP TRIGGER IF EXISTS trigger_aft_del_' + table);
        return sqls;
    };
    MysqlFacetCacheAdapter.prototype.generateCreateUpdateScheduleSql = function (facetKey, updateSql, checkInterval) {
        var sqls = [];
        sqls.push('CREATE EVENT event_update_' + facetKey +
            ' ON SCHEDULE EVERY ' + checkInterval + ' MINUTE' +
            ' ON COMPLETION NOT PRESERVE ENABLE' +
            ' DO ' +
            '   BEGIN ' +
            '     CALL CheckFacetCacheUpdateTriggerTableAndExceuteSql("' + facetKey + '", \'' + updateSql + '\');' +
            '   END');
        return sqls;
    };
    MysqlFacetCacheAdapter.prototype.generateDropUpdateScheduleSql = function (facetKey) {
        var sqls = [];
        sqls.push('DROP EVENT IF EXISTS event_update_' + facetKey);
        return sqls;
    };
    MysqlFacetCacheAdapter.prototype.generateFacetTriggerCallSql = function (facetKey) {
        var sqls = [];
        sqls.push('CALL InsertFacetCacheUpdateTriggerTableEntry(\'' + facetKey + '\');');
        return sqls;
    };
    MysqlFacetCacheAdapter.prototype.generateCreateFacetCacheConfigsSql = function (configurations) {
        var sqls = [];
        for (var _i = 0, configurations_1 = configurations; _i < configurations_1.length; _i++) {
            var configuration = configurations_1[_i];
            sqls = sqls.concat(this.generateCreateFacetCacheConfigSql(configuration));
        }
        return sqls;
    };
    MysqlFacetCacheAdapter.prototype.generateCreateFacetCacheConfigSql = function (configuration) {
        return ['INSERT INTO facetcacheconfig (fcc_usecache, fcc_key) VALUES (1, "' + configuration.longKey + '")',
            'INSERT INTO facetcacheupdatetrigger (ft_key)' +
                '        SELECT "' + configuration.longKey + '" from dual' +
                '            WHERE NOT EXISTS (SELECT 1 FROM facetcacheupdatetrigger WHERE ft_key="' + configuration.longKey + '");'];
    };
    MysqlFacetCacheAdapter.prototype.generateRemoveFacetCacheConfigsSql = function (configurations) {
        var sqls = [];
        for (var _i = 0, configurations_2 = configurations; _i < configurations_2.length; _i++) {
            var configuration = configurations_2[_i];
            sqls = sqls.concat(this.generateRemoveFacetCacheConfigSql(configuration));
        }
        return sqls;
    };
    MysqlFacetCacheAdapter.prototype.generateRemoveFacetCacheConfigSql = function (configuration) {
        return ['IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = "facetcacheconfig") ' +
                ' THEN ' +
                '   DELETE IGNORE FROM facetcacheconfig WHERE fcc_key IN ("' + configuration.longKey + '");' +
                ' END IF'];
    };
    MysqlFacetCacheAdapter.prototype.generateSelectTrueIfTableFacetCacheConfigExistsSql = function () {
        return this.generateSelectTrueIfTableExistsSql('facetcacheconfig');
    };
    MysqlFacetCacheAdapter.prototype.generateUpdateFacetsCacheSql = function (configurations) {
        var sqls = [];
        for (var _i = 0, configurations_3 = configurations; _i < configurations_3.length; _i++) {
            var configuration = configurations_3[_i];
            sqls = sqls.concat(this.generateUpdateFacetCacheSql(configuration));
        }
        return sqls;
    };
    MysqlFacetCacheAdapter.prototype.generateUpdateFacetCacheSql = function (configuration) {
        var sqls = [];
        var longKey = configuration.longKey;
        sqls.push('INSERT INTO facetcache (fc_key, fc_order, fc_count,' +
            '   fc_value_' + configuration.valueType +
            (configuration.withLabel === true ? ', fc_label' : '') +
            (configuration.withId === true ? ', fc_recid ' : ' ') +
            '   )' +
            ' SELECT "' + longKey + '" AS fc_key, @i:=@i+1 AS fc_order, count, value ' +
            (configuration.withLabel === true ? ', label ' : ' ') +
            (configuration.withId === true ? ', id ' : ' ') +
            ' FROM fc_live_' + longKey + ', (SELECT @i:=0) AS temp');
        return sqls;
    };
    MysqlFacetCacheAdapter.prototype.generateDeleteFacetCacheSql = function (configuration) {
        var sqls = [];
        var longKey = configuration.longKey;
        sqls.push('DELETE IGNORE from facetcache where fc_key in ("' + longKey + '")');
        return sqls;
    };
    MysqlFacetCacheAdapter.prototype.generateSelectFacetCacheUpdateTriggerSql = function () {
        return 'SELECT ft_key from facetcacheupdatetrigger';
    };
    MysqlFacetCacheAdapter.prototype.generateDeleteFacetCacheUpdateTriggerSql = function (configuration) {
        var sqls = [];
        var longKey = configuration.longKey;
        sqls.push('DELETE IGNORE from facetcacheupdatetrigger where ft_key in ("' + longKey + '")');
        return sqls;
    };
    MysqlFacetCacheAdapter.prototype.generateCreateFacetViewsSql = function (configurations) {
        var sqls = [];
        for (var _i = 0, configurations_4 = configurations; _i < configurations_4.length; _i++) {
            var configuration = configurations_4[_i];
            sqls = sqls.concat(this.generateCreateFacetViewSql(configuration));
        }
        return sqls;
    };
    MysqlFacetCacheAdapter.prototype.generateCreateFacetViewSql = function (configuration) {
        var longKey = configuration.longKey;
        var facetSql = configuration.facetSql;
        var sqls = [];
        sqls.push('CREATE VIEW fc_live_' + longKey + ' AS ' + facetSql);
        sqls.push('CREATE VIEW fc_cached_' + longKey + ' AS' +
            ' SELECT fc_count AS count, ' +
            (configuration.withLabel === true ? 'fc_label AS label, ' : '') +
            (configuration.withId === true ? 'fc_recid AS id, ' : '') +
            '    fc_value_' + configuration.valueType + ' AS value' +
            ' FROM facetcache WHERE fc_key in ("' + longKey + '") ORDER BY fc_order');
        sqls.push('CREATE VIEW fc_real_' + longKey + ' AS ' +
            '   SELECT count, ' +
            (configuration.withLabel === true ? 'label, ' : '') +
            (configuration.withId === true ? 'id, ' : '') +
            '   value FROM fc_live_' + longKey +
            '       WHERE NOT EXISTS (SELECT 1 FROM facetcacheconfig WHERE fcc_key IN ("' + longKey + '") AND fcc_usecache <> 0)' +
            ' UNION ' +
            '   SELECT count, ' +
            (configuration.withLabel === true ? 'label, ' : '') +
            (configuration.withId === true ? 'id, ' : '') +
            '   value FROM fc_cached_' + longKey +
            '       WHERE EXISTS (SELECT 1 FROM facetcacheconfig WHERE fcc_key IN ("' + longKey + '") AND fcc_usecache <> 0)');
        return sqls;
    };
    MysqlFacetCacheAdapter.prototype.generateDropFacetViewsSql = function (configurations) {
        var sqls = [];
        for (var _i = 0, configurations_5 = configurations; _i < configurations_5.length; _i++) {
            var configuration = configurations_5[_i];
            sqls = sqls.concat(this.generateDropFacetViewSql(configuration));
        }
        return sqls;
    };
    MysqlFacetCacheAdapter.prototype.generateDropFacetViewSql = function (configuration) {
        var longKey = configuration.longKey;
        var sqls = [];
        sqls.push('DROP VIEW IF EXISTS fc_live_' + longKey);
        sqls.push('DROP VIEW IF EXISTS fc_cached_' + longKey);
        sqls.push('DROP VIEW IF EXISTS fc_real_' + longKey);
        return sqls;
    };
    MysqlFacetCacheAdapter.prototype.generateCreateFacetCacheTables = function () {
        return this.extractSqlFileOnScriptPath('create-facetcache-tables.sql', ';');
    };
    MysqlFacetCacheAdapter.prototype.generateCreateFacetCacheTriggerFunctions = function () {
        return this.extractSqlFileOnScriptPath('create-facetcache-trigger-functions.sql', '$$');
    };
    MysqlFacetCacheAdapter.prototype.generateCreateFacetCacheUpdateCheckFunctions = function () {
        return this.extractSqlFileOnScriptPath('create-facetcache-updatecheck-functions.sql', '$$');
    };
    MysqlFacetCacheAdapter.prototype.generateDropFacetCacheTables = function () {
        return this.extractSqlFileOnScriptPath('drop-facetcache-tables.sql', ';');
    };
    MysqlFacetCacheAdapter.prototype.generateDropFacetCacheTriggerFunctions = function () {
        return this.extractSqlFileOnScriptPath('drop-facetcache-trigger-functions.sql', '$$');
    };
    MysqlFacetCacheAdapter.prototype.generateDropFacetCacheUpdateCheckFunctions = function () {
        return this.extractSqlFileOnScriptPath('drop-facetcache-updatecheck-functions.sql', '$$');
    };
    MysqlFacetCacheAdapter.prototype.generateSelectTrueIfTableExistsSql = function (table) {
        return 'SELECT "true" FROM information_schema.tables WHERE table_schema=DATABASE() AND table_name="' + table + '"';
    };
    MysqlFacetCacheAdapter.prototype.extractSqlFileOnScriptPath = function (sqlFile, splitter) {
        return database_service_1.DatabaseService.extractSqlFileOnScriptPath(this.sqlScriptPath, splitter);
    };
    return MysqlFacetCacheAdapter;
}());
exports.MysqlFacetCacheAdapter = MysqlFacetCacheAdapter;
//# sourceMappingURL=mysql-facetcache.adapter.js.map