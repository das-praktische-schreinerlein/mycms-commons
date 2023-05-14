"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var geogpx_parser_1 = require("../services/geogpx.parser");
var geojson_parser_1 = require("../services/geojson.parser");
var geotxt_parser_1 = require("../services/geotxt.parser");
var backend_geo_types_1 = require("./backend-geo.types");
var xmldom_1 = require("@xmldom/xmldom");
var geo_calcutils_1 = require("../services/geo-calcutils");
var BackendGeoUtils = /** @class */ (function () {
    function BackendGeoUtils() {
    }
    BackendGeoUtils.createLatLng = function (lat, lng, alt, time) {
        return time !== undefined
            ? {
                lat: Number(lat),
                lng: Number(lng),
                alt: Number(alt),
                time: time
            }
            : alt !== undefined
                ? {
                    lat: Number(lat),
                    lng: Number(lng),
                    alt: Number(alt)
                }
                : {
                    lat: Number(lat),
                    lng: Number(lng),
                    alt: undefined
                };
    };
    BackendGeoUtils.createGeoElement = function (type, points, name) {
        return new backend_geo_types_1.BackendGeoElement(type, points, name);
    };
    BackendGeoUtils.calcDistance = function (from, to) {
        return geo_calcutils_1.GeoCalcUtils.calcDegDistance(from.lat, from.lng, to.lat, to.lng);
    };
    return BackendGeoUtils;
}());
exports.BackendGeoUtils = BackendGeoUtils;
var BackendGeoGpxParser = /** @class */ (function (_super) {
    __extends(BackendGeoGpxParser, _super);
    function BackendGeoGpxParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BackendGeoGpxParser.prototype.parseDomFromString = function (xml) {
        var oParser = new xmldom_1.DOMParser();
        return oParser.parseFromString(xml, 'application/xml');
    };
    BackendGeoGpxParser.prototype.createLatLng = function (lat, lng, alt, time) {
        return BackendGeoUtils.createLatLng(lat, lng, alt, time);
    };
    BackendGeoGpxParser.prototype.createGeoElement = function (type, points, name) {
        return BackendGeoUtils.createGeoElement(type, points, name);
    };
    BackendGeoGpxParser.prototype.calcDistance = function (from, to) {
        return BackendGeoUtils.calcDistance(from, to);
    };
    return BackendGeoGpxParser;
}(geogpx_parser_1.AbstractGeoGpxParser));
exports.BackendGeoGpxParser = BackendGeoGpxParser;
var BackendGeoTxtParser = /** @class */ (function (_super) {
    __extends(BackendGeoTxtParser, _super);
    function BackendGeoTxtParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BackendGeoTxtParser.prototype.createLatLng = function (lat, lng, alt, time) {
        return BackendGeoUtils.createLatLng(lat, lng, alt, time);
    };
    BackendGeoTxtParser.prototype.createGeoElement = function (type, points, name) {
        return BackendGeoUtils.createGeoElement(type, points, name);
    };
    BackendGeoTxtParser.prototype.calcDistance = function (from, to) {
        return BackendGeoUtils.calcDistance(from, to);
    };
    return BackendGeoTxtParser;
}(geotxt_parser_1.AbstractGeoTxtParser));
exports.BackendGeoTxtParser = BackendGeoTxtParser;
var BackendGeoJsonParser = /** @class */ (function (_super) {
    __extends(BackendGeoJsonParser, _super);
    function BackendGeoJsonParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BackendGeoJsonParser.prototype.createLatLng = function (lat, lng, alt, time) {
        return BackendGeoUtils.createLatLng(lat, lng, alt, time);
    };
    BackendGeoJsonParser.prototype.createGeoElement = function (type, points, name) {
        return BackendGeoUtils.createGeoElement(type, points, name);
    };
    BackendGeoJsonParser.prototype.calcDistance = function (from, to) {
        return BackendGeoUtils.calcDistance(from, to);
    };
    return BackendGeoJsonParser;
}(geojson_parser_1.AbstractGeoJsonParser));
exports.BackendGeoJsonParser = BackendGeoJsonParser;
//# sourceMappingURL=backend-geo.parser.js.map