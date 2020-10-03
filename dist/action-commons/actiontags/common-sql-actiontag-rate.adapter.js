"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generic_validator_util_1 = require("../../search-commons/model/forms/generic-validator.util");
var js_data_1 = require("js-data");
var CommonSqlActionTagRateAdapter = /** @class */ (function () {
    function CommonSqlActionTagRateAdapter(commonSqlRateAdapter) {
        this.rateValidationRule = new generic_validator_util_1.NumberValidationRule(true, -1, 15, 0);
        this.keywordValidationRule = new generic_validator_util_1.KeywordValidationRule(true);
        this.commonSqlRateAdapter = commonSqlRateAdapter;
    }
    CommonSqlActionTagRateAdapter.prototype.executeActionTagRate = function (table, id, actionTagForm, opts) {
        return this.executeActionTagCommonRate(table, id, actionTagForm, false, opts);
    };
    CommonSqlActionTagRateAdapter.prototype.executeActionTagRateWithGreatestCheck = function (table, id, actionTagForm, opts) {
        return this.executeActionTagCommonRate(table, id, actionTagForm, true, opts);
    };
    CommonSqlActionTagRateAdapter.prototype.executeActionTagCommonRate = function (table, id, actionTagForm, checkGreatestHimself, opts) {
        opts = opts || {};
        if (!js_data_1.utils.isInteger(id)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }
        var rateKey = actionTagForm.payload.ratekey;
        if (!this.keywordValidationRule.isValid(rateKey)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' ratekey not valid');
        }
        var rate = actionTagForm.payload.value || 0;
        if (!this.rateValidationRule.isValid(rate)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' rate not valid');
        }
        var rates = {};
        rates[rateKey] = rate;
        return this.commonSqlRateAdapter.setRates(table, id, rates, checkGreatestHimself, opts);
    };
    return CommonSqlActionTagRateAdapter;
}());
exports.CommonSqlActionTagRateAdapter = CommonSqlActionTagRateAdapter;
//# sourceMappingURL=common-sql-actiontag-rate.adapter.js.map