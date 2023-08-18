import {AbstractHtmlMarkdownExtension, AbstractMarkdownExtension, MarkdownExtension, Token} from './markdown.extension';

const extendedBlockRules = {
    tocStart: /(\s*)(<|&lt;)!---(TOC) *([-#_a-zA-Z,;0-9\.]*?) *---(>|&gt;)(\s*)/,
    toc: /(\s*)(<|&lt;)!---(TOC) *([-#_a-zA-Z,;0-9\.]*?) *---(>|&gt;)(\s*)/
};

// TODO its not functional
class TocExtension extends AbstractHtmlMarkdownExtension {
    public constructor() {
        super('toc', 'inline', [],
            extendedBlockRules.tocStart,
            extendedBlockRules.toc);
    }

    tokenizer(marked, src: string, tokens: Token[]): Token {
        const rule = this.tokenizerRegExp;
        const match = rule.exec(src);
        if (match) {
            return {
                type: this.name,
                raw: match[0],
                toctype: match[3],
                attr: match[4],
                tokens: []
            };
        }
    }

    renderer(marked, token: Token): string {
        const renderer = marked.parser.renderer;
        const type = token.toctype;
        const param = token.attr;

        return renderer.renderExtendedMarkdownTOC(type, param);
    }
}

export const MarkdownTocExtension: MarkdownExtension = (new TocExtension()).toMarkDownExtension();
