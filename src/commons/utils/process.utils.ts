import {spawn} from 'child_process';

export class ProcessUtils {
    public static executeCommandAsync(command: string, commandArgs: string[],
                                      stdoutHandler?: Function, stderrHandler?: Function): Promise<any> {
        return new Promise(function (resolve, reject) {

            const process = spawn(command, commandArgs);
            if (stdoutHandler) {
                process.stdout.on('data', (chunk) => {
                    // data from standard output is here as buffers
                    stdoutHandler.call(this, chunk);
                });
            }

            if (stderrHandler) {
                process.stderr.on('data', (chunk) => {
                    // data from standard output is here as buffers
                    stderrHandler.call(this, chunk);
                });
            }

            process.on('close', function (code) {
                resolve(code);
            });
            process.on('error', function (err) {
                reject(err);
            });
        });
    }
}
