import { AbstractGeoParser } from './geo.parser';
import { AbstractGeoTxtParser } from './geotxt.parser';
import { LatLngBase } from '../model/geoElementTypes';
import { AbstractGeoGpxParser } from './geogpx.parser';
import { AbstractGeoJsonParser } from './geojson.parser';
export declare class AbstractGeoParserDeterminer<T extends LatLngBase> {
    protected gpxParser: AbstractGeoGpxParser<T>;
    protected jsonParser: AbstractGeoJsonParser<T>;
    protected txtParser: AbstractGeoTxtParser<T>;
    constructor(gpxParser: AbstractGeoGpxParser<T>, jsonParser: AbstractGeoJsonParser<T>, txtParser: AbstractGeoTxtParser<T>);
    determineParser(trackUrl: string, trackSrc: string): AbstractGeoParser<T>;
}
