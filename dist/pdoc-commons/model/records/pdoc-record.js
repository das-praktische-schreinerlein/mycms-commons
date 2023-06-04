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
var base_entity_record_1 = require("../../../search-commons/model/records/base-entity-record");
var cdoc_entity_record_1 = require("../../../search-commons/model/records/cdoc-entity-record");
var util_1 = require("util");
var generic_validator_util_1 = require("../../../search-commons/model/forms/generic-validator.util");
exports.PDocRecordRelation = {
    hasOne: {},
    hasMany: {}
};
var PDocRecord = /** @class */ (function (_super) {
    __extends(PDocRecord, _super);
    function PDocRecord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDocRecord.cloneToSerializeToJsonObj = function (baseRecord, anonymizeMedia) {
        var record = {};
        for (var key in baseRecord) {
            record[key] = baseRecord[key];
        }
        for (var _i = 0, _a = PDocRecord.pdocRelationNames; _i < _a.length; _i++) {
            var relationName = _a[_i];
            record[relationName] = baseRecord.get(relationName);
        }
        if (anonymizeMedia === true) {
            var relationName = 'pdocimages';
            if (util_1.isArray(record[relationName])) {
                for (var _b = 0, _c = record[relationName]; _b < _c.length; _b++) {
                    var media = _c[_b];
                    media.fileName = 'anonymized.JPG';
                }
            }
            relationName = 'pdocvideos';
            if (util_1.isArray(record[relationName])) {
                for (var _d = 0, _e = record[relationName]; _d < _e.length; _d++) {
                    var media = _e[_d];
                    media.fileName = 'anonymized.MP4';
                }
            }
        }
        return record;
    };
    PDocRecord.prototype.toString = function () {
        return 'PDocRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  heading: ' + this.name + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  theme: ' + this.theme + '' +
            '  type: ' + this.type + '' +
            '}';
    };
    PDocRecord.prototype.toSerializableJsonObj = function (anonymizeMedia) {
        return PDocRecord.cloneToSerializeToJsonObj(this, anonymizeMedia);
    };
    PDocRecord.prototype.isValid = function () {
        return PDocRecordValidator.instance.isValid(this);
    };
    PDocRecord.pdocRelationNames = []
        .concat(exports.PDocRecordRelation.hasOne ? Object.keys(exports.PDocRecordRelation.hasOne).map(function (key) {
        return exports.PDocRecordRelation.hasOne[key].localField;
    }) : [])
        .concat(exports.PDocRecordRelation.hasMany ? Object.keys(exports.PDocRecordRelation.hasMany).map(function (key) {
        return exports.PDocRecordRelation.hasMany[key].localField;
    }) : []);
    PDocRecord.pdocValidationRelationNames = []
        .concat(exports.PDocRecordRelation.hasOne ? Object.keys(exports.PDocRecordRelation.hasOne).map(function (key) {
        return exports.PDocRecordRelation.hasOne[key].localField;
    }) : []);
    PDocRecord.pdocFields = {
        css: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.HTML, new generic_validator_util_1.HtmlValidationRule(false)),
        flags: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID, new generic_validator_util_1.IdCsvValidationRule(false)),
        heading: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.MARKDOWN, new generic_validator_util_1.MarkdownValidationRule(false)),
        key: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID, new generic_validator_util_1.IdValidationRule(true)),
        langkeys: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID, new generic_validator_util_1.IdCsvValidationRule(true)),
        pageId: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID, new generic_validator_util_1.IdValidationRule(false)),
        profiles: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID, new generic_validator_util_1.IdCsvValidationRule(true)),
        subSectionIds: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID, new generic_validator_util_1.IdCsvValidationRule(false)),
        teaser: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.MARKDOWN, new generic_validator_util_1.MarkdownValidationRule(false)),
        theme: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID, new generic_validator_util_1.IdValidationRule(false)),
    };
    return PDocRecord;
}(cdoc_entity_record_1.CommonDocRecord));
exports.PDocRecord = PDocRecord;
var PDocRecordFactory = /** @class */ (function (_super) {
    __extends(PDocRecordFactory, _super);
    function PDocRecordFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDocRecordFactory.createSanitized = function (values) {
        var sanitizedValues = PDocRecordFactory.instance.getSanitizedValues(values, {});
        return new PDocRecord(sanitizedValues);
    };
    PDocRecordFactory.cloneSanitized = function (doc) {
        var sanitizedValues = PDocRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new PDocRecord(sanitizedValues);
    };
    PDocRecordFactory.prototype.getSanitizedValues = function (values, result) {
        _super.prototype.getSanitizedValues.call(this, values, result);
        this.sanitizeFieldValues(values, PDocRecord.pdocFields, result, '');
        return result;
    };
    PDocRecordFactory.prototype.getSanitizedRelationValues = function (relation, values) {
        switch (relation) {
            default:
                return _super.prototype.getSanitizedRelationValues.call(this, relation, values);
        }
    };
    ;
    PDocRecordFactory.instance = new PDocRecordFactory();
    return PDocRecordFactory;
}(cdoc_entity_record_1.CommonDocRecordFactory));
exports.PDocRecordFactory = PDocRecordFactory;
var PDocRecordValidator = /** @class */ (function (_super) {
    __extends(PDocRecordValidator, _super);
    function PDocRecordValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDocRecordValidator.prototype.isValid = function (doc, errFieldPrefix) {
        return this.validate(doc, errFieldPrefix).length === 0;
    };
    PDocRecordValidator.prototype.validateMyFieldRules = function (values, errors, fieldPrefix, errFieldPrefix) {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';
        var state = _super.prototype.validateMyFieldRules.call(this, values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, PDocRecord.pdocFields, fieldPrefix, errors, errFieldPrefix) && state;
    };
    PDocRecordValidator.prototype.validateMyValueRelationRules = function (values, errors, fieldPrefix, errFieldPrefix) {
        return this.validateValueRelationRules(values, PDocRecord.pdocValidationRelationNames, errors, fieldPrefix, errFieldPrefix);
    };
    PDocRecordValidator.prototype.validateMyRelationRules = function (doc, errors, fieldPrefix, errFieldPrefix) {
        return this.validateRelationRules(doc, PDocRecord.pdocRelationNames, errors, fieldPrefix, errFieldPrefix);
    };
    PDocRecordValidator.prototype.validateRelationDoc = function (relation, doc, errFieldPrefix) {
        switch (relation) {
            default:
                return _super.prototype.validateRelationDoc.call(this, relation, doc, errFieldPrefix);
        }
    };
    ;
    PDocRecordValidator.prototype.validateValueRelationDoc = function (relation, values, fieldPrefix, errFieldPrefix) {
        switch (relation) {
            default:
                return _super.prototype.validateValueRelationDoc.call(this, relation, values, fieldPrefix, errFieldPrefix);
        }
    };
    ;
    PDocRecordValidator.instance = new PDocRecordValidator();
    return PDocRecordValidator;
}(cdoc_entity_record_1.CommonDocRecordValidator));
exports.PDocRecordValidator = PDocRecordValidator;
//# sourceMappingURL=pdoc-record.js.map