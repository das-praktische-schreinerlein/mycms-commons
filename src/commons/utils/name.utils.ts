export class NameUtils {
    public static normalizeNames(src: string, defaultValue: string): string {
        let res = src && src.length > 0 ? src : '';
        res = res.replace(/\s+/g, ' ').trim();
        if (res.length > 0) {
            return res;
        } else {
            return defaultValue;
        }
    }

    public static normalizeTechnicalNames(src: string): string {
        return NameUtils.normalizeKwNames(src).toLocaleLowerCase();
    }

    public static normalizeFileNames(src: string): string {
        let res = src && src.length > 0 ? NameUtils.normalizeNames(src, '') : '';
        res = NameUtils.normalizeNames(res.replace(/[^-_ a-zA-Z0-9äöüßÄÖÜ]+/g, ' ').trim(), '');
        if (res.length > 0) {
            return res;
        } else {
            return '';
        }
    }

    public static normalizeKwNames(src: string): string {
        let res = src && src.length > 0 ? NameUtils.normalizeNames(src, '') : '';
        res = NameUtils.normalizeNames(res.replace(/[ ;:'"´`()/&$!]+/g, '').trim(), '');
        if (res.length > 0) {
            return res;
        } else {
            return '';
        }
    }

    public static remapData(mappings: {}, type: string, remapSubType: string, key: string, value: string): string {
        if (mappings[type] !== undefined && mappings[type][key.toLocaleLowerCase()]
            &&  mappings[type][key.toLocaleLowerCase()][remapSubType]) {
            return mappings[type][key.toLocaleLowerCase()][remapSubType];
        }

        return value;
    }

}

