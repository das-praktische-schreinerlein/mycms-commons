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
    FileUtils.splitJsonFile = function (srcFile, targetFileBase, targetFileSuffix, chunkSize, parent, targetContentConverter) {
        var _this = this;
        var err = this.checkFilePath(srcFile, false, false, true, true, true);
        if (err) {
            return Promise.reject('srcFile is invalid: ' + err);
        }
        var me = this;
        return new Promise(function (passed, failure) {
            var resultFileNames = [];
            var data;
            try {
                data = fs.readFileSync(srcFile, { encoding: 'utf8' });
            }
            catch (err) {
                console.error('error while splitting json-file: ' + srcFile, err);
                return failure('error while reading srcFile: ' + err);
            }
            var jsonArray = JSON.parse(data);
            if (parent) {
                jsonArray = jsonArray[parent];
            }
            var index = 1;
            do {
                var targetFileName = targetFileBase + index + targetFileSuffix;
                err = me.checkFilePath(targetFileName, false, true, false, true, false);
                if (err) {
                    return failure('targetFileName is invalid: ' + err);
                }
                try {
                    var chunk = jsonArray.splice(0, chunkSize);
                    var result = void 0;
                    if (parent) {
                        var object = {};
                        object[parent] = chunk;
                        result = JSON.stringify(object);
                    }
                    else {
                        result = JSON.stringify(chunk);
                    }
                    if (targetContentConverter) {
                        result = targetContentConverter.call(_this, result, targetFileName);
                    }
                    fs.writeFileSync(targetFileName, result);
                }
                catch (err) {
                    return failure('error while writing to targetFileName: ' + err);
                }
                resultFileNames.push(targetFileName);
                index++;
            } while (jsonArray.length !== 0);
            return passed(resultFileNames);
        });
    };
    FileUtils.deleteFilesInDirectoryByPattern = function (targetBase, targetSuffix) {
        targetBase = targetBase.replace(/\\/, '/').trim();
        targetSuffix = targetSuffix.replace(/\\/, '/').trim();
        if (targetSuffix.includes('/')) {
            return Promise.reject('targetSuffix must not include / or \\: ' + targetSuffix);
        }
        var targetDir = pathLib.dirname(targetBase) || './';
        var err = this.checkDirPath(targetDir, false, false, true);
        if (err) {
            return Promise.reject('targetBase is invalid - directory not exists: ' + err);
        }
        var targetFileBase = pathLib.basename(targetBase);
        return new Promise(function (passed, failure) {
            var resultFileNames;
            try {
                resultFileNames = fs.readdirSync(targetDir);
            }
            catch (err) {
                console.error('error while reading files of: ' + targetDir, err);
                return failure('error while reading files of targetDir: ' + err);
            }
            var pattern = '^' + targetFileBase.replace(/(\.)/g, '\\$1') + '.*' + targetSuffix.replace(/(\.)/g, '\\$1') + '$';
            var regex = new RegExp(pattern);
            try {
                resultFileNames.filter(function (f) { return regex.test(f); })
                    .map(function (f) {
                    fs.unlinkSync(targetDir + '/' + f);
                    console.log('deleted file for targetBase+Suffix', targetDir + '/' + f, targetBase, targetSuffix);
                });
            }
            catch (err) {
                console.error('error while deleting files for pattern: ' + pattern + ' in: ' + targetDir, err);
                return failure('error while deleting files for pattern: ' + pattern + ' in: ' + err);
            }
            return passed(resultFileNames);
        });
    };
    return FileUtils;
}());
exports.FileUtils = FileUtils;
//# sourceMappingURL=file.utils.js.map