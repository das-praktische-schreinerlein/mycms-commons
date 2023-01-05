import {StringUtils} from '../../commons/utils/string.utils';
import {LatLngBase} from '../model/geoElementTypes';

export class GeoGpxUtils {

    public fixXml(xml: string): string {
        if (!xml) {
            return xml;
        }

        xml = xml.replace('<--?xml version="1.0" encoding="UTF-8" standalone="no" ?-->',
            '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>');
        xml = xml.replace('<!--?xml version="1.0" encoding="UTF-8" standalone="no" ?-->',
            '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>');
        xml = xml.replace('</text><time>',
            '</text></link><time>');
        xml = xml.trim();

        return xml;
    }

    public fixXmlExtended(xml: string): string {
        if (!xml) {
            return xml;
        }

        xml = xml.replace(/^[ \r\n]+/, '');
        xml = xml.replace(/[ \r\n]+$/, '');
        xml = xml.replace(/'/g, '"');

        if (xml.indexOf('<gpx ') < 0 && xml.indexOf('<gpx>') < 0) {
            xml = '<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1"' +
                ' xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3"' +
                ' xmlns:wptx1="http://www.garmin.com/xmlschemas/WaypointExtension/v1"' +
                ' xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1"' +
                ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
                ' xsi:schemaLocation="http://www.topografix.com/GPX/1/1' +
                '     http://www.topografix.com/GPX/1/1/gpx.xsd' +
                '     http://www.garmin.com/xmlschemas/GpxExtensions/v3' +
                '     http://www8.garmin.com/xmlschemas/GpxExtensionsv3.xsd' +
                '     http://www.garmin.com/xmlschemas/WaypointExtension/v1' +
                '     http://www8.garmin.com/xmlschemas/WaypointExtensionv1.xsd' +
                '     http://www.garmin.com/xmlschemas/TrackPointExtension/v1' +
                '     http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd">' + xml;
        }
        if (!(xml.startsWith('<?xml'))) {
            xml = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>' + xml;
        }

        if (!(xml.endsWith('</gpx>'))) {
            xml = xml + '</gpx>';
        }

        return xml;
    }

    public reformatXml(xml: string): string {
        if (!xml) {
            return xml;
        }

        xml = this.trimXml(xml)
            .replace(/<gpx /g, '\n<gpx ')
            .replace(/<gpx>/g, '\n<gpx>')
            .replace(/<\/gpx>/g, '\n</gpx>')

            .replace(/<trk /g, '\n  <trk ')
            .replace(/<trk>/g, '\n  <trk>')
            .replace(/<\/trk>/g, '\n  </trk>')

            .replace(/<trkseg /g, '\n  <trkseg ')
            .replace(/<trkseg>/g, '\n  <trkseg>')
            .replace(/<\/trkseg>/g, '\n  </trkseg>')

            .replace(/<rte /g, '\n  <rte ')
            .replace(/<rte>/g, '\n  <rte>')
            .replace(/<\/rte>/g, '\n  </rte>')

            .replace(/<wpt /g, '\n      <wpt ')
            .replace(/<trkpt /g, '\n      <trkpt ')
            .replace(/<rtept /g, '\n    <rtept ')
        ;

        return xml;
    }

    public trimXml(xml: string): string {
        if (!xml) {
            return xml;
        }

        return xml.replace(/[\r\n]+/g, '\n')
            .replace(/\n+/g, ' ')
            .replace(/[ ]+/g, ' ');
    }

    public createNewRouteGpx(name: string, type: string, points: LatLngBase[]): string {
        let newGpx = '<rte> <type>' + type + '</type><name>' + name + '</name> ';
        // @ts-ignore
        if (points) {
            for (let i = 0; i < points.length; i++) {
                const point = points[i];
                newGpx = newGpx + '<rtept lat="' + point.lat + '" lon="' + point.lng + '"></rtept>';
            }
        }
        newGpx = newGpx + '</rte>';

        return newGpx;
    }

    public deleteGpxTrackSegment(track: string, delSegIdx: number): string {
        if (track === undefined || track === null || track.length <= 0 || delSegIdx < 0) {
            return track;
        }

        let newTrack = track;
        const lastPos = StringUtils.findNeedle(track, '<trkseg>', delSegIdx);
        if (lastPos >= 0) {
            newTrack = track.substring(0, lastPos - 1);
            const endPos = track.indexOf('</trkseg>', lastPos);
            if (endPos >= 0) {
                newTrack += track.substring(endPos + '</trkseg>'.length, track.length);
            }
        }

        return newTrack;
    }

    public mergeGpxTrackSegment(track: string, mergeSegIdx: number): string {
        if (track === undefined || track === null || track.length <= 0 || mergeSegIdx <= 0) {
            return track;
        }

        let newTrack = track;
        const lastPos = StringUtils.findNeedle(track, '</trkseg>', mergeSegIdx - 1);
        if (lastPos >= 0) {
            newTrack = track.substring(0, lastPos - 1);
            const endPos = track.indexOf('<trkseg>', lastPos);
            if (endPos >= 0) {
                newTrack += track.substring(endPos + '<trkseg>'.length, track.length);
            }
        }

        return newTrack;
    }

    public mergeGpx(track1: string, track2: string): string {
        if (track1 === undefined || track1 === null) {
            return track2;
        }
        if (track2 === undefined || track2 === null) {
            return track1;
        }

        track1 = this.fixXml(track1);
        track1 = this.fixXmlExtended(track1);
        track2 = this.fixXml(track2);
        track2 = this.fixXmlExtended(track2);

        let newTrack = '   ';
        for (const track of [track1, track2]) {
            for (const element of [['<trk>', '</trk>'], ['<rte>', '</rte>'], ['<wpt ', '</wpt>']]) {
                let lastPos = -1;
                let idx = -1;
                do {
                    idx++;
                    lastPos = StringUtils.findNeedle(track, element[0], idx);
                    if (lastPos >= 0) {
                        const endPos = track.indexOf(element[1], lastPos);
                        if (endPos >= 0) {
                            newTrack += track.substring(lastPos, endPos + element[1].length);
                        }
                    }
                } while (lastPos >= 0);
            }
        }

        newTrack = this.fixXml(newTrack);
        newTrack = this.fixXmlExtended(newTrack);

        return newTrack;
    }

}
