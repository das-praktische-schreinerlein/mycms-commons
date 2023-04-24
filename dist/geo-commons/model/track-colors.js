"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var hierarchy_utils_1 = require("../../commons/utils/hierarchy.utils");
var TrackColors = /** @class */ (function (_super) {
    __extends(TrackColors, _super);
    function TrackColors(arr, startIndex) {
        return _super.call(this, arr, startIndex) || this;
    }
    return TrackColors;
}(hierarchy_utils_1.Circular));
exports.TrackColors = TrackColors;
var DefaultTrackColors = /** @class */ (function (_super) {
    __extends(DefaultTrackColors, _super);
    function DefaultTrackColors(startIndex) {
        return _super.call(this, DefaultTrackColors.colors, startIndex) || this;
    }
    DefaultTrackColors.colors = ['blue', 'green', 'red', 'yellow', 'darkgreen'];
    return DefaultTrackColors;
}(TrackColors));
exports.DefaultTrackColors = DefaultTrackColors;
//# sourceMappingURL=track-colors.js.map