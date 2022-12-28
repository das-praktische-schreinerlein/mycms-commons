export class GeoFormatter  {
    public static humanLen(l) {
        if (l < 2000) {
            return l.toFixed(0) + ' m';
        } else {
            return (l / 1000).toFixed(1) + ' km';
        }
    }

    public static formatMToKm(l: number): number {
        if (l !== undefined) {
            return parseFloat((l / 1000).toFixed(1));
        }

        return undefined;
    }

    public static formatM(l: number): number {
        if (l !== undefined) {
            return parseInt(l.toFixed(0), 10);
        }

        return undefined;
    }

    public static formatMillisToHH24(l: number): number {
        if (l !== undefined) {
            return parseFloat((l / 1000 / 60 / 60).toFixed(1));
        }

        return undefined;
    }

}
