"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MathUtils = /** @class */ (function () {
    function MathUtils() {
    }
    MathUtils.round = function (i) {
        if (i === undefined) {
            return i;
        }
        return Math.round(i);
    };
    MathUtils.min = function (i, o) {
        if (i === undefined) {
            return o;
        }
        if (o === undefined) {
            return i;
        }
        return Math.min(i, o);
    };
    MathUtils.max = function (i, o) {
        if (i === undefined) {
            return o;
        }
        if (o === undefined) {
            return i;
        }
        return Math.max(i, o);
    };
    MathUtils.sum = function (i, o) {
        if (i === undefined) {
            return o;
        }
        if (o === undefined) {
            return i;
        }
        return i + o;
    };
    MathUtils.sub = function (i, o) {
        if (i === undefined) {
            return -o;
        }
        if (o === undefined) {
            return i;
        }
        return i - o;
    };
    MathUtils.calcRate = function (rate, max, newBase) {
        return Math.round((rate / max * newBase) + 0.5);
    };
    return MathUtils;
}());
exports.MathUtils = MathUtils;
//# sourceMappingURL=math.utils.js.map