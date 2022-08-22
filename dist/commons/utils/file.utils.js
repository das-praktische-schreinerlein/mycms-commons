"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var fse = require("fs-extra");
var pathLib = require("path");
var FileUtils = /** @class */ (function () {
    function FileUtils() {
    }
    FileUtils.checkDirPath = function (path, createDirIfNotExists, dirMustNotExist, dirMustExist, allowParentSymLink) {
        if (allowParentSymLink === void 0) { allowParentSymLink = false; }
        if (dirMustExist && !fs.existsSync(path)) {
            return 'path not exists: ' + path;
        }
        if (fs.existsSync(path)) {
            if (dirMustNotExist) {
                return 'path already exists: ' + path;
            }
            var srcStat = fs.lstatSync(path);
            if (!srcStat.isDirectory()) {
                if (!allowParentSymLink
                    || !srcStat.isSymbolicLink()
                    || !fs.lstatSync(fs.readlinkSync(path)).isDirectory()) {
                    return 'path exists but is no directory and/or no symmlink to directory allowed: ' + path;
                }
            }
        }
        if (createDirIfNotExists && !fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
    };
    FileUtils.checkFilePath = function (path, createDirIfNotExists, fileMustNotExist, fileMustExist, allowParentSymLink, allowFileSymLink) {
        if (allowParentSymLink === void 0) { allowParentSymLink = false; }
        if (allowFileSymLink === void 0) { allowFileSymLink = false; }
        var dir = pathLib.dirname(path);
        if (!fs.existsSync(path)) {
            var err = this.checkDirPath(dir, createDirIfNotExists, false, !createDirIfNotExists, allowParentSymLink);
            if (err) {
                return err;
            }
        }
        var dirStat = fs.lstatSync(dir);
        if (!dirStat.isDirectory()) {
            if (!allowParentSymLink
                || !dirStat.isSymbolicLink()
                || !fs.lstatSync(fs.readlinkSync(dir)).isDirectory()) {
                return 'directory of path is no directory and/or no symlink to directory allowed: ' + dir;
            }
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
            if (!allowFileSymLink
                || !srcStat.isSymbolicLink()
                || !fs.lstatSync(fs.readlinkSync(path)).isFile()) {
                return 'path is no file and/or no symlink to file allowed: ' + path;
            }
        }
    };
    FileUtils.copyFile = function (srcPath, destPath, onlyIfDiffer, destFileMustNotExists, allowParentSymLink, allowFileSymLink) {
        if (destFileMustNotExists === void 0) { destFileMustNotExists = false; }
        if (allowParentSymLink === void 0) { allowParentSymLink = false; }
        if (allowFileSymLink === void 0) { allowFileSymLink = false; }
        var err = this.checkFilePath(srcPath, false, false, true, allowParentSymLink, allowFileSymLink);
        if (err) {
            return Promise.reject('srcFile is invalid: ' + err);
        }
        err = this.checkFilePath(destPath, true, destFileMustNotExists, false, allowParentSymLink, allowFileSymLink);
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
                if (err2) {
                    console.error('error while copyFile: ' + srcPath + ' to ' + destPath, err2);
                    return failure(err2);
                }
                console.log('copied ' + srcPath, ' to ' + destPath);
                return passed(destPath);
            });
        });
    };
    FileUtils.moveFile = function (srcPath, destPath, overwrite, allowParentSymLink, allowFileSymLink) {
        if (allowParentSymLink === void 0) { allowParentSymLink = false; }
        if (allowFileSymLink === void 0) { allowFileSymLink = false; }
        var err = this.checkFilePath(srcPath, false, false, true, allowParentSymLink, allowFileSymLink);
        if (err) {
            return Promise.reject('srcFile is invalid: ' + err);
        }
        err = this.checkFilePath(destPath, true, !overwrite, false, allowParentSymLink, allowFileSymLink);
        if (err) {
            return Promise.reject('destPath is invalid: ' + err);
        }
        return new Promise(function (passed, failure) {
            fs.rename(srcPath, destPath, function (err2) {
                if (err2) {
                    console.error('error while rename: ' + srcPath + ' to ' + destPath, err2);
                    return failure(err2);
                }
                console.log('renamed ' + srcPath, ' to ' + destPath);
                return passed(destPath);
            });
        });
    };
    FileUtils.moveDir = function (srcPath, destPath, overwrite, allowParentSymLink) {
        if (allowParentSymLink === void 0) { allowParentSymLink = false; }
        var err = FileUtils.checkDirPath(srcPath, false, false, true, allowParentSymLink);
        if (err) {
            return Promise.reject('srcDir is invalid: ' + err);
        }
        err = FileUtils.checkDirPath(destPath, false, !overwrite, false, allowParentSymLink);
        if (err) {
            return Promise.reject('destPath is invalid: ' + err);
        }
        return new Promise(function (passed, failure) {
            fse.move(srcPath, destPath, { overwrite: overwrite }, function (err2) {
                if (err2) {
                    console.error('error while move: ' + srcPath, err2);
                    return failure(err2);
                }
                return passed(destPath);
            });
        });
    };
    FileUtils.copyDir = function (srcPath, destPath, overwrite, allowParentSymLink) {
        if (allowParentSymLink === void 0) { allowParentSymLink = false; }
        var err = FileUtils.checkDirPath(srcPath, false, false, true, allowParentSymLink);
        if (err) {
            return Promise.reject('srcDir is invalid: ' + err);
        }
        err = FileUtils.checkDirPath(destPath, false, !overwrite, false, allowParentSymLink);
        if (err) {
            return Promise.reject('destPath is invalid: ' + err);
        }
        return new Promise(function (passed, failure) {
            fse.copy(srcPath, destPath, { overwrite: overwrite }, function (err2) {
                if (err2) {
                    console.error('error while exporting: ' + srcPath, err2);
                    return failure(err2);
                }
                return passed(destPath);
            });
        });
    };
    return FileUtils;
}());
exports.FileUtils = FileUtils;
//# sourceMappingURL=file.utils.js.map