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
    ObjectUtils.explodeValueToObjects = function (srcValue, objectSeparator, fieldSeparator, valueSeparator) {
        var objectsSrcs = srcValue.split(objectSeparator);
        var objects = [];
        for (var i = 0; i < objectsSrcs.length; i++) {
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
    ObjectUtils.mergePropertyValues = function (detailDocs, property, joiner) {
        var merged = [];
        detailDocs.forEach(function (doc) {
            if (doc[property] !== undefined && doc[property] !== null) {
                merged.push(doc[property]);
            }
        });
        return merged.join(joiner);
    };
    return ObjectUtils;
}());
exports.ObjectUtils = ObjectUtils;
//# sourceMappingURL=object.utils.js.map