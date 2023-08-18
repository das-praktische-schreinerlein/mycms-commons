export interface Token {
    [index: string]: any,
    type: string,
    raw: string,                         // Text to consume from the source
    text?: string,
    tokens?: Token[]
}

export interface MarkdownExtension {
    name: string,
    level: 'block' | 'inline',
    childTokens?: string[],

    [index: string]: any,
}

export abstract class AbstractMarkdownExtension {
    name: string;
    level: 'block' | 'inline';
    childTokens?: string[];
    startRegExp?: RegExp;
    tokenizerRegExp?: RegExp;

    constructor(name: string, level: 'block' | 'inline', childTokens: string[],
                startRegExp: RegExp, tokenizerRegExp: RegExp) {
        this.name = name;
        this.level = level;
        this.childTokens = childTokens;
        this.startRegExp = startRegExp;
        this.tokenizerRegExp = tokenizerRegExp;
    }

    public start(marked, src: string): number | void {
        const match = src.match(this.startRegExp);
        return match
            ? match.index
            : undefined;
    };

    public tokenizer(marked, src: string, tokens: Token[]): Token {
        throw new Error('must be implemented: ' + this.name)
    }

    public renderer(marked, token: Token): string {
        throw new Error('must be implemented: ' + this.name)
    };

    public toMarkDownExtension(): MarkdownExtension {
        const me = this;
        return {
            name: this.name,
            childTokens: this.childTokens,
            level: this.level,
            start(src: string): number | void {
                const index = me.start(this, src)
                return me.start(this, src);
            },
            tokenizer(src: string, tokens: Token[]): Token {
                return me.tokenizer(this, src, tokens);
            },
            renderer(token: Token): string {
                return me.renderer(this, token);
            }
        }
    }
}

export abstract class AbstractHtmlMarkdownExtension extends AbstractMarkdownExtension {
}
