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
        return src !== undefined && /^[\r\n ]*<(Track|Header|Trackpoint)/g.test(src);
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
            console.error('cant parse GeoGpxParser: empty');
            return;
        }
        if (txt.includes('<gpx') || txt.includes('<rte') || txt.includes('<trk')) {
            console.error('cant parse GeoGpxParser: no valid txt - contains xml');
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
        segments = segments.concat(this.parseTrkSeg(lines, options));
        return segments;
    };
    AbstractGeoTxtParser.prototype.parseTrkSeg = function (lines, options) {
        var coords = [];
        for (var i = 0; i < lines.length; i++) {
            var CONST_TRACKPOINT = new RegExp("Trackpoint\tN([0-9.]*) E([0-9.]*)\t([0-9.: ]*) \t([0-9-]*) m.*").compile();
            // Trackpoint N37.49171 W118.56251 19.07.2008 12:39:00 (UTC-7) 1623 m
            var CONST_TRACKPOINT_GLOB = new RegExp("Trackpoint\t([NS])([0-9.]*) ([EW])([0-9.]*)\t([0-9.: ]*)[ ]*([0-9()A-Z-]*)\t([0-9-]*) m.*").compile();
            var line = lines[i];
            // Trackpoint N53.99300 E13.17541 10.12.2005 14:17:51 2 m 96 m 0:01:54 3 kph
            // Trackpoint N37.49171 W118.56251 19.07.2008 12:39:00 (UTC-7) 1623 m
            var regExp = CONST_TRACKPOINT_GLOB;
            if (regExp.test(line)) {
                // Daten extrahieren
                var res = regExp.exec(line);
                if (res.length < 6) {
                    console.warn('cant parse line: expected pattern with 7 but got only ', res.length, line);
                    continue;
                }
                var latD = res[1];
                var lat = res[2];
                var lonD = res[3];
                var lon = res[4];
                var time = res[5];
                var ele = res[7];
                var date = date_utils_1.DateUtils.parseDate(time); // TODO check this
                // Zonen auswerten
                if (latD.toUpperCase() === 'S') {
                    lat = '-' + lat;
                }
                if (lonD.toUpperCase() === 'W') {
                    lon = '-' + lon;
                }
                coords.push(this.createLatLng(lat, lon, ele, date));
            }
        }
        var type = geoElementTypes_1.GeoElementType.TRACK;
        return this.createGeoElement(type, coords, name);
    };
    return AbstractGeoTxtParser;
}(geo_parser_1.AbstractGeoParser));
exports.AbstractGeoTxtParser = AbstractGeoTxtParser;
//# sourceMappingURL=geotxt.parser.js.map