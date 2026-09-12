# Examine — Feature Specification

## I. Overview

**Examine** is xMargin's third native module — a reader-first knowledge assessment and learning companion. It transforms question sets into a calm, focused learning experience that respects deep thinking and honest self-knowledge over performance theater.

Examine follows xMargin's core principle: *reading requires space*. But instead of reading prose or code, users read questions, answers, and patterns in their own understanding.

---

## II. Ideology & Philosophy

### Core Belief
Learning is not about **scoring**. It is about understanding what you know and what you don't.

Examine rejects the engagement-maximization playbook:
- No gamification (badges, streaks, levels)
- No score theater (percentages, grade letters, leaderboards)
- No time pressure (optional timer only)
- No artificial urgency (no "X days remaining")

Instead, examine embraces:
- **Honesty** — Clear view of strengths and gaps
- **Reflection** — Time to think and process
- **Typography** — Questions and answers read beautifully
- **Breathing room** — Space between content for contemplation
- **Privacy** — No tracking, no data collection beyond what you need

### Design Principles (Inherited from xMargin)

1. **Interface disappears behind content**
   - The question and answer matter; the UI doesn't
   - Chrome is minimal and contextual
   - Focus is on the knowledge, not the app

2. **Calm, not stimulation**
   - Motion is slow, purposeful, never decorative
   - Colors are muted; accents guide attention
   - No notifications, no alerts, no pressure

3. **Typography as pedagogy**
   - Questions in serif (contemplative, readable)
   - Answers in carefully-sized sans (clear, scannable)
   - Code in monospace (technical, accurate)
   - Spacing rhythmic and generous

4. **Respect for user time**
   - No required pacing (except optional exam timer)
   - Pause between questions is encouraged
   - Answers and explanations are skimmable or detailed
   - Progress is saved automatically

5. **Timeless, not trendy**
   - Feel should be like a printed study guide, not a mobile game
   - Aesthetic is premium and understated
   - Should work in 5 years without feeling outdated

### The Experience Statement
> A quiet place to test what you know — not to be judged, but to understand yourself.

---

## III. Core Features

### A. Three Reading Modes

Each mode serves a different learning goal:

#### 1. **Read Mode**
**Purpose:** Browse and absorb without pressure

- View all questions and answers in a single, scrollable list
- No timer, no scoring, no interaction required
- Like reading a reference guide or study guide
- Each question-answer pair is typographically distinct
- Perfect for: Initial learning, review, sharing knowledge

**Experience:**
```
examine — AWS AI Practitioner

Browsing 25 questions

─────────────────────────────────

Q 01  Which AWS solution monitors AI fairness metrics 
      in real time with the least custom development?

      ✓ C · SageMaker Clarify + CloudWatch
        A is insufficient because...
        B doesn't provide...
        D is for image recognition...

─────────────────────────────────

Q 02  Which three Bedrock Guardrail steps prevent...
      ✓ A · Configure denied topics guardrail...
        B · Configure custom word filters...
        D · Set high grounding score threshold...

[scroll...]
```

#### 2. **Reflect Mode**
**Purpose:** Self-paced card-based learning

- One question at a time, cards you can flip
- Question appears, you think about your answer
- You reveal the answer when ready (no timer)
- Immediate feedback: correct/incorrect
- Perfect for: Building confidence, pre-testing, spaced repetition

**Experience:**
```
examine — Reflect Mode

Q 07 of 25

─────────────────────────────────

Which AWS service provides access to foundation 
models via API with no infrastructure to manage?

        [Reveal answer]

[User clicks → Answer flips in]

─────────────────────────────────

✓ B · Amazon Bedrock

Amazon Bedrock is the fully managed service for 
accessing foundation models from providers like 
Anthropic, AI21, and Cohere via API.

        ← Previous    Next →
```

#### 3. **Examine Mode**
**Purpose:** Full assessment with honest feedback

- Linear progression through questions
- Answer selection as you go
- Optional timer (for exam-style test)
- Immediate per-question feedback (optional)
- Full results with detailed breakdown at end
- Shows what you selected, what was correct, why it matters
- Perfect for: Assessment, identifying gaps, exam prep

