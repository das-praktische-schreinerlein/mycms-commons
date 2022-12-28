"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GeoFormatter = /** @class */ (function () {
    function GeoFormatter() {
    }
    GeoFormatter.humanLen = function (l) {
        if (l < 2000) {
            return l.toFixed(0) + ' m';
        }
        else {
            return (l / 1000).toFixed(1) + ' km';
        }
    };
    GeoFormatter.formatMToKm = function (l) {
        if (l !== undefined) {
            return parseFloat((l / 1000).toFixed(1));
        }
        return undefined;
    };
    GeoFormatter.formatM = function (l) {
        if (l !== undefined) {
            return parseInt(l.toFixed(0), 10);
        }
        return undefined;
    };
    GeoFormatter.formatMillisToHH24 = function (l) {
        if (l !== undefined) {
            return parseFloat((l / 1000 / 60 / 60).toFixed(1));
        }
        return undefined;
    };
    return GeoFormatter;
}());
exports.GeoFormatter = GeoFormatter;
//# sourceMappingURL=geo.formatter.js.map