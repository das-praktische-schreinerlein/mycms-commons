export declare class ObjectUtils {
    static mapValueToObjects(fieldValues: any, fieldName: string): {}[];
    static explodeValueToObjects(srcValue: string, objectSeparator: string, fieldSeparator: string, valueSeparator: string): {}[];
    static mergePropertyValues(detailDocs: {}[], property: string, joiner: string): string;
}
