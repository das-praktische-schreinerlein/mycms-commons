export declare abstract class BeanUtils {
    static getAttributeValue(object: any, attribute: string): any;
    static getValue(record: any, property: string): any;
    static jsonStringify(object: any, whiteList?: string[], blackList?: string[], removeBuffersGreaterThan?: number): string;
}
