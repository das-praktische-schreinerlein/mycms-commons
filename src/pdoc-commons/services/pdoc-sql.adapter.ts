import {PDocSearchForm} from '../model/forms/pdoc-searchform';
import {PDocSearchResult} from '../model/container/pdoc-searchresult';
import {GenericSqlAdapter} from '../../search-commons/services/generic-sql.adapter';
import {PDocAdapterResponseMapper} from './pdoc-adapter-response.mapper';
import {
    FacetCacheUsageConfigurations,
    LoadDetailDataConfig,
    SelectQueryData,
    TableConfig,
    WriteQueryData
} from '../../search-commons/services/sql-query.builder';
import {AdapterOpts, AdapterQuery} from '../../search-commons/services/mapper.utils';
import {Facet, Facets} from '../../search-commons/model/container/facets';
import {Mapper, utils} from 'js-data';
import {ActionTagForm} from '../../commons/utils/actiontag.utils';
import {PDocSqlConfig} from './pdoc-sql.config';
import {PDocSqlUtils} from './pdoc-sql.utils';
import {
    AssignActionTagForm,
    CommonSqlActionTagAssignAdapter
} from '../../action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {
    CommonSqlActionTagReplaceAdapter,
    ReplaceActionTagForm
} from '../../action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {
    AssignJoinActionTagForm,
    CommonSqlActionTagAssignJoinAdapter
} from '../../action-commons/actiontags/common-sql-actiontag-assignjoin.adapter';
import {PDocRecord} from "../model/records/pdoc-record";

// TODO sync with model

export class PDocSqlAdapter extends GenericSqlAdapter<PDocRecord, PDocSearchForm, PDocSearchResult> {
    private readonly actionTagAssignAdapter: CommonSqlActionTagAssignAdapter;
    private readonly actionTagAssignJoinAdapter: CommonSqlActionTagAssignJoinAdapter;
    private readonly actionTagReplaceAdapter: CommonSqlActionTagReplaceAdapter;
    private readonly dbModelConfig: PDocSqlConfig = new PDocSqlConfig();

