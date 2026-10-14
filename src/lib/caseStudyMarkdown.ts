/**
 * Renders a case study `body` as Markdown into HTML.
 *
 * Scoped down from the main pipeline (src/lib/markdown.ts) — case studies
 * never need math, code highlighting, slugged headings, or wikilinks, and
 * this file must stay independent of examine.ts, which is imported on the
 * home page (pulling remark/rehype into examine.ts would leak this whole
 * pipeline into the home-page bundle).
 */
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import type { Root } from 'hast';

/** PDF-extracted case studies commonly use glyph bullets instead of markdown list syntax. */
function normalizeBullets(body: string): string {
	return body.replace(/^[ \t]*[•‣·][ \t]+/gm, '- ');
}

const SAFE_HREF = /^(https?:|mailto:|#|\/)/i;
const SAFE_SRC = /^(https?:|data:image\/)/i;

/** Raw HTML is already dropped; this keeps `javascript:` links and non-image `data:` URLs inert. */
function restrictUrls() {
	return (tree: Root) => {
		visit(tree, 'element', (node) => {
			const prop = node.tagName === 'a' ? 'href' : node.tagName === 'img' ? 'src' : null;
			if (!prop) return;
			const value = String(node.properties[prop] ?? '');
			if (!(prop === 'href' ? SAFE_HREF : SAFE_SRC).test(value)) delete node.properties[prop];
		});
	};
}

const processor = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkRehype)
	.use(restrictUrls)
	.use(rehypeStringify);

/** Pure — no state, no side effects. Safe to call from a $derived. */
export function renderCaseStudyMarkdown(body: string): string {
	return String(processor.processSync(normalizeBullets(body)));
}

/** For one-line previews: images collapse to their alt text so base64 never lands in a summary. */
export function markdownToPlainText(body: string): string {
	return body.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1').trim();
}
