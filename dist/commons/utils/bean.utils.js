"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BeanUtils = /** @class */ (function () {
    function BeanUtils() {
    }
    BeanUtils.getAttributeValue = function (object, attribute) {
        if (object === undefined || object === null || attribute === undefined) {
            return undefined;
        }
        if (object[attribute] !== undefined) {
            return object[attribute];
        }
        if (typeof object['get'] === 'function' && object.get(attribute) !== undefined) {
            return object.get(attribute);
        }
        return object[attribute];
    };
    BeanUtils.getValue = function (record, property) {
        if (record === undefined) {
            return undefined;
        }
        if (record[property] !== undefined) {
            return record[property];
        }
        var hierarchy = property.split('.');
        var context = record;
        var arrayRegexp = /([a-zA-Z]+)(\[(\d)\])+/; // matches:  item[0]
        var arrayMatch = null;
        var key, idx, arrayKey, arrayValue, value, propName;
        for (var i = 0; i < hierarchy.length; i++) {
            if (context === undefined) {
                return undefined;
            }
            key = hierarchy[i];
            arrayMatch = arrayRegexp.exec(key);
            if (arrayMatch !== null) {
                // check for array
                idx = arrayMatch[3];
                arrayKey = arrayMatch[1];
                arrayValue = BeanUtils.getAttributeValue(context, arrayKey);
                if (!Array.isArray(arrayValue)) {
                    return undefined;
                }
                if (!arrayValue.length > idx) {
                    return undefined;
                }
                context = arrayValue[idx];
            }
            else {
                context = BeanUtils.getAttributeValue(context, key);
            }
            propName = hierarchy.slice(i + 1, hierarchy.length).join('.');
            value = BeanUtils.getAttributeValue(context, propName);
            if (value) {
                return value;
            }
        }
        return context;
    };
    BeanUtils.jsonStringify = function (object, whiteList, blackList, removeBuffersGreaterThan) {
        if (!object) {
            return undefined;
        }
        return JSON.stringify(object, function (key, value) {
            if (value === null || value === undefined) {
                return undefined;
            }
            if (whiteList && whiteList.length > 0 && !whiteList.includes(key)) {
                return undefined;
            }
            if (blackList && blackList.length > 0 && blackList.includes(key)) {
                return undefined;
            }
            if (removeBuffersGreaterThan !== undefined && removeBuffersGreaterThan > -1 &&
                ((value['type'] === 'Buffer' && value['data'] && value['data'].length > removeBuffersGreaterThan) ||
                    (Buffer.isBuffer(value) && value.length > removeBuffersGreaterThan))) {
                return undefined;
            }
            if ((typeof value === 'string' || value instanceof String)) {
                value = value.trim();
            }
            return value;
        });
    };
    return BeanUtils;
}());
exports.BeanUtils = BeanUtils;
//# sourceMappingURL=bean.utils.js.map