export declare class DateUtils {
    static parseDate(date: any, timezone?: string): Date;
    static parseDateStringWithLocaltime(dateSrc: any, timezone?: string): Date;
    static dateToLocalISOString(src: any): string;
    static formatDateRange(start: Date, end: Date): string;
    static formatDateTime(start: Date): string;
    static formatToFileNameDate(date: Date, dateSeparator: string, dateTimeSeparator: string, timeSeparator: string): string;
    static createDateForTimezone(year: number | string, month: number | string, day: number | string, hour: number | string, minute: number | string, second?: number | string, timezone?: string): Date;
}
