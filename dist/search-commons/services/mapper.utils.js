"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var date_utils_1 = require("../../commons/utils/date.utils");
var object_utils_1 = require("../../commons/utils/object.utils");
var AdapterFilterActions = /** @class */ (function () {
    function AdapterFilterActions() {
    }
    AdapterFilterActions.LIKEI = 'likei';
    AdapterFilterActions.LIKE = 'like';
    AdapterFilterActions.EQ1 = '==';
    AdapterFilterActions.EQ2 = 'eq';
    AdapterFilterActions.GT = '>';
    AdapterFilterActions.GE = '>=';
    AdapterFilterActions.LT = '<';
    AdapterFilterActions.LE = '<=';
    AdapterFilterActions.IN = 'in';
    AdapterFilterActions.IN_NUMBER = 'in_number';
    AdapterFilterActions.IN_CSV = 'in_csv';
    AdapterFilterActions.LIKEIN = 'likein';
    AdapterFilterActions.NOTIN = 'notin';
    return AdapterFilterActions;
}());
exports.AdapterFilterActions = AdapterFilterActions;
var MapperUtils = /** @class */ (function () {
    function MapperUtils(_objectSeparator, _fieldSeparator, _valueSeparator) {
        this._objectSeparator = _objectSeparator || MapperUtils.DEFAULT_OBJECTSEPARATOR;
        this._fieldSeparator = _fieldSeparator || MapperUtils.DEFAULT_FIELDSEPARATOR;
        this._valueSeparator = _valueSeparator || MapperUtils.DEFAULT_VALUESEPARATOR;
    }
    MapperUtils.prototype.mapToAdapterFieldName = function (mapping, fieldName) {
        if (mapping.hasOwnProperty(fieldName)) {
            return mapping[fieldName];
        }
        return fieldName;
    };
    MapperUtils.prototype.getMappedAdapterValue = function (mapping, adapterDocument, adapterFieldName, defaultValue) {
        return this.getAdapterValue(adapterDocument, this.mapToAdapterFieldName(mapping, adapterFieldName), defaultValue);
    };
    MapperUtils.prototype.getMappedAdapterNumberValue = function (mapping, adapterDocument, adapterFieldName, defaultValue) {
        return this.getAdapterNumberValue(adapterDocument, this.mapToAdapterFieldName(mapping, adapterFieldName), defaultValue);
    };
    MapperUtils.prototype.getMappedAdapterDateTimeValue = function (mapping, adapterDocument, adapterFieldName, defaultValue) {
        return this.getAdapterDateTimeValue(adapterDocument, this.mapToAdapterFieldName(mapping, adapterFieldName), defaultValue);
    };
    MapperUtils.prototype.getAdapterValue = function (adapterDocument, adapterFieldName, defaultValue) {
        var value = defaultValue;
        if (adapterDocument[adapterFieldName] !== undefined && adapterDocument[adapterFieldName] !== null) {
            if (Array.isArray(adapterDocument[adapterFieldName])) {
                value = adapterDocument[adapterFieldName][0];
            }
            else {
                value = adapterDocument[adapterFieldName];
            }
        }
        return value;
    };
    MapperUtils.prototype.getAdapterNumberValue = function (adapterDocument, adapterFieldName, defaultValue) {
        var value = defaultValue;
        if (adapterDocument[adapterFieldName] !== undefined && adapterDocument[adapterFieldName] !== null) {
            if (Array.isArray(adapterDocument[adapterFieldName])) {
                value = adapterDocument[adapterFieldName][0];
            }
            else {
                value = adapterDocument[adapterFieldName];
            }
            if (value === undefined) {
                return undefined;
            }
            if (typeof value === 'string') {
                value = Number.parseFloat(value);
            }
            value = Number(value);
        }
        return value;
    };
    MapperUtils.prototype.getAdapterDateTimeValue = function (adapterDocument, adapterFieldName, defaultValue) {
        var value = defaultValue;
        if (adapterDocument[adapterFieldName] !== undefined && adapterDocument[adapterFieldName] !== null) {
            if (Array.isArray(adapterDocument[adapterFieldName])) {
                value = adapterDocument[adapterFieldName][0];
            }
            else {
                value = adapterDocument[adapterFieldName];
            }
            if (value === undefined) {
                return undefined;
            }
            value = date_utils_1.DateUtils.dateToLocalISOString(value);
        }
        return value;
    };
    MapperUtils.prototype.getAdapterCoorValue = function (adapterDocument, adapterFieldName, defaultValue) {
        var value = defaultValue;
        if (adapterDocument[adapterFieldName] !== undefined && adapterDocument[adapterFieldName] !== null) {
            if (Array.isArray(adapterDocument[adapterFieldName])) {
                value = adapterDocument[adapterFieldName][0];
            }
            else if (adapterDocument[adapterFieldName] !== '0' && adapterDocument[adapterFieldName] !== '0,0') {
                value = adapterDocument[adapterFieldName];
            }
        }
        return value;
    };
    MapperUtils.prototype.prepareEscapedSingleValue = function (value, splitter, joiner) {
        var _this = this;
        value = this.prepareSingleValue(value, ' ');
        value = this.escapeAdapterValue(value);
        var values = this.prepareValueToArray(value, splitter);
        value = values.map(function (inValue) { return _this.escapeAdapterValue(inValue); }).join(joiner);
        return value;
    };
    MapperUtils.prototype.prepareSingleValue = function (value, joiner) {
        switch (typeof value) {
            case 'string':
                return value.toString();
            case 'number':
                return '' + value;
            default:
        }
        if (Array.isArray(value)) {
            return value.join(joiner);
        }
        return value.toString();
    };
    MapperUtils.prototype.prepareValueToArray = function (value, splitter) {
        return value.toString().split(splitter);
    };
    MapperUtils.prototype.escapeAdapterValue = function (value) {
        value = value.toString().replace(/[%]/g, ' ')
            .replace(/[\"\':\()\[\]\x00\n\r\x1a\\]/g, ' ')
            .replace(/[ ]+/g, ' ')
            .trim();
        return value;
    };
    MapperUtils.prototype.splitPairs = function (arr) {
        var pairs = [];
        for (var i = 0; i < arr.length; i += 2) {
            if (arr[i + 1] !== undefined) {
                pairs.push([arr[i], arr[i + 1]]);
            }
            else {
                pairs.push([arr[i]]);
            }
        }
        return pairs;
    };
    MapperUtils.prototype.mapDetailDocsToDetailRecords = function (mapper, factory, record, detailDocs) {
        var detailRecords = [];
        if (detailDocs !== undefined) {
            var id = this.extractUniqueId(record);
            for (var _i = 0, detailDocs_1 = detailDocs; _i < detailDocs_1.length; _i++) {
                var detailDoc = detailDocs_1[_i];
                if (detailDoc === undefined || detailDoc === null) {
                    continue;
                }
                var detailValues = __assign({}, detailDoc);
                detailValues['id'] = (id++).toString() + record.id;
                var detailRecord = mapper.createRecord(factory.getSanitizedValues(detailValues, {}));
                detailRecords.push(detailRecord);
            }
        }
        return detailRecords;
    };
    MapperUtils.prototype.explodeAndMapDetailResponseDocuments = function (mapper, relation, srcFields, record, docs, unique) {
        var _this = this;
        if (unique === void 0) { unique = true; }
        if (docs === undefined) {
            return;
        }
        var subDocs = [];
        docs.forEach(function (doc) {
            var fieldName;
            for (var _i = 0, srcFields_1 = srcFields; _i < srcFields_1.length; _i++) {
                var srcField = srcFields_1[_i];
                if (doc[srcField] !== undefined && doc[srcField] !== null) {
                    fieldName = srcField;
                    break;
                }
            }
            if (fieldName !== undefined && doc[fieldName] !== undefined && doc[fieldName] !== null) {
                var objects = object_utils_1.ObjectUtils.explodeValueToObjects(doc[fieldName], _this._objectSeparator, _this._fieldSeparator, _this._valueSeparator, unique);
                subDocs = subDocs.concat(objects);
            }
        });
        record.set(relation.localField, this.mapDetailDocsToDetailRecords(mapper['datastore']._mappers[relation.mapperKey], relation.factory, record, subDocs));
    };
    MapperUtils.prototype.mapValuesToSubRecords = function (mapper, values, record, relations) {
        if (relations.hasOne) {
            for (var relationKey in relations.hasOne) {
                var relation = relations.hasOne[relationKey];
                var subMapper = mapper['datastore']._mappers[relation.mapperKey];
                var subValues = undefined;
                for (var key in values) {
                    if (key.startsWith(relation.localField + '.')) {
                        var subKey = key.replace(relation.localField + '.', '');
                        subValues = subValues || {};
                        subValues[subKey] = values[key];
                    }
                }
                if (subValues) {
                    record.set(relation.localField, subMapper.createRecord(relation.factory.getSanitizedValues(subValues, {})));
                }
                else {
                    record.set(relation.localField, undefined);
                }
            }
        }
        if (relations.hasMany) {
            for (var relationKey in relations.hasMany) {
                var relation = relations.hasMany[relationKey];
                var joinMapper = mapper['datastore']._mappers[relation.mapperKey];
                if (values[relation.localField]) {
                    var joinValues = values[relation.localField];
                    var joinRecords = [];
                    for (var _i = 0, joinValues_1 = joinValues; _i < joinValues_1.length; _i++) {
                        var joinRecordProps = joinValues_1[_i];
                        joinRecords.push(joinMapper.createRecord(relation.factory.getSanitizedValues(joinRecordProps, {})));
                    }
                    if (joinRecords.length > 0) {
                        record.set(relation.localField, joinRecords);
                    }
                    else {
                        record.set(relation.localField, undefined);
                    }
                }
            }
        }
    };
    MapperUtils.prototype.extractUniqueId = function (record) {
        if (record === undefined || record.id === undefined) {
            return undefined;
        }
        var id = Number(record.id.replace(/.*_/, '')) || 1;
        id = id * 1000000;
        return id;
    };
    MapperUtils.generateDoubletteValue = function (value) {
        return value === undefined ? value :
            value.toLowerCase()
                .replace(/ß/g, 'ss')
                .replace(/ö/g, 'oe')
                .replace(/ü/g, 'ue')
                .replace(/ä/g, 'ae')
                .replace(/[^a-z0-9]/g, '');
    };
    MapperUtils.DEFAULT_OBJECTSEPARATOR = ';;';
    MapperUtils.DEFAULT_FIELDSEPARATOR = ':::';
    MapperUtils.DEFAULT_VALUESEPARATOR = '=';
    return MapperUtils;
}());
exports.MapperUtils = MapperUtils;
//# sourceMappingURL=mapper.utils.js.map