**Experience:**
```
examine — Examine Mode

Q 07 of 25 (Optional timer: 12:34 remaining)

─────────────────────────────────

Which AWS service provides access to foundation 
models via API with no infrastructure to manage?

[ ] A · Amazon SageMaker
[ ] B · Amazon Bedrock
[ ] C · Amazon Rekognition
[ ] D · Amazon Comprehend

        ← Previous    Next →
```

### B. Custom Question Range Selection

**Purpose:** Users can practice subsets of large question pools

Before entering any mode, users select which questions to examine:

```
examine — AWS AI Practitioner

Total questions available: 105

What would you like to examine?

  ○ All questions (1–105)
  ○ First 25 questions (1–25)
  ○ Questions 26–50
  ○ Questions 51–75
  ○ Questions 76–105
  ○ Custom range:  From [__] To [__]

Select a mode:
  ○ Read     — Browse all together
  ○ Reflect  — Card-based, self-paced
  ○ Examine  — Full test, honest feedback

                            Begin »
```

**Benefits:**
- Not overwhelming for large pools
- Allows focused studying of topics (if Q1-25 = "Basics", Q26-50 = "Advanced")
- Users set their own difficulty/scope
- No forced commitment to 100+ questions

### C. Honest Results & Reflection

**Purpose:** Self-knowledge, not performance judgment

Results show:

1. **Total overview** (not a score)
   - "You answered 17 of 25 correctly"
   - Time spent (informational, not bragging)
   - No percentage, no grade letter, no pass/fail badge

2. **Question-by-question breakdown**
   - Each question with number and text
   - What you selected (shown clearly)
   - What was correct
   - Explanation of why

3. **Pattern identification**
   - "Questions to revisit: Q02, Q04, Q08"
   - "Topics you found challenging: [topic], [topic]"
   - No shaming, framed as learning opportunity

4. **Actionable next steps**
   - Retake this range
   - Load new question set
   - Practice specifically the "revisit" questions

**Results Example:**
```
examine — Results

AWS AI Practitioner (25 questions)
Completed in 12:34

──────────────────────────────

You answered 17 of 25 correctly.

──────────────────────────────

Q 01 ✓
Which AWS solution monitors AI fairness metrics 
in real time with the least custom development?

Your answer: C · SageMaker Clarify + CloudWatch
Correct.

──────────────────────────────

Q 02 ✗
Which three Bedrock Guardrail steps prevent a 
finance AI from inappropriate advice, competitor 
discussion, and ungrounded claims?

Your answer: A, C, E
Correct answer: A, D, F

Why this matters:
Content filters target harmful categories, not 
business-defined topics. Word filters (D) block 
competitor names. A low grounding threshold (E) 
would worsen ungrounded outputs, not prevent them.

──────────────────────────────

Q 03 ✓
An Amplify app experiences timeouts from long-
running Lambda resolvers. Which solution 
resolves this?

Your answer: A · AWS Amplify AI Kit with streaming
Correct.

──────────────────────────────

Questions to revisit: Q02, Q04, Q08

         Retake    Load new set »
```

### D. Progress Persistence

**Purpose:** Resume study sessions across browser refreshes

- All exam state saved to localStorage automatically
- On page reload, user can resume from where they left off
- Option to start fresh if preferred
- No nagging — silent restoration as default

**Persisted State:**
```javascript
{
  sessionId: "uuid",
  setId: "AWS AI Practitioner",
  selectedRange: { from: 1, to: 25 },
  mode: "examine",
  currentQuestionIndex: 6,
  answers: {
    "q1": { selected: "C", isCorrect: true },
    "q2": { selected: ["A", "C", "E"], isCorrect: false },
    "q3": { selected: "A", isCorrect: true }
  },
  startedAt: 1687891234000,
  lastSavedAt: 1687891299000
}
```

**Resume Flow:**
```
[User refreshes page]

examine — Resume?

AWS AI Practitioner

You were on Q 07 of 25 in "Examine" mode.
Last saved 2 minutes ago.

        Continue from Q 07        Start fresh
```

---

## IV. Technical Architecture

### A. State Management (Svelte 5 .svelte.js)

