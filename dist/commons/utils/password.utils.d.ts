export declare class PasswordUtils {
    static DEFAULTCHARSET: string;
    static DEFAULTNUMBERCHARSET: string;
    static DEFAULTSPECIALCHARSET: string;
    static createNewPassword(max: number, chars: string, numberChars: string, specialChars: string): string;
    static createNewDefaultPassword(max: number): string;
    static createSolrPasswordHash(pwd: string): Promise<string>;
}
