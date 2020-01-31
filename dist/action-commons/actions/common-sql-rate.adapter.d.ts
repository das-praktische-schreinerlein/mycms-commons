import { SqlQueryBuilder } from '../../search-commons/services/sql-query.builder';
export interface RateModelConfigRateType {
    [key: string]: string;
}
export interface RateModelConfigTableType {
    fieldId: string;
    fieldSum: string;
    rateFields: RateModelConfigRateType;
    table: string;
}
export interface RateModelConfigTablesType {
    [key: string]: RateModelConfigTableType;
}
export interface RateModelConfigType {
    tables: RateModelConfigTablesType;
}
export declare class CommonSqlRateAdapter {
    private config;
    private readonly knex;
    private sqlQueryBuilder;
    private readonly rateModelConfig;
    private rateValidationRule;
    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, rateModelConfig: RateModelConfigType);
    setRates(rateTableKey: string, dbId: number, rates: {
        [key: string]: number;
    }, checkGreatestHimself: boolean, opts: any): Promise<any>;
}
