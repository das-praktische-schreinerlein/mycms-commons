"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var ConfigInitializerUtil = /** @class */ (function () {
    function ConfigInitializerUtil() {
    }
    ConfigInitializerUtil.executeChangeOnFile = function (file, searchPattern, replacePattern, required) {
        if (!fs.existsSync(file) || !fs.statSync(file).isFile) {
            if (required) {
                return Promise.reject('file must exist:' + file);
            }
            return Promise.resolve(false);
        }
        var configSrc = fs.readFileSync(file, { encoding: 'utf8' });
        configSrc = configSrc.replace(searchPattern, replacePattern);
        fs.writeFileSync(file, configSrc);
        return Promise.resolve(true);
    };
    ConfigInitializerUtil.replaceSolrPasswordInBackendConfig = function (file, key, solrPassword, required) {
        return ConfigInitializerUtil.executeChangeOnFile(file, new RegExp('"' + key + '": ".*?"', 'g'), '"' + key + '": "' + solrPassword + '"', required);
    };
    ConfigInitializerUtil.replaceSolrPasswordInDbPublishConfig = function (file, solrPassword, required) {
        return ConfigInitializerUtil.executeChangeOnFile(file, /"solr": ({[\n\r\t ]*"core".*?)+"password": ".*?"/gms, '"solr": $1"password": "' + solrPassword + '"', required);
    };
    ConfigInitializerUtil.replaceSolrUserPasswordInSolrConfig = function (file, user, solrPasswordHash, required) {
        return ConfigInitializerUtil.executeChangeOnFile(file, new RegExp('"credentials": ({[^}]*"' + user + '")+: ".*?"', 'gms'), '"credentials": $1: "' + solrPasswordHash + '"', required);
    };
    ConfigInitializerUtil.replaceSolrDefaultPasswordHashInSolrConfig = function (file, solrPasswordHash, required) {
        return ConfigInitializerUtil.executeChangeOnFile(file, /"IV0EHq1OnNrj6gvRCwvFwTrZ1\+z1oBbnQdiVC3otuq0= Ndd7LKvVBAaZIF0QAVi1ekCfAJXr1GGfLtRUXhgrF8c="/g, '"' + solrPasswordHash + '"', required);
    };
    ConfigInitializerUtil.replaceMysqlPasswordInBackendConfig = function (file, configKey, password, required) {
        return ConfigInitializerUtil.executeChangeOnFile(file, new RegExp('"' + configKey + '": ({[\\n\\r\\t ]*"client": "mysql".*?)+"password": ".*?"', 'gms'), '"' + configKey + '": $1"password": "' + password + '"', required);
    };
    ConfigInitializerUtil.replaceMysqlPasswordInCreateUserSql = function (file, oldPasswordPattern, password, required) {
        return ConfigInitializerUtil.executeChangeOnFile(file, new RegExp('IDENTIFIED BY \'' + oldPasswordPattern + '\'', 'gm'), 'IDENTIFIED BY \'' + password + '\'', required);
    };
    ConfigInitializerUtil.replaceMysqlPasswordInSolrCoreConfig = function (file, password, required) {
        return ConfigInitializerUtil.executeChangeOnFile(file, /dataimport.mysql.jdbcPassword=(.*?)$/gm, 'dataimport.mysql.jdbcPassword=' + password, required);
    };
    ConfigInitializerUtil.replaceTokenCookieInFirewallConfig = function (file, key, tokenCookie, required) {
        return ConfigInitializerUtil.executeChangeOnFile(file, new RegExp('"allowTokenCookieOnly": ({[^}]*"' + key + '")+: \\[".*?"\\]', 'gms'), '"allowTokenCookieOnly": $1: ["' + tokenCookie + '"]', required);
    };
    return ConfigInitializerUtil;
}());
exports.ConfigInitializerUtil = ConfigInitializerUtil;
//# sourceMappingURL=config-initializer.util.js.map