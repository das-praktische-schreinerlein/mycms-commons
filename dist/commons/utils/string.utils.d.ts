export declare class StringUtils {
    static trimKeywords(src: string): string;
    static uniqueKeywords(src: string): string[];
    static mergeKeywords(src: string, mergerSrc: string, subtract: boolean): string;
    static createReplacementsFromConfigArray(config: [any, any][]): [RegExp, string][];
    static doReplacements(src: string, nameReplacements: [RegExp, string][]): string;
    static calcCharCodeForListIndex(code: number): string;
    static generateTechnicalName(name: string): string;
    static findNeedle(source: string, needle: string, findIdx: number): number;
    static padStart(source: string, paddingValue: string): string;
    static formatToShortFileNameDate(date: Date, dateSeparator: string): string;
}
