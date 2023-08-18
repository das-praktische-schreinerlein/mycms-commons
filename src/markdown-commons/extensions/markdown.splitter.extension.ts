import {AbstractMarkdownExtension, MarkdownExtension, Token} from './markdown.extension';

interface SplitterToken extends Token {
    before: string,
    after: string,
}

const extendedBlockRules = {
    splitterStart: /(:\|:)/,
    splitter: /^([\s\S]*?)(:\|:)([\s\S]*)$/
};

class SplitterExtension extends AbstractMarkdownExtension {
    public constructor() {
        super('splitter', 'inline', [],
            extendedBlockRules.splitterStart,
            extendedBlockRules.splitter);
    }

    tokenizer(marked, src: string, tokens: SplitterToken[]): SplitterToken {
        const rule = this.tokenizerRegExp;
        const match = rule.exec(src);
        if (match) {
            return {
                type: this.name,
                raw: match[0],
                tokens: [],
                before: marked.lexer.inlineTokens(match[1].trimRight()),
                after: marked.lexer.inlineTokens(match[3].trimLeft())
            };
        }
    }

    renderer(marked, token: SplitterToken): string {
        const renderer = marked.parser.renderer;
        const type = token.boxtype;
        const param = token.attr;

        return renderer.renderExtendedMarkdownSplitter(type, param,
            marked.parser.parseInline(token.before),
            marked.parser.parseInline(token.after));
    }
}

export const MarkdownSplitterExtension: MarkdownExtension = (new SplitterExtension()).toMarkDownExtension();
