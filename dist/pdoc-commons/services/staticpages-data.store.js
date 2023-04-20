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
var pdoc_data_store_1 = require("./pdoc-data.store");
var StaticPagesDataStore = /** @class */ (function (_super) {
    __extends(StaticPagesDataStore, _super);
    function StaticPagesDataStore(searchParameterUtils) {
        return _super.call(this, searchParameterUtils) || this;
    }
    return StaticPagesDataStore;
}(pdoc_data_store_1.PDocDataStore));
exports.StaticPagesDataStore = StaticPagesDataStore;
//# sourceMappingURL=staticpages-data.store.js.map