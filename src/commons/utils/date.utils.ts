import {isDate, isNumber, isString} from 'util';
import {StringUtils} from './string.utils';
import {GeoDateUtils} from '../../geo-commons/services/geodate.utils';

export class DateUtils {
    public static parseDate(date: any, timezone?: string): Date {
        if (date === undefined || date === null || (isString(date) && date.toString() === '')) {
            return undefined;
        }

        if (!isDate(date)) {
            if (isNumber(date )) {
                date = new Date(date);
            } else if (isString(date)) {
                if (timezone) {
                    return DateUtils.parseDateStringWithLocaltime(date, timezone);
                } else {
                    return DateUtils.parseDateStringWithLocaltime(date);
                }
            } else {
                return undefined;
            }
        }

        return date;
    }

    public static parseDateStringWithLocaltime(dateSrc: any, timezone?: string): Date {
        if (dateSrc === undefined || dateSrc === null
            || (isString(dateSrc) && dateSrc.toString() === '')
            || !isString(dateSrc)) {
            return undefined;
        }

        // parse Date for localtime ISO
        let dateParts = dateSrc.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):{0,1}(\d{2}){0,1}$/);
        if (dateParts !== null) {
            dateParts = dateParts.slice(1);
            const date = DateUtils.createDateForTimezone(dateParts[0], dateParts[1], dateParts[2],
                dateParts[3], dateParts[4], dateParts.length > 5 && dateParts[5] !== undefined
                    ? Number(dateParts[5])
                    : 0, timezone);

            return date;
        }

        // parse Date for localtime German
        dateParts = dateSrc.match(/^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})$/);
        if (dateParts !== null ) {
            dateParts = dateParts.slice(1);

            const date = DateUtils.createDateForTimezone(dateParts[2], dateParts[1], dateParts[0],
                dateParts[3], dateParts[4], dateParts[5], timezone);

            return date;
        }

        // parse Date for localtime German with timezone
        dateParts = dateSrc.match(/^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2}) \(UTC([-+0-9])+\)$/);
        if (dateParts !== null ) {
            dateParts = dateParts.slice(1);

            const tmpDate = new Date();
            tmpDate.setFullYear(Number(dateParts[2]), Number(dateParts[1]), Number(dateParts[0]));

            const timezoneOffset = Number(dateParts[6]);
            const hour = Number(dateParts[3]) + timezoneOffset - tmpDate.getTimezoneOffset() / 60; // add with date.timezoneOffset and local.timezoneOffset

            const date = DateUtils.createDateForTimezone(dateParts[2], dateParts[1], dateParts[1],
                hour, dateParts[4], dateParts.length > 5 && dateParts[5] !== undefined
                    ? Number(dateParts[5])
                    : 0, timezone);

            return date;
        }

        return new Date(Date.parse(<any>dateSrc));
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

    public static createDateForTimezone(year: number | string, month: number | string, day: number | string,
                                        hour: number | string, minute: number | string, second?: number | string,
                                        timezone?: string): Date {
        let date = new Date();
        month = (Number(month) - 1);
        date.setFullYear(Number(year), Number(month), Number(day));

        if (timezone) {
            const offset = GeoDateUtils.getTimeOffset(timezone, date);
            const utcHour = Number(hour) + (offset) / 60;

            date = new Date(Date.UTC(Number(year), Number(month), Number(day), Number(utcHour), Number(minute),
                second !== undefined
                    ? Number(second)
                    : 0));
        } else {
            date.setHours(Number(hour), Number(minute),
                second > 5 && second !== undefined
                    ? Number(second)
                    : 0);
            date.setMilliseconds(0);
        }


        return date;
    }
}
