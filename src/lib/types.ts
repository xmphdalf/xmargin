export type Theme = 'light' | 'dark' | 'sepia';
export type ReadingMode = 'book' | 'focus' | 'study' | 'story';
export type FontFamily = 'serif' | 'sans';
export type Measure = 'narrow' | 'default' | 'wide';

export interface TocEntry {
	id: string;
	text: string;
	depth: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface Frontmatter {
	title?: string;
	author?: string;
	date?: string;
	description?: string;
	[key: string]: unknown;
}

export interface ParsedDoc {
	html: string;
	toc: TocEntry[];
	/** Math.ceil(wordCount / 238) */
	readingTime: number;
	wordCount: number;
	frontmatter: Frontmatter;
	hasMath: boolean;
	hasCode: boolean;
}

export interface ReaderSettings {
	/** rem value, e.g. 1.125 = 18px */
	fontSize: number;
	fontFamily: FontFamily;
	/** e.g. 1.75 */
	lineHeight: number;
	/** maps to 60ch / 68ch / 80ch */
	measure: Measure;
}

export interface Bookmark {
	id: string;
	headingId: string;
	headingText: string;
	createdAt: number;
}

export interface ReadingPosition {
	scrollY: number;
	headingId: string;
	savedAt: number;
}

// ─── Git Diff types ───────────────────────────────────────────────────────────

export interface DiffMeta {
	/** Derived title: filename, short list, or "N files changed" */
	title: string;
	/** Estimated reading time, e.g. "~4 min" */
	breath: string;
	/** One-sentence prose summary of the overall change set */
	editorsNote: string;
}

export interface ParsedDiff {
	files: DiffFile[];
	totalAdditions: number;
	totalDeletions: number;
	synopsis: SynopsisEntry[];
	meta: DiffMeta;
}

export interface DiffFile {
	id: string;
	path: string;
	oldPath?: string;
	status: 'added' | 'deleted' | 'modified' | 'renamed';
	additions: number;
	deletions: number;
	isGenerated: boolean;
	/** Prose sentence describing what changed in this file */
	synopsis: string;
	hunks: DiffHunk[];
}

export interface DiffHunk {
	/** The @@ ... @@ context line, cleaned of @@ markers */
	header: string;
	lines: DiffLine[];
}

export interface DiffLine {
	type: 'context' | 'addition' | 'deletion';
	content: string;
	/** Old file line number (present on context and deletion lines) */
	oldLine?: number;
	/** New file line number (present on context and addition lines) */
	newLine?: number;
	tokens?: DiffToken[];
	highlightedHtml?: string;
}

export interface DiffToken {
	value: string;
	changed: boolean;
}

export interface SynopsisEntry {
	fileId: string;
	path: string;
	status: DiffFile['status'];
	note?: string;
	isGenerated: boolean;
}

// ─── Examine types ──────────────────────────────────────────────────────────

export type QuestionType =
	| 'multiple-choice'
	| 'multiple-choice-multiple-correct'
	| 'true-false'
	| 'hotspot-yesno'
	| 'hotspot-categorize';
export type ExamineMode = 'read' | 'reflect' | 'examine';

/**
 * A chosen answer: an option key, or one entry per row for the hotspot types
 * (`null` = that row was never answered, which reads differently from wrong).
 */
export type AnswerValue = string | (string | null)[];

export interface QuestionOption {
	key: string;
	text: string;
	isCorrect: boolean;
	explanation: string;
}

/** One row of a hotspot question — a statement categorized into exactly one category. */
export interface HotspotItem {
	statement: string;
	/** Must be a member of the question's `categories` */
	correct: string;
	explanation?: string;
}

export interface CaseStudy {
	id: string;
	title: string;
	/** Markdown scenario text — headings, lists, bold, and paragraphs are supported */
	body: string;
}

export interface Question {
	id: string;
	number: number;
	categoryId?: string;
	/** Links this question to a shared case study; absent = standalone question */
	caseStudyId?: string;
	type: QuestionType;
	content: {
		stem: string;
		/** multiple-choice, multiple-choice-multiple-correct */
		options?: QuestionOption[];
		/** multiple-choice-multiple-correct */
		correctCount?: number;
		/** true-false */
		correct?: 'true' | 'false';
		/** true-false */
		explanation?: string;
		/** hotspot-yesno, hotspot-categorize — ordered, never shuffled */
		categories?: string[];
		/** hotspot-yesno, hotspot-categorize — ordered, never shuffled */
		items?: HotspotItem[];
		/** hotspot-yesno, hotspot-categorize — cosmetic column header, e.g. "Tool:" */
		itemLabel?: string;
	};
	tags?: string[];
}

export interface QuestionCategory {
	id: string;
	name: string;
	questionIds: string[];
}

export interface QuestionSetMetadata {
	id: string;
	title: string;
	description?: string;
	totalQuestions: number;
	author?: string;
	difficulty?: string;
	[key: string]: unknown;
}

export interface QuestionSet {
	metadata: QuestionSetMetadata;
	categories?: QuestionCategory[];
	caseStudies?: CaseStudy[];
	questions: Question[];
}

export interface UserAnswer {
	questionId: string;
	selected: AnswerValue;
	isCorrect: boolean;
	timestamp: number;
}

export interface ExamineSession {
	setTitle: string;
	totalQuestions: number;
	selectedRange: { from: number; to: number };
	mode: ExamineMode;
	shuffleQuestions: boolean;
	shuffleOptions: boolean;
	/** Seeds the deterministic shuffle so the same order survives reloads; regenerated per session */
	shuffleSeed: number;
	currentIndex: number;
	/** Keyed by questionId — a plain object, not a Map, so it survives JSON.stringify */
	answers: Record<string, UserAnswer>;
	/** questionIds flagged for revisit */
	flagged: string[];
	timerEnabled: boolean;
	startedAt: number | null;
	lastSavedAt: number | null;
	finishedAt: number | null;
}
