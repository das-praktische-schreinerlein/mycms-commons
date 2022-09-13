export declare class ObjectUtils {
    static mapValueToObjects(fieldValues: any, fieldName: string): {}[];
    static explodeValueToObjects(srcValue: string, objectSeparator: string, fieldSeparator: string, valueSeparator: string, unique?: boolean): {}[];
    static mergePropertyValues(detailDocs: {}[], property: string, joiner: string, unique?: boolean): string;
    static uniqueArray(arr: any[]): any[];
}
