import {AbstractHtmlMarkdownExtension, AbstractMarkdownExtension, MarkdownExtension, Token} from './markdown.extension';

const extendedBlockRules = {
    togglerStart: /^(\s*)(<|&lt;)!---(TOGGLER) +([-#_a-zA-Z,;0-9\.]*?) *---(>|&gt;)(\s*)/,
    toggler: /^(\s*)(<|&lt;)!---(TOGGLER) +([-#_a-zA-Z,;0-9\.]*?) *---(>|&gt;)(\s*)/,
    togglerAppendStart: /^(\s*)(<|&lt;)!---(TOGGLER\.AFTER|TOGGLER\.BEFORE) +([-#_a-zA-Z,;:0-9\.]*?) *---(>|&gt;)(\s*)/,
    togglerAppend: /^(\s*)(<|&lt;)!---(TOGGLER\.AFTER|TOGGLER\.BEFORE) +([-#_a-zA-Z,;:0-9\.]*?) *---(>|&gt;)(\s*)/
};

class TogglerExtension extends AbstractHtmlMarkdownExtension {
    public constructor() {
        super('toggler', 'block', [],
            extendedBlockRules.togglerStart,
            extendedBlockRules.toggler);
    }

    tokenizer(marked, src: string, tokens: Token[]): Token {
        const rule = this.tokenizerRegExp;
        const match = rule.exec(src);
        if (match) {
            return {
                type: this.name,
                raw: match[0],
                togglertype: match[3],
                attr: match[4],
                tokens: []
            };
        }
    }

    renderer(marked, token: Token): string {
        const renderer = marked.parser.renderer;
        const type = token.togglertype;
        const param = token.attr;

        return renderer.renderExtendedMarkdownToggler(type, param);
    }
}

class TogglerAppendExtension extends AbstractMarkdownExtension {
    public constructor() {
        super('togglerAppend', 'block', [],
            extendedBlockRules.togglerAppendStart,
            extendedBlockRules.togglerAppend);
    }

    tokenizer(marked, src: string, tokens: Token[]): Token {
        const rule = this.tokenizerRegExp;
        const match = rule.exec(src);
        if (match) {
            return {
                type: this.name,
                raw: match[0],
                togglertype: match[3],
                attr: match[4],
                tokens: []
            };
        }
    }

    renderer(marked, token: Token): string {
        const renderer = marked.parser.renderer;
        const type = token.togglertype;
        const param = token.attr;

        return renderer.renderExtendedMarkdownTogglerAppend(type, param);
    }
}

export const MarkdownTogglerExtension: MarkdownExtension = (new TogglerExtension()).toMarkDownExtension();
export const MarkdownTogglerAppendExtension: MarkdownExtension = (new TogglerAppendExtension()).toMarkDownExtension();