```typescript
// src/lib/state/examine.svelte.ts

interface ExamineSession {
  sessionId: string;
  setId: string;
  totalQuestions: number;
  selectedRange: { from: number; to: number };
  mode: 'read' | 'reflect' | 'examine';
  currentQuestionIndex: number;
  answers: Map<string, UserAnswer>;
  flaggedQuestions: Set<string>;
  startedAt: number | null;
  lastSavedAt: number | null;
}

interface UserAnswer {
  questionId: string;
  selected: string | string[]; // Single or multiple choice
  isCorrect: boolean;
  timestamp: number;
}

export let examineState = $state<ExamineSession>({
  sessionId: '',
  setId: '',
  totalQuestions: 0,
  selectedRange: { from: 1, to: 25 },
  mode: 'read',
  currentQuestionIndex: 0,
  answers: new Map(),
  flaggedQuestions: new Set(),
  startedAt: null,
  lastSavedAt: null
});

// Functions
export function loadQuestionSet(questions: Question[], mode: 'read' | 'reflect' | 'examine') {
  // Initialize session
}

export function selectAnswer(questionId: string, selected: string | string[]) {
  // Record answer, validate, save to localStorage
}

export function toggleFlagQuestion(questionId: string) {
  // Mark question for review
}

export function submitExamine() {
  // Calculate results, persist final state
}

export function resumeSession() {
  // Restore from localStorage
}

export function startFresh() {
  // Clear session, begin new
}
```

### B. Component Structure

```
src/lib/components/examine/
├── ExamineShell.svelte          # Main container, mode/range selection
├── SetupPanel.svelte             # Load questions, choose range + mode
├── ReadMode.svelte               # Browse all questions + answers
├── ReflectMode.svelte            # Card-based flip interface
├── ExamineMode.svelte            # Linear test progression
├── QuestionCard.svelte           # Single question display
├── OptionButton.svelte           # Answer option (multiple choice, T/F)
├── ResultsView.svelte            # Breakdown of answers + explanations
├── ResumePrompt.svelte          # Resume or start fresh
├── ProgressIndicator.svelte      # Current question + total
└── TimerDisplay.svelte           # Optional timer (exam mode only)
```

### C. Routes

```
/examine                    # Main examine page
/examine/read              # Read mode view (if separate routes needed)
/examine/reflect           # Reflect mode view
/examine/results           # Results view
```

Or single-page app with state-driven view switching.

### D. localStorage Schema

```javascript
// Key: 'xmargin-examine-session'
{
  sessions: [
    {
      sessionId: "uuid-1",
      setId: "AWS AI Practitioner",
      // ... full session state
      expiresAt: timestamp + 90 days
    }
  ],
  preferences: {
    defaultMode: 'examine',
    showTimer: true,
    autoSaveInterval: 5000,
    theme: 'light' // inherits from xMargin's theme system
  }
}
```

---

## V. JSON Question Set Structure

### Required Format

