import {AbstractMarkdownExtension, MarkdownExtension, Token} from './markdown.extension';

interface ChecklistToken extends Token {
    before: string,
    after: string,
    checklistType: string,
    checklistValue: string
}

const checkListConfigs = {
    'state-OPEN': {
        matchers: ['OPEN', 'OFFEN', 'o', 'O', '0', 'TODO']
    },
    'state-RUNNING': {
        matchers: ['RUNNING']
    },
    'state-LATE': {
        matchers: ['LATE']
    },
    'state-BLOCKED': {
        matchers: ['BLOCKED', 'WAITING', 'WAIT']
    },
    'state-WARNING': {
        matchers: ['WARNING']
    },
    'state-DONE': {
        matchers: ['DONE', 'OK', 'x', 'X', 'ERLEDIGT']
    },
    'test-TESTOPEN': {
        matchers: ['TESTOPEN']
    },
    'test-PASSED': {
        matchers: ['PASSED']
    },
    'test-FAILED': {
        matchers: ['FAILED', 'ERROR']
    }
};

class ChecklistExtension extends AbstractMarkdownExtension {
    public constructor() {
        super('checklist', 'inline', [],
            /\[(a-zA-Z0-9)\]/,
            undefined);
    }

    tokenizer(marked, src: string, tokens: Token[]): ChecklistToken {
        for (const checklistType in checkListConfigs) {
            const checklistConfig = checkListConfigs[checklistType];
            for (const matcher of checklistConfig.matchers) {
                const rule = new RegExp('^([\\s\\S]*?)(\\[' + matcher + '\\])([\\s\\S]*)$');
                const match = rule.exec(src);
                if (match) {
                    return {
                        type: this.name,
                        raw: match[0],
                        tokens: [],
                        checklistType: checklistType,
                        checklistValue: '[' + matcher + ']',
                        before: marked.lexer.inlineTokens(match[1]),
                        after: marked.lexer.inlineTokens(match[3])
                    };
                }
            }
        }
    }

    renderer(marked, token: ChecklistToken): string {
        const renderer = marked.parser.renderer;
        const type = token.checklistType;
        const value = token.checklistValue;

        return renderer.renderExtendedMarkdownChecklist(type, value,
            marked.parser.parseInline(token.before),
            marked.parser.parseInline(token.after));
    }
}

export const MarkdownChecklistExtension: MarkdownExtension = (new ChecklistExtension()).toMarkDownExtension();
