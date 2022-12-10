import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as pathLib from 'path';

export class FileUtils {
    public static checkDirPath(path: string, createDirIfNotExists: boolean, dirMustNotExist: boolean,
                               dirMustExist: boolean, allowParentSymLink: boolean = false): string {
        if (dirMustExist && !fs.existsSync(path)) {
            return 'path not exists: ' + path;
        }

        if (fs.existsSync(path)) {
            if (dirMustNotExist) {
                return 'path already exists: ' + path;
            }

            const srcStat: fs.Stats = fs.lstatSync(path);
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
    }

    public static checkFilePath(path: string, createDirIfNotExists: boolean, fileMustNotExist: boolean,
                                fileMustExist: boolean, allowParentSymLink: boolean = false,
                                allowFileSymLink: boolean = false): string {
        const dir = pathLib.dirname(path);

        if (!fs.existsSync(path)) {
            const err = this.checkDirPath(dir, createDirIfNotExists,  false, !createDirIfNotExists,
                allowParentSymLink);
            if (err) {
                return err;
            }
        }

        const dirStat: fs.Stats = fs.lstatSync(dir);
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

        const srcStat: fs.Stats = fs.lstatSync(path);
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
    }

    public static copyFile(srcPath: string, destPath: string, onlyIfDiffer: boolean,
                           destFileMustNotExists: boolean = false, allowParentSymLink: boolean = false,
                           allowFileSymLink: boolean = false)
        : Promise<string> {
        let err = this.checkFilePath(srcPath, false,  false, true,
            allowParentSymLink, allowFileSymLink);
        if (err) {
            return Promise.reject('srcFile is invalid: ' + err);
        }

        err = this.checkFilePath(destPath, true,  destFileMustNotExists, false,
            allowParentSymLink, allowFileSymLink);
        if (err) {
            return Promise.reject('destPath is invalid: ' + err);
        }

        const srcStat: fs.Stats = fs.lstatSync(srcPath);
        let destStat: fs.Stats = undefined;
        if (destPath && fs.existsSync(destPath)) {
            destStat = fs.lstatSync(destPath);
        }

        return new Promise<string>((passed, failure) => {
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
    }

    public static moveFile(srcPath: string, destPath: string, overwrite: boolean, allowParentSymLink: boolean = false,
                           allowFileSymLink: boolean = false): Promise<string> {
        let err = this.checkFilePath(srcPath, false,  false, true,
            allowParentSymLink, allowFileSymLink);
        if (err) {
            return Promise.reject('srcFile is invalid: ' + err);
        }

        err = this.checkFilePath(destPath, true,  !overwrite, false,
            allowParentSymLink, allowFileSymLink);
        if (err) {
            return Promise.reject('destPath is invalid: ' + err);
        }

        return new Promise<string>((passed, failure) => {
            fs.rename(srcPath, destPath, function (err2) {
                if (err2) {
                    console.error('error while rename: ' + srcPath + ' to ' + destPath, err2);
                    return failure(err2);
                }

                console.log('renamed ' + srcPath, ' to ' + destPath);
                return passed(destPath);
            });
        });
    }

    public static moveDir(srcPath: string, destPath: string, overwrite: boolean, allowParentSymLink: boolean = false): Promise<string> {
        let err = FileUtils.checkDirPath(srcPath, false,  false, true,
            allowParentSymLink);
        if (err) {
            return Promise.reject('srcDir is invalid: ' + err);
        }

        err = FileUtils.checkDirPath(destPath, false,  !overwrite, false,
            allowParentSymLink);
        if (err) {
            return Promise.reject('destPath is invalid: ' + err);
        }

        return new Promise<string>((passed, failure) => {
            fse.move(srcPath, destPath, { overwrite: overwrite}, function (err2) {
                if (err2) {
                    console.error('error while move: ' + srcPath, err2);
                    return failure(err2);
                }

                return passed(destPath);
            });
        });
    }

    public static copyDir(srcPath: string, destPath: string, overwrite: boolean, allowParentSymLink: boolean = false): Promise<string> {
        let err = FileUtils.checkDirPath(srcPath, false,  false, true,
            allowParentSymLink);
        if (err) {
            return Promise.reject('srcDir is invalid: ' + err);
        }

        err = FileUtils.checkDirPath(destPath, false,  !overwrite, false,
            allowParentSymLink);
        if (err) {
            return Promise.reject('destPath is invalid: ' + err);
        }

        return new Promise<string>((passed, failure) => {
            fse.copy(srcPath, destPath, { overwrite: overwrite}, function (err2) {
                if (err2) {
                    console.error('error while exporting: ' + srcPath, err2);
                    return failure(err2);
                }

                return passed(destPath);
            });
        });
    }

    public static splitJsonFile(srcFile: string, targetFileBase: string, targetFileSuffix: string, chunkSize: number,
                                parent?: string, targetContentConverter?: Function): Promise<string[]> {

        let err = this.checkFilePath(srcFile, false,  false, true,
            true, true);
        if (err) {
            return Promise.reject('srcFile is invalid: ' + err);
        }

        const me = this;
        return new Promise<string[]>((passed, failure) => {
            const resultFileNames: string[] = [];
            let data;
            try {
                data = fs.readFileSync(srcFile, {encoding: 'utf8'});
            } catch (err) {
                console.error('error while splitting json-file: ' + srcFile, err);
                return failure('error while reading srcFile: ' + err);
            }

            let jsonArray = JSON.parse(data);
            if (parent) {
                jsonArray = jsonArray[parent];
            }

            let index = 1;
            do {
                const targetFileName = targetFileBase + index + targetFileSuffix;
                err = me.checkFilePath(targetFileName, false,  true, false,
                    true, false);
                if (err) {
                    return failure('targetFileName is invalid: ' + err);
                }

                try {
                    const chunk = jsonArray.splice(0, chunkSize);
                    let result;
                    if (parent) {
                        const object  = {};
                        object[parent] = chunk;
                        result = JSON.stringify(object);
                    } else {
                        result = JSON.stringify(chunk);
                    }


                    if (targetContentConverter) {
                        result = targetContentConverter.call(this, result, targetFileName);
                    }

                    fs.writeFileSync(targetFileName, result);
                } catch (err) {
                    return failure('error while writing to targetFileName: ' + err);
                }

                resultFileNames.push(targetFileName);
                index++;
            } while (jsonArray.length !== 0);

            return passed(resultFileNames);
        });
    }

    public static deleteFilesInDirectoryByPattern(targetBase: string, targetSuffix: string): Promise<string[]> {
        targetBase = targetBase.replace(/\\/, '/').trim();
        targetSuffix = targetSuffix.replace(/\\/, '/').trim();
        if (targetSuffix.includes('/')) {
            return Promise.reject('targetSuffix must not include / or \\: ' + targetSuffix);
        }

        const targetDir = pathLib.dirname(targetBase) || './';
        let err = this.checkDirPath(targetDir, false, false, true);
        if (err) {
            return Promise.reject('targetBase is invalid - directory not exists: ' + err);
        }

        const targetFileBase = pathLib.basename(targetBase);

        return new Promise<string[]>((passed, failure) => {
            let resultFileNames: string[];
            try {
                resultFileNames = fs.readdirSync(targetDir)
            } catch (err) {
                console.error('error while reading files of: ' + targetDir, err);
                return failure('error while reading files of targetDir: ' + err);
            }

            const pattern = '^' + targetFileBase.replace(/(\.)/g, '\\$1') + '.*' + targetSuffix.replace(/(\.)/g, '\\$1') + '$';
            const regex = new RegExp(pattern);
            try {
                resultFileNames.filter(f => regex.test(f))
                    .map(f => {
                        fs.unlinkSync(targetDir + '/' + f);
                        console.log('deleted file for targetBase+Suffix', targetDir + '/' + f, targetBase, targetSuffix);
                    });
            } catch (err) {
                console.error('error while deleting files for pattern: ' + pattern + ' in: ' + targetDir, err);
                return failure('error while deleting files for pattern: ' + pattern + ' in: ' + err);
            }

            return passed(resultFileNames);
        });
    }

}
