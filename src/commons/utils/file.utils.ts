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

}
