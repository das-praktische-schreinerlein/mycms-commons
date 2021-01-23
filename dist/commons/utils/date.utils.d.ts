export declare class DateUtils {
    static parseDate(date: any): Date;
    static parseDateStringWithLocaltime(date: any): Date;
    static dateToLocalISOString(src: any): string;
    static formatDateRange(start: Date, end: Date): string;
    static formatDateTime(start: Date): string;
    static formatToFileNameDate(date: Date, dateSeparator: string, dateTimeSeparator: string, timeSeparator: string): string;
}
