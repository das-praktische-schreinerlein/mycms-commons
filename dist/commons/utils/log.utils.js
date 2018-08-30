"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogUtils = /** @class */ (function () {
    function LogUtils() {
    }
    LogUtils.sanitizeLogMsg = function (msg) {
        if (msg === undefined) {
            return undefined;
        }
        return (msg + '').replace(/[^-A-Za-z0-9äöüßÄÖÜ/+;,:._*]*/gi, '');
    };
    return LogUtils;
}());
exports.LogUtils = LogUtils;
//# sourceMappingURL=log.utils.js.map