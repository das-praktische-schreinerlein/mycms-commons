export declare class FileUtils {
    static checkDirPath(path: string, createDirIfNotExists: boolean, dirMustNotExist: boolean, dirMustExist: boolean): string;
    static checkFilePath(path: string, createDirIfNotExists: boolean, fileMustNotExist: boolean, fileMustExist: boolean): string;
    static copyFile(srcPath: string, destPath: string, onlyIfDiffer: boolean): Promise<string>;
}
