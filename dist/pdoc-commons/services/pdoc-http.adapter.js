"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var generic_search_http_adapter_1 = require("../../search-commons/services/generic-search-http.adapter");
var PDocHttpAdapter = /** @class */ (function (_super) {
    __extends(PDocHttpAdapter, _super);
    function PDocHttpAdapter(config) {
        return _super.call(this, config) || this;
    }
    PDocHttpAdapter.prototype.getHttpEndpoint = function (method) {
        var updateMethods = ['create', 'destroy', 'update'];
        if (updateMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'pdoc';
        }
        return 'pdocsearch';
    };
    return PDocHttpAdapter;
}(generic_search_http_adapter_1.GenericSearchHttpAdapter));
exports.PDocHttpAdapter = PDocHttpAdapter;
//# sourceMappingURL=pdoc-http.adapter.js.map