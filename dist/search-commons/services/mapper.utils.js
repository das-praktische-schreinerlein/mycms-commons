"use strict";
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
    return MapperUtils;
}());
exports.MapperUtils = MapperUtils;
//# sourceMappingURL=mapper.utils.js.map