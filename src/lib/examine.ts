/**
 * Examine question-set parsing & grading.
 *
 * Steps: JSON.parse → structural validation → return QuestionSet.
 * Grading is pure and stateless — no side effects, no storage access.
 */
import type { AnswerValue, CaseStudy, HotspotItem, Question, QuestionSet } from './types.js';
import { hashDoc } from './utils/storage.js';

function fail(message: string): never {
	throw new Error(message);
}

/** Both hotspot types are one widget — only the category list differs. */
export function isHotspot(question: Question): boolean {
	return question.type === 'hotspot-yesno' || question.type === 'hotspot-categorize';
}

/** Validate (and, for hotspot-yesno, normalize) a hotspot question's categories and rows. */
function validateHotspot(q: Question): void {
	const categories = q.content.categories;
	if (!Array.isArray(categories) || categories.length < 2) {
		fail(`Question "${q.id}" needs content.categories with at least two categories.`);
	}
	if (categories.some((c) => typeof c !== 'string' || c.trim() === '')) {
		fail(`Question "${q.id}" has an empty category label.`);
	}
	if (new Set(categories).size !== categories.length) {
		fail(`Question "${q.id}" has duplicate categories.`);
	}

	// hotspot-yesno is always Yes/No — accept any casing or order, then normalize.
	if (q.type === 'hotspot-yesno') {
		const lower = categories.map((c) => c.toLowerCase());
		if (categories.length !== 2 || !lower.includes('yes') || !lower.includes('no')) {
			fail(`Question "${q.id}" (hotspot-yesno) needs categories to be exactly "Yes" and "No".`);
		}
	}

	const items = q.content.items;
	if (!Array.isArray(items) || items.length === 0) {
		fail(`Question "${q.id}" needs content.items with at least one row.`);
	}

	const normalize = (value: string): string =>
		q.type === 'hotspot-yesno' ? (value.toLowerCase() === 'yes' ? 'Yes' : 'No') : value;

	items.forEach((item: HotspotItem, i) => {
		const row = i + 1;
		if (typeof item?.statement !== 'string' || item.statement.trim() === '') {
			fail(`Question "${q.id}", row ${row} is missing a statement.`);
		}
		if (typeof item.correct !== 'string' || item.correct.trim() === '') {
			fail(`Question "${q.id}", row ${row} is missing a correct category.`);
		}
		if (q.type === 'hotspot-yesno') {
			if (!['yes', 'no'].includes(item.correct.toLowerCase())) {
				fail(`Question "${q.id}", row ${row} has a correct value ("${item.correct}") that isn't "Yes" or "No".`);
			}
			item.correct = normalize(item.correct);
		} else if (!categories.includes(item.correct)) {
			fail(
				`Question "${q.id}", row ${row} has a correct value ("${item.correct}") that isn't one of its categories.`
			);
		}
	});

	if (q.type === 'hotspot-yesno') q.content.categories = ['Yes', 'No'];
}

/** Parse and validate a raw JSON question set, throwing a descriptive Error on any violation. */
export function parseQuestionSet(raw: string): QuestionSet {
	let data: unknown;
	try {
		data = JSON.parse(raw);
	} catch {
		fail('That doesn\'t look like valid JSON.');
	}

	if (typeof data !== 'object' || data === null) fail('Question set must be a JSON object.');
	const set = data as Partial<QuestionSet>;

	if (!set.metadata?.title) fail('Question set is missing metadata.title.');
	if (!Array.isArray(set.questions) || set.questions.length === 0) {
		fail('Question set must include a non-empty questions array.');
	}

	const questions = set.questions as Question[];

	const caseStudyIds = new Set<string>();
	if (set.caseStudies !== undefined) {
		if (!Array.isArray(set.caseStudies)) fail('caseStudies must be an array.');
		for (const cs of set.caseStudies as CaseStudy[]) {
			if (!cs.id) fail('Every case study needs a unique id.');
			if (caseStudyIds.has(cs.id)) fail(`Duplicate case study id: "${cs.id}".`);
			caseStudyIds.add(cs.id);
			if (!cs.title) fail(`Case study "${cs.id}" is missing a title.`);
			if (!cs.body) fail(`Case study "${cs.id}" is missing a body.`);
		}
	}

	const ids = new Set<string>();
	const numbers: number[] = [];
	for (const q of questions) {
		if (!q.id) fail('Every question needs a unique id.');
		if (ids.has(q.id)) fail(`Duplicate question id: "${q.id}".`);
		ids.add(q.id);
		numbers.push(q.number);

		if (!q.content?.stem) fail(`Question "${q.id}" is missing content.stem.`);

		if (q.caseStudyId && !caseStudyIds.has(q.caseStudyId)) {
			fail(`Question "${q.id}" references an unknown case study: "${q.caseStudyId}".`);
		}

		if (q.type === 'true-false') {
			if (q.content.correct !== 'true' && q.content.correct !== 'false') {
				fail(`Question "${q.id}" (true-false) needs content.correct to be "true" or "false".`);
			}
		} else if (q.type === 'multiple-choice' || q.type === 'multiple-choice-multiple-correct') {
			const options = q.content.options;
			if (!options || options.length === 0) {
				fail(`Question "${q.id}" needs at least one option.`);
			}
			const correctCount = options.filter((o) => o.isCorrect).length;
			if (correctCount === 0) fail(`Question "${q.id}" has no option marked isCorrect.`);
			if (q.type === 'multiple-choice-multiple-correct' && q.content.correctCount !== correctCount) {
				fail(`Question "${q.id}": correctCount (${q.content.correctCount}) doesn't match the number of isCorrect options (${correctCount}).`);
			}
		} else if (isHotspot(q)) {
			validateHotspot(q);
		} else {
			fail(`Question "${q.id}" has an unknown type: "${q.type}".`);
		}
	}

	const sorted = [...numbers].sort((a, b) => a - b);
	const sequential = sorted.every((n, i) => n === i + 1);
	if (!sequential) fail('Question numbers must be sequential, starting at 1.');

	return set as QuestionSet;
}

/** The case study a question belongs to, or undefined for standalone questions. */
export function caseStudyFor(set: QuestionSet, question: Question): CaseStudy | undefined {
	if (!question.caseStudyId) return undefined;
	return set.caseStudies?.find((cs) => cs.id === question.caseStudyId);
}

/** How many options (or hotspot rows) must be answered before an answer can be revealed/submitted. */
export function requiredSelectionCount(question: Question): number {
	if (question.type === 'multiple-choice-multiple-correct') {
		return question.content.correctCount ?? 1;
	}
	if (isHotspot(question)) return question.content.items?.length ?? 0;
	return 1;
}

/** How much of an answer is filled in — unanswered hotspot rows (null) don't count. */
export function selectionCount(question: Question, selected: AnswerValue | undefined): number {
	if (selected === undefined) return 0;
	if (Array.isArray(selected)) return selected.filter((v) => v != null).length;
	return 1;
}

/** A hotspot answer as a dense array parallel to `items`, padded with nulls. */
export function hotspotAnswer(question: Question, selected: AnswerValue | undefined): (string | null)[] {
	const length = question.content.items?.length ?? 0;
	const current = Array.isArray(selected) ? selected : [];
	return Array.from({ length }, (_, i) => current[i] ?? null);
}

/**
 * Toggle a key into/out of the current selection.
 * `rowIndex` applies only to hotspot questions, where the key is a category and
 * each row holds exactly one — so picking replaces rather than accumulates.
 */
export function toggleSelection(
	question: Question,
	current: AnswerValue | undefined,
	key: string,
	rowIndex?: number
): AnswerValue {
	if (isHotspot(question)) {
		const next = hotspotAnswer(question, current);
		if (rowIndex === undefined || rowIndex < 0 || rowIndex >= next.length) return next;
		next[rowIndex] = key;
		return next;
	}
	if (question.type === 'multiple-choice-multiple-correct') {
		const arr = Array.isArray(current) ? (current.filter((k) => k != null) as string[]) : [];
		if (arr.includes(key)) return arr.filter((k) => k !== key);
		if (arr.length >= requiredSelectionCount(question)) return arr;
		return [...arr, key];
	}
	return key;
}

/**
 * How many hotspot rows were categorized correctly. Reported alongside the
 * pass/fail so the learner sees how close they were — a count, never a score.
 */
export function hotspotRowTally(
	question: Question,
	selected: AnswerValue | undefined
): { correct: number; total: number } {
	const items = question.content.items ?? [];
	const answer = hotspotAnswer(question, selected);
	return {
		correct: items.filter((item, i) => answer[i] === item.correct).length,
		total: items.length
	};
}

