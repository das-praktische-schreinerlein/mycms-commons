"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractGeoParser = /** @class */ (function () {
    function AbstractGeoParser() {
    }
    AbstractGeoParser.prototype.humanLen = function (l) {
        if (l < 2000) {
            return l.toFixed(0) + ' m';
        }
        else {
            return (l / 1000).toFixed(1) + ' km';
        }
    };
    AbstractGeoParser.prototype.polylineLen = function (ll) {
        var d = 0, p = null;
        for (var i = 0; i < ll.length; i++) {
            if (i && p) {
                d += p.distanceTo(ll[i]);
            }
            p = ll[i];
        }
        return d;
    };
    return AbstractGeoParser;
}());
exports.AbstractGeoParser = AbstractGeoParser;
//# sourceMappingURL=geo.parser.js.map