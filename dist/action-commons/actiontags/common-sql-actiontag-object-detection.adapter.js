"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generic_validator_util_1 = require("../../search-commons/model/forms/generic-validator.util");
var js_data_1 = require("js-data");
var objectdetection_model_1 = require("../../commons/model/objectdetection-model");
var CommonSqlActionTagObjectDetectionAdapter = /** @class */ (function () {
    function CommonSqlActionTagObjectDetectionAdapter(commonSqlObjectDetectionAdapter) {
        this.keywordValidationRule = new generic_validator_util_1.KeywordValidationRule(true);
        this.precisionValidationRule = new generic_validator_util_1.NumberValidationRule(true, 0, 1, 1);
        this.commonSqlObjectDetectionAdapter = commonSqlObjectDetectionAdapter;
    }
    CommonSqlActionTagObjectDetectionAdapter.prototype.executeActionTagObjects = function (table, id, actionTagForm, opts) {
        if (!js_data_1.utils.isInteger(id)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }
        var objectKey = actionTagForm.payload.objectkey;
        var precision = actionTagForm.payload.precision || 1;
        var detector = actionTagForm.payload.detector || 'playlist';
        if (!this.keywordValidationRule.isValid(objectKey)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' objectkey not valid');
        }
        if (!this.keywordValidationRule.isValid(detector)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' detector not valid');
        }
        if (!this.precisionValidationRule.isValid(precision)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' precision not valid');
        }
        return this.commonSqlObjectDetectionAdapter.setObjects(table, id, objectKey, precision, detector, actionTagForm.payload.set, opts);
    };
    CommonSqlActionTagObjectDetectionAdapter.prototype.executeActionTagObjectsState = function (table, id, actionTagForm, opts) {
        if (!js_data_1.utils.isInteger(id)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }
        var state = actionTagForm.payload.state;
        if (!this.keywordValidationRule.isValid(state)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' state not valid');
        }
        return this.commonSqlObjectDetectionAdapter.setObjectsState(table, id, state, opts);
    };
    CommonSqlActionTagObjectDetectionAdapter.prototype.executeActionTagObjectsKey = function (table, id, actionTagForm, opts) {
        if (!js_data_1.utils.isInteger(id)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }
        var objectname = actionTagForm.payload.objectname;
        var objectcategory = actionTagForm.payload.objectcategory;
        var state = actionTagForm.payload.state;
        var action = actionTagForm.payload.action;
        var objectkey = actionTagForm.payload.objectkey;
        var detector = actionTagForm.payload.detector;
        if (!this.keywordValidationRule.isValid(detector)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' detector not valid');
        }
        if (!this.keywordValidationRule.isValid(objectkey)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' objectkey not valid');
        }
        if (!this.keywordValidationRule.isValid(action)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' action not valid');
        }
        if (!this.keywordValidationRule.isValid(state)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' state not valid');
        }
        if (state !== objectdetection_model_1.ObjectDetectionState.RUNNING_MANUAL_CORRECTED && state !== objectdetection_model_1.ObjectDetectionState.RUNNING_MANUAL_DETAILED) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' state not allowed');
        }
        if (action === 'changeObjectKeyForRecord') {
            // NOOP
        }
        else if (action === 'changeObjectLabelForObjectKey'
            || action === 'createNewObjectKeyAndObjectLabel'
            || action === 'createObjectLabelForObjectKey') {
            if (!this.keywordValidationRule.isValid(objectname)) {
                return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' objectname not valid');
            }
            // insert object_name if not exists
            if (action === 'createNewObjectKeyAndObjectLabel' || action === 'createObjectLabelForObjectKey') {
                if (!this.keywordValidationRule.isValid(objectcategory)) {
                    return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' objectcategory not valid');
                }
            }
        }
        else {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' action unknown');
        }
        return this.commonSqlObjectDetectionAdapter.updateObjectsKey(table, id, detector, objectkey, objectname, objectcategory, action, state, opts);
    };
    return CommonSqlActionTagObjectDetectionAdapter;
}());
exports.CommonSqlActionTagObjectDetectionAdapter = CommonSqlActionTagObjectDetectionAdapter;
//# sourceMappingURL=common-sql-actiontag-object-detection.adapter.js.map