/** Grade a single answer against its question. Pure — no side effects. */
export function isAnswerCorrect(question: Question, selected: AnswerValue): boolean {
	if (question.type === 'true-false') {
		return selected === question.content.correct;
	}

	// A hotspot question is correct only when every row is — no partial credit.
	if (isHotspot(question)) {
		const { correct, total } = hotspotRowTally(question, selected);
		return total > 0 && correct === total;
	}

	const correctKeys = new Set(
		(question.content.options ?? []).filter((o) => o.isCorrect).map((o) => o.key)
	);

	if (question.type === 'multiple-choice-multiple-correct') {
		const sel = (Array.isArray(selected) ? selected : [selected]).filter((k) => k != null);
		return sel.length === correctKeys.size && sel.every((k) => correctKeys.has(k));
	}

	// multiple-choice (single correct)
	return !Array.isArray(selected) && correctKeys.has(selected);
}

function mulberry32(seed: number): () => number {
	let a = seed;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Deterministic Fisher-Yates shuffle — the same seed always produces the same order. */
export function seededShuffle<T>(items: T[], seed: number): T[] {
	const rng = mulberry32(seed);
	const result = [...items];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

/** Derives a per-question seed so each question's options shuffle independently, not identically. */
export function questionSeed(sessionSeed: number, questionId: string): number {
	return sessionSeed ^ parseInt(hashDoc(questionId), 36);
}

/** Static, hand-written example covering every question type — display-only, never parsed. */
export const SAMPLE_QUESTION_SET_JSON = `{
  "metadata": {
    "id": "sample-set",
    "title": "Sample Question Set",
    "totalQuestions": 5
  },
  "caseStudies": [
    {
      "id": "cs-1",
      "title": "xMargin at a Glance",
      "body": "xMargin is a reader-first Markdown web application.\\n\\n## Architecture\\n\\n- Runs entirely as a static site\\n- No backend, no accounts, no tracking\\n\\n## Design Tokens\\n\\nColor is defined with the **oklch** color space throughout."
    }
  ],
  "questions": [
    {
      "id": "q1",
      "number": 1,
      "type": "multiple-choice",
      "caseStudyId": "cs-1",
      "content": {
        "stem": "Which token system does xMargin use for color?",
        "options": [
          { "key": "A", "text": "Tailwind defaults", "isCorrect": false, "explanation": "xMargin defines its own semantic tokens." },
          { "key": "B", "text": "oklch semantic tokens", "isCorrect": true, "explanation": "Three-layer token system, oklch throughout." }
        ]
      }
    },
    {
      "id": "q2",
      "number": 2,
      "type": "multiple-choice-multiple-correct",
      "content": {
        "stem": "Which of these are xMargin reading modes? (choose 2)",
        "correctCount": 2,
        "options": [
          { "key": "A", "text": "Book", "isCorrect": true, "explanation": "A core reading mode." },
          { "key": "B", "text": "Arcade", "isCorrect": false, "explanation": "Not an xMargin mode." },
          { "key": "C", "text": "Focus", "isCorrect": true, "explanation": "A core reading mode." }
        ]
      }
    },
    {
      "id": "q3",
      "number": 3,
      "type": "true-false",
      "content": {
        "stem": "xMargin shows a percentage score after an exam.",
        "correct": "false",
        "explanation": "Examine reports counts honestly — never a percentage or grade."
      }
    },
    {
      "id": "q4",
      "number": 4,
      "type": "hotspot-yesno",
      "content": {
        "stem": "For each statement about xMargin, select yes if it is true. Otherwise, select no.",
        "itemLabel": "Statement:",
        "categories": ["Yes", "No"],
        "items": [
          { "statement": "Reading settings persist to localStorage.", "correct": "Yes" },
          { "statement": "Documents are synced to a server.", "correct": "No" }
        ]
      }
    },
    {
      "id": "q5",
      "number": 5,
      "type": "hotspot-categorize",
      "content": {
        "stem": "For each concern, select the layer it belongs to.",
        "itemLabel": "Concern:",
        "categories": ["Parsing", "Rendering", "Persistence"],
        "items": [
          { "statement": "Extracting the table of contents from the MDAST", "correct": "Parsing" },
          { "statement": "Restoring the last reading position", "correct": "Persistence" },
          { "statement": "Highlighting the active heading while scrolling", "correct": "Rendering", "explanation": "Optional — a per-row note, shown under the row when present." }
        ]
      }
    }
  ]
}`;
