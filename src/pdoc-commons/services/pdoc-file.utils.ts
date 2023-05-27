import {IdValidationRule} from '../../search-commons/model/forms/generic-validator.util';
import {isArray} from 'util';
import {DateUtils} from '../../commons/utils/date.utils';

export class PDocFileUtils {
    public static normalizeCygwinPath(path: string): string {
        if (!path) {
            return path;
        }

        path = path.replace(/^\/cygdrive\/([a-z])\//g, '$1:/');

        return path;
    }

    public static parseRecordSourceFromJson(json: string): any[] {
        let data = JSON.parse(json);
        const records = [];
        const idValidator = new IdValidationRule(true);
        const mapping = {
            // facets
            page_id_is: 'page_id_i'
        };

        if (data.pdocs) {
            data = data.pdocs;
        }

        if (!isArray(data)) {
            throw new Error('no valid data to import: no array of pdocs');
        }

        data.forEach(record => {
            for (const fieldName in mapping) {
                record[fieldName] = record[mapping[fieldName]];
            }
            record['id'] = idValidator.sanitize(record['id'] + '');
            record['subtype_s'] = record['subtype_s'] ? record['subtype_s'].replace(/[-a-zA-Z_]+/g, '') : '';

            // clean keywords
            record['keywords_txt'] = (record['keywords_txt'] !== undefined ?
                record['keywords_txt'].replace(/^,/g, '').replace(/,$/g, '').replace(/,,/g, ',') : '');

            for (const dateField of []) {
                if (record[dateField] !== undefined && record[dateField] !== '') {
                    record[dateField] = DateUtils.parseDateStringWithLocaltime(record[dateField]);
                }
            }

            records.push(record);
        });

        return records;
    }

}
