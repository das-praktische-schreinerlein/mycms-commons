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
var BackendLatLng = /** @class */ (function () {
    function BackendLatLng() {
    }
    return BackendLatLng;
}());
exports.BackendLatLng = BackendLatLng;
var BackendLatLngTime = /** @class */ (function (_super) {
    __extends(BackendLatLngTime, _super);
    function BackendLatLngTime() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BackendLatLngTime;
}(BackendLatLng));
exports.BackendLatLngTime = BackendLatLngTime;
var BackendGeoElement = /** @class */ (function () {
    function BackendGeoElement(type, points, name) {
        this.points = [];
        this.type = type;
        this.points = points;
        this.name = name;
    }
    return BackendGeoElement;
}());
exports.BackendGeoElement = BackendGeoElement;
//# sourceMappingURL=backend-geo.types.js.map