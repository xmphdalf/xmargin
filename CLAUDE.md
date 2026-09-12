# xMargin — Claude Context

## What Is xMargin

xMargin is a **reader-first Markdown web application**. It transforms raw Markdown into a calm, immersive reading experience.

It is not an editor. Not a CMS. Not a documentation generator.
It is a dedicated reading environment — focused on typography, spacing, cognitive comfort, and sustained attention.

xMargin runs entirely as a **static web application** — no backend, no accounts, no tracking. Deployable on any static host.

> The goal: a **digital reading studio for Markdown.**

---

## Philosophy

> Reading requires space.

Markdown is widely used for writing, but most tools optimize for *editing* rather than *reading*. xMargin reverses that priority entirely.

The best reading apps — iA Writer, Readwise Reader, Instapaper, Kindle — succeed by making the interface disappear. Typography is a first-class design decision. Restraint is a feature. xMargin follows this lineage.

**Core principles:**
- The interface should disappear behind the content
- Typography and spacing determine reading quality
- Motion should feel calm and intentional — never decorative
- Users should feel mentally uncluttered
- The product must feel timeless, not trendy
- Privacy and openness are first-class values

xMargin is not built to maximize engagement. It is built to support deep focus and thoughtful reading.

---

## Who Uses This

- Developers reading documentation or technical notes
- Writers previewing long-form manuscripts
- Students studying Markdown-based notes
- Indie creators sharing essays or stories
- Knowledge workers reviewing structured content

Must feel credible to intellectual users. Must feel beautiful to design-sensitive users.

---

## Core Use Cases

- Paste Markdown → instantly read in a premium layout
- Upload `.md` files → navigate structured content
- Fetch from a public URL (e.g. GitHub raw) → read without leaving
- Long technical documents → reduced visual fatigue
- Structured Markdown → minimal presentation slides
- Notes → reading progress awareness and bookmarks
- Paste/upload a JSON question set → study it via Read, Reflect, or Examine mode

---

## How It Should Feel

**One-word targets:** calm, focused, lightweight, thoughtful, smooth, spacious, distraction-free.

Users should feel like they've walked into a quiet reading room — not opened a web app.

---

## Visual Design

### Themes
Three distinct themes — not just color swaps but full coordinated palettes:
- **Light** — warm off-white surface (`oklch(0.985 0.002 247)`), never pure white
- **Dark** — deep charcoal (`oklch(0.16 0.006 285)`), never pure black
- **Sepia** — warm amber surface (`oklch(0.96 0.025 80)`), muted ink tones; a full palette like Bear's best themes

Each theme has its own coordinated: surface color, heading weight, link color, code block tint, border tone. A theme is not a CSS filter — it is a curated reading environment.

### Typography Defaults (Research-Validated)
- **Body font size:** 18–20px (default 18px, user-adjustable)
- **Line height:** 1.65 (unitless, scales with font size)
- **Column measure:** `max-width: 68ch` — optimal for prose comprehension
- **Serif reading font:** Source Serif 4 — excellent x-height, screen hinting, purpose-built for screen
- **Sans reading font:** Inter — battle-tested for technical documentation
- **Code font:** JetBrains Mono — programmer legibility as primary goal, at `0.875em` relative to prose
- All sizing in `rem` — never `px` — so user browser preferences are respected
- Fluid type scaling: `font-size: clamp(1.0625rem, 1rem + 0.25vw, 1.25rem)` between breakpoints

### Layout
- Centered reading column with large outer margins — psychological breathing space
- Minimal persistent UI chrome
- Floating contextual controls, not fixed nav bars
- `<article>` for document content, `<aside>` for TOC panel, `<nav>` for navigation — semantic HTML always

### Color Architecture
Three-layer CSS custom property token system:

**Layer 1 — Primitive tokens** (raw values, never used directly in components)
**Layer 2 — Semantic tokens** (purpose-named, defined per theme)
**Layer 3 — Component tokens** (scoped overrides, e.g. `--prose-measure`)

Use `oklch` color space throughout — perceptually uniform, predictable lightness adjustments across themes, P3 gamut on modern displays.

```css
/* Semantic token examples */
:root {
  --color-surface: oklch(0.985 0.002 247);
  --color-text-primary: oklch(0.22 0.01 250);
  --color-text-secondary: oklch(0.45 0.01 285);
  --color-text-muted: oklch(0.6 0.01 285);
  --color-accent: oklch(0.55 0.18 255);
  --color-border: oklch(0.88 0.005 285);
  --color-code-bg: oklch(0.96 0.003 285);
}
html.dark {
  --color-surface: oklch(0.16 0.006 285);
  --color-text-primary: oklch(0.92 0.004 285);
  /* ...etc */
}
html[data-theme="sepia"] {
  --color-surface: oklch(0.96 0.025 80);
  --color-text-primary: oklch(0.25 0.04 55);
  /* ...etc */
}
```

---

## Motion Design

All animation must be: **slow, smooth, non-bouncy, purposeful.**

- TOC highlighting glides, never jumps
- Theme switching fades (400ms ease)
- Scroll progress animates gradually
- Section jumps feel cinematic
- Mode transitions fade UI chrome in/out (never snap)

Motion must support orientation, not attract attention. If it's noticeable, it's too much.

