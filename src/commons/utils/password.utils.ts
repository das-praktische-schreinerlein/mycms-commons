import * as crypto from 'crypto';

export class PasswordUtils {
    public static DEFAULTCHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    public static DEFAULTNUMBERCHARSET = '0123456789';
    public static DEFAULTSPECIALCHARSET = '_@-()<>:';

    public static createNewPassword(max: number, chars: string, numberChars: string, specialChars: string): string {
        if (chars.length < 2 && numberChars.length < 2 && specialChars.length < 2) {
            throw new Error('minimum one of the charsets must have length >= 2');
        }

        const a = [];
        while (a.length < max) {
            let charset: string;
            // TODO check charsetlength spread
            const charSetNumber = Math.floor(Math.random() * 3);
            switch (charSetNumber) {
                case 0:
                    charset = chars;
                    break;
                case 1:
                    charset = numberChars;
                    break;
                case 2:
                    charset = specialChars;
                    break;
                default:
                    throw new Error('unknown charset-index:' + charSetNumber)
            }

            if (charset.length < 2) {
                continue;
            }

            a.push(charset[Math.floor(Math.random() * charset.length)]);
        }

        return a.join('');
    }

    public static createNewDefaultPassword(max: number): string {
        return this.createNewPassword(max, this.DEFAULTCHARSET, this.DEFAULTNUMBERCHARSET, this.DEFAULTSPECIALCHARSET);
    }

    public static createSolrPasswordHash(pwd: string): Promise<string> {
        return new Promise<string>((accept) => {
            const salt: Buffer = crypto.randomBytes(32);
            const saltBase64 = salt.toString('base64');

            const basekey = crypto.createHash('sha256')
                .update(salt)
                .update(pwd)
                .digest();
            const hash = crypto.createHash('sha256')
                .update(basekey)
                .digest();

            return accept(hash.toString('base64') + ' ' + saltBase64);
        });
    }

}
