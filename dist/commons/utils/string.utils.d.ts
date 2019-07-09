export declare class StringUtils {
    static trimKeywords(src: string): string;
    static uniqueKeywords(src: string): string[];
    static mergeKeywords(src: string, mergerSrc: string, subtract: boolean): string;
    static calcCharCodeForListIndex(code: number): string;
    static generateTechnicalName(name: string): string;
    static findNeedle(source: string, needle: string, findIdx: number): number;
}
