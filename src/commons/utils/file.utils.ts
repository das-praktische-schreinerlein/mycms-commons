import * as fs from 'fs';
import * as pathLib from 'path';

export class FileUtils {
    public static checkDirPath(path: string, createDirIfNotExists: boolean, dirMustNotExist: boolean, dirMustExist: boolean): string {
        if (dirMustExist && !fs.existsSync(path)) {
            return 'path not exists: ' + path;
        }
        if (fs.existsSync(path)) {
            if (dirMustNotExist) {
                return 'path already exists: ' + path;
            }

            const srcStat: fs.Stats = fs.lstatSync(path);
            if (!srcStat.isDirectory()) {
                return 'path exists but is no directory: ' + path;
            }
        }

        if (createDirIfNotExists && !fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
    }

    public static checkFilePath(path: string, createDirIfNotExists: boolean, fileMustNotExist: boolean, fileMustExist: boolean): string {
        const dir = pathLib.dirname(path);

        if (!fs.existsSync(path)) {
            const err = this.checkDirPath(dir, createDirIfNotExists,  false, !createDirIfNotExists);
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

        const srcStat: fs.Stats = fs.lstatSync(path);
        if (fileMustNotExist && fs.existsSync(path)) {
            return 'file already exists: ' + path;
        }

        if (!srcStat.isFile()) {
            return 'path is no file: ' + path;
        }
    }

    public static copyFile(srcPath: string, destPath: string, onlyIfDiffer: boolean, overwrite?: boolean): Promise<string> {
        let err = this.checkFilePath(srcPath, false,  false, true);
        if (err) {
            return Promise.reject('srcFile is invalid: ' + err);
        }

        err = this.checkFilePath(destPath, true,  !overwrite, false);
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
                if (err) {
                    console.error('error while exporting: ' + srcPath, err2);
                    return failure(err2);
                }

                console.log('copied ' + srcPath, ' to ' + destPath);
                return passed(destPath);
            });
        });
    }

    public static moveFile(srcPath: string, destPath: string, overwrite: boolean): Promise<string> {
        let err = this.checkFilePath(srcPath, false,  false, true);
        if (err) {
            return Promise.reject('srcFile is invalid: ' + err);
        }

        err = this.checkFilePath(destPath, true,  !overwrite, false);
        if (err) {
            return Promise.reject('destPath is invalid: ' + err);
        }

        return new Promise<string>((passed, failure) => {
            fs.rename(srcPath, destPath, function (err2) {
                if (err) {
                    console.error('error while exporting: ' + srcPath, err2);
                    return failure(err2);
                }

                console.log('renamed ' + srcPath, ' to ' + destPath);
                return passed(destPath);
            });
        });
    }
}