```json
{
  "metadata": {
    "id": "aip-c01",
    "title": "AWS AI Practitioner · AIP-C01",
    "description": "Official AWS AI Practitioner exam preparation",
    "version": "1.0",
    "totalQuestions": 105,
    "createdAt": "2024-01-15",
    "updatedAt": "2024-06-25",
    "author": "AWS",
    "difficulty": "beginner"
  },
  
  "categories": [
    {
      "id": "cat-1",
      "name": "Foundations & Core Concepts",
      "questionIds": ["q1", "q2", "q3", "q4", "q5"]
    },
    {
      "id": "cat-2",
      "name": "Amazon Bedrock",
      "questionIds": ["q6", "q7", "q8", "q9", "q10"]
    }
  ],

  "questions": [
    {
      "id": "q1",
      "number": 1,
      "categoryId": "cat-1",
      "type": "multiple-choice",
      "difficulty": "easy",
      "content": {
        "stem": "Which AWS solution monitors AI fairness metrics in real time with the least custom development effort?",
        "options": [
          {
            "key": "A",
            "text": "Amazon SageMaker",
            "isCorrect": false,
            "explanation": "SageMaker supports fairness monitoring but requires more custom implementation than Clarify."
          },
          {
            "key": "B",
            "text": "Amazon Bedrock",
            "isCorrect": false,
            "explanation": "Bedrock is for accessing foundation models, not for monitoring fairness."
          },
          {
            "key": "C",
            "text": "SageMaker Clarify + CloudWatch",
            "isCorrect": true,
            "explanation": "SageMaker Clarify provides built-in fairness monitoring with CloudWatch integration, requiring minimal custom development."
          },
          {
            "key": "D",
            "text": "Amazon Lookout for Metrics",
            "isCorrect": false,
            "explanation": "Lookout is for anomaly detection in metrics, not specifically for AI fairness."
          }
        ]
      },
      "tags": ["monitoring", "fairness", "sagemaker"]
    },
    
    {
      "id": "q2",
      "number": 2,
      "categoryId": "cat-2",
      "type": "multiple-choice-multiple-correct",
      "difficulty": "medium",
      "content": {
        "stem": "Which three Bedrock Guardrail steps prevent a finance AI from inappropriate advice, competitor discussion, and ungrounded claims?",
        "correctCount": 3,
        "options": [
          {
            "key": "A",
            "text": "Configure a denied topics guardrail to block competitor names",
            "isCorrect": true,
            "explanation": "Denied topics guardrails prevent discussion of specific topics like competitors."
          },
          {
            "key": "B",
            "text": "Configure custom word filters with block action for competitor names",
            "isCorrect": false,
            "explanation": "Word filters are for profanity and sensitive words, not business logic like competitor names."
          },
          {
            "key": "C",
            "text": "Set a low grounding score threshold to allow flexible responses",
            "isCorrect": false,
            "explanation": "A low threshold would worsen ungrounded outputs, not prevent them."
          },
          {
            "key": "D",
            "text": "Set a high grounding score threshold to prevent ungrounded claims",
            "isCorrect": true,
            "explanation": "High grounding threshold ensures responses are grounded in source material."
          },
          {
            "key": "E",
            "text": "Configure a content filter for hate speech categories",
            "isCorrect": false,
            "explanation": "Content filters target harmful categories, not business-specific topics."
          },
          {
            "key": "F",
            "text": "Use knowledge base retrieval to ensure all responses are grounded",
            "isCorrect": true,
            "explanation": "Knowledge base integration ensures financial advice is grounded in verified sources."
          }
        ]
      },
      "tags": ["guardrails", "bedrock", "grounding"]
    },
    
    {
      "id": "q3",
      "number": 3,
      "categoryId": "cat-1",
      "type": "true-false",
      "difficulty": "easy",
      "content": {
        "stem": "Amazon Bedrock can be accessed only through the AWS Console, not via API.",
        "correct": "false",
        "explanation": "Bedrock provides a fully managed API for accessing foundation models. The console is just one interface."
      },
      "tags": ["bedrock", "api"]
    }
  ]
}
```

### Question Type Definitions

#### 1. Multiple Choice (Single Correct)
```json
{
  "type": "multiple-choice",
  "content": {
    "stem": "...",
    "options": [
      { "key": "A", "text": "...", "isCorrect": true, "explanation": "..." },
      // ...
    ]
  }
}
```
- User selects one option
- Result: string (e.g., "A")

#### 2. Multiple Choice (Multiple Correct)
```json
{
  "type": "multiple-choice-multiple-correct",
  "correctCount": 3,
  "content": {
    "stem": "Which TWO of the following...",
    "options": [
      { "key": "A", "text": "...", "isCorrect": true, "explanation": "..." },
      // ...
    ]
  }
}
```
- User selects multiple options
- Result: string[] (e.g., ["A", "D", "F"])
- Validation: user selected exactly `correctCount` items AND they match isCorrect

#### 3. True/False
```json
{
  "type": "true-false",
  "content": {
    "stem": "...",
    "correct": "true" | "false",
    "explanation": "..."
  }
}
```
- User selects True or False
- Result: string ("true" or "false")

#### 4. Hotspot (Yes/No) and 5. Hotspot (Categorize)

The same widget with a different category list. The stem is followed by rows —
each row is a statement assigned exactly one category, drawn from a list shared
by every row in the question.

```json
{
  "type": "hotspot-categorize",
  "content": {
    "stem": "You are classifying chunking strategies by corpus type...",
    "itemLabel": "Chunking Strategy:",
    "categories": ["Long Structured Documents", "Heterogeneous Short Records"],
    "items": [
      { "statement": "per-record chunking where each record is one chunk", "correct": "Heterogeneous Short Records" },
      { "statement": "semantic chunking along clause boundaries", "correct": "Long Structured Documents", "explanation": "optional" }
    ]
  }
}
```

