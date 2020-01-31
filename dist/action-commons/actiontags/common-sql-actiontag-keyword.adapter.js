"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generic_validator_util_1 = require("../../search-commons/model/forms/generic-validator.util");
var js_data_1 = require("js-data");
var CommonSqlActionTagKeywordAdapter = /** @class */ (function () {
    function CommonSqlActionTagKeywordAdapter(commonSqlKeywordAdapter) {
        this.keywordValidationRule = new generic_validator_util_1.KeywordValidationRule(true);
        this.commonSqlKeywordAdapter = commonSqlKeywordAdapter;
    }
    CommonSqlActionTagKeywordAdapter.prototype.executeActionTagKeyword = function (table, id, actionTagForm, opts) {
        opts = opts || {};
        if (!js_data_1.utils.isInteger(id)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }
        var keywords = actionTagForm.payload.keywords;
        if (!this.keywordValidationRule.isValid(keywords)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' keywords not valid');
        }
        var keywordAction = actionTagForm.payload.keywordAction;
        if (keywordAction !== 'set' && keywordAction !== 'unset') {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' keywordAction not valid');
        }
        if (keywordAction === 'set') {
            return this.commonSqlKeywordAdapter.setGenericKeywords(table, id, keywords, opts, false);
        }
        else {
            return this.commonSqlKeywordAdapter.unsetGenericKeywords(table, id, keywords, opts);
        }
    };
    return CommonSqlActionTagKeywordAdapter;
}());
exports.CommonSqlActionTagKeywordAdapter = CommonSqlActionTagKeywordAdapter;
//# sourceMappingURL=common-sql-actiontag-keyword.adapter.js.map