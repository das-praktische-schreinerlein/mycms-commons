/* tslint:disable:no-unused-variable */
import {MarkdownService} from './markdown.service';
import {MarkdownDefaultExtensions} from './extensions/markdown.extensions';
import {DefaultOptions} from "./options";

describe('MarkdownService', () => {
    const service = new MarkdownService(DefaultOptions.getDefault(), MarkdownDefaultExtensions);

    it('should parse render default-markdown', done => {
         const src = `# Markdown

## Syntax

### link

[Link text Here](https://link-url-here.org)

### list

- li1
- li2

### table

|*bla*|*bla*|
|-|-|
|bla|bla|
|bla|bla|
         `;
        const rendered = `<h1 id="markdown" class="dps-md-h1">Markdown</h1>
<h2 id="syntax" class="dps-md-h2">Syntax</h2>
<h3 id="link" class="dps-md-h3">link</h3>
<p class="dps-md-p"><a href="https://link-url-here.org" class="dps-md-a">Link text Here</a></p>
<h3 id="list" class="dps-md-h3">list</h3>
<ul class="dps-md-ul">
<li class="dps-md-li">li1</li>
<li class="dps-md-li">li2</li>
</ul>
<h3 id="table" class="dps-md-h3">table</h3>
<table class="dps-md-table">
<thead class="dps-md-thead">
<tr class="dps-md-tr">
<th class="dps-md-th"><em class="dps-md-em">bla</em></th>
<th class="dps-md-th"><em class="dps-md-em">bla</em></th>
</tr>
</thead>
<tbody class="dps-md-tbody"><tr class="dps-md-tr">
<td class="dps-md-td">bla</td>
<td class="dps-md-td">bla</td>
</tr>
<tr class="dps-md-tr">
<td class="dps-md-td">bla</td>
<td class="dps-md-td">bla</td>
</tr>
</tbody></table>
`;
        expect(service.renderMarkdown(src)).toBe(rendered);
        done();
    });


    it('should parse render box-markdown', done => {
        const src = `# Markdown

## Syntax

### box

<!---BOX.INFO blimblam --->
- li3
- li4

<!---/BOX.INFO blimblam --->

`;
        const rendered = `<h1 id="markdown" class="dps-md-h1">Markdown</h1>
<h2 id="syntax" class="dps-md-h2">Syntax</h2>
<h3 id="box" class="dps-md-h3">box</h3>
<div class="dps-md-infobox"><div class="dps-md-infobox-ue">blimblam</div><div class="dps-md-infobox-container"><ul class="dps-md-ul">
<li class="dps-md-li">li3</li>
<li class="dps-md-li">li4</li>
</ul>
</div></div>`;
        expect(service.renderMarkdown(src)).toBe(rendered);
        done();
    });

    it('should parse render splitter-markdown', done => {
        const src = `# Markdown

## Syntax

### splitter

- ubla :|: blum
- bla2 :|: blum2`;
        const rendered = `<h1 id="markdown" class="dps-md-h1">Markdown</h1>
<h2 id="syntax" class="dps-md-h2">Syntax</h2>
<h3 id="splitter" class="dps-md-h3">splitter</h3>
<ul class="dps-md-ul">
<li class="dps-md-li"><label class="dps-md-splitter1">ubla</label><span class="dps-md-splitter2">blum</span></li>
<li class="dps-md-li"><label class="dps-md-splitter1">bla2</label><span class="dps-md-splitter2">blum2</span></li>
</ul>
`;
        expect(service.renderMarkdown(src)).toBe(rendered);
        done();
    });

    it('should parse render toggler-markdown', done => {
        const src = `# Markdown

## Syntax

### toggler

nblimtext1
mblimtext2
<!---TOGGLER blim,icon --->
blimtext3

<!---TOGGLER.AFTER li:dps-md-ul,text --->

`;
        const rendered = `<h1 id="markdown" class="dps-md-h1">Markdown</h1>
<h2 id="syntax" class="dps-md-h2">Syntax</h2>
<h3 id="toggler" class="dps-md-h3">toggler</h3>
<p class="dps-md-p">nblimtext1
mblimtext2</p>
<div class="dps-md-togglerparent md-togglerparent-blim" id="md-togglerparent-blim" data-togglecontainer="blim" data-toggletype="icon"></div><p class="dps-md-p">blimtext3</p>
<div style="display: none" class="dps-command-toggle-append" data-togglefilter="li.dps-md-ul" data-toggletype="text" data-togglepos="TOGGLER.AFTER"></div>`;
        expect(service.renderMarkdown(src)).toBe(rendered);
        done();
    });

    it('should parse render checklist-markdown', done => {
        const src = `# Markdown

## Syntax

### checklist [O]

- [OPEN] blim
- done [DONE]
- [FAILED] blob

`;
        const rendered = `<h1 id="markdown" class="dps-md-h1">Markdown</h1>
<h2 id="syntax" class="dps-md-h2">Syntax</h2>
<h3 id="checklist-o" class="dps-md-h3">checklist <span class="dps-md-checklist-state-OPEN">[O]</span></h3>
<ul class="dps-md-ul">
<li class="dps-md-li"><span class="dps-md-checklist-state-OPEN">[OPEN]</span> blim</li>
<li class="dps-md-li">done <span class="dps-md-checklist-state-DONE">[DONE]</span></li>
<li class="dps-md-li"><span class="dps-md-checklist-test-FAILED">[FAILED]</span> blob</li>
</ul>
`;
        expect(service.renderMarkdown(src)).toBe(rendered);
        done();
    });
});
