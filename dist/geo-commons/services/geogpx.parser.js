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
var geogpx_utils_1 = require("./geogpx.utils");
var geoElementTypes_1 = require("../model/geoElementTypes");
var AbstractGeoGpxParser = /** @class */ (function (_super) {
    __extends(AbstractGeoGpxParser, _super);
    function AbstractGeoGpxParser(geoGpxUtils) {
        var _this = _super.call(this) || this;
        _this.geoGpxUtils = geoGpxUtils;
        if (!geoGpxUtils) {
            _this.geoGpxUtils = new geogpx_utils_1.GeoGpxUtils();
        }
        return _this;
    }
    AbstractGeoGpxParser.prototype.parse = function (xml, options) {
        if (!xml) {
            console.error('cant parse GeoGpxParser: empty');
            return;
        }
        xml = this.geoGpxUtils.fixXml(xml);
        if (!(xml.startsWith('<?xml'))) {
            console.error('cant parse GeoGpxParser: no valid xml');
            return;
        }
        var gpxDom = this.parseDomFromString(xml);
        if (gpxDom.getElementsByTagName('parsererror').length > 0) {
            console.error('cant parse GeoGpxParser: parsererror', gpxDom.getElementsByTagName('parsererror')[0]);
            return;
        }
        var elements = this.parseGpxDom(gpxDom, options);
        if (!elements) {
            return;
        }
        return elements;
    };
    AbstractGeoGpxParser.prototype.parseGpxDom = function (gpxDom, options) {
        var j, i;
        var el;
        var elements = [], tags = [['rte', 'rtept'], ['trkseg', 'trkpt']];
        for (j = 0; j < tags.length; j++) {
            el = gpxDom.getElementsByTagName(tags[j][0]);
            for (i = 0; i < el.length; i++) {
                var l = this.parseTrkSeg(el[i], gpxDom, tags[j][1]);
                if (!l) {
                    continue;
                }
                if (options.generateName) {
                    this.parseName(el[i], l);
                }
                elements.push(l);
            }
        }
        el = gpxDom.getElementsByTagName('wpt');
        if (options.display_wpt !== false) {
            for (i = 0; i < el.length; i++) {
                var waypoint = this.parseWpt(el[i], gpxDom);
                if (!waypoint) {
                    continue;
                }
                if (options.generateName) {
                    this.parseName(el[i], waypoint);
                }
                elements.push(waypoint);
            }
        }
        if (!elements.length) {
            return;
        }
        return elements;
    };
    AbstractGeoGpxParser.prototype.parseName = function (gpxDom, layer) {
        var i, el, txt = '', name, descr = '', link, len = 0;
        el = gpxDom.getElementsByTagName('name');
        if (el.length && el[0].childNodes && el[0].childNodes.length) {
            name = el[0].childNodes[0].nodeValue;
        }
        el = gpxDom.getElementsByTagName('desc');
        for (i = 0; i < el.length; i++) {
            if (!el[i].childNodes) {
                continue;
            }
            for (var j = 0; j < el[i].childNodes.length; j++) {
                descr = descr + el[i].childNodes[j].nodeValue;
            }
        }
        el = gpxDom.getElementsByTagName('link');
        if (el.length) {
            link = el[0].getAttribute('href');
        }
        len = layer !== undefined ?
            this.polylineLen(layer.points)
            : undefined;
        if (name) {
            txt += '<h2>' + name + '</h2>' + descr;
        }
        if (len) {
            txt += '<p>' + this.humanLen(len) + '</p>';
        }
        if (link) {
            txt += '<p><a target="_blank" href="' + link + '">[...]</a></p>';
        }
        layer.name = txt;
        return txt;
    };
    AbstractGeoGpxParser.prototype.parseTrkSeg = function (line, gpxDom, tag) {
        var el = line.getElementsByTagName(tag);
        if (!el.length) {
            return;
        }
        var coords = [];
        for (var i = 0; i < el.length; i++) {
            var ptElement = el[i];
            var eleElement = ptElement.getElementsByTagName('ele');
            var timeElement = ptElement.getElementsByTagName('time');
            var ele = void 0;
            var time = void 0;
            if (eleElement && eleElement.length > 0 && eleElement[0].childNodes.length) {
                ele = eleElement[0].childNodes[0].nodeValue;
            }
            if (timeElement && timeElement.length > 0 && timeElement[0].childNodes.length) {
                time = date_utils_1.DateUtils.parseDate(timeElement[0].childNodes[0].nodeValue);
            }
            coords.push(this.createLatLng(ptElement.getAttribute('lat'), ptElement.getAttribute('lon'), ele, time));
        }
        var typeEl = gpxDom.getElementsByTagName('type');
        var type = tag === 'trkpt'
            ? geoElementTypes_1.GeoElementType.TRACK
            : geoElementTypes_1.GeoElementType.ROUTE;
        if (typeEl.length && typeEl[0].childNodes[0].nodeValue === 'AREA') {
            type = geoElementTypes_1.GeoElementType.AREA;
        }
        return this.createGeoElement(type, coords, name);
    };
    AbstractGeoGpxParser.prototype.parseWpt = function (e, gpxDom) {
        return this.createGeoElement(geoElementTypes_1.GeoElementType.WAYPOINT, [this.createLatLng(e.getAttribute('lat'), e.getAttribute('lon'))], undefined);
    };
    return AbstractGeoGpxParser;
}(geo_parser_1.AbstractGeoParser));
exports.AbstractGeoGpxParser = AbstractGeoGpxParser;
//# sourceMappingURL=geogpx.parser.js.map