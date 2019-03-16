"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BeanUtils = /** @class */ (function () {
    function BeanUtils() {
    }
    BeanUtils.getValue = function (record, property) {
        if (record === undefined) {
            return undefined;
        }
        var value = record[property];
        if (value === undefined) {
            var hierarchy = property.split('.');
            var parent_1 = record;
            for (var i = 0; i < hierarchy.length; i++) {
                var element = hierarchy[i];
                if (!parent_1) {
                    break;
                }
                // TODO: check for arrays
                if (parent_1[element] !== undefined) {
                    parent_1 = parent_1[element];
                }
                else if (typeof parent_1['get'] === 'function' && parent_1.get(element) !== undefined) {
                    parent_1 = parent_1.get(element);
                }
                else {
                    parent_1 = parent_1[element];
                }
                if (!parent_1) {
                    break;
                }
                var propName = hierarchy.slice(i + 1, hierarchy.length).join('.');
                if (parent_1 && parent_1[propName]) {
                    value = parent_1[propName];
                    break;
                }
            }
        }
        return value;
    };
    return BeanUtils;
}());
exports.BeanUtils = BeanUtils;
//# sourceMappingURL=bean.utils.js.map