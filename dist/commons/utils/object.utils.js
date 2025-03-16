"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectUtils = /** @class */ (function () {
    function ObjectUtils() {
    }
    ObjectUtils.mapValueToObjects = function (fieldValues, fieldName) {
        var objects = [];
        if (fieldValues !== undefined) {
            if (Array.isArray(fieldValues)) {
                fieldValues.forEach(function (fieldValue) {
                    var doc = {};
                    doc[fieldName] = fieldValue;
                    objects.push(doc);
                });
            }
            else {
                var doc = {};
                doc[fieldName] = fieldValues;
                objects.push(doc);
            }
        }
        return objects;
    };
    ObjectUtils.explodeValueToObjects = function (srcValue, objectSeparator, fieldSeparator, valueSeparator, unique) {
        if (unique === void 0) { unique = true; }
        var objectsSrcs = srcValue.split(objectSeparator);
        if (unique) {
            objectsSrcs = ObjectUtils.uniqueArray(objectsSrcs);
        }
        var objects = [];
        for (var i = 0; i < objectsSrcs.length; i++) {
            if (objectsSrcs[i] === undefined || objectsSrcs[i] === null || objectsSrcs[i] === 'null' || objectsSrcs[i] === '') {
                continue;
            }
            var valuePairs = objectsSrcs[i].split(fieldSeparator);
            var detailDoc = {};
            for (var j = 0; j < valuePairs.length; j++) {
                var value = valuePairs[j].split(valueSeparator);
                detailDoc[value[0]] = value[1];
            }
            objects.push(detailDoc);
        }
        return objects;
    };
    ObjectUtils.mergePropertyValues = function (detailDocs, property, joiner, unique) {
        if (unique === void 0) { unique = true; }
        var merged = [];
        detailDocs.forEach(function (doc) {
            if (doc[property] !== undefined && doc[property] !== null) {
                merged.push(doc[property]);
            }
        });
        if (unique) {
            merged = ObjectUtils.uniqueArray(merged);
        }
        return merged.join(joiner);
    };
    ObjectUtils.uniqueArray = function (arr) {
        var keys = {};
        var result = [];
        for (var i = 0, length_1 = arr.length; i < length_1; ++i) {
            if (!keys.hasOwnProperty(arr[i])) {
                result.push(arr[i]);
                keys[arr[i]] = 1;
            }
        }
        return result;
    };
    ObjectUtils.splitArrayIntoTable = function (src, splitByRowCount, maxColumnsToSplit) {
        var res = [];
        if (splitByRowCount <= 0) {
            return res;
        }
        if (splitByRowCount > 0 && src.length <= splitByRowCount) {
            res[0] = src;
            return res;
        }
        var columnCount = Math.min(Math.ceil(src.length / splitByRowCount), Math.max(1, maxColumnsToSplit));
        var rowCount = Math.ceil(src.length / columnCount);
        for (var i = 0; i < columnCount; i++) {
            res[i] = src.slice(i * rowCount, Math.min((i + 1) * rowCount, src.length));
        }
        return res;
    };
    return ObjectUtils;
}());
exports.ObjectUtils = ObjectUtils;
//# sourceMappingURL=object.utils.js.map