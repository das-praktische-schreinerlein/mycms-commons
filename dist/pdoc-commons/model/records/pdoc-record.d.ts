import { BaseEntityRecord } from '../../../search-commons/model/records/base-entity-record';
export declare class PDocRecord extends BaseEntityRecord {
    css: string;
    descTxt: string;
    descMd: string;
    descHtml: string;
    flgShowSearch?: boolean;
    flgShowNews?: boolean;
    flgShowTopTen?: boolean;
    flgShowAdminArea?: boolean;
    flgShowDashboard?: boolean;
    flags?: string[];
    heading: string;
    image: string;
    keywords: string;
    name: string;
    subSectionIds: string;
    teaser: string;
    theme: string;
    type: string;
    toString(): string;
}
export declare let PDocRecordRelation: any;
