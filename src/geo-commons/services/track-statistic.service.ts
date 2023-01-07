import {MathUtils} from '../../commons/utils/math.utils';
import {GeoElementBase, LatLngBase, LatLngBoundsBase, TrackStatisticBase} from '../model/geoElementTypes';
import {GeoFormatter} from './geo.formatter';
import {GeoDateUtils} from './geodate.utils';

export abstract class AbstractTrackStatisticService<T extends LatLngBase, B extends LatLngBoundsBase<T>>  {
    public emptyStatistic(): TrackStatisticBase<T, B> {
        return {
            altAsc: undefined,
            altDesc: undefined,
            dist: undefined,
            velocity: undefined,
            altAscVelocity: undefined,
            altDescVelocity: undefined,
            altMin: undefined,
            altMax: undefined,
            altAvg: undefined,
            altStart: undefined,
            altEnd: undefined,
            bounds: undefined,
            posStart: undefined,
            posEnd: undefined,
            dateStart: undefined,
            dateEnd: undefined,
            duration: undefined
        };
    }

    public trackStatisticsForGeoElement(geoElement: GeoElementBase<T>): TrackStatisticBase<T, B> {
        if (geoElement === undefined || geoElement.points === undefined) {
            return this.emptyStatistic();
        }

        return this.trackStatistics(geoElement.points);
    }

    public trackStatistics(ll: T[]): TrackStatisticBase<T, B> {
        const posStart: T = ll.length > 0
            ? ll[0]
            : undefined;
        const posEnd: T = ll.length > 0
            ? ll[ll.length - 1]
            : undefined;
        const dateStart = this.getLocalDateTimeForLatLng(posStart);
        const dateEnd = this.getLocalDateTimeForLatLng(posEnd);
        const t: TrackStatisticBase<T, B> = {
            altAsc: undefined,
            altDesc: undefined,
            dist: ll.length > 0
                ? 0
                : undefined,
            velocity: undefined,
            altAscVelocity: undefined,
            altDescVelocity: undefined,
            altMin: undefined,
            altMax: undefined,
            altAvg: undefined,
            altStart: undefined,
            altEnd: undefined,
            bounds: this.getLatLngBounds(ll),
            posStart: posStart,
            posEnd: posEnd,
            dateStart: dateStart,
            dateEnd: dateEnd,
            duration: undefined
        };

        let l = null, altSum = 0, altCount = 0, fullDuration = 0;
        for (let i = 0; i < ll.length; i++) {
            const p = ll[i];
            if (p && l) {
                t.dist += this.calcDistance(l, p);
            }

            if (p.alt !== undefined) {
                if (t.altEnd !== undefined) {
                    const diff = MathUtils.sub(MathUtils.round(p.alt), MathUtils.round(t.altEnd));
                    if (diff > 0) {
                        t.altAsc = t.altAsc !== undefined
                            ? t.altAsc + diff
                            : diff;
                    } else {
                        t.altDesc = t.altDesc !== undefined
                            ? t.altDesc - diff
                            : -diff;
                    }
                }

                t.altMin = MathUtils.min(t.altMin, p.alt);
                t.altMax = MathUtils.max(t.altMax, p.alt);

                if (t.altStart === undefined) {
                    t.altStart = p.alt;
                }

                t.altEnd = p.alt;

                altSum = MathUtils.sum(altSum, p.alt);
                altCount++;
            }
            l = p;
        }

        if (altSum > 0) {
            t.altAvg = altSum / altCount;
        }

        if (t.dateEnd !== undefined && t.dateStart !== undefined) {
            fullDuration = t.dateEnd.getTime() - t.dateStart.getTime();
            t.duration = this.formatMillisToHH24(fullDuration);
        }

        t.altAsc = this.formatM(t.altAsc);
        t.altDesc = this.formatM(t.altDesc);
        t.altAvg = this.formatM(t.altAvg);
        t.altMax = this.formatM(t.altMax);
        t.altMin = this.formatM(t.altMin);
        t.altStart = this.formatM(t.altStart);
        t.altEnd = this.formatM(t.altEnd);
        t.dist = this.formatMToKm(t.dist);

        if (t.dist !== undefined && fullDuration > 0) {
            t.velocity = t.dist / fullDuration * 1000 * 60 * 60;
        }
        if (t.altAsc !== undefined && fullDuration > 0) {
            t.altAscVelocity = this.formatM(t.altAsc / fullDuration * 1000 * 60 * 60);
        }
        if (t.altDesc !== undefined && fullDuration > 0) {
            t.altDescVelocity = this.formatM(t.altDesc / fullDuration * 1000 * 60 * 60);
        }

        return t;
    }

