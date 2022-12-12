"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var ProcessUtils = /** @class */ (function () {
    function ProcessUtils() {
    }
    ProcessUtils.executeCommandAsync = function (command, commandArgs, stdoutHandler, stderrHandler) {
        return new Promise(function (resolve, reject) {
            var _this = this;
            var process = child_process_1.spawn(command, commandArgs);
            if (stdoutHandler) {
                process.stdout.on('data', function (chunk) {
                    // data from standard output is here as buffers
                    stdoutHandler.call(_this, chunk);
                });
            }
            if (stderrHandler) {
                process.stderr.on('data', function (chunk) {
                    // data from standard output is here as buffers
                    stderrHandler.call(_this, chunk);
                });
            }
            process.on('close', function (code) {
                resolve(code);
            });
            process.on('error', function (err) {
                reject(err);
            });
        });
    };
    return ProcessUtils;
}());
exports.ProcessUtils = ProcessUtils;
//# sourceMappingURL=process.utils.js.map