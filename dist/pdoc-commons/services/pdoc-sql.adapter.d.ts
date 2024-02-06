import { PDocSearchForm } from '../model/forms/pdoc-searchform';
import { PDocSearchResult } from '../model/container/pdoc-searchresult';
import { GenericSqlAdapter } from '../../search-commons/services/generic-sql.adapter';
import { FacetCacheUsageConfigurations, LoadDetailDataConfig, SelectQueryData, TableConfig, WriteQueryData } from '../../search-commons/services/sql-query.builder';
import { AdapterQuery } from '../../search-commons/services/mapper.utils';
import { Facets } from '../../search-commons/model/container/facets';
import { Mapper } from 'js-data';
import { ActionTagForm } from '../../commons/utils/actiontag.utils';
import { PDocRecord } from '../model/records/pdoc-record';
export declare class PDocSqlAdapter extends GenericSqlAdapter<PDocRecord, PDocSearchForm, PDocSearchResult> {
    private readonly actionTagAssignAdapter;
    private readonly actionTagAssignJoinAdapter;
    private readonly actionTagReplaceAdapter;
    private readonly commonKeywordAdapter;
    private readonly dbModelConfig;
    constructor(config: any, facetCacheUsageConfigurations: FacetCacheUsageConfigurations);
    protected isActiveLoadDetailsMode(tableConfig: TableConfig, loadDetailDataConfig: LoadDetailDataConfig, loadDetailsMode: string): boolean;
    protected extendTableConfigs(): void;
    protected getTableConfig(params: AdapterQuery): TableConfig;
    protected getTableConfigForTableKey(table: string): TableConfig;
    protected extractTable(params: AdapterQuery): string;
    protected getDefaultFacets(): Facets;
    protected queryTransformToAdapterWriteQuery(method: string, mapper: Mapper, props: any, opts: any): WriteQueryData;
    protected transformToSqlDialect(sql: string): string;
    protected saveDetailData(method: string, mapper: Mapper, id: string | number, props: any, opts?: any): Promise<boolean>;
    protected _doActionTag(mapper: Mapper, record: PDocRecord, actionTagForm: ActionTagForm, opts: any): Promise<any>;
    protected queryTransformToAdapterSelectQuery(method: string, mapper: Mapper, params: any, opts: any): SelectQueryData;
}
