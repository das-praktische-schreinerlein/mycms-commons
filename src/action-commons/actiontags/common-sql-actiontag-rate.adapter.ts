import {ActionTagForm} from '../../commons/utils/actiontag.utils';
import {KeywordValidationRule, NumberValidationRule} from '../../search-commons/model/forms/generic-validator.util';
import {utils} from 'js-data';
import {CommonSqlRateAdapter} from '../actions/common-sql-rate.adapter';

export interface RateActionTagForm extends ActionTagForm {
    payload: {
        ratekey: string;
        value: number;
    };
}

export class CommonSqlActionTagRateAdapter {

    private rateValidationRule = new NumberValidationRule(true, -1, 15, 0);
    private keywordValidationRule = new KeywordValidationRule(true);
    private readonly commonSqlRateAdapter: CommonSqlRateAdapter;

    constructor(commonSqlRateAdapter: CommonSqlRateAdapter) {
        this.commonSqlRateAdapter = commonSqlRateAdapter;
    }

    public executeActionTagRate(table: string, id: number, actionTagForm: RateActionTagForm, opts: any): Promise<any> {
        return this.executeActionTagCommonRate(table, id, actionTagForm, false,  opts);
    }

    public executeActionTagRateWithGreatestCheck(table: string, id: number, actionTagForm: RateActionTagForm,
                                                 opts: any): Promise<any> {
        return this.executeActionTagCommonRate(table, id, actionTagForm, true,  opts);
    }

    public executeActionTagCommonRate(table: string, id: number, actionTagForm: RateActionTagForm,
                                      checkGreatestHimself: boolean, opts: any): Promise<any> {
        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }

        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }

        const rateKey = actionTagForm.payload.ratekey;
        if (!this.keywordValidationRule.isValid(rateKey)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' ratekey not valid');
        }

        const rate = actionTagForm.payload.value || 0;
        if (!this.rateValidationRule.isValid(rate)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' rate not valid');
        }

        const rates = {};
        rates[rateKey] = rate;

        return this.commonSqlRateAdapter.setRates(table, id, rates, checkGreatestHimself, opts);
    }
}