    constructor(config: any, facetCacheUsageConfigurations: FacetCacheUsageConfigurations) {
        super(config, new PDocAdapterResponseMapper(config), facetCacheUsageConfigurations);
        this.extendTableConfigs();
        this.actionTagAssignAdapter = new CommonSqlActionTagAssignAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getActionTagAssignConfig());
        this.actionTagAssignJoinAdapter = new CommonSqlActionTagAssignJoinAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getActionTagAssignJoinConfig());
        this.actionTagReplaceAdapter = new CommonSqlActionTagReplaceAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getActionTagReplaceConfig());
    }

    protected isActiveLoadDetailsMode(tableConfig: TableConfig, loadDetailDataConfig: LoadDetailDataConfig,
                                      loadDetailsMode: string): boolean {
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
    }

    protected extendTableConfigs() {
        this.sqlQueryBuilder.extendTableConfigs(PDocSqlConfig.tableConfigs);
    }

    protected getTableConfig(params: AdapterQuery): TableConfig {
        return this.getTableConfigForTableKey(this.extractTable(params));
    }

    protected getTableConfigForTableKey(table: string): TableConfig {
        return this.dbModelConfig.getTableConfigForTableKey(table);
    }

    protected extractTable(params: AdapterQuery): string {
        let tabKey = super.extractTable(params);
        if (tabKey !== undefined || params.where === undefined) {
            return tabKey;
        }

        // fallback for several types
        const types = params.where['type_txt'];
        if (types === undefined || types.in === undefined ||
            !Array.isArray(types.in) || types.in.length < 1) {
            return undefined;
        }

        return undefined;
    }

    protected getDefaultFacets(): Facets {
        const facets = new Facets();
        let facet = new Facet();
        facet.facet = ['page']
            .map(value => {return [value, 0]; });
        facet.selectLimit = 1;
        facets.facets.set('type_txt', facet);
        facet = new Facet();
        facet.facet = ['relevance'].map(value => {return [value, 0]; });
        facets.facets.set('sorts', facet);

        return facets;
    }

    protected queryTransformToAdapterWriteQuery(method: string, mapper: Mapper, props: any, opts: any): WriteQueryData {
        const query = super.queryTransformToAdapterWriteQuery(method, mapper, props, opts);
        if (!query && !query.tableConfig && !query.tableConfig.key) {
            return query;
        }

        return query;
    }

    protected transformToSqlDialect(sql: string): string {
        // console.error("transformToSqlDialect before sql", sql);
        if (this.config.knexOpts.client !== 'mysql') {
            sql = PDocSqlUtils.transformToSqliteDialect(sql);
        }

        sql = super.transformToSqlDialect(sql);
        // console.error("transformToSqlDialect after sql", sql);

        return sql;
    }

    protected saveDetailData(method: string, mapper: Mapper, id: string | number, props: any, opts?: any): Promise<boolean> {
        if (props.type === undefined) {
            return utils.resolve(false);
        }
        const dbId = parseInt(id + '', 10);
        if (!utils.isInteger(dbId)) {
            return utils.reject('saveDetailData ' + props.type + ' id not an integer');
        }

        const tabKey = props.type.toLowerCase();
        if (tabKey === 'page') {
            return new Promise<boolean>((allResolve, allReject) => {
                const promises = [];

                return Promise.all(promises).then(() => {
                    return allResolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('setPageDetails failed:', reason);
                    return allReject(reason);
                });
            });
        }


        return utils.resolve(true);
    }

    protected _doActionTag(mapper: Mapper, record: PDocRecord, actionTagForm: ActionTagForm, opts: any): Promise<any> {
        opts = opts || {};
        const id = parseInt(record.id.replace(/.*_/g, ''), 10);
        if (!utils.isInteger(id)) {
            return utils.reject(false);
        }

        const table = (record['type'] + '').toLowerCase();
        actionTagForm.deletes = false;
        if (actionTagForm.type === 'assign' && actionTagForm.key.startsWith('assign')) {
            return this.actionTagAssignAdapter.executeActionTagAssign(table, id, <AssignActionTagForm> actionTagForm, opts);
        } else if (actionTagForm.type === 'assignjoin' && actionTagForm.key.startsWith('assignjoin')) {
            return this.actionTagAssignJoinAdapter.executeActionTagAssignJoin(table, id, <AssignJoinActionTagForm> actionTagForm, opts);
        } else if (actionTagForm.type === 'replace' && actionTagForm.key.startsWith('replace')) {
            actionTagForm.deletes = true;
            return this.actionTagReplaceAdapter.executeActionTagReplace(table, id, <ReplaceActionTagForm> actionTagForm, opts);
        }

        return super._doActionTag(mapper, record, actionTagForm, opts);
    }

    protected queryTransformToAdapterSelectQuery(method: string, mapper: Mapper, params: any, opts: any): SelectQueryData {
        const tableConfig = this.getTableConfig(<AdapterQuery>params);
        if (tableConfig === undefined) {
            return undefined;
        }

        const adapterQuery: AdapterQuery = <AdapterQuery>params;
        this.remapFulltextFilter(adapterQuery, tableConfig, 'html', 'SF_searchNameOnly', 'htmlNameOnly', 'likein');
        this.remapFulltextFilter(adapterQuery, tableConfig, 'html', 'SF_searchTrackKeywordsOnly', 'track_keywords_txt', 'in');

        return this.sqlQueryBuilder.queryTransformToAdapterSelectQuery(tableConfig, method, adapterQuery, <AdapterOpts>opts);
    }


    protected remapFulltextFilter(adapterQuery: AdapterQuery, tableConfig: TableConfig, fulltextFilterName: string,
                                  fulltextNewTrigger: string, fulltextNewFilterName: string, fullTextNewAction: string) {
        if (adapterQuery.where && adapterQuery.where[fulltextFilterName] &&
            tableConfig.filterMapping.hasOwnProperty(fulltextNewFilterName)) {
            const filter = adapterQuery.where[fulltextFilterName];
            const action = Object.getOwnPropertyNames(filter)[0];
            const value: string[] = adapterQuery.where[fulltextFilterName][action];

            if (value.join(' ')
                .includes(fulltextNewTrigger)) {

                const fulltextValues = [];
                adapterQuery.where[fulltextNewFilterName] = [];
                for (let fulltextValue of value) {
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
    }
}

