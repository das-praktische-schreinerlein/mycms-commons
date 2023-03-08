"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var geo_formatter_1 = require("./geo.formatter");
var AbstractGeoParser = /** @class */ (function () {
    function AbstractGeoParser() {
    }
    AbstractGeoParser.prototype.createTrack = function (name, type, segments, defaultPosition) {
        throw new Error('not implemented');
    };
    AbstractGeoParser.prototype.createRoute = function (name, type, points, defaultPosition) {
        throw new Error('not implemented');
    };
    AbstractGeoParser.prototype.humanLen = function (l) {
        return geo_formatter_1.GeoFormatter.humanLen(l);
    };
    AbstractGeoParser.prototype.polylineLen = function (ll) {
        var d = 0, p = null;
        for (var i = 0; i < ll.length; i++) {
            if (i && p) {
                d += this.calcDistance(p, ll[i]);
            }
            p = ll[i];
        }
        return d;
    };
    return AbstractGeoParser;
}());
exports.AbstractGeoParser = AbstractGeoParser;
//# sourceMappingURL=geo.parser.js.map