"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var database_service_1 = require("../../commons/services/database.service");
var Sqlite3FacetCacheAdapter = /** @class */ (function () {
    function Sqlite3FacetCacheAdapter(sqlScriptPath) {
        this.sqlScriptPath = sqlScriptPath;
    }
    Sqlite3FacetCacheAdapter.prototype.supportsDatabaseManagedUpdate = function () {
        return false;
    };
    Sqlite3FacetCacheAdapter.prototype.generateCreateTableTriggerSql = function (table, triggerSql) {
        var sqls = [];
        sqls.push('CREATE TRIGGER trigger_aft_upd_' + table + ' AFTER UPDATE ON ' + table + ' FOR EACH ROW\n' +
            'BEGIN\n' + triggerSql + 'END');
        sqls.push('CREATE TRIGGER trigger_aft_ins_' + table + ' AFTER INSERT ON ' + table + ' FOR EACH ROW\n' +
            'BEGIN\n' + triggerSql + 'END');
        sqls.push('CREATE TRIGGER trigger_aft_del_' + table + ' AFTER DELETE ON ' + table + ' FOR EACH ROW\n' +
            'BEGIN\n' + triggerSql + 'END');
        return sqls;
    };
    Sqlite3FacetCacheAdapter.prototype.generateDropTableTriggerSql = function (table) {
        var sqls = [];
        sqls.push('DROP TRIGGER IF EXISTS trigger_aft_upd_' + table);
        sqls.push('DROP TRIGGER IF EXISTS trigger_aft_ins_' + table);
        sqls.push('DROP TRIGGER IF EXISTS trigger_aft_del_' + table);
        return sqls;
    };
    Sqlite3FacetCacheAdapter.prototype.generateCreateUpdateScheduleSql = function (facetKey, updateSql, checkInterval) {
        return [];
    };
    Sqlite3FacetCacheAdapter.prototype.generateDropUpdateScheduleSql = function (facetKey) {
        return [];
    };
    Sqlite3FacetCacheAdapter.prototype.generateFacetTriggerCallSql = function (facetKey) {
        return ['INSERT INTO facetcacheupdatetrigger (ft_key)' +
                '        SELECT "' + facetKey + '"' +
                '            WHERE NOT EXISTS (SELECT 1 FROM facetcacheupdatetrigger WHERE ft_key="' + facetKey + '");'];
    };
    Sqlite3FacetCacheAdapter.prototype.generateCreateFacetCacheConfigsSql = function (configurations) {
        var sqls = [];
        for (var _i = 0, configurations_1 = configurations; _i < configurations_1.length; _i++) {
            var configuration = configurations_1[_i];
            sqls = sqls.concat(this.generateCreateFacetCacheConfigSql(configuration));
        }
        return sqls;
    };
    Sqlite3FacetCacheAdapter.prototype.generateCreateFacetCacheConfigSql = function (configuration) {
        return ['INSERT INTO facetcacheconfig (fcc_usecache, fcc_key) VALUES (1, "' + configuration.longKey + '")',
            'INSERT INTO facetcacheupdatetrigger (ft_key)' +
                '        SELECT "' + configuration.longKey + '"' +
                '            WHERE NOT EXISTS (SELECT 1 FROM facetcacheupdatetrigger WHERE ft_key="' + configuration.longKey + '");'];
    };
    Sqlite3FacetCacheAdapter.prototype.generateRemoveFacetCacheConfigsSql = function (configurations) {
        var sqls = [];
        for (var _i = 0, configurations_2 = configurations; _i < configurations_2.length; _i++) {
            var configuration = configurations_2[_i];
            sqls = sqls.concat(this.generateRemoveFacetCacheConfigSql(configuration));
        }
        return sqls;
    };
    Sqlite3FacetCacheAdapter.prototype.generateRemoveFacetCacheConfigSql = function (configuration) {
        return ['DELETE FROM facetcacheconfig WHERE fcc_key IN ("' + configuration.longKey + '")'];
    };
    Sqlite3FacetCacheAdapter.prototype.generateSelectTrueIfTableFacetCacheConfigExistsSql = function () {
        return this.generateSelectTrueIfTableExistsSql('facetcacheconfig');
    };
    Sqlite3FacetCacheAdapter.prototype.generateUpdateFacetsCacheSql = function (configurations) {
        var sqls = [];
        for (var _i = 0, configurations_3 = configurations; _i < configurations_3.length; _i++) {
            var configuration = configurations_3[_i];
            sqls = sqls.concat(this.generateUpdateFacetCacheSql(configuration));
        }
        return sqls;
    };
    Sqlite3FacetCacheAdapter.prototype.generateUpdateFacetCacheSql = function (configuration) {
        var sqls = [];
        var longKey = configuration.longKey;
        sqls.push('INSERT INTO facetcache (fc_key, fc_order, fc_count,' +
            '   fc_value_' + configuration.valueType +
            (configuration.withLabel === true ? ', fc_label' : '') +
            (configuration.withId === true ? ', fc_recid ' : ' ') +
            '   )' +
            ' SELECT "' + longKey + '" AS fc_key,' +
            '   ROW_NUMBER() OVER(ORDER BY ' + (configuration.orderBy === undefined
            ? (configuration.withLabel === true ? 'label, ' : '') + ' value'
            : configuration.orderBy) + ') AS fc_order,' +
            ' count, value ' +
            (configuration.withLabel === true ? ', label ' : ' ') +
            (configuration.withId === true ? ', id ' : ' ') +
            ' FROM fc_live_' + longKey);
        return sqls;
    };
    Sqlite3FacetCacheAdapter.prototype.generateDeleteFacetCacheSql = function (configuration) {
        var sqls = [];
        var longKey = configuration.longKey;
        sqls.push('DELETE from facetcache where fc_key in ("' + longKey + '")');
        return sqls;
    };
    Sqlite3FacetCacheAdapter.prototype.generateSelectFacetCacheUpdateTriggerSql = function () {
        return 'SELECT ft_key from facetcacheupdatetrigger';
    };
    Sqlite3FacetCacheAdapter.prototype.generateDeleteFacetCacheUpdateTriggerSql = function (configuration) {
        var sqls = [];
        var longKey = configuration.longKey;
        sqls.push('DELETE from facetcacheupdatetrigger where ft_key in ("' + longKey + '")');
        return sqls;
    };
    Sqlite3FacetCacheAdapter.prototype.generateCreateFacetViewsSql = function (configurations) {
        var sqls = [];
        for (var _i = 0, configurations_4 = configurations; _i < configurations_4.length; _i++) {
            var configuration = configurations_4[_i];
            sqls = sqls.concat(this.generateCreateFacetViewSql(configuration));
        }
        return sqls;
    };
    Sqlite3FacetCacheAdapter.prototype.generateCreateFacetViewSql = function (configuration) {
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
    Sqlite3FacetCacheAdapter.prototype.generateDropFacetViewsSql = function (configurations) {
        var sqls = [];
        for (var _i = 0, configurations_5 = configurations; _i < configurations_5.length; _i++) {
            var configuration = configurations_5[_i];
            sqls = sqls.concat(this.generateDropFacetViewSql(configuration));
        }
        return sqls;
    };
    Sqlite3FacetCacheAdapter.prototype.generateDropFacetViewSql = function (configuration) {
        var longKey = configuration.longKey;
        var sqls = [];
        sqls.push('DROP VIEW IF EXISTS fc_live_' + longKey);
        sqls.push('DROP VIEW IF EXISTS fc_cached_' + longKey);
        sqls.push('DROP VIEW IF EXISTS fc_real_' + longKey);
        return sqls;
    };
    Sqlite3FacetCacheAdapter.prototype.generateCreateFacetCacheTables = function () {
        return this.extractSqlFileOnScriptPath('create-facetcache-tables.sql', ';');
    };
    Sqlite3FacetCacheAdapter.prototype.generateCreateFacetCacheTriggerFunctions = function () {
        return [];
    };
    Sqlite3FacetCacheAdapter.prototype.generateCreateFacetCacheUpdateCheckFunctions = function () {
        return [];
    };
    Sqlite3FacetCacheAdapter.prototype.generateDropFacetCacheTables = function () {
        return this.extractSqlFileOnScriptPath('drop-facetcache-tables.sql', ';');
    };
    Sqlite3FacetCacheAdapter.prototype.generateDropFacetCacheTriggerFunctions = function () {
        return [];
    };
    Sqlite3FacetCacheAdapter.prototype.generateDropFacetCacheUpdateCheckFunctions = function () {
        return [];
    };
    Sqlite3FacetCacheAdapter.prototype.generateSelectTrueIfTableExistsSql = function (table) {
        return 'SELECT "true" FROM sqlite_master WHERE type="table" AND name="' + table + '"';
    };
    Sqlite3FacetCacheAdapter.prototype.extractSqlFileOnScriptPath = function (sqlFile, splitter) {
        return database_service_1.DatabaseService.extractSqlFileOnScriptPath(this.sqlScriptPath, splitter);
    };
    return Sqlite3FacetCacheAdapter;
}());
exports.Sqlite3FacetCacheAdapter = Sqlite3FacetCacheAdapter;
//# sourceMappingURL=sqlite3-facetcache.adapter.js.map