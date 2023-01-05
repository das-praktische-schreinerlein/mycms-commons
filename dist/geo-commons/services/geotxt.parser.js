"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
var AbstractGeoTxtParser = /** @class */ (function (_super) {
    __extends(AbstractGeoTxtParser, _super);
    function AbstractGeoTxtParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractGeoTxtParser.isResponsibleForSrc = function (src) {
        return src !== undefined && /^[\r\n ]*(Grid|Datum|Track|Header|Trackpoint)/g.test(src);
    };
    AbstractGeoTxtParser.isResponsibleForFile = function (fileName) {
        return fileName !== undefined && fileName.toLowerCase().endsWith('.txt');
    };
    AbstractGeoTxtParser.prototype.isResponsibleForSrc = function (src) {
        return AbstractGeoTxtParser.isResponsibleForSrc(src);
    };
    AbstractGeoTxtParser.prototype.isResponsibleForFile = function (fileName) {
        return AbstractGeoTxtParser.isResponsibleForFile(fileName);
    };
    AbstractGeoTxtParser.prototype.parse = function (txt, options) {
        if (!txt) {
            console.error('GeoTxtParser cant parse: empty');
            return;
        }
        if (txt.includes('<gpx') || txt.includes('<rte') || txt.includes('<trk')) {
            console.error('GeoTxtParser cant parse: no valid txt - contains xml');
            return;
        }
        var elements = this.parseTxt(txt, options);
        if (!elements) {
            return;
        }
        return elements;
    };
    AbstractGeoTxtParser.prototype.parseTxt = function (txt, options) {
        var segments = [];
        var lines = txt.replace(/[\r\n]+/g, '\n')
            .replace(/\n[\t ]+\n/g, '\n')
            .split('\n');
        // Trackpoint N53.99300 E13.17541 10.12.2005 14:17:51 2 m 96 m 0:01:54 3 kph
        // TODO check for
        // Track	ACTIVE LOG 057	02.05.2008 07:30:04 	9:21:12	6.9 km	0.7 kph
        // Header	Position	Time	Altitude	Depth	Temperature	Leg Length	Leg Time	Leg Speed	Leg Course
        // while (found) check for next and do this.parseTrkSeg for lines between
        // with rest of lines do this.parseTrkSeg for lines
        var srcSegments = [];
        var currentSeg = {
            name: undefined,
            lines: []
        };
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            if (line.match(/Grid/)) {
                // NOOP
            }
            else if (line.match(/Datum/)) {
                // NOOP
            }
            else if (line.match(/^Track[\t ]+/)) {
                // NOOP
                if (currentSeg.name) {
                    srcSegments.push(currentSeg);
                }
                currentSeg = {
                    name: line,
                    lines: []
                };
            }
            else if (line.match(/^Header/)) {
                // NOOP
            }
            else if (line.match(/^Trackpoint/)) {
                if (!currentSeg.name) {
                    currentSeg.name = 'Default';
                }
                currentSeg.lines.push(line);
            }
            else {
                // NOOP
            }
        }
        if (currentSeg.name) {
            srcSegments.push(currentSeg);
        }
        for (var _a = 0, srcSegments_1 = srcSegments; _a < srcSegments_1.length; _a++) {
            var srcSegment = srcSegments_1[_a];
            segments.push(this.parseTrkSeg(srcSegment.name, srcSegment.lines, options));
        }
        return segments;
    };
    AbstractGeoTxtParser.prototype.parseTrkSeg = function (name, lines, options) {
        var coords = [];
        for (var i = 0; i < lines.length; i++) {
            var CONST_TRACKPOINT_LEGACY = /Trackpoint[\t ]+([NS])([0-9.]*)[\t ]+([EW])([0-9.]*)[\t ]+(\d\d\.\d\d\.\d\d\d\d \d\d:\d\d:\d\d)[\t ]+([0-9-]*) m.*/g;
            var CONST_TRACKPOINT_GLOB = /Trackpoint[\t ]+([NS])([0-9.]*)[\t ]+([EW])([0-9.]*)[\t ]+(\d\d\.\d\d\.\d\d\d\d \d\d:\d\d:\d\d)( \(UTC[+-0-9].*\))[\t ]+([0-9-]*) m.*/g;
            var line = lines[i];
            if (line.match(CONST_TRACKPOINT_LEGACY)) {
                // Trackpoint N53.99300 E13.17541 10.12.2005 14:17:51 2 m 96 m 0:01:54 3 kph
                var res = CONST_TRACKPOINT_LEGACY.exec(line);
                if (res.length < 5) {
                    console.warn('cant parse line: expected pattern with 6 but got only ', res.length, line, res);
                    continue;
                }
                var latD = res[1].trim();
                var lat = res[2].trim();
                var lonD = res[3].trim();
                var lon = res[4].trim();
                var time = res[5].trim();
                var ele = res[6].trim();
                var date = date_utils_1.DateUtils.parseDate(time); // TODO check this
                if (latD.toUpperCase() === 'S') {
                    lat = '-' + lat;
                }
                if (lonD.toUpperCase() === 'W') {
                    lon = '-' + lon;
                }
                coords.push(this.createLatLng(lat, lon, ele, date));
            }
            else if (line.match(CONST_TRACKPOINT_GLOB)) {
                // Trackpoint N37.49171 W118.56251 19.07.2008 12:39:00 (UTC-7) 1623 m
                var res = CONST_TRACKPOINT_GLOB.exec(line);
                if (res.length < 6) {
                    console.warn('cant parse line: expected pattern with 7 but got only ', res.length, line, res);
                    continue;
                }
                var latD = res[1].trim();
                var lat = res[2].trim();
                var lonD = res[3].trim();
                var lon = res[4].trim();
                var time = res[5].trim();
                var timezone = res[6].trim();
                var ele = res[7].trim();
                var date = date_utils_1.DateUtils.parseDate(time + ' ' + timezone); // TODO check this
                if (latD.toUpperCase() === 'S') {
                    lat = '-' + lat;
                }
                if (lonD.toUpperCase() === 'W') {
                    lon = '-' + lon;
                }
                coords.push(this.createLatLng(lat, lon, ele, date));
            }
            else {
                console.trace('GeoTxtParser: cant parse Trackpoint', line);
            }
        }
        var type = geoElementTypes_1.GeoElementType.TRACK;
        return this.createGeoElement(type, coords, name);
    };
    return AbstractGeoTxtParser;
}(geo_parser_1.AbstractGeoParser));
exports.AbstractGeoTxtParser = AbstractGeoTxtParser;
//# sourceMappingURL=geotxt.parser.js.map