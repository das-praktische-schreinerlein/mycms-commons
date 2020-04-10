export declare enum SimpleFilterCommands {
    CSVIN = "CSVIN",
    NUMIN = "NUMIN",
    EQ = "EQ",
    SEQ = "SEQ",
    NEQ = "NEQ",
    SNEQ = "SNEQ",
    LT = "LT",
    LE = "LE",
    GT = "GT",
    GE = "GE"
}
export interface SimpleFilter {
    property: string;
    command: string;
    expectedValues: any[];
}
export declare abstract class FilterUtils {
    static checkFilters(filters: SimpleFilter[], record: any): boolean;
    static checkFilter(filter: SimpleFilter, record: any): boolean;
}
