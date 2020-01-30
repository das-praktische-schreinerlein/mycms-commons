"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var date_utils_1 = require("../../commons/utils/date.utils");
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
    function MapperUtils() {
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
    MapperUtils.prototype.extractUniqueId = function (record) {
        var id = Number(record.id.replace(/.*_/, '')) || 1;
        id = id * 1000000;
        return id;
    };
    return MapperUtils;
}());
exports.MapperUtils = MapperUtils;
//# sourceMappingURL=mapper.utils.js.map