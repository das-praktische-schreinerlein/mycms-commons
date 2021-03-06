"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var PasswordUtils = /** @class */ (function () {
    function PasswordUtils() {
    }
    PasswordUtils.createNewPassword = function (max, chars, numberChars, specialChars) {
        if (chars.length < 2 && numberChars.length < 2 && specialChars.length < 2) {
            throw new Error('minimum one of the charsets must have length >= 2');
        }
        var a = [];
        while (a.length < max) {
            var charset = void 0;
            // TODO check charsetlength spread
            var charSetNumber = Math.floor(Math.random() * 3);
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
                    throw new Error('unknown charset-index:' + charSetNumber);
            }
            if (charset.length < 2) {
                continue;
            }
            a.push(charset[Math.floor(Math.random() * charset.length)]);
        }
        return a.join('');
    };
    PasswordUtils.createNewDefaultPassword = function (max) {
        return this.createNewPassword(max, this.DEFAULTCHARSET, this.DEFAULTNUMBERCHARSET, this.DEFAULTSPECIALCHARSET);
    };
    PasswordUtils.createSolrPasswordHash = function (pwd) {
        return new Promise(function (accept) {
            var salt = crypto.randomBytes(32);
            var saltBase64 = salt.toString('base64');
            var basekey = crypto.createHash('sha256')
                .update(salt)
                .update(pwd)
                .digest();
            var hash = crypto.createHash('sha256')
                .update(basekey)
                .digest();
            return accept(hash.toString('base64') + ' ' + saltBase64);
        });
    };
    PasswordUtils.DEFAULTCHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    PasswordUtils.DEFAULTNUMBERCHARSET = '0123456789';
    PasswordUtils.DEFAULTSPECIALCHARSET = '_@-()<>:';
    return PasswordUtils;
}());
exports.PasswordUtils = PasswordUtils;
//# sourceMappingURL=password.utils.js.map