- `categories` — ordered, 2+ unique labels, rendered in source order. For
  `hotspot-yesno` it is always `["Yes", "No"]`; casing and order are normalized
  on parse, but membership is strict.
- `items` — ordered, rendered in source order. Rows and categories are **never
  shuffled**, even when the session shuffles options for other types. Categories
  may repeat freely across rows — this is not a matching question.
- `items[].correct` — must be a member of `categories` (exact, case-sensitive).
- `items[].explanation` — optional per-row note, shown under the row on reveal.
- No `options` array and no `correctCount` on these types.
- Result: `(string | null)[]` parallel to `items` — `null` means that row was
  never answered, which review distinguishes from answered-incorrectly.
- Grading: the question counts as correct **only when every row is correct** —
  no partial credit. The row tally ("3 of 5 rows correct") is shown alongside,
  as a count, never a score.
- Rendering: two-column table on wide screens, stacked cards on narrow. A
  segmented radio group for 2–3 categories, a dropdown for 4+. Nothing is
  preselected.

### Case Studies (optional)

For exam styles that attach groups of questions to a shared scenario (e.g. GCP
certification case studies), a set may declare top-level `caseStudies` and link
questions to them. A question either references one case study or none —
unlinked questions are standalone.

```json
{
  "caseStudies": [
    {
      "id": "cs-1",
      "title": "EHR Healthcare",
      "body": "Company overview...\n\nSolution concept... (blank lines separate paragraphs)"
    }
  ],
  "questions": [
    { "id": "q1", "number": 1, "caseStudyId": "cs-1", "type": "multiple-choice", "content": { } },
    { "id": "q2", "number": 2, "type": "true-false", "content": { } }
  ]
}
```

Associated questions render a collapsed "Case study · {title}" disclosure above
the stem in every mode (Read, Reflect, Examine, Results).

### Validation Rules
- All questions must have unique `id`
- All questions must have sequential `number`
- `correctCount` (for multiple-correct) must match count of options with `isCorrect: true`
- At least one option must be `isCorrect: true`
- Hotspot types need `categories` (2+ unique, non-empty) and `items` (1+ rows)
- Every hotspot row needs a non-empty `statement` and a `correct` that is a
  member of `categories`; errors name the question id and the 1-based row
- `hotspot-yesno` categories must be exactly Yes and No (normalized, not rejected,
  when the source uses other casing or order)
- Case studies must have unique `id`, a `title`, and a `body`
- A question's `caseStudyId`, when present, must reference a declared case study

---

## VI. The Feel & Visual Design

### Color Palette (Using xMargin's Tokens)

```css
/* Question text — primary ink, serif */
.question-stem {
  color: var(--color-ink);
  font-family: var(--font-serif);
  font-size: 1.125rem;
  line-height: 1.65;
  font-weight: 400;
}

/* Option text — secondary ink, sans */
.option-text {
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.55;
}

/* Your selection — accent highlight (soft blue) */
.option.selected {
  border-color: var(--color-accent);
  background-color: oklch(0.97 0.01 260);
}

/* Correct answer — success green (from xMargin's diff palette) */
.option.correct,
.mark-correct {
  color: var(--color-add);
  border-color: var(--color-add);
  background-color: var(--color-add-tint);
}

/* Incorrect answer — error red (from xMargin's diff palette) */
.option.incorrect,
.mark-incorrect {
  color: var(--color-del);
  border-color: var(--color-del);
  background-color: var(--color-del-tint);
}

/* Explanation text — muted ink */
.explanation {
  color: var(--color-ink-muted);
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  line-height: 1.65;
  margin-top: 1rem;
  padding: 1rem;
  border-left: 2px solid var(--color-border);
  background-color: var(--color-surface-alt);
}
```

### Layout & Spacing

