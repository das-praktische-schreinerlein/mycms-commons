"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var generic_sql_adapter_1 = require("../../search-commons/services/generic-sql.adapter");
var pdoc_adapter_response_mapper_1 = require("./pdoc-adapter-response.mapper");
var facets_1 = require("../../search-commons/model/container/facets");
var js_data_1 = require("js-data");
var pdoc_sql_config_1 = require("./pdoc-sql.config");
var pdoc_sql_utils_1 = require("./pdoc-sql.utils");
var common_sql_actiontag_assign_adapter_1 = require("../../action-commons/actiontags/common-sql-actiontag-assign.adapter");
var common_sql_actiontag_replace_adapter_1 = require("../../action-commons/actiontags/common-sql-actiontag-replace.adapter");
var common_sql_actiontag_assignjoin_adapter_1 = require("../../action-commons/actiontags/common-sql-actiontag-assignjoin.adapter");
// TODO sync with model
var PDocSqlAdapter = /** @class */ (function (_super) {
    __extends(PDocSqlAdapter, _super);
    function PDocSqlAdapter(config, facetCacheUsageConfigurations) {
        var _this = _super.call(this, config, new pdoc_adapter_response_mapper_1.PDocAdapterResponseMapper(config), facetCacheUsageConfigurations) || this;
        _this.dbModelConfig = new pdoc_sql_config_1.PDocSqlConfig();
        _this.extendTableConfigs();
        _this.actionTagAssignAdapter = new common_sql_actiontag_assign_adapter_1.CommonSqlActionTagAssignAdapter(config, _this.knex, _this.sqlQueryBuilder, _this.dbModelConfig.getActionTagAssignConfig());
        _this.actionTagAssignJoinAdapter = new common_sql_actiontag_assignjoin_adapter_1.CommonSqlActionTagAssignJoinAdapter(config, _this.knex, _this.sqlQueryBuilder, _this.dbModelConfig.getActionTagAssignJoinConfig());
        _this.actionTagReplaceAdapter = new common_sql_actiontag_replace_adapter_1.CommonSqlActionTagReplaceAdapter(config, _this.knex, _this.sqlQueryBuilder, _this.dbModelConfig.getActionTagReplaceConfig());
        return _this;
    }
    PDocSqlAdapter.prototype.isActiveLoadDetailsMode = function (tableConfig, loadDetailDataConfig, loadDetailsMode) {
        if (loadDetailDataConfig && loadDetailDataConfig.modes) {
            if (!loadDetailsMode) {
                // mode required but no mode set on options
                return false;
            }
            if (loadDetailDataConfig.modes.indexOf(loadDetailsMode) < 0) {
                // mode not set on options
                return false;
            }
        }
        return true;
    };
    PDocSqlAdapter.prototype.extendTableConfigs = function () {
        this.sqlQueryBuilder.extendTableConfigs(pdoc_sql_config_1.PDocSqlConfig.tableConfigs);
    };
    PDocSqlAdapter.prototype.getTableConfig = function (params) {
        return this.getTableConfigForTableKey(this.extractTable(params));
    };
    PDocSqlAdapter.prototype.getTableConfigForTableKey = function (table) {
        return this.dbModelConfig.getTableConfigForTableKey(table);
    };
    PDocSqlAdapter.prototype.extractTable = function (params) {
        var tabKey = _super.prototype.extractTable.call(this, params);
        if (tabKey !== undefined || params.where === undefined) {
            return tabKey;
        }
        // fallback for several types
        var types = params.where['type_txt'];
        if (types === undefined || types.in === undefined ||
            !Array.isArray(types.in) || types.in.length < 1) {
            return undefined;
        }
        return undefined;
    };
    PDocSqlAdapter.prototype.getDefaultFacets = function () {
        var facets = new facets_1.Facets();
        var facet = new facets_1.Facet();
        facet.facet = ['page']
            .map(function (value) { return [value, 0]; });
        facet.selectLimit = 1;
        facets.facets.set('type_txt', facet);
        facet = new facets_1.Facet();
        facet.facet = ['relevance'].map(function (value) { return [value, 0]; });
        facets.facets.set('sorts', facet);
        return facets;
    };
    PDocSqlAdapter.prototype.queryTransformToAdapterWriteQuery = function (method, mapper, props, opts) {
        var query = _super.prototype.queryTransformToAdapterWriteQuery.call(this, method, mapper, props, opts);
        if (!query && !query.tableConfig && !query.tableConfig.key) {
            return query;
        }
        return query;
    };
    PDocSqlAdapter.prototype.transformToSqlDialect = function (sql) {
        // console.error("transformToSqlDialect before sql", sql);
        if (this.config.knexOpts.client !== 'mysql') {
            sql = pdoc_sql_utils_1.PDocSqlUtils.transformToSqliteDialect(sql);
        }
        sql = _super.prototype.transformToSqlDialect.call(this, sql);
        // console.error("transformToSqlDialect after sql", sql);
        return sql;
    };
    PDocSqlAdapter.prototype.saveDetailData = function (method, mapper, id, props, opts) {
        if (props.type === undefined) {
            return js_data_1.utils.resolve(false);
        }
        var dbId = parseInt(id + '', 10);
        if (!js_data_1.utils.isInteger(dbId)) {
            return js_data_1.utils.reject('saveDetailData ' + props.type + ' id not an integer');
        }
        var tabKey = props.type.toLowerCase();
        if (tabKey === 'page') {
            return new Promise(function (allResolve, allReject) {
                var promises = [];
                return Promise.all(promises).then(function () {
                    return allResolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('setPageDetails failed:', reason);
                    return allReject(reason);
                });
            });
        }
        return js_data_1.utils.resolve(true);
    };
    PDocSqlAdapter.prototype._doActionTag = function (mapper, record, actionTagForm, opts) {
        opts = opts || {};
        var id = parseInt(record.id.replace(/.*_/g, ''), 10);
        if (!js_data_1.utils.isInteger(id)) {
            return js_data_1.utils.reject(false);
        }
        var table = (record['type'] + '').toLowerCase();
        actionTagForm.deletes = false;
        if (actionTagForm.type === 'assign' && actionTagForm.key.startsWith('assign')) {
            return this.actionTagAssignAdapter.executeActionTagAssign(table, id, actionTagForm, opts);
        }
        else if (actionTagForm.type === 'assignjoin' && actionTagForm.key.startsWith('assignjoin')) {
            return this.actionTagAssignJoinAdapter.executeActionTagAssignJoin(table, id, actionTagForm, opts);
        }
        else if (actionTagForm.type === 'replace' && actionTagForm.key.startsWith('replace')) {
            actionTagForm.deletes = true;
            return this.actionTagReplaceAdapter.executeActionTagReplace(table, id, actionTagForm, opts);
        }
        return _super.prototype._doActionTag.call(this, mapper, record, actionTagForm, opts);
    };
    PDocSqlAdapter.prototype.queryTransformToAdapterSelectQuery = function (method, mapper, params, opts) {
        var tableConfig = this.getTableConfig(params);
        if (tableConfig === undefined) {
            return undefined;
        }
        var adapterQuery = params;
        this.remapFulltextFilter(adapterQuery, tableConfig, 'html', 'SF_searchNameOnly', 'htmlNameOnly', 'likein');
        this.remapFulltextFilter(adapterQuery, tableConfig, 'html', 'SF_searchTrackKeywordsOnly', 'track_keywords_txt', 'in');
        return this.sqlQueryBuilder.queryTransformToAdapterSelectQuery(tableConfig, method, adapterQuery, opts);
    };
    PDocSqlAdapter.prototype.remapFulltextFilter = function (adapterQuery, tableConfig, fulltextFilterName, fulltextNewTrigger, fulltextNewFilterName, fullTextNewAction) {
        if (adapterQuery.where && adapterQuery.where[fulltextFilterName] &&
            tableConfig.filterMapping.hasOwnProperty(fulltextNewFilterName)) {
            var filter = adapterQuery.where[fulltextFilterName];
            var action = Object.getOwnPropertyNames(filter)[0];
            var value = adapterQuery.where[fulltextFilterName][action];
            if (value.join(' ')
                .includes(fulltextNewTrigger)) {
                var fulltextValues = [];
                adapterQuery.where[fulltextNewFilterName] = [];
                for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                    var fulltextValue = value_1[_i];
                    fulltextValue = fulltextValue.split(fulltextNewTrigger)
                        .join('')
                        .trim();
                    if (fulltextValue && fulltextValue.length > 0) {
                        fulltextValues.push(fulltextValue);
                    }
                }
                adapterQuery.where[fulltextNewFilterName] = {};
                adapterQuery.where[fulltextNewFilterName][fullTextNewAction] = fulltextValues;
                adapterQuery.where[fulltextFilterName] = undefined;
                delete adapterQuery.where[fulltextFilterName];
            }
        }
    };
    return PDocSqlAdapter;
}(generic_sql_adapter_1.GenericSqlAdapter));
exports.PDocSqlAdapter = PDocSqlAdapter;
//# sourceMappingURL=pdoc-sql.adapter.js.map