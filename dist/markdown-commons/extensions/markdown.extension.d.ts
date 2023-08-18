export interface Token {
    [index: string]: any;
    type: string;
    raw: string;
    text?: string;
    tokens?: Token[];
}
export interface MarkdownExtension {
    name: string;
    level: 'block' | 'inline';
    childTokens?: string[];
    [index: string]: any;
}
export declare abstract class AbstractMarkdownExtension {
    name: string;
    level: 'block' | 'inline';
    childTokens?: string[];
    startRegExp?: RegExp;
    tokenizerRegExp?: RegExp;
    constructor(name: string, level: 'block' | 'inline', childTokens: string[], startRegExp: RegExp, tokenizerRegExp: RegExp);
    start(marked: any, src: string): number | void;
    tokenizer(marked: any, src: string, tokens: Token[]): Token;
    renderer(marked: any, token: Token): string;
    toMarkDownExtension(): MarkdownExtension;
}
export declare abstract class AbstractHtmlMarkdownExtension extends AbstractMarkdownExtension {
}
