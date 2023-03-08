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
var geo_parser_1 = require("./geo.parser");
var date_utils_1 = require("../../commons/utils/date.utils");
var geoElementTypes_1 = require("../model/geoElementTypes");
var AbstractGeoJsonParser = /** @class */ (function (_super) {
    __extends(AbstractGeoJsonParser, _super);
    function AbstractGeoJsonParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractGeoJsonParser.isResponsibleForSrc = function (src) {
        return src !== undefined && /^[\r\n ]*\[[\r\n ]*{[\r\n ]*"track"/g.test(src);
    };
    AbstractGeoJsonParser.isResponsibleForFile = function (fileName) {
        return fileName !== undefined &&
            (fileName.toLowerCase().endsWith('.json') || fileName.toLowerCase().endsWith('.geojson'));
    };
    AbstractGeoJsonParser.prototype.isResponsibleForSrc = function (src) {
        return AbstractGeoJsonParser.isResponsibleForSrc(src);
    };
    AbstractGeoJsonParser.prototype.isResponsibleForFile = function (fileName) {
        return AbstractGeoJsonParser.isResponsibleForFile(fileName);
    };
    AbstractGeoJsonParser.prototype.parse = function (json, options) {
        var obj = typeof json === 'string'
            ? JSON.parse(json)
            : json;
        var elements = this.parseJsonObj(obj, options);
        if (!elements) {
            return;
        }
        return elements;
    };
    AbstractGeoJsonParser.prototype.createTrack = function (name, type, segments, defaultPosition) {
        var gpxSegments = [];
        for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
            var segment = segments_1[_i];
            gpxSegments.push(this.createJsonTrackSegment(segment, defaultPosition));
        }
        return this.createJsonTrack(name, type, gpxSegments);
    };
    AbstractGeoJsonParser.prototype.createRoute = function (name, type, points, defaultPosition) {
        return this.createJsonRoute(name, type, points, defaultPosition);
    };
    AbstractGeoJsonParser.prototype.createJsonTrack = function (name, type, segments) {
        return this.createJson(name, type, segments);
    };
    AbstractGeoJsonParser.prototype.createJsonTrackSegment = function (points, defaultPosition) {
        return this.createJsonPointSegment(points);
    };
    AbstractGeoJsonParser.prototype.createJsonRoute = function (name, type, points, defaultPosition) {
        return this.createJson(name, type, [this.createJsonPointSegment(points)]);
    };
    AbstractGeoJsonParser.prototype.createJson = function (name, type, pointSegments) {
        return '{ "track": {"' +
            '"tName":""' + name + '"",' +
            '"type":""' + type + '"",' +
            '"header":["lat","lon","ele"],' +
            '"records":[' +
            pointSegments.join(',') +
            ']' +
            '}}';
    };
    AbstractGeoJsonParser.prototype.createJsonPointSegment = function (points) {
        var _this = this;
        return points.map(function (point) { return _this.createJsonPoint(point); }).join(',');
    };
    AbstractGeoJsonParser.prototype.createJsonPoint = function (point) {
        var alt = point['alt']
            ? point['alt']
            : undefined;
        return '[' + [point.lat, point.lng, alt].join(',') + ']';
    };
    AbstractGeoJsonParser.prototype.parseJsonObj = function (obj, options) {
        var j;
        var coords = [];
        for (j = 0; j < obj['track']['records'].length; j++) {
            var record = obj['track']['records'][j];
            if (record.length > 2) {
                coords.push(this.createLatLng(record[0], record[1], record[2], date_utils_1.DateUtils.parseDate(record[3])));
            }
            else {
                coords.push(this.createLatLng(record[0], record[1], record[2]));
            }
        }
        return [this.createGeoElement(geoElementTypes_1.GeoElementType.TRACK, coords, obj['track']['tName'] || obj['track']['kName'])];
    };
    return AbstractGeoJsonParser;
}(geo_parser_1.AbstractGeoParser));
exports.AbstractGeoJsonParser = AbstractGeoJsonParser;
//# sourceMappingURL=geojson.parser.js.map