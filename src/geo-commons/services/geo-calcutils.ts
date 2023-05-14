export class GeoCalcUtils {
    public static calcDistance(degLat1: number, degLng1: number, degLat2: number, degLng2: number): number {
        const radius = 6371;
        const diffLat = this.deg2Rad(degLat2 - degLat1);
        const diffLng = this.deg2Rad(degLng2 - degLng1);
        const lat1 = this.deg2Rad(degLat1);
        const lat2 = this.deg2Rad(degLat2);

        const a = Math.sin(diffLat/2) * Math.sin(diffLat/2) +
            Math.sin(diffLng/2) * Math.sin(diffLng/2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return radius * c;
    }

    public static calcDegDistance(degLat1: number, degLng1: number, degLat2: number, degLng2: number): number {
        return this.calcRadDistance(this.deg2Rad(degLat1), this.deg2Rad(degLng1), this.deg2Rad(degLat2), this.deg2Rad(degLng2))
    }

    public static calcRadDistance(lat1: number, lng1: number, lat2: number,lng2: number): number {
        const radius = 6371;
        const diffLat = lat2 - lat1;
        const diffLng = lng2 - lng1;

        const a = Math.sin(diffLat/2) * Math.sin(diffLat/2) +
            Math.sin(diffLng/2) * Math.sin(diffLng/2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return radius * c;
    }

    public static deg2Rad(degValue: number): number {
        return degValue * Math.PI / 180;
    }
}