**Enforced in CSS — no exceptions:**
```css
/* All transitions */
/* duration: 300–500ms, ease or cubic-bezier(0.4, 0, 0.2, 1) */
/* No spring, bounce, or elastic easing — ever */

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Full Feature Set

This is the complete product vision. Build in order of priority, but design for the whole.

### Input
- Paste Markdown text directly
- Upload local `.md` files
- Fetch from public URLs (e.g. GitHub raw links, any CORS-accessible URL)

### Reading Modes
- **Book Mode** — `max-width: 65ch`, large vertical padding, large font, pure reading focus
- **Focus Mode** — zero UI chrome; `data-mode="focus"` on the read shell, TOC/toolbar/header fade to `opacity: 0; pointer-events: none`. Mode bar dims to 20% opacity, reveals on hover. Exit via `Escape` or clicking the mode bar
- **Study Mode** — TOC always visible on left, narrower content column, heading anchors always shown
- **Story Mode** — chapter styling, drop caps (`::first-letter`), cinematic vertical pacing for prose/fiction

### Navigation
- Dynamic table of contents extracted from Markdown AST (not DOM scraping)
- Scroll-based section highlighting via scroll listener (picks last heading above 30% viewport height; activates last heading when at page bottom)
- Smooth jump navigation with offset for fixed/floating headers (`scroll-margin-top: 4.5rem`)
- Keyboard shortcut `J`/`K` to jump to next/previous section

### Reading Intelligence
- Estimated reading time — displayed as `{n} min read` near title; updates to `{n} min left` based on scroll position
- Scroll progress indicator (CSS scroll-driven animation primary; JS fallback for Firefox)
- Section completion tracking — mark sections read as headings scroll past the viewport top
- Per-document reading history stored locally

### Typography Controls
- Font size (slider, range 14–24px)
- Font family (Serif: Source Serif 4 / Sans: Inter)
- Line height (range 1.4–1.9)
- Reading column width (range 55ch–90ch)
- All controls persist to localStorage, restored on next visit

### Themes
- Light, Dark, Sepia — user-selectable
- Persisted to localStorage
- Zero flash on load (see: Anti-Flash Init below)
- System preference respected as default when no preference is stored

### Code Rendering
- Syntax highlighting via Shiki v1 — dual themes (light + dark) via CSS variables
- Visually harmonious with prose — no jarring contrast
- Languages loaded on-demand from AST scan (never all languages)
- Code font: JetBrains Mono at `0.875em`

### Markdown Features
- GitHub Flavored Markdown (tables, task lists, strikethrough, footnotes, autolinks)
- YAML/TOML frontmatter parsing (title, author, date surfaced in UI)
- LaTeX math — inline (`$x^2$`) and display (`$$\sum$$`) via remark-math + rehype-katex
- Typographic quotes, dashes, ellipses via remark-smartypants (critical for quality)
- Mermaid diagrams — client-side rendering via `mermaid.initialize()` in `onMount`
- Lazy-loaded images with `loading="lazy"` via rehype plugin

### Local Persistence
- Last reading position — keyed by document hash, stores scroll percentage + nearest heading ID
- Bookmarks — per-document, stored as `{ headingId, text, createdAt }`, max 100 with LRU eviction
- Typography settings — single versioned object (`v1`, migrate forward without data loss)
- Theme preference
- Reading mode preference
- All reads wrapped in try/catch (Safari Private Browsing throws on `setItem`)
- Positions expire after 90 days
- No cloud sync, ever

### Presentation Mode
- Slides delimited by `\n---\n` (horizontal rule — renders gracefully in reading mode)
- Each slide processed through the full Markdown pipeline independently
- Keyboard navigation (arrow keys), touch swipe, fullscreen via `document.requestFullscreen()`
- Speaker notes via `<!-- notes: ... -->` blocks
- Minimal slide CSS: `100vw × 100vh` centered containers, typography scales with viewport
- Loaded as a lazy Svelte component (`{#await import('./Slideshow.svelte')}`) — never in initial bundle

### Examine (Quiz / Study Mode)
- Third native module, alongside Markdown reading and git diff reading — entered via the same home-page mode dropdown
- Input: paste or upload a JSON question set (single-choice, multi-correct, true/false, and two hotspot types — `hotspot-yesno` and `hotspot-categorize`, where each row of a statement table is assigned one category from a shared list); a "view sample format" disclosure shows the schema
- Optional case studies: a set may declare `caseStudies` (`{ id, title, body }`) and any question may link one via `caseStudyId` — or none, staying standalone. Linked questions show a collapsed "Case study · {title}" disclosure above the stem in all modes
- Pick a question range (all, quartile presets, or custom) and a mode, then **Begin**:
  - **Read** — browse every question with its answer and explanation, no interaction required
  - **Reflect** — one question at a time; select your answer(s) first, "Reveal answer" unlocks only once you've picked the required number of options, then decorates your picks against the correct answer
  - **Examine** — linear test, optional timer (off by default), flag-for-revisit, dot-row progress; "Review & submit" (reachable from any question) shows attempted count, the flagged list, and a final Submit before honest results
- Results never show a percentage or grade — just "you answered N of M correctly," a per-question breakdown, and a "questions to revisit" list (incorrect ∪ flagged)
- A hotspot question counts as correct only when every row is correct — no partial credit. The row tally ("3 of 5 rows correct") is surfaced alongside the pass/fail, and review distinguishes an unanswered row from a wrongly answered one
- Session (range, mode, answers, flags, timer) persists to localStorage and resumes after a refresh, with a 90-day expiry — same pattern as reading position

### Export
- Export rendered document as a self-contained static HTML file (inline CSS, inline fonts, no external deps)

### Lightweight Knowledge Features (extended)
- Detect `[[wikilinks]]` in Markdown, render as cross-reference hints
- Reading session analytics — words read, time spent, sections completed (local only, never transmitted)

---

## Tech Stack

| Concern | Tool | Notes |
|---|---|---|
| Framework | SvelteKit 2.x + `@sveltejs/adapter-static` | Deployed on Railway via Dockerfile |
| Svelte syntax | **Svelte 5 runes only** | `$state`, `$derived`, `$effect` — no legacy stores, no `$:` |
| Styling | TailwindCSS v4 | Vite plugin only — no `tailwind.config.js`, use `@theme` directive in CSS |
| Markdown parsing | unified ecosystem | See pipeline below |
| Syntax highlighting | Shiki v1 | Singleton pattern; lazy-loaded for runtime input |
| Math rendering | remark-math + rehype-katex | Build-time; KaTeX CSS lazy-loaded only when math present |
| Smart typography | remark-smartypants | Typographic quotes, dashes, ellipses |
| Persistence | localStorage | Versioned schemas, try/catch guards, SSR-safe |

**Hard constraints:**
- No backend, ever
- No auth, no accounts
- No external runtime deps that break offline usage after initial load
- Initial JS bundle target: **< 50KB gzipped** — Shiki and KaTeX never in the initial chunk
- Fast on low-power devices — defer expensive work to `requestIdleCallback`

---

## Architecture

### Markdown Pipeline

Full production pipeline:

```ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMath from 'remark-math';
import remarkSmartypants from 'remark-smartypants';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypeShiki from '@shikijs/rehype';
import rehypeStringify from 'rehype-stringify';
```

Order: `remarkParse` → `remarkGfm` → `remarkFrontmatter` → `remarkMath` → `remarkSmartypants` → `[remarkWikilinks]` → `[extractTocPlugin]` → `remarkRehype` → `rehypeSlug` → `rehypeAutolinkHeadings` → `rehypeKatex` → `rehypeShiki` → `[rehypeLazyImages]` → `rehypeStringify`

**Return shape:**
```ts
{
  html: string,
  toc: Array<{ id: string, text: string, depth: 1|2|3|4|5|6 }>,
  readingTime: number,        // Math.ceil(wordCount / 238)
  frontmatter: Record<string, unknown>,
  hasMath: boolean,           // to conditionally load KaTeX CSS
  hasCode: boolean,           // to conditionally lazy-load Shiki
}
```

**TOC Extraction:**
Always from the MDAST (before `remark-rehype`), never from the DOM. Use `unist-util-visit` to walk `heading` nodes. Use `github-slugger` for consistent IDs that match `rehype-slug`.

**Reading time:** `Math.ceil(rawText.trim().split(/\s+/).length / 238)` — 238 wpm adult average.

### Syntax Highlighting

```ts
import { getSingletonHighlighter } from 'shiki';

// Scan AST for languages BEFORE creating highlighter
const langs = [...new Set(codeBlocks.map(b => b.lang).filter(Boolean))];

const highlighter = await getSingletonHighlighter({
  themes: ['github-light', 'github-dark'],
  langs,
});
```

Dual-theme CSS variable output (Shiki's built-in):
```ts
codeToHtml(code, { lang, themes: { light: 'github-light', dark: 'github-dark' } })
```

Wire dark theme in CSS:
```css
html.dark .shiki span { color: var(--shiki-dark) !important; }
html.dark .shiki { background-color: var(--shiki-dark-bg) !important; }
```

- Build-time: run in `+page.server.js`, zero Shiki JS ships to browser
- Runtime (user input): `const { getSingletonHighlighter } = await import('shiki')` — dynamic import on first code block
- Never load all languages — scan AST, load only what is present

### Scroll Spy (TOC Active State)

Implemented as a scroll listener (not IntersectionObserver — IO fails on short sections that never fully enter the root margin window):

```ts
function updateActive() {
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  if (atBottom) {
    readerState.setActiveHeading(headingIds[headingIds.length - 1]);
    return;
  }
  const threshold = window.innerHeight * 0.3;
  let active = headingIds[0];
  for (const id of headingIds) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= threshold) active = id;
    else break;
  }
  if (active) readerState.setActiveHeading(active);
}
window.addEventListener('scroll', updateActive, { passive: true });
return () => window.removeEventListener('scroll', updateActive);
```

Section completion uses a separate `IntersectionObserver` with `rootMargin: '0px 0px -95% 0px'` — marks a heading complete when it exits through the top of the viewport.

Active indicator: CSS `transition` only — no JS-driven animation.

### Theme System

Toggle via class on `<html>`:
- Light: no class, no data-theme
- Dark: `class="dark"`
- Sepia: `data-theme="sepia"`

**Anti-Flash Init** — inline script in `app.html` `<head>`, runs synchronously before CSS paints:
```html
<script>
  var stored = localStorage.getItem('xmargin-theme');
  var t = stored ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (t === 'dark') document.documentElement.classList.add('dark');
  if (t === 'sepia') document.documentElement.setAttribute('data-theme', 'sepia');
</script>
```
Falls back to `prefers-color-scheme` when no stored preference exists.

Theme transition: `transition: background-color 400ms ease, color 400ms ease, border-color 400ms ease` on `*, *::before, *::after`. Suppress during page init with a `no-transitions` class removed after first paint.

Persist via `$effect` in `AppShell.svelte`:
```ts
$effect(() => { localStorage.setItem('xmargin-theme', theme); });
```

### TailwindCSS v4 Patterns

```css
/* No tailwind.config.js — configuration lives here */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-reading-serif: 'Source Serif 4', Georgia, serif;
  --font-reading-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  /* Design tokens map to utility classes: bg-surface, text-ink, etc. */
}
```

### Svelte 5 Runes Patterns

```ts
// State: mutable reactive primitives and objects
let theme = $state<'light' | 'dark' | 'sepia'>('light');
let settings = $state({ fontSize: 18, fontFamily: 'serif', lineHeight: 1.65, measure: 68 });

// Derived: pure computed values — prefer over $effect for any computed value
const isDark = $derived(theme === 'dark');
const progressPercent = $derived(Math.round(scrollProgress * 100));

// Effect: side effects only — DOM mutations, localStorage, observers
$effect(() => {
  localStorage.setItem('xmargin:settings:v1', JSON.stringify(settings));
});

// Props (replaces export let)
const { doc, mode = 'book' }: { doc: ProcessedDoc, mode?: ReadingMode } = $props();
```

**Rule:** If a value can be `$derived`, never use `$effect` to compute it. Overusing `$effect` for derived values causes cascading re-renders.

### Shared State (across components)

Use module-level `$state` in `.svelte.ts` files — no stores needed:
```ts
// src/state/settings.svelte.ts
export const settings = $state({ fontSize: 18, fontFamily: 'serif' as const, ... });
export const theme = $state({ current: 'light' as Theme });
```
Import directly into components — reactivity is preserved.

### SvelteKit SSR Guards

`window`, `document`, `localStorage`, `IntersectionObserver` are unavailable during prerender.

Three safe patterns (in order of preference):
1. `onMount(() => { /* browser code */ })` — documented to never run on server
2. `import { browser } from '$app/environment'; if (browser) { ... }` — idiomatic SvelteKit
3. `if (typeof window !== 'undefined') { ... }` — for module-level synchronous checks

### Scroll Progress Indicator

CSS Scroll-Driven (primary — no JS, no jank):
```css
@keyframes grow { from { width: 0% } to { width: 100% } }
.progress-bar {
  animation: grow linear;
  animation-timeline: scroll(root block);
  animation-duration: auto;
}
```

JS fallback (for Firefox):
```ts
const scrolled = document.documentElement.scrollTop /
  (document.documentElement.scrollHeight - document.documentElement.clientHeight);
progress = Math.min(1, Math.max(0, scrolled));
```

### Font Loading

Self-host all fonts — no Google Fonts CDN. Variable fonts (one file for all weights). WOFF2 only.
```html
<link rel="preload" href="/fonts/source-serif-4.woff2" as="font" type="font/woff2" crossorigin>
```
`font-display: swap` for body, `font-display: optional` for display fonts. Add `size-adjust` to prevent CLS on font swap.

### Deployment

xMargin is deployed on Railway. The build uses a multi-stage Dockerfile: Node 22 alpine compiles the app, Caddy 2 alpine serves it.

```js
// svelte.config.js
adapter: adapter({ fallback: 'index.html' })
```

```
# Caddyfile
:{$PORT} {
  encode gzip

  @legacy host margin.up.railway.app
  redir @legacy https://xmargin.app{uri} permanent

  root * /srv
  try_files {path} /index.html
  file_server
}
```

- `try_files {path} /index.html` handles SPA routing — unknown paths fall back to the SvelteKit shell
- Railway injects `PORT`; Caddy reads it via `{$PORT}`
- Root layout: `export const prerender = true`
- No `BASE_PATH` — deployed to root domain, `base` is always `''`
- GitHub Actions runs tests and creates releases; Railway deploys independently via native GitHub integration
- The `@legacy` block 301-redirects the original Railway-provided subdomain (`margin.up.railway.app`, from before the custom domain existed) to the canonical apex — kept rather than deleted, since it may still be bookmarked

### Custom Domain Setup (Railway + Cloudflare)

The canonical domain is the bare apex `xmargin.app`, not a Railway-provided subdomain. Getting an apex domain working on Railway surfaced two non-obvious platform gotchas, both worth knowing before touching domain config again:

**1. Railway has no static IP — apex domains need CNAME flattening, which most registrars (including GoDaddy) can't do.**
A CNAME record is structurally disallowed at a DNS zone's apex/root by the DNS spec, and Railway doesn't publish a static IP for an `A` record fallback. The fix is **CNAME flattening**, which GoDaddy's DNS does not support at all. The working setup: registration stays at the original registrar, but **DNS management (nameservers) moves to Cloudflare** (free plan), which does support apex CNAME flattening. `www` (and the old `margin.up.railway.app`) redirect to the apex via a **Cloudflare Redirect Rule** (Rules → Single Redirect) — handled entirely at Cloudflare's edge, never touching the Railway origin.

**2. Railway's custom-domain `dnsRecords` status can silently omit the TXT ownership-verification requirement.**
Querying a custom domain's `status.dnsRecords` via the GraphQL API (or the dashboard's "Show DNS records" dialog) may show a CNAME as the only pending requirement, with no TXT record listed — even when Railway is still internally gating traffic on a domain-ownership TXT check. Symptom: DNS is fully `PROPAGATED`, TLS cert issues successfully (`certificateStatus: VALID`), the domain shows `syncStatus: ACTIVE`, and the domain is correctly attached to the service — but every request still 404s at the edge with `x-railway-fallback: true` / `"Application not found"`. This can burn hours before Railway support surfaces the actual field: `status.verified` (Boolean), `status.verificationToken`, and `status.verificationDnsHost` are separate fields from `dnsRecords`, only found via the Railway community forum (station.railway.com), not the dashboard UI. **Fix:** add a TXT record at `{verificationDnsHost}.{domain}` (e.g. `_railway-verify.xmargin.app`) with the exact value from `verificationToken` (e.g. `railway-verify=<token>`) — do this even if the dashboard never explicitly asked for it. `status.verified` flips to `true` once Railway's edge picks it up (a few minutes, not instant).

Query pattern for full domain diagnostics (GraphQL, `https://backboard.railway.com/graphql/v2`):
```graphql
query {
  domains(projectId: "...", serviceId: "...", environmentId: "...") {
    customDomains {
      id domain syncStatus
      status {
        verified verificationToken verificationDnsHost
        certificateStatus certificateStatusDetailed
        dnsRecords { hostlabel recordType requiredValue currentValue status }
      }
    }
  }
}
```

### LocalStorage Schema

```ts
// Keys (all use hyphen separator, defined in src/lib/utils/storage.ts KEYS object)
'xmargin-settings-v1'        // typography + display prefs (ReaderSettings)
'xmargin-theme'              // 'light' | 'dark' | 'sepia'
'xmargin-mode'               // 'book' | 'focus' | 'study' | 'story'
'xmargin-position-{hash}'    // { scrollY, headingId, savedAt } — expires 90d, hash = djb2(rawMarkdown)
'xmargin-bookmarks'          // Bookmark[] — max 100, LRU eviction
'xmargin-examine-set-v1'     // raw JSON of the active question set
'xmargin-examine-session-v1' // ExamineSession — range, mode, answers, flags, timer

// All reads/writes wrapped in try/catch (Safari Private Browsing throws on setItem)
// Always spread defaults as base to handle missing keys after schema change
// Positions purged on load if savedAt > 90 days ago; examine sessions older than 90d discarded on /examine load
```

### Mermaid Diagrams

No production-ready build-time plugin. Pattern:
1. Rehype plugin: detect `<code class="language-mermaid">`, replace with `<div class="mermaid" data-graph="...">` placeholder
2. In `onMount`: `import('mermaid').then(m => m.default.initialize({ startOnLoad: false })); mermaid.run()`
3. Mermaid is lazy-loaded — never in initial bundle

### Presentation Mode

Implemented as a dedicated SvelteKit route at `/present/+page.svelte` (not a lazy-loaded component). Navigation between reading and presentation uses the `{base}/present/` link in the reading toolbar.

Slide parsing: split raw Markdown at `\n---\n`, process each chunk independently through the pipeline on `onMount`. Store as `Array<{ html: string, notes: string }>`. Notes extracted from `<!-- notes: ... -->` comments.

Navigation: keyboard (arrow keys / space), pointer swipe (left/right), and tap-to-navigate (left half = prev, right half = next). Text selection suppressed during swipe. Fullscreen via `document.requestFullscreen()`.

### Examine Module

Data model and parsing/grading logic live in `src/lib/examine.ts` (`parseQuestionSet`, `isAnswerCorrect`, `toggleSelection`, `requiredSelectionCount`, `selectionCount`, `caseStudyFor`, and the hotspot helpers `isHotspot`, `hotspotAnswer`, `hotspotRowTally`) — pure functions, no state, no side effects, mirroring how `diff.ts` is kept separate from `differ.svelte.ts`.

State: `src/lib/state/examine.svelte.ts` (`examineState`) holds `rawSet`, `questionSet`, and `session` as module-level `$state`, exposed via getters + setter methods — same plain-object pattern as `reader.svelte.ts`. Reflect mode's in-progress selection is local component state, never written to `examineState` — only `Examine` mode's answers feed the session and Results.

Route: `/examine` is client-only (`ssr = false`), entered only via the home page's `ExamineInput` (paste/upload JSON, same tab pattern as `MarkdownInput`/`DiffInput`). `+page.ts` mirrors `read/+page.ts` — tries to hydrate `questionSet` + `session` from storage, discarding a session whose `lastSavedAt` is older than 90 days, then redirects home if there's still nothing to show. The route itself switches between `setup` → `resume` (only if a session was actually restored mid-progress) → `session` (Read/Reflect/Examine, picked by `session.mode`) → `review` (Examine mode only, reachable any time via "Review & submit") → `results` (once `finishSession()` sets `session.finishedAt`) — all as local `$derived` stage logic in `+page.svelte`, the same single-route-many-stages approach `present/+page.svelte` uses for slides.

Components live under `src/lib/components/examine/`. `QuestionCard` (header + optional collapsed `CaseStudyBlock` + stem) and `QuestionOptions` (renders the right option shape per question type, consolidating multi-correct explanations into one shared block rather than repeating them per option) are shared by `ReadMode`, `ReflectMode`, `ExamineMode`, and `ResultsView` — each mode only supplies the interaction props it needs. `QuestionOptions` also dispatches the two hotspot types to a single shared `HotspotGrid` — one widget, not two renderers, with `hotspot-yesno` being the case where `categories` is `["Yes", "No"]`. It never shuffles rows or categories (source order is part of the question), renders a segmented radio group for 2–3 categories and a dropdown for 4+, and stacks each row as a card below 40rem. `QuestionFrame` gives Reflect/Examine's single-question views the bordered/padded card chrome with a 300ms entrance animation; Read/Results stay flat (list views).

---

## Accessibility (Non-Negotiable)

- **Color contrast:** WCAG AA minimum (4.5:1 body text, 3:1 large text). Target AAA (7:1) for body — achievable without harshness using oklch
- **Reduced motion:** The `@media (prefers-reduced-motion: reduce)` block above is always present, always last in cascade
- **Skip link:** `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>` — first focusable element
- **Focus indicators:** Never remove `outline`. Style: `outline: 2px solid var(--color-accent); outline-offset: 3px`
- **Keyboard nav:** All interactive controls reachable via Tab. Mode toggles have `aria-pressed`. TOC links never trap focus
- **Screen reader landmarks:** `<article>` for content, `<aside>` for TOC, `<nav aria-label="Table of contents">`, `role="progressbar"` for reading progress
- **Text resize:** All layout works at 200% browser font size — use `rem` everywhere, test at `font-size: 32px`
- **Heading hierarchy:** Must be semantically correct (h1 → h2 → h3, no skipping)
- **Code blocks:** `<pre><code role="region" aria-label="Code example">`
- **Theme toggles:** `<button aria-label="Switch to dark mode" aria-pressed="false">`

---

## Performance Targets

| Metric | Target |
|---|---|
| Initial JS bundle | < 50KB gzipped |
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |
| Shiki | Never in initial chunk — dynamic import only |
| KaTeX CSS | Loaded only when `hasMath === true` |
| Slideshow component | Lazy-loaded on demand |
| Fonts | Self-hosted WOFF2 variable fonts, preloaded |

Defer expensive operations (Shiki highlighting of large documents) to `requestIdleCallback`.

---

## Non-Goals

xMargin will never be:
- A collaborative editor
- A publishing platform
- A note-taking knowledge base
- A login-driven SaaS
- A real-time sync application
- A tool that requires a server

These are different products. Do not scope-creep toward them.

---

## Coding Principles for Claude

When working on xMargin, follow these without exception:

1. **No unnecessary complexity.** Every line justifies its existence. Simple over clever.
2. **No speculative features.** Build only what is asked. No configurability, error handling, or abstractions for hypothetical futures.
3. **Preserve the reading feel.** Every UI change must pass: does this make reading calmer and better? If not, remove it.
4. **Motion is sacred.** Never introduce an animation that is snappy, bouncy, or fast. Slow and deliberate only. 300–500ms, no spring/bounce/elastic easing.
5. **Typography first.** When in doubt, improve text rendering before touching any other visual element.
6. **No backend drift.** Never suggest solutions requiring a server, database, or auth layer.
7. **Tailwind is the styling layer.** No additional CSS frameworks. No inline style overrides unless truly no other way.
8. **Three themes, always.** Every visual decision validated for light, dark, and sepia. Dark mode and sepia are not afterthoughts.
9. **Mobile is not optional.** Reading column must be usable and beautiful on small screens.
10. **If it looks like clutter, remove it.** Default is always *less*, never *more*.
11. **SSR guard everything.** Never access `window`, `document`, `localStorage` outside `onMount` or `browser` guards.
12. **`$derived` over `$effect`.** If a value can be computed, derive it. `$effect` is for side effects only.
13. **Accessibility is structural, not an add-on.** Semantic HTML, contrast, keyboard nav, and reduced motion are built in from the start.
14. **Bundle discipline.** Shiki, KaTeX, Mermaid, and Slideshow are never in the initial bundle. Always dynamic import.

---

## Vision

> xMargin aims to become the most elegant way to read Markdown on the web.

The best reading apps share one quality: they disappear. The reader is left alone with the words. Every design decision, every technical constraint, every coding principle in this document serves that one purpose.

The philosophy may grow into a broader ecosystem — personal reading libraries, writer distribution tools, structured knowledge interfaces — but the core identity must never drift:

**Calm reading first. Always.**
