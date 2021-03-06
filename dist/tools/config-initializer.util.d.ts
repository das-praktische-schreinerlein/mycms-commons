export declare class ConfigInitializerUtil {
    static executeChangeOnFile(file: string, searchPattern: RegExp, replacePattern: string, required: boolean): Promise<boolean>;
    static replaceSolrPasswordInBackendConfig(file: string, key: string, solrPassword: string, required: boolean): Promise<boolean>;
    static replaceSolrPasswordInDbPublishConfig(file: string, solrPassword: string, required: boolean): Promise<boolean>;
    static replaceSolrUserPasswordInSolrConfig(file: string, user: string, solrPasswordHash: string, required: boolean): Promise<boolean>;
    static replaceSolrDefaultPasswordHashInSolrConfig(file: string, solrPasswordHash: string, required: boolean): Promise<boolean>;
    static replaceMysqlPasswordInBackendConfig(file: string, configKey: string, password: string, required: boolean): Promise<boolean>;
    static replaceMysqlPasswordInDbMigrateConfig(file: string, configKey: string, password: string, required: boolean): Promise<boolean>;
    static replaceMysqlPasswordInCreateUserSql(file: string, oldPasswordPattern: string, password: string, required: boolean): Promise<boolean>;
    static replaceMysqlPasswordInSolrCoreConfig(file: string, password: string, required: boolean): Promise<boolean>;
    static replaceTokenCookieInFirewallConfig(file: string, key: string, tokenCookie: string, required: boolean): Promise<boolean>;
}
