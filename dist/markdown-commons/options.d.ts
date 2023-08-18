import { marked } from 'marked/marked.min';
export interface MarkedOptions {
    breaks: boolean;
    gfm: boolean;
    pedantic: boolean;
    sanitize: boolean;
    smartLists: boolean;
    smartypants: boolean;
    tables: boolean;
    async: boolean;
    baseUrl: null;
    headerIds: boolean;
    headerPrefix: string;
    highlight: Function;
    langPrefix: string;
    mangle: boolean;
    renderer: marked.Renderer;
    sanitizer: null;
    silent: boolean;
    tokenizer: marked.Tokenizer;
    walkTokens: null;
    xhtml: boolean;
    appBaseVarName: string;
    stylePrefix: string;
}
export declare const DefaultOptions: {
    getDefault(): MarkedOptions;
};
