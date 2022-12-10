export declare class FileUtils {
    static checkDirPath(path: string, createDirIfNotExists: boolean, dirMustNotExist: boolean, dirMustExist: boolean, allowParentSymLink?: boolean): string;
    static checkFilePath(path: string, createDirIfNotExists: boolean, fileMustNotExist: boolean, fileMustExist: boolean, allowParentSymLink?: boolean, allowFileSymLink?: boolean): string;
    static copyFile(srcPath: string, destPath: string, onlyIfDiffer: boolean, destFileMustNotExists?: boolean, allowParentSymLink?: boolean, allowFileSymLink?: boolean): Promise<string>;
    static moveFile(srcPath: string, destPath: string, overwrite: boolean, allowParentSymLink?: boolean, allowFileSymLink?: boolean): Promise<string>;
    static moveDir(srcPath: string, destPath: string, overwrite: boolean, allowParentSymLink?: boolean): Promise<string>;
    static copyDir(srcPath: string, destPath: string, overwrite: boolean, allowParentSymLink?: boolean): Promise<string>;
    static splitJsonFile(srcFile: string, targetFileBase: string, targetFileSuffix: string, chunkSize: number, parent?: string, targetContentConverter?: Function): Promise<string[]>;
    static deleteFilesInDirectoryByPattern(targetBase: string, targetSuffix: string): Promise<string[]>;
}
