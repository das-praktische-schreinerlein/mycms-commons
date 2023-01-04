"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractGeoParserDeterminer = /** @class */ (function () {
    function AbstractGeoParserDeterminer(gpxParser, jsonParser, txtParser) {
        this.gpxParser = gpxParser;
        this.jsonParser = jsonParser;
        this.txtParser = txtParser;
    }
    AbstractGeoParserDeterminer.prototype.determineParser = function (trackUrl, trackSrc) {
        if (this.gpxParser.isResponsibleForFile(trackUrl)
            || this.gpxParser.isResponsibleForSrc(trackSrc)) {
            return this.gpxParser;
        }
        else if (this.jsonParser.isResponsibleForFile(trackUrl)
            || this.jsonParser.isResponsibleForSrc(trackSrc)) {
            return this.jsonParser;
        }
        else if (this.txtParser.isResponsibleForFile(trackUrl)
            || this.txtParser.isResponsibleForSrc(trackSrc)) {
            return this.txtParser;
        }
        else {
            console.error('no loader found for url/src:', trackUrl, trackSrc);
        }
        return undefined;
    };
    return AbstractGeoParserDeterminer;
}());
exports.AbstractGeoParserDeterminer = AbstractGeoParserDeterminer;
//# sourceMappingURL=geo-parser.determiner.js.map