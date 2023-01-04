import {isDate, isNumber, isString} from 'util';
import {StringUtils} from './string.utils';

export class DateUtils {
    public static parseDate(date: any): Date {
        if (date === undefined || date === null || (isString(date) && date.toString() === '')) {
            return undefined;
        }

        if (!isDate(date)) {
            if (isNumber(date )) {
                date = new Date(date);
            } else if (isString(date)) {
                return DateUtils.parseDateStringWithLocaltime(date);
            } else {
                return undefined;
            }
        }

        return date;
    }

    public static parseDateStringWithLocaltime(date: any): Date {
        if (date === undefined || date === null || (isString(date) && date.toString() === '') || !isString(date)) {
            return undefined;
        }

        // parse Date for localtime ISO
        let dateParts = date.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):{0,1}(\d{2}){0,1}$/);
        if (dateParts !== null ) {
            dateParts = dateParts.slice(1);
            dateParts[1] = (Number(dateParts[1]) - 1) + ''; // months are zero-based
            date = new Date();
            date.setFullYear(dateParts[0], dateParts[1], dateParts[2]);
            date.setHours(dateParts[3], dateParts[4], dateParts.length > 5 && dateParts[5] !== undefined ? dateParts[5] : 0);
            date.setMilliseconds(0)

            return date;
        }

        // parse Date for localtime German
        dateParts = date.match(/^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})$/);
        if (dateParts !== null ) {
            dateParts = dateParts.slice(1);
            dateParts[1] = (Number(dateParts[1]) - 1) + ''; // months are zero-based
            date = new Date();
            date.setFullYear(dateParts[2], dateParts[1], dateParts[0]);
            date.setHours(dateParts[3], dateParts[4], dateParts[5]);
            date.setMilliseconds(0);
            return date;
        }

        // parse Date for localtime German with timezone
        dateParts = date.match(/^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2}) \(UTC([-+0-9])+\)$/);
        if (dateParts !== null ) {
            dateParts = dateParts.slice(1);
            dateParts[1] = (Number(dateParts[1]) - 1) + ''; // months are zero-based
            date = new Date();
            date.setFullYear(dateParts[2], dateParts[1], dateParts[0]);
            const timezoneOffset = Number(dateParts[6]);
            const hour = Number(dateParts[3]) + timezoneOffset - date.getTimezoneOffset() / 60; // add with date.timezoneOffset and local.timezoneOffset
            date.setHours(hour, dateParts[4], dateParts[5]);
            date.setMilliseconds(0);
            return date;
        }

        return new Date(Date.parse(<any>date));
    }

    public static dateToLocalISOString(src: any): string {
        const date = DateUtils.parseDate(src);
        if (date === undefined || date === null || !isDate(date)) {
            return undefined;
        }
        const ten = function (i) {
                return (i < 10 ? '0' : '') + i;
            },
            YYYY = date.getFullYear(),
            MM = ten(date.getMonth() + 1),
            DD = ten(date.getDate()),
            HH = ten(date.getHours()),
            II = ten(date.getMinutes()),
            SS = ten(date.getSeconds())
        ;

        return YYYY + '-' + MM + '-' + DD + 'T' +
            HH + ':' + II + ':' + SS;
    }

    public static formatDateRange(start: Date, end: Date): string {
        const formatOptionsShort = { day: '2-digit' };
        const formatOptionsLong = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const datestart = start.toLocaleString('de-DE', formatOptionsLong);
        const dateend = end.toLocaleString('de-DE', formatOptionsLong);
        if (datestart !== dateend) {
            return start.toLocaleString('de-DE', formatOptionsShort)
                + '-' + dateend;
        } else {
            return dateend;
        }
    }

    public static formatDateTime(start: Date): string {
        const formatOptionsLong = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
            second: '2-digit' };
        return start.toLocaleString('de-DE', formatOptionsLong);
    }

    public static formatToFileNameDate(date: Date, dateSeparator: string, dateTimeSeparator: string, timeSeparator: string): string {
        return [StringUtils.padStart(date.getDate().toString(), '00'),
            dateSeparator,
            StringUtils.padStart((date.getMonth() + 1).toString(), '00'),
            dateSeparator,
            date.getFullYear(),
            dateTimeSeparator,
            StringUtils.padStart(date.getHours().toString(), '00'),
            timeSeparator,
            StringUtils.padStart(date.getMinutes().toString(), '00'),
            timeSeparator,
            StringUtils.padStart(date.getSeconds().toString(), '00')].join('');
    }
}
