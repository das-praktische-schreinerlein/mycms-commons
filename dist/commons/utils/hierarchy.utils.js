"use strict";
// TODO move to commons
Object.defineProperty(exports, "__esModule", { value: true });
var Circular = /** @class */ (function () {
    function Circular(arr, startIndex) {
        this.arr = arr;
        this.currentIndex = startIndex || 0;
    }
    Circular.prototype.next = function () {
        var i = this.currentIndex, arr = this.arr;
        this.currentIndex = i < arr.length - 1 ? i + 1 : 0;
        return this.current();
    };
    Circular.prototype.prev = function () {
        var i = this.currentIndex, arr = this.arr;
        this.currentIndex = i > 0 ? i - 1 : arr.length - 1;
        return this.current();
    };
    Circular.prototype.current = function () {
        return this.arr[this.currentIndex];
    };
    Circular.prototype.setCurrent = function (idx) {
        this.currentIndex = idx;
    };
    return Circular;
}());
exports.Circular = Circular;
var HierarchyUtils = /** @class */ (function () {
    function HierarchyUtils() {
    }
    HierarchyUtils.getHierarchy = function (config, record, lastOnly, truncate, maxWordLength) {
        if (!config) {
            return [];
        }
        if (record[config.hierarchyField] === undefined || record[config.hierarchyIdsField] === undefined) {
            return [];
        }
        var hierarchyTexts = record[config.hierarchyField].split(' -> ');
        var hierarchyIds = record[config.hierarchyIdsField].split(',');
        if (hierarchyIds.length !== hierarchyTexts.length) {
            return [];
        }
        var hierarchy = [];
        var lastIndex = hierarchyTexts.length - 1;
        // remove own name of location from location-hierarchy
        if (config.removeOwnElementOfType && record[config.typeField] === config.removeOwnElementOfType && hierarchy.length > 1) {
            lastIndex--;
        }
        for (var i = lastOnly ? lastIndex : 0; i < hierarchyTexts.length; i++) {
            if (config.removeOwnElementOfType && config.removeRootElementNames &&
                record[config.typeField] !== config.removeOwnElementOfType &&
                i === 0 && hierarchyTexts.length > 1 &&
                config.removeRootElementNames.includes(hierarchyTexts[i])) {
                continue;
            }
            if (hierarchyIds[i] !== undefined && hierarchyTexts[i] !== undefined && hierarchyTexts[i].length > 0) {
                hierarchy.push([config.hierarchyIdsPrefix + hierarchyIds[i],
                    HierarchyUtils.getHierarchyElementName(hierarchyTexts[i], truncate && (i < hierarchyTexts.length - 1), maxWordLength)]);
            }
        }
        return hierarchy;
    };
    HierarchyUtils.getTxtHierarchy = function (config, record, lastOnly, truncate, maxWordLength) {
        if (record[config.hierarchyField] === undefined) {
            return [];
        }
        var hierarchyTexts = record[config.hierarchyField].split(' -> ');
        var hierarchy = [];
        var lastIndex = hierarchyTexts.length - 1;
        // remove own name of location from location-hierarchy
        if (config.removeOwnElementOfType && record[config.typeField] === config.removeOwnElementOfType && hierarchy.length > 1) {
            lastIndex--;
        }
        for (var i = lastOnly ? lastIndex : 0; i < hierarchyTexts.length; i++) {
            if (config.removeOwnElementOfType && config.removeRootElementNames &&
                record[config.typeField] !== config.removeOwnElementOfType &&
                i === 0 && hierarchyTexts.length > 1 &&
                config.removeRootElementNames.includes(hierarchyTexts[i])) {
                continue;
            }
            if (hierarchyTexts[i] !== undefined && hierarchyTexts[i].length > 0) {
                hierarchy.push(HierarchyUtils.getHierarchyElementName(hierarchyTexts[i], truncate && (i < hierarchyTexts.length - 1), maxWordLength));
            }
        }
        return hierarchy;
    };
    HierarchyUtils.getHierarchyElementName = function (name, truncate, maxWordLength) {
        if (!truncate) {
            return name;
        }
        var names = name.split(' ');
        return names.map(function (value) {
            value = value.trim();
            if (maxWordLength > 0 && value.length > maxWordLength) {
                return value.slice(0, maxWordLength);
            }
            return value;
        }).join(' ');
    };
    return HierarchyUtils;
}());
exports.HierarchyUtils = HierarchyUtils;
//# sourceMappingURL=hierarchy.utils.js.map