import {AbstractGeoParser} from './geo.parser';
import {AbstractGeoTxtParser} from './geotxt.parser';
import {LatLngBase} from '../model/geoElementTypes';
import {AbstractGeoGpxParser} from './geogpx.parser';
import {AbstractGeoJsonParser} from './geojson.parser';

export class AbstractGeoParserDeterminer<T extends LatLngBase> {

    constructor(protected gpxParser: AbstractGeoGpxParser<T>,
                protected jsonParser: AbstractGeoJsonParser<T>,
                protected txtParser: AbstractGeoTxtParser<T>) {
    }

    public determineParser(trackUrl: string, trackSrc: string): AbstractGeoParser<T> {
        if (this.gpxParser.isResponsibleForFile(trackUrl)
            || this.gpxParser.isResponsibleForSrc(trackSrc)) {
            return this.gpxParser;
        } else if (this.jsonParser.isResponsibleForFile(trackUrl)
            || this.jsonParser.isResponsibleForSrc(trackSrc)) {
            return this.jsonParser;
        } else if (this.txtParser.isResponsibleForFile(trackUrl)
            || this.txtParser.isResponsibleForSrc(trackSrc)) {
            return this.txtParser;
        } else {
            console.error('no loader found for url/src:', trackUrl, trackSrc);
        }

        return undefined;
    }
}
