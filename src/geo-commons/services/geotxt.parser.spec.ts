/* tslint:disable:no-unused-variable */
import {AbstractGeoTxtParser} from './geotxt.parser';
import {BackendGeoTxtParser} from '../backend/backend-geo.parser';

describe('AbstractGeoTxtParser', () => {
    const service = new BackendGeoTxtParser();

    it('should parse txt without timezone in gmt...', done => {
        // WHEN/THEN
        const src = `
Grid	Breite/Länge hddd.ddddd°
Datum	WGS 84

Header	Name	Start Time	Elapsed Time	Length	Average Speed	Link

Track	ACTIVE LOG	10.12.2005 11:52:49 	0:20:01	402 m	1.2 kph

Header	Position	Time	Altitude	Depth	Leg Length	Leg Time	Leg Speed	Leg Course

Trackpoint	N54.01712 E13.23951	10.12.2005 11:52:49 	25 m
Trackpoint	N54.01723 E13.23903	10.12.2005 12:02:14 	24 m		34 m	0:09:25	0.2 kph	NW
Trackpoint	N54.01773 E13.23892	10.12.2005 12:04:46 	22 m		56 m	0:02:32	1.3 kph	N
Trackpoint	N54.01830 E13.23828	10.12.2005 12:06:17 	19 m		76 m	0:01:31	3 kph	NW
Trackpoint	N54.01820 E13.23677	10.12.2005 12:07:40 	17 m		100 m	0:01:23	4 kph	W
Trackpoint	N54.01785 E13.23624	10.12.2005 12:09:50 	17 m		52 m	0:02:10	1.4 kph	SW
Trackpoint	N54.01741 E13.23517	10.12.2005 12:12:50 	21 m		85 m	0:03:00	2 kph	SW

Track	ACTIVE LOG 001	10.12.2005 12:13:30 	0:00:00	0 m	0 kph

Header	Position	Time	Altitude	Depth	Leg Length	Leg Time	Leg Speed	Leg Course

Trackpoint	N54.01743 E13.23530	10.12.2005 12:13:30 	66 m

Track	ACTIVE LOG 002	10.12.2005 12:14:03 	0:00:00	0 m	0 kph

Header	Position	Time	Altitude	Depth	Leg Length	Leg Time	Leg Speed	Leg Course

Trackpoint	N54.01743 E13.23530	10.12.2005 12:14:03 	66 m

Track	ACTIVE LOG 003	10.12.2005 12:14:15 	0:17:32	1.1 km	4 kph

Header	Position	Time	Altitude	Depth	Leg Length	Leg Time	Leg Speed	Leg Course

Trackpoint	N54.01734 E13.23488	10.12.2005 12:14:15 	-14 m
Trackpoint	N54.01723 E13.23504	10.12.2005 12:16:50 	-11 m		16 m	0:02:35	0.4 kph	SO
Trackpoint	N54.01638 E13.23382	10.12.2005 12:18:20 	-6 m		124 m	0:01:30	5 kph	SW
Trackpoint	N54.01592 E13.23307	10.12.2005 12:20:32 	-12 m		71 m	0:02:12	2 kph	SW
`;
        expect(service.isResponsibleForSrc(src)).toBeTruthy();
        const res = service.parse(src, {});
        expect(res.length).toEqual(4);
        expect(res[0].points.length).toEqual(7);
        expect(res[0].points[0]['time']).toEqual(new Date('2005-12-10 11:52:49 GMT+0100'));
        done();
    });

    it('should parse txt with timezone and summertime...', done => {
        // WHEN/THEN
        const src = `
Track	ACTIVE LOG 123	23.07.2008 10:47:56 (UTC-7)	0:00:29	31 m	4 kph	
Header	Position	Time	Altitude	Depth	Temperature	Leg Length	Leg Time	Leg Speed	Leg Course
Trackpoint	N37.72949 W119.55242	23.07.2008 10:47:56 (UTC-7)	1309 m
Trackpoint	N37.72951 W119.55207	23.07.2008 10:48:25 (UTC-7)	1308 m			31 m	0:00:29	4 kph	87° true
Trackpoint	N37.72734 W119.55034	23.07.2008 10:51:42 (UTC-7)	1326 m
Trackpoint	N37.72726 W119.54900	23.07.2008 10:54:08 (UTC-7)	1354 m
Trackpoint	N37.72706 W119.54918	23.07.2008 10:57:51 (UTC-7)	1369 m			27 m	0:03:43	0.4 kph	216° true
Trackpoint	N37.72623 W119.54917	23.07.2008 11:02:11 (UTC-7)	1397 m
Trackpoint	N37.72647 W119.54569	23.07.2008 11:06:39 (UTC-7)	1433 m
Trackpoint	N37.72680 W119.54533	23.07.2008 11:09:16 (UTC-7)	1457 m			48 m	0:02:37	1.1 kph	41° true
Trackpoint	N37.72659 W119.54436	23.07.2008 11:12:52 (UTC-7)	1482 m			88 m	0:03:36	1.5 kph	105° true
Trackpoint	N37.72664 W119.54384	23.07.2008 11:59:56 (UTC-7)	1466 m
Trackpoint	N37.72664 W119.54384	23.07.2008 12:01:07 (UTC-7)	1466 m
Trackpoint	N37.72678 W119.53334	23.07.2008 12:01:38 (UTC-7)	1702 m
Trackpoint	N37.72616 W119.53138	23.07.2008 12:12:59 (UTC-7)	1786 m			187 m	0:11:21	1.0 kph	112° true
Trackpoint	N37.72607 W119.53039	23.07.2008 12:19:06 (UTC-7)	1811 m
Trackpoint	N37.72632 W119.52999	23.07.2008 12:22:17 (UTC-7)	1825 m			45 m	0:03:11	0.8 kph	51° true
Trackpoint	N37.72711 W119.52944	23.07.2008 12:24:01 (UTC-7)	1836 m			101 m	0:01:44	3 kph	29° true
`;
        expect(service.isResponsibleForSrc(src)).toBeTruthy();
        const res = service.parse(src, {});
        expect(res.length).toEqual(1);
        expect(res[0].points.length).toEqual(16);
        expect(res[0].points[0]['time']).toEqual(new Date('2008-07-23 10:47:56 UTC-0800'));
        done();
    });

    it('should parse txt with timezone and wintertime...', done => {
        // WHEN/THEN
        const src = `
Track	ACTIVE LOG 123	23.07.2008 10:47:56 (UTC-7)	0:00:29	31 m	4 kph	
Header	Position	Time	Altitude	Depth	Temperature	Leg Length	Leg Time	Leg Speed	Leg Course
Trackpoint	N37.72949 W119.55242	23.03.2008 10:47:56 (UTC-7)	1309 m
Trackpoint	N37.72951 W119.55207	23.03.2008 10:48:25 (UTC-7)	1308 m			31 m	0:00:29	4 kph	87° true
Trackpoint	N37.72734 W119.55034	23.03.2008 10:51:42 (UTC-7)	1326 m
Trackpoint	N37.72726 W119.54900	23.03.2008 10:54:08 (UTC-7)	1354 m
`;
        expect(service.isResponsibleForSrc(src)).toBeTruthy();
        const res = service.parse(src, {});
        expect(res.length).toEqual(1);
        expect(res[0].points.length).toEqual(4);
        expect(res[0].points[0]['time'].toISOString()).toEqual(new Date('2008-03-23 10:47:56 UTC-8').toISOString());
        done();
    });
});
