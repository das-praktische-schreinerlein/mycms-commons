export class StringUtils {
    public static trimKeywords(src: string): string {
        if (src === undefined) {
            return '';
        }

        return src.replace(/[^-a-zA-Z_0-9äöüßÄÖÜ,:.]+/g, '').replace(/^[,;]*/g, '').replace(/[,;]*$/g, '');
    }

    public static uniqueKeywords(src: string): string[] {
        const keywordsList = [];
        StringUtils.trimKeywords(src).split(/[,;]+/).map(keyword => {
            if (keyword !== '' && keywordsList.indexOf(keyword) < 0) {
                keywordsList.push(keyword);
            }
        });

        return keywordsList;
    }

    public static mergeKeywords(src: string, mergerSrc: string, subtract: boolean): string {
        const keywordsList = StringUtils.uniqueKeywords(src);
        const mergerList = StringUtils.uniqueKeywords(mergerSrc);
        mergerList.map(keyword => {
            if (subtract) {
                while (keywordsList.indexOf(keyword) >= 0) {
                    keywordsList.splice(keywordsList.indexOf(keyword), 1);
                }
            } else {
                if (keywordsList.indexOf(keyword) < 0) {
                    keywordsList.push(keyword);
                }
            }
        });

        return keywordsList.join(',');
    }

    public static createReplacementsFromConfigArray(config: [any, any][]): [RegExp, string][] {
        const replacementConfig = [];
        if (Array.isArray(config)) {
            for (const replacement of config) {
                if (Array.isArray(replacement) && replacement.length === 2) {
                    replacementConfig.push([new RegExp(replacement[0]), replacement[1]]);
                }
            }
        }

        return replacementConfig;
    }

    public static doReplacements(src: string, nameReplacements: [RegExp, string][]): string {
        if (src === undefined || src === null || !nameReplacements || !Array.isArray(nameReplacements)) {
            return src;
        }

        let name = src;
        for (const replacement of nameReplacements) {
            name = name.replace(replacement[0], replacement[1]);
        }

        return name;
    }

    public static calcCharCodeForListIndex(code: number): string {
        const baseChar = ('A').charCodeAt(0);
        let res  = '';

        do {
            code -= 1;
            res = String.fromCharCode(baseChar + (code % 26)) + res;
            code = (code / 26) >> 0;
        } while(code > 0);

        return res;
    }

    public static generateTechnicalName(name: string): string {
        return name ? name.replace(/[^-a-zA-Z0-9.+]+/g, ' ')
            .replace(/ +/g, ' ')
            .replace(/ /g, '-')
            .trim()
            .toLowerCase() : '';
    }

    public static findNeedle(source: string, needle: string, findIdx: number): number {
        let lastPos = -needle.length;
        let curPos = -1;
        let idx = -1;
        do {
            curPos = source.indexOf(needle, lastPos + needle.length);
            if (curPos >= 0) {
                lastPos = curPos;
                idx++;
            }
        } while (curPos >= 0 && idx < findIdx);
        return lastPos >= 0 && idx === findIdx ? lastPos : -1;
    }

    public static padStart(source: string, paddingValue: string) {
        return String(paddingValue + source).slice(-paddingValue.length);
    };

    public static formatToShortFileNameDate(date: Date, dateSeparator: string): string {
        return [date.getFullYear(),
            dateSeparator,
            StringUtils.padStart((date.getMonth() + 1).toString(), '00'),
            dateSeparator,
            StringUtils.padStart(date.getDate().toString(), '00')].join('');
    }

}
