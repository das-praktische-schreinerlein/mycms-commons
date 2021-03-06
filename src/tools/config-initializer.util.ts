import * as fs from 'fs';

export class ConfigInitializerUtil {

    public static executeChangeOnFile(file: string, searchPattern: RegExp, replacePattern: string,
                                      required: boolean): Promise<boolean> {
        if (!fs.existsSync(file) || !fs.statSync(file).isFile) {
            if (required) {
                return Promise.reject('file must exist:' + file);
            }

            return Promise.resolve(false);
        }

        let configSrc = fs.readFileSync(file, {encoding: 'utf8'});
        configSrc = configSrc.replace(searchPattern, replacePattern)
        fs.writeFileSync(file, configSrc);

        return Promise.resolve(true);
    }

    public static replaceSolrPasswordInBackendConfig(file: string, key: string, solrPassword: string,
                                                     required: boolean): Promise<boolean> {
        return ConfigInitializerUtil.executeChangeOnFile(file,
            new RegExp('"' + key + '": ".*?"', 'g'),
            '"' + key + '": "' + solrPassword + '"', required);
    }

    public static replaceSolrPasswordInDbPublishConfig(file: string, solrPassword: string, required: boolean):
        Promise<boolean>{
        return ConfigInitializerUtil.executeChangeOnFile(file,
            /"solr": ({[\n\r\t ]*"core".*?)+"password": ".*?"/gms,
            '"solr": $1"password": "' + solrPassword + '"', required);
    }

    public static replaceSolrUserPasswordInSolrConfig(file: string, user: string, solrPasswordHash: string,
                                                      required: boolean): Promise<boolean> {
        return ConfigInitializerUtil.executeChangeOnFile(file,
            new RegExp('"credentials": ({[^}]*"' + user + '")+: ".*?"', 'gms'),
            '"credentials": $1: "' + solrPasswordHash + '"', required);
    }

    public static replaceSolrDefaultPasswordHashInSolrConfig(file: string, solrPasswordHash: string,
                                                             required: boolean): Promise<boolean> {
        return ConfigInitializerUtil.executeChangeOnFile(file,
            /"IV0EHq1OnNrj6gvRCwvFwTrZ1\+z1oBbnQdiVC3otuq0= Ndd7LKvVBAaZIF0QAVi1ekCfAJXr1GGfLtRUXhgrF8c="/g,
            '"' + solrPasswordHash + '"', required);
    }

    public static replaceMysqlPasswordInBackendConfig(file: string, configKey: string, password: string,
                                                      required: boolean): Promise<boolean> {
        return ConfigInitializerUtil.executeChangeOnFile(file,
            new RegExp('"' + configKey + '": ({[\\n\\r\\t ]*"client": "mysql".*?)+"password": ".*?"', 'gms'),
            '"' + configKey + '": $1"password": "' + password + '"', required);
    }

    public static replaceMysqlPasswordInCreateUserSql(file: string, oldPasswordPattern: string, password: string,
                                                      required: boolean): Promise<boolean> {
        return ConfigInitializerUtil.executeChangeOnFile(file,
            new RegExp('IDENTIFIED BY \'' + oldPasswordPattern + '\'', 'gm'),
            'IDENTIFIED BY \'' + password + '\'', required);
    }

    public static replaceMysqlPasswordInSolrCoreConfig(file: string, password: string, required: boolean):
        Promise<boolean> {
        return ConfigInitializerUtil.executeChangeOnFile(file,
            /dataimport.mysql.jdbcPassword=(.*?)$/gm,
            'dataimport.mysql.jdbcPassword=' + password, required);
    }

    public static replaceTokenCookieInFirewallConfig(file: string, key: string, tokenCookie:string, required: boolean):
        Promise<boolean>{
        return ConfigInitializerUtil.executeChangeOnFile(file,
            new RegExp('"allowTokenCookieOnly": ({[^}]*"' + key + '")+: \\[".*?"\\]', 'gms'),
            '"allowTokenCookieOnly": $1: ["' + tokenCookie + '"]', required);
    }

}
