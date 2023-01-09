/* tslint:disable:no-unused-variable */
import {AbstractGeoGpxParser} from './geogpx.parser';
import {BackendGeoGpxParser} from '../backend/backend-geo.parser';

describe('AbstractGeoGpxParser', () => {
    const service = new BackendGeoGpxParser();

    it('should parse gpx without timezone in gmt...', done => {
        // WHEN/THEN
        const src = `
<?xml version="1.0" encoding="UTF-8" standalone="no" ?> 
<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:wptx1="http://www.garmin.com/xmlschemas/WaypointExtension/v1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" creator="Oregon 450t" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www8.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/WaypointExtension/v1 http://www8.garmin.com/xmlschemas/WaypointExtensionv1.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd"><metadata><link href="http://www.garmin.com"><text>Garmin International</text></link><time>2017-09-13T13:59:19Z</time></metadata> 
  <trk><name>2017-08-25 06:12:56 Auto</name><extensions><gpxx:TrackExtension><gpxx:DisplayColor>Red</gpxx:DisplayColor></gpxx:TrackExtension></extensions> 
  <trkseg> 
      <trkpt lat="-17.0097638201" lon="145.5824358109"><ele>608.17</ele><time>2017-08-25T04:12:56Z</time></trkpt> 
      <trkpt lat="-17.0097659994" lon="145.5824374873"><ele>608.17</ele><time>2017-08-25T04:12:57Z</time></trkpt> 
      <trkpt lat="-17.0098021254" lon="145.5824451987"><ele>607.69</ele><time>2017-08-25T04:13:09Z</time></trkpt> 
      <trkpt lat="-17.0097463857" lon="145.5824447796"><ele>607.69</ele><time>2017-08-25T04:13:18Z</time></trkpt> 
      <trkpt lat="-17.0096783247" lon="145.5824443605"><ele>605.29</ele><time>2017-08-25T04:13:27Z</time></trkpt> 
      <trkpt lat="-17.0096373372" lon="145.5824831687"><ele>605.29</ele><time>2017-08-25T04:13:35Z</time></trkpt> 
      <trkpt lat="-17.0095826872" lon="145.5825772975"><ele>603.36</ele><time>2017-08-25T04:13:45Z</time></trkpt> 
      <trkpt lat="-17.0095773228" lon="145.5827105697"><ele>600.96</ele><time>2017-08-25T04:13:58Z</time></trkpt>
  </trkseg> 
</trk>
</gpx> 
`;
        expect(service.isResponsibleForSrc(src)).toBeTruthy();
        const res = service.parse(src, {});
        expect(res.length).toEqual(1);
        expect(res[0].points.length).toEqual(8);
        expect(res[0].points[0]['time']).toEqual(new Date('2017-08-25 06:12:56 GMT+0200'));
        done();
    });

});
