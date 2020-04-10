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
var js_data_1 = require("js-data");
var generic_validator_util_1 = require("../forms/generic-validator.util");
var generic_searchform_1 = require("../forms/generic-searchform");
var util_1 = require("util");
var BaseEntityRecordFieldConfig = /** @class */ (function () {
    function BaseEntityRecordFieldConfig(datatype, validator) {
        this._datatype = datatype;
        this._validator = validator;
    }
    Object.defineProperty(BaseEntityRecordFieldConfig.prototype, "datatype", {
        get: function () {
            return this._datatype;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseEntityRecordFieldConfig.prototype, "validator", {
        get: function () {
            return this._validator;
        },
        enumerable: true,
        configurable: true
    });
    return BaseEntityRecordFieldConfig;
}());
exports.BaseEntityRecordFieldConfig = BaseEntityRecordFieldConfig;
var BaseEntityRecord = /** @class */ (function (_super) {
    __extends(BaseEntityRecord, _super);
    function BaseEntityRecord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseEntityRecord.prototype.toString = function (useWrapper, includeId) {
        useWrapper = typeof useWrapper === 'boolean' ? useWrapper : true;
        includeId = typeof includeId === 'boolean' ? includeId : true;
        return (useWrapper ? '{\n' : '') +
            (includeId ? 'id: ' + this.id + ',\n' : '') +
            (useWrapper ? '\n}' : '');
    };
    BaseEntityRecord.prototype.isValid = function () {
        return BaseEntityRecordValidator.instance.isValid(this);
    };
    BaseEntityRecord.genericFields = {
        id: new generic_searchform_1.GenericSearchFormFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID, new generic_validator_util_1.IdValidationRule(false))
    };
    return BaseEntityRecord;
}(js_data_1.Record));
exports.BaseEntityRecord = BaseEntityRecord;
var BaseEntityRecordFactory = /** @class */ (function () {
    function BaseEntityRecordFactory() {
    }
    BaseEntityRecordFactory.createSanitized = function (values) {
        var sanitizedValues = BaseEntityRecordFactory.instance.getSanitizedValues(values, {});
        return new BaseEntityRecord(sanitizedValues);
    };
    BaseEntityRecordFactory.cloneSanitized = function (doc) {
        var sanitizedValues = BaseEntityRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new BaseEntityRecord(sanitizedValues);
    };
    BaseEntityRecordFactory.prototype.getSanitizedValues = function (values, result) {
        return this.sanitizeFieldValues(values, BaseEntityRecord.genericFields, result, '');
    };
    BaseEntityRecordFactory.prototype.getSanitizedValuesFromObj = function (doc) {
        return this.getSanitizedValues(doc, {});
    };
    BaseEntityRecordFactory.prototype.getSanitizedRelationValues = function (relation, values) {
        throw new Error('unknown relation:' + relation);
    };
    BaseEntityRecordFactory.prototype.sanitizeFieldValues = function (values, fieldConfigs, result, fieldPrefix) {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        var sanitizedValues = result;
        for (var fieldConfigName in fieldConfigs) {
            var fieldConfig = fieldConfigs[fieldConfigName];
            sanitizedValues[fieldPrefix + fieldConfigName] =
                this.sanitizeFieldValue(values, fieldConfig.validator, fieldPrefix + fieldConfigName);
        }
        return sanitizedValues;
    };
    BaseEntityRecordFactory.prototype.sanitizeFieldValue = function (record, rule, fieldName) {
        return this.sanitizeValue(record[fieldName], rule);
    };
    BaseEntityRecordFactory.prototype.sanitizeValue = function (value, rule) {
        return rule.sanitize(value) || undefined;
    };
    BaseEntityRecordFactory.instance = new BaseEntityRecordFactory();
    return BaseEntityRecordFactory;
}());
exports.BaseEntityRecordFactory = BaseEntityRecordFactory;
var BaseEntityRecordValidator = /** @class */ (function () {
    function BaseEntityRecordValidator() {
    }
    BaseEntityRecordValidator.prototype.isValidValues = function (values, fieldPrefix, errFieldPrefix) {
        return this.validateValues(values, fieldPrefix, errFieldPrefix).length === 0;
    };
    BaseEntityRecordValidator.prototype.validateValues = function (values, fieldPrefix, errFieldPrefix) {
        var errors = [];
        this.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);
        this.validateMyValueRelationRules(values, errors, fieldPrefix, errFieldPrefix);
        return errors;
    };
    BaseEntityRecordValidator.prototype.isValid = function (doc, errFieldPrefix) {
        return this.validate(doc, errFieldPrefix).length === 0;
    };
    BaseEntityRecordValidator.prototype.validate = function (doc, errFieldPrefix) {
        var errors = [];
        this.validateMyFieldRules(doc, errors, '', errFieldPrefix);
        this.validateMyRelationRules(doc, errors, errFieldPrefix);
        return errors;
    };
    BaseEntityRecordValidator.prototype.validateMyValueRelationRules = function (values, errors, fieldPrefix, errFieldPrefix) {
        return true;
    };
    BaseEntityRecordValidator.prototype.validateMyRelationRules = function (doc, errors, errFieldPrefix) {
        return true;
    };
    BaseEntityRecordValidator.prototype.validateMyFieldRules = function (values, errors, fieldPrefix, errFieldPrefix) {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';
        return this.validateFieldRules(values, BaseEntityRecord.genericFields, fieldPrefix, errors, errFieldPrefix);
    };
    BaseEntityRecordValidator.prototype.validateValueRelationRules = function (values, relations, errors, fieldPrefix, errFieldPrefix) {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';
        var relErrors = [];
        for (var _i = 0, relations_1 = relations; _i < relations_1.length; _i++) {
            var relation = relations_1[_i];
            relErrors.push.apply(relErrors, this.validateValueRelationDoc(relation, values, fieldPrefix + relation + '.', errFieldPrefix));
        }
        errors.push.apply(errors, relErrors);
        return relErrors.length === 0;
    };
    BaseEntityRecordValidator.prototype.validateRelationRules = function (doc, relations, errors, fieldPrefix, errFieldPrefix) {
        var relErrors = [];
        for (var _i = 0, relations_2 = relations; _i < relations_2.length; _i++) {
            var relation = relations_2[_i];
            var subRecords = doc.get(relation) || doc[relation];
            if (util_1.isArray(subRecords)) {
                for (var _a = 0, subRecords_1 = subRecords; _a < subRecords_1.length; _a++) {
                    var subRecord = subRecords_1[_a];
                    relErrors.push.apply(relErrors, this.validateRelationDoc(relation, subRecord, errFieldPrefix + relation + '.'));
                }
            }
            else if (subRecords) {
                relErrors.push.apply(relErrors, this.validateRelationDoc(relation, subRecords, errFieldPrefix + relation + '.'));
            }
        }
        errors.push.apply(errors, relErrors);
        return relErrors.length === 0;
    };
    BaseEntityRecordValidator.prototype.validateRelationDoc = function (relation, doc, errFieldPrefix) {
        throw new Error('unknown relation:' + relation);
    };
    ;
    BaseEntityRecordValidator.prototype.validateValueRelationDoc = function (relation, values, fieldPrefix, errFieldPrefix) {
        throw new Error('unknown relation:' + relation);
    };
    ;
    BaseEntityRecordValidator.prototype.validateFieldRules = function (values, fieldConfigs, fieldPrefix, errors, errFieldPrefix) {
        var state = true;
        for (var fieldConfigName in fieldConfigs) {
            var fieldConfig = fieldConfigs[fieldConfigName];
            state = this.validateRule(values, fieldConfig.validator, fieldPrefix + fieldConfigName, errors, errFieldPrefix) && state;
        }
        return state;
    };
    BaseEntityRecordValidator.prototype.validateRule = function (record, rule, fieldName, errors, errFieldPrefix) {
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';
        return !rule.isValid(record[fieldName]) ? errors.push(errFieldPrefix + fieldName) && false : true;
    };
    BaseEntityRecordValidator.instance = new BaseEntityRecordValidator();
    return BaseEntityRecordValidator;
}());
exports.BaseEntityRecordValidator = BaseEntityRecordValidator;
//# sourceMappingURL=base-entity-record.js.map