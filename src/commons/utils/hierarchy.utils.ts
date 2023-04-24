export class Circular {
    protected arr: any[];
    protected currentIndex: number;

    constructor(arr: any[], startIndex?: number) {
        this.arr = arr;
        this.currentIndex = startIndex || 0;
    }

    public next(): any {
        const i = this.currentIndex, arr = this.arr;
        this.currentIndex = i < arr.length - 1 ? i + 1 : 0;

        return this.current();
    }

    public prev(): any {
        const i = this.currentIndex, arr = this.arr;
        this.currentIndex = i > 0 ? i - 1 : arr.length - 1;

        return this.current();
    }

    public current(): any {
        return this.arr[this.currentIndex];
    }

    public setCurrent(idx: number): void {
        this.currentIndex = idx;
    }
}

export interface HierarchyConfig {
    hierarchyField: string,
    hierarchyIdsField?: string,
    hierarchyIdsPrefix?: string,
    typeField: string,
    removeOwnElementOfType?: string,
    removeRootElementNames?: string[]
}

export class HierarchyUtils {
    public static getHierarchy(config: HierarchyConfig, record: {}, lastOnly: boolean, truncate: boolean, maxWordLength: number): any[] {
        if (!config) {
            return [];
        }

        if (record[config.hierarchyField] === undefined || record[config.hierarchyIdsField] === undefined) {
            return [];
        }

        const hierarchyTexts = record[config.hierarchyField].split(' -> ');
        const hierarchyIds = record[config.hierarchyIdsField].split(',');
        if (hierarchyIds.length !== hierarchyTexts.length) {
            return [];
        }

        const hierarchy = [];
        let lastIndex = hierarchyTexts.length - 1;
        // remove own name of location from location-hierarchy
        if (config.removeOwnElementOfType && record[config.typeField] === config.removeOwnElementOfType && hierarchy.length > 1) {
            lastIndex--;
        }

        for (let i = lastOnly ? lastIndex : 0; i < hierarchyTexts.length; i++) {
            if (config.removeOwnElementOfType && config.removeRootElementNames &&
                record[config.typeField] !== config.removeOwnElementOfType &&
                i === 0 && hierarchyTexts.length > 1 &&
                config.removeRootElementNames.includes(hierarchyTexts[i])) {
                continue;
            }

            if (hierarchyIds[i] !== undefined && hierarchyTexts[i] !== undefined && hierarchyTexts[i].length > 0) {
                hierarchy.push(
                    [config.hierarchyIdsPrefix + hierarchyIds[i],
                    HierarchyUtils.getHierarchyElementName(hierarchyTexts[i], truncate && (i < hierarchyTexts.length - 1), maxWordLength)]);
            }
        }

        return hierarchy;
    }

    public static getTxtHierarchy(config: HierarchyConfig, record: {}, lastOnly: boolean, truncate: boolean, maxWordLength: number): any[] {
        if (record[config.hierarchyField] === undefined) {
            return [];
        }

        const hierarchyTexts = record[config.hierarchyField].split(' -> ');
        const hierarchy = [];
        let lastIndex = hierarchyTexts.length - 1;
        // remove own name of location from location-hierarchy
        if (config.removeOwnElementOfType && record[config.typeField] === config.removeOwnElementOfType && hierarchy.length > 1) {
            lastIndex--;
        }

        for (let i = lastOnly ? lastIndex : 0; i < hierarchyTexts.length; i++) {
            if (config.removeOwnElementOfType && config.removeRootElementNames &&
                record[config.typeField] !== config.removeOwnElementOfType &&
                i === 0 && hierarchyTexts.length > 1 &&
                config.removeRootElementNames.includes(hierarchyTexts[i])) {
                continue;
            }

            if (hierarchyTexts[i] !== undefined && hierarchyTexts[i].length > 0) {
                hierarchy.push(
                    HierarchyUtils.getHierarchyElementName(hierarchyTexts[i], truncate && (i < hierarchyTexts.length - 1), maxWordLength));
            }
        }

        return hierarchy;
    }

    public static getHierarchyElementName(name: string, truncate: boolean, maxWordLength: number): string {
        if (!truncate) {
            return name;
        }

        const names = name.split(' ');
        return names.map(value => {
            value = value.trim();
            if (maxWordLength > 0 && value.length > maxWordLength) {
                return value.slice(0, maxWordLength);
            }

            return value;
        }).join(' ');
    }
}
