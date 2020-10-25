export declare class NameUtils {
    static normalizeNames(src: string, defaultValue: string): string;
    static normalizeTechnicalNames(src: string): string;
    static normalizeFileNames(src: string): string;
    static normalizeKwNames(src: string): string;
    static remapData(mappings: {}, type: string, remapSubType: string, key: string, value: string): string;
}
