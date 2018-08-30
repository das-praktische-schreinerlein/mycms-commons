"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bean_utils_1 = require("./bean.utils");
var SimpleFilterCommands;
(function (SimpleFilterCommands) {
    SimpleFilterCommands["CSVIN"] = "CSVIN";
    SimpleFilterCommands["NUMIN"] = "NUMIN";
    SimpleFilterCommands["EQ"] = "EQ";
    SimpleFilterCommands["SEQ"] = "SEQ";
    SimpleFilterCommands["NEQ"] = "NEQ";
    SimpleFilterCommands["SNEQ"] = "SNEQ";
    SimpleFilterCommands["LT"] = "LT";
    SimpleFilterCommands["LE"] = "LE";
    SimpleFilterCommands["GT"] = "GT";
    SimpleFilterCommands["GE"] = "GE";
})(SimpleFilterCommands = exports.SimpleFilterCommands || (exports.SimpleFilterCommands = {}));
var FilterUtils = /** @class */ (function () {
    function FilterUtils() {
    }
    FilterUtils.checkFilters = function (filters, record) {
        if (record === undefined) {
            return false;
        }
        for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
            var filter = filters_1[_i];
            if (!FilterUtils.checkFilter(filter, record)) {
                return false;
            }
        }
        return true;
    };
    FilterUtils.checkFilter = function (filter, record) {
        if (record === undefined) {
            return false;
        }
        var value = bean_utils_1.BeanUtils.getValue(record, filter.property);
        if (value === undefined) {
            return false;
        }
        var values = [];
        switch (filter.command) {
            case SimpleFilterCommands.CSVIN:
                values = (value + '').split(/[ ]*,[ ]*/);
                break;
            case SimpleFilterCommands.NUMIN:
                values = [value];
                break;
            case SimpleFilterCommands.LT:
                return value < filter.expectedValues[0];
            case SimpleFilterCommands.LE:
                return value <= filter.expectedValues[0];
            case SimpleFilterCommands.GT:
                return value > filter.expectedValues[0];
            case SimpleFilterCommands.GE:
                return value >= filter.expectedValues[0];
            case SimpleFilterCommands.EQ:
                return value === filter.expectedValues[0];
            case SimpleFilterCommands.SEQ:
                return value + '' === filter.expectedValues[0] + '';
            case SimpleFilterCommands.NEQ:
                return value !== filter.expectedValues[0];
            case SimpleFilterCommands.SNEQ:
                return value + '' !== filter.expectedValues[0] + '';
        }
        for (var _i = 0, _a = filter.expectedValues; _i < _a.length; _i++) {
            var expected = _a[_i];
            if (values.indexOf(expected) >= 0) {
                return true;
            }
        }
        return false;
    };
    return FilterUtils;
}());
exports.FilterUtils = FilterUtils;
//# sourceMappingURL=filter.utils.js.map