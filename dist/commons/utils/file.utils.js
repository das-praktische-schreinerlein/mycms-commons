"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var pathLib = require("path");
var FileUtils = /** @class */ (function () {
    function FileUtils() {
    }
    FileUtils.checkDirPath = function (path, createDirIfNotExists, dirMustNotExist, dirMustExist) {
        if (dirMustExist && !fs.existsSync(path)) {
            return 'path not exists: ' + path;
        }
        if (fs.existsSync(path)) {
            if (dirMustNotExist) {
                return 'path already exists: ' + path;
            }
            var srcStat = fs.lstatSync(path);
            if (!srcStat.isDirectory()) {
                return 'path exists but is no directory: ' + path;
            }
        }
        if (createDirIfNotExists && !fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
    };
    FileUtils.checkFilePath = function (path, createDirIfNotExists, fileMustNotExist, fileMustExist) {
        var dir = pathLib.dirname(path);
        if (!fs.existsSync(path)) {
            var err = this.checkDirPath(dir, createDirIfNotExists, false, !createDirIfNotExists);
            if (err) {
                return err;
            }
        }
        if (!fs.lstatSync(dir).isDirectory()) {
            return 'directory of path is no directory: ' + dir;
        }
        if (!fs.existsSync(path)) {
            if (fileMustExist) {
                return 'file not exists: ' + path;
            }
            return undefined;
        }
        var srcStat = fs.lstatSync(path);
        if (fileMustNotExist && fs.existsSync(path)) {
            return 'file already exists: ' + path;
        }
        if (!srcStat.isFile()) {
            return 'path is no file: ' + path;
        }
    };
    FileUtils.copyFile = function (srcPath, destPath, onlyIfDiffer, overwrite) {
        var err = this.checkFilePath(srcPath, false, false, true);
        if (err) {
            return Promise.reject('srcFile is invalid: ' + err);
        }
        err = this.checkFilePath(destPath, true, !overwrite, false);
        if (err) {
            return Promise.reject('destPath is invalid: ' + err);
        }
        var srcStat = fs.lstatSync(srcPath);
        var destStat = undefined;
        if (destPath && fs.existsSync(destPath)) {
            destStat = fs.lstatSync(destPath);
        }
        return new Promise(function (passed, failure) {
            if (onlyIfDiffer && destStat && srcStat.ctimeMs === destStat.ctimeMs && srcStat.ctimeMs === destStat.ctimeMs) {
                console.log('SKIPPED - already exists -  ' + srcPath + ' to ' + destPath);
                return passed(destPath);
            }
            fs.copyFile(srcPath, destPath, function (err2) {
                if (err) {
                    console.error('error while exporting: ' + srcPath, err2);
                    return failure(err2);
                }
                console.log('copied ' + srcPath, ' to ' + destPath);
                return passed(destPath);
            });
        });
    };
    FileUtils.moveFile = function (srcPath, destPath, overwrite) {
        var err = this.checkFilePath(srcPath, false, false, true);
        if (err) {
            return Promise.reject('srcFile is invalid: ' + err);
        }
        err = this.checkFilePath(destPath, true, !overwrite, false);
        if (err) {
            return Promise.reject('destPath is invalid: ' + err);
        }
        return new Promise(function (passed, failure) {
            fs.rename(srcPath, destPath, function (err2) {
                if (err) {
                    console.error('error while exporting: ' + srcPath, err2);
                    return failure(err2);
                }
                console.log('renamed ' + srcPath, ' to ' + destPath);
                return passed(destPath);
            });
        });
    };
    return FileUtils;
}());
exports.FileUtils = FileUtils;
//# sourceMappingURL=file.utils.js.map