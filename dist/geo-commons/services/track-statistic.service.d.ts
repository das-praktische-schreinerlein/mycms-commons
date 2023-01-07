import { GeoElementBase, LatLngBase, LatLngBoundsBase, TrackStatisticBase } from '../model/geoElementTypes';
export declare abstract class AbstractTrackStatisticService<T extends LatLngBase, B extends LatLngBoundsBase<T>> {
    emptyStatistic(): TrackStatisticBase<T, B>;
    trackStatisticsForGeoElement(geoElement: GeoElementBase<T>): TrackStatisticBase<T, B>;
    trackStatistics(ll: T[]): TrackStatisticBase<T, B>;
    mergeStatistics(param1: TrackStatisticBase<T, B>, param2: TrackStatisticBase<T, B>): TrackStatisticBase<T, B>;
    formatMToKm(l: number): number;
    formatM(l: number): number;
    formatMillisToHH24(l: number): number;
    protected getLocalDateTimeForLatLng(position: T): Date;
    protected abstract getLatLngBounds(coords: T[]): B;
    protected abstract calcDistance(from: T, to: T): number;
}