```css
/* Main container */
.examine-main {
  max-width: 680px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

/* Question card */
.question-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 1.5rem;
}

/* Question header (Q number + mode indicator) */
.question-header {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  margin-bottom: 1.5rem;
}

/* Options container */
.options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1.5rem 0;
}

/* Single option */
.option {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 200ms ease;
  background: var(--color-surface);
}

.option:hover:not(.disabled) {
  border-color: var(--color-border-hover);
  background: var(--color-surface-alt);
}

/* Option key (A, B, C, etc.) */
.option-key {
  font-family: var(--font-mono);
  font-weight: 500;
  color: var(--color-ink-muted);
  min-width: 20px;
  flex-shrink: 0;
  padding-top: 2px;
}

/* Progress indicator */
.progress-bar {
  display: flex;
  gap: 0.5rem;
  margin: 2rem 0 1rem;
  justify-content: center;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-border);
  transition: all 200ms ease;
}

.progress-dot.answered {
  background: var(--color-accent);
}

.progress-dot.current {
  background: var(--color-ink);
  transform: scale(1.3);
  box-shadow: 0 0 0 3px var(--color-surface), 0 0 0 5px var(--color-ink);
}

/* Timer (optional, subtle) */
.timer {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-ink-muted);
  text-align: right;
  margin-bottom: 1rem;
}

.timer.warning {
  color: var(--color-del);
}

/* Navigation buttons */
.nav-button {
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  color: var(--color-ink);
  cursor: pointer;
  transition: all 200ms ease;
}

.nav-button:hover:not(:disabled) {
  border-color: var(--color-ink);
  background: var(--color-surface-alt);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-button.primary {
  background: var(--color-ink);
  color: var(--color-surface);
  border-color: var(--color-ink);
}

.nav-button.primary:hover {
  background: var(--color-ink-muted);
}
```

### Motion & Transitions

```css
/* All transitions must be calm, purposeful */

/* Question fade in */
@keyframes question-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.question-card {
  animation: question-in 300ms ease-out;
}

/* Answer reveal */
@keyframes answer-reveal {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 400px;
    opacity: 1;
  }
}

.answer-revealed {
  animation: answer-reveal 300ms ease-out;
}

/* Selection highlight */
.option {
  transition: border-color 200ms ease, background-color 200ms ease;
}

/* Results appear */
@keyframes results-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.results-view {
  animation: results-in 400ms ease;
}

/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Dark & Sepia Theme Support

Examine inherits all theme switching from xMargin's AppShell. No special theme logic needed — just use `var(--color-*)` tokens.

---

## VII. User Flows

### Flow 1: Fresh Exam Session

```
1. User lands on /examine
   → Load question set (JSON)

2. Setup screen appears
   → Choose range (all, preset, custom)
   → Choose mode (read, reflect, examine)
   → Click "Begin"

3. Mode-specific experience
   → Read: scrolls through all Q&A
   → Reflect: flips through cards
   → Examine: answers linearly, sees results at end

4. Results screen
   → See breakdown, explanations
   → Option to retake, load new set, or revisit flagged questions
```

### Flow 2: Interrupted Session (Refresh)

```
1. User on Q 12 of 25 in Examine mode
   → Accidentally closes tab or refreshes

2. Returns to xmargin, navigates back to /examine
   → "Resume?" prompt appears
   → "Continue from Q 12" or "Start fresh"

3a. If "Continue"
    → Q 12 reappears in context
    → Can complete remaining questions
    → Results show all answers (including pre-refresh)

3b. If "Start fresh"
    → Session cleared
    → Setup screen appears again
```

### Flow 3: Study Multiple Ranges

```
1. User completes Q1–25
   → Sees results

2. Clicks "Load new set"
   → Back to setup
   → Selects Q26–50
   → Begins new session

3. Later, can retake Q1–25
   → Old session data still there
   → Can compare results over time
