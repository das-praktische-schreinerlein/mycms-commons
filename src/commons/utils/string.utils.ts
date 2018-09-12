export class StringUtils {
    public static trimKeywords(src: string): string {
        if (src === undefined) {
            return '';
        }

        return src.replace(/[^a-zA-Z0-9üÜäÄöÖß_,]+/g, '').replace(/^,*/g, '').replace(/,*$/g, '');
    }

    public static uniqueKeywords(src: string): string[] {
        const keywordsList = [];
        StringUtils.trimKeywords(src).split(',').map(keyword => {
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

}
