export declare class StringUtils {
    static readonly UMLAUTMAP: {
        '\u00dc': string;
        '\u00c4': string;
        '\u00d6': string;
        '\u00fc': string;
        '\u00e4': string;
        '\u00f6': string;
        '\u00df': string;
    };
    static trimKeywords(src: string): string;
    static uniqueKeywords(src: string): string[];
    static mergeKeywords(src: string, mergerSrc: string, subtract: boolean): string;
    static createReplacementsFromConfigArray(config: [any, any][]): [RegExp, string][];
    static doReplacements(src: string, nameReplacements: [RegExp, string][]): string;
    static calcCharCodeForListIndex(code: number): string;
    static replaceUmlauts(src: string): string;
    static generateTechnicalName(name: string): string;
    static findNeedle(source: string, needle: string, findIdx: number): number;
    static padStart(source: string, paddingValue: string): string;
    static formatToShortFileNameDate(date: Date, dateSeparator: string): string;
    static normalizeWhiteSpaceForParser(src: string): string;
    static removeWhitespaces(src: string): string;
    static nullSafeStringCompare(a: string, b: string): number;
}
