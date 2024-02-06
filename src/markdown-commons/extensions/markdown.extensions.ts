import {MarkdownExtension} from './markdown.extension';
import {MarkdownRuleBoxEndExtension, MarkdownRuleBoxStartExtension} from './markdown.rulebox.extension';
import {MarkdownSplitterExtension} from './markdown.splitter.extension';
import {MarkdownTogglerAppendExtension, MarkdownTogglerExtension} from './markdown.toggler.extension';
import {MarkdownChecklistExtension} from './markdown.checklist.extension';

export const MarkdownDefaultExtensions: MarkdownExtension[] = [
    MarkdownChecklistExtension,
    MarkdownRuleBoxStartExtension,
    MarkdownRuleBoxEndExtension,
    MarkdownSplitterExtension,
    MarkdownTogglerExtension,
    MarkdownTogglerAppendExtension
];
