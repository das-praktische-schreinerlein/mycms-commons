export declare class Circular {
    protected arr: any[];
    protected currentIndex: number;
    constructor(arr: any[], startIndex?: number);
    next(): any;
    prev(): any;
    current(): any;
    setCurrent(idx: number): void;
}
export interface HierarchyConfig {
    hierarchyField: string;
    hierarchyIdsField?: string;
    hierarchyIdsPrefix?: string;
    typeField: string;
    removeOwnElementOfType?: string;
    removeRootElementNames?: string[];
}
export declare class HierarchyUtils {
    static getHierarchy(config: HierarchyConfig, record: {}, lastOnly: boolean, truncate: boolean, maxWordLength: number): any[];
    static getTxtHierarchy(config: HierarchyConfig, record: {}, lastOnly: boolean, truncate: boolean, maxWordLength: number): any[];
    static getHierarchyElementName(name: string, truncate: boolean, maxWordLength: number): string;
}