```

---

## VIII. Data Collection & Privacy

### What Is Persisted
- Question selections (which answer you chose)
- Timestamps (when you answered)
- Session metadata (which questions, which mode)
- NO tracking of time spent per question
- NO analytics of struggle patterns
- NO server-side data collection

### Storage Location
- All data in browser localStorage
- No cloud sync
- User can clear at any time
- Sessions expire after 90 days

### Compliance
- GDPR-friendly (no data sent to servers)
- No cookies (except session ID for localStorage)
- No third-party trackers
- User owns their own data

---

## IX. Accessibility

### WCAG 2.1 Level AA Compliance

1. **Keyboard Navigation**
   - Tab through options
   - Space/Enter to select
   - Arrow keys to move between questions (optional)
   - Escape to close panels

2. **Screen Reader Support**
   - Semantic HTML (`<fieldset>`, `<legend>`, `<label>`)
   - ARIA labels on interactive elements
   - Question and answer text read naturally
   - Results announced clearly

3. **Color Independence**
   - Don't rely on color alone to indicate correct/incorrect
   - Use checkmarks, X marks, or text labels
   - Color is enhancement, not the only signal

4. **Motion**
   - Respect `prefers-reduced-motion`
   - Reduce animation duration to ~1ms when reduced motion preferred

5. **Text & Font**
   - Contrast ratio 4.5:1 for normal text
   - Contrast ratio 3:1 for large text
   - Resizable text up to 200%
   - No justified text (use left-align)

---

## X. Implementation Roadmap

### Phase 1: MVP (2 weeks)
- [ ] State management (examine.svelte.ts)
- [ ] Examine mode (linear test)
- [ ] Basic results view
- [ ] localStorage persistence
- [ ] Range selection
- [ ] Styling using xMargin's tokens

### Phase 2: Complete Experience (1 week)
- [ ] Read mode (browse all)
- [ ] Reflect mode (card flip)
- [ ] Resume prompt
- [ ] Full results breakdown with explanations
- [ ] Dark/sepia theme support

### Phase 3: Polish (1 week)
- [ ] Animations and transitions
- [ ] Accessibility audit (WCAG AA)
- [ ] Mobile responsiveness
- [ ] Keyboard navigation
- [ ] Error handling & edge cases

### Phase 4: Future Enhancements
- [ ] Category-based filtering ("Study only Bedrock questions")
- [ ] Spaced repetition scheduler
- [ ] Study session analytics (per-user, not server-side)
- [ ] Export results as PDF
- [ ] Share question sets with others
- [ ] Question difficulty ratings (crowd-sourced)

---

## XI. Example Question Set (Sample JSON)

See `EXAMINE_SAMPLE.json` in this directory for a complete, valid question set with all three question types.

---

## XII. Component API Reference

### ExamineShell Component

```svelte
<ExamineShell
  questions={questions}
  on:complete={handleResults}
  on:abandon={handleAbandon}
/>
```

### Props
- `questions: Question[]` — Array of question objects
- Events: `complete`, `abandon`

---

## XIII. Migration Path from xmprep

For existing xmprep users:

1. **Question format** — Minor adjustments needed to xmprep JSON
   - Add `metadata` section
   - Convert `questions` array to new structure
   - Map `type` field correctly
   
2. **Data loss** — xmprep sessions won't transfer
   - But examine design makes this less critical (no scores to lose)
   - Encourages fresh start mindset

3. **Feature mapping**
   - xmprep "practice" mode → examine "reflect" mode
   - xmprep "exam" mode → examine "examine" mode
   - New: "read" mode (xmprep didn't have this)

---

## XIV. Success Metrics

### Qualitative
- Users feel the interface "disappears"
- Results feel honest, not judgmental
- Users want to revisit questions for learning, not score improvement
- Aesthetic feels timeless, not trendy

### Quantitative (Browser-side only)
- Average session duration
- Completion rate (% who finish a full range)
- Repeat usage (users returning to the same sets)
- Range selection patterns (do users ever do all 100+?)

---

## XV. Similar Products & Inspiration

- **Readwise Reader** — Respects user attention, no gamification
- **Anki** — Spaced repetition without pressure
- **Bear App** — Beautiful, calm reading experience
- **iA Writer** — Typography-first design
- **Kindle** — Distraction-free reading on a device

Examine takes the best from these — calm, focused, honest, beautiful — and applies it to knowledge assessment.

---

## XVI. Design Principles (Reiterated)

1. **Calm over excitement** — No notifications, no streaks, no pressure
2. **Honesty over flattery** — Show what you know and don't know clearly
3. **Typography over chrome** — Beautiful questions and answers matter most
4. **Space over clutter** — Breathing room for thinking
5. **Reading over scoring** — The experience should feel like studying, not testing
6. **Privacy over tracking** — No server-side data collection
7. **Timeless over trendy** — Should look good in 5 years

---

## XVII. Final Vision

**Examine** is xMargin's answer to a simple question:

> *What if learning felt like stepping into a quiet library, not taking a test in a stressful classroom?*

It transforms question sets from "things to get right" into "knowledge to understand." The interface disappears. Typography guides your eye. Spacing lets you breathe. Results are honest, never judgmental. And when you're done, you know yourself better.

That is examine.