    public mergeStatistics(param1: TrackStatisticBase<T, B>, param2: TrackStatisticBase<T, B>): TrackStatisticBase<T, B> {
        if (param1 === undefined) {
            return param2;
        }
        if (param2 === undefined) {
            return param1;
        }

        let stat1 = param1;
        let stat2 = param2;
        if (stat1.dateStart !== undefined && stat2.dateStart !== undefined &&
            stat1.dateStart.getTime() > stat2.dateStart.getTime()) {
            stat1 = param2;
            stat2 = param1;
        }

        let coords: T[] = [];
        if (stat1.bounds !== undefined) {
            coords = coords.concat([stat1.bounds.getNorthEast(), stat1.bounds.getNorthWest(),
                stat1.bounds.getSouthEast(), stat1.bounds.getSouthWest()]);
        }
        if (stat2.bounds !== undefined) {
            coords = coords.concat([stat2.bounds.getNorthEast(), stat2.bounds.getNorthWest(),
                stat2.bounds.getSouthEast(), stat2.bounds.getSouthWest()]);
        }
        const t: TrackStatisticBase<T, B> = {
            altAsc: MathUtils.sum(stat1.altAsc, stat2.altAsc),
            altDesc: MathUtils.sum(stat1.altDesc, stat2.altDesc),
            dist: MathUtils.sum(stat1.dist, stat2.dist),
            velocity: stat1.velocity,
            altAscVelocity: stat1.altAscVelocity,
            altDescVelocity: stat1.altDescVelocity,
            altMin: MathUtils.min(stat1.altMin, stat2.altMin),
            altMax: MathUtils.max(stat1.altMax, stat2.altMax),
            altAvg: stat1.altAvg,
            altStart: stat1.altStart !== undefined ? stat1.altStart : stat2.altStart,
            altEnd: stat2.altEnd !== undefined ? stat2.altEnd : stat1.altEnd,
            bounds: this.getLatLngBounds(coords),
            posStart: stat1.posStart !== undefined ? stat1.posStart : stat2.posStart,
            posEnd: stat2.posEnd !== undefined ? stat2.posEnd : stat1.posEnd,
            dateStart: stat1.dateStart !== undefined ? stat1.dateStart : stat2.dateStart,
            dateEnd: stat2.dateEnd !== undefined ? stat2.dateEnd : stat1.dateEnd,
            duration: MathUtils.sum(stat1.duration, stat2.duration)
        };

        let fullDuration = 0;
        t.altAvg = this.formatM(MathUtils.sum(t.altMin, t.altMax) / 2);
        if (stat1.dateEnd !== undefined && stat1.dateStart !== undefined) {
            fullDuration = stat1.dateEnd.getTime() - stat1.dateStart.getTime();
        }

        if (stat2.dateEnd !== undefined && stat2.dateStart !== undefined) {
            fullDuration = stat2.dateEnd.getTime() - stat2.dateStart.getTime();
        }

        if (t.dist !== undefined && fullDuration > 0) {
            t.velocity = t.dist / fullDuration * 1000 * 60 * 60;
        }

        if (t.altAsc !== undefined && fullDuration > 0) {
            t.altAscVelocity = this.formatM(t.altAsc / fullDuration * 1000 * 60 * 60);
        }

        if (t.altDesc !== undefined && fullDuration > 0) {
            t.altDescVelocity = this.formatM(t.altDesc / fullDuration * 1000 * 60 * 60);
        }

        return t;
    }

    public formatMToKm(l: number): number {
        return GeoFormatter.formatMToKm(l);
    }

    public formatM(l: number): number {
        return GeoFormatter.formatM(l);
    }

    public formatMillisToHH24(l: number): number {
        return GeoFormatter.formatMillisToHH24(l);
    }

    protected getLocalDateTimeForLatLng(position: T): Date {
        return GeoDateUtils.getLocalDateTimeForLatLng(position);
    }

    protected abstract getLatLngBounds(coords: T[]): B;

    protected abstract calcDistance(from: T, to: T): number;
}
