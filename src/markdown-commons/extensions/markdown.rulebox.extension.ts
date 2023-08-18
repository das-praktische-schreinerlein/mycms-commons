import {AbstractHtmlMarkdownExtension, AbstractMarkdownExtension, MarkdownExtension, Token} from './markdown.extension';

const extendedBlockRules = {
    ruleBoxStart: /^(\s*)(<|&lt;)\!---(BOX\.INFO|BOX\.WARN|BOX\.ALERT|BOX|CONTAINER|STYLE?) *([#-_a-zA-Z,;0-9\.: ]*?) *---(>|&gt;)(\s*)/,
    ruleBoxEnd:   /^(\s*)(<|&lt;)\!---\/(BOX\.INFO|BOX\.WARN|BOX\.ALERT|BOX|CONTAINER|STYLE?) *([#-_a-zA-Z,;0-9\.: ]*?) *---(>|&gt;)(\s*)/
};

abstract class RuleBoxExtension extends AbstractHtmlMarkdownExtension {
    tokenizer(marked, src: string, tokens: Token[]): Token {
        const rule = this.tokenizerRegExp;
        const match = rule.exec(src);
        if (match && match.length === 7) {
            const token: Token = {
                type: this.name,
                raw: match[0],
                boxtype: match[3],
                attr: match[4],
                tokens: []
            };

            return token;
        }
    }

}

class RuleBoxStartExtension extends RuleBoxExtension {
    public constructor() {
        super('ruleBoxStart', 'block', [],
            extendedBlockRules.ruleBoxStart, extendedBlockRules.ruleBoxStart);
    }

    renderer(marked, token: Token): string {
        const renderer = marked.parser.renderer;
        const type = token.boxtype;
        const param = token.attr;

        return renderer.renderExtendedMarkdownBoxStart(type, param);
    }
}


class RuleBoxEndExtension extends RuleBoxExtension {
    public constructor() {
        super('ruleBoxEnd', 'block', [],
            extendedBlockRules.ruleBoxEnd, extendedBlockRules.ruleBoxEnd);
    }

    renderer(marked, token: Token): string {
        const renderer = marked.parser.renderer;
        const type = token.boxtype;
        const param = token.attr;

        return renderer.renderExtendedMarkdownBoxEnd(type, param);
    }
}


export const MarkdownRuleBoxStartExtension: MarkdownExtension = (new RuleBoxStartExtension()).toMarkDownExtension();
export const MarkdownRuleBoxEndExtension: MarkdownExtension = (new RuleBoxEndExtension()).toMarkDownExtension();
