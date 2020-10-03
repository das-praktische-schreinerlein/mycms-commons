import { ActionTagForm } from '../../commons/utils/actiontag.utils';
import { CommonSqlRateAdapter } from '../actions/common-sql-rate.adapter';
export interface RateActionTagForm extends ActionTagForm {
    payload: {
        ratekey: string;
        value: number;
    };
}
export declare class CommonSqlActionTagRateAdapter {
    private rateValidationRule;
    private keywordValidationRule;
    private readonly commonSqlRateAdapter;
    constructor(commonSqlRateAdapter: CommonSqlRateAdapter);
    executeActionTagRate(table: string, id: number, actionTagForm: RateActionTagForm, opts: any): Promise<any>;
    executeActionTagRateWithGreatestCheck(table: string, id: number, actionTagForm: RateActionTagForm, opts: any): Promise<any>;
    executeActionTagCommonRate(table: string, id: number, actionTagForm: RateActionTagForm, checkGreatestHimself: boolean, opts: any): Promise<any>;
}
