---
name: notes-generator
description: >
  Use this skill whenever the user wants notes, wants to study a topic, says "notes banao",
  "notes chahiye", "padha do", "notes de do", "explain in notes", "ek notes bana",
  "summarize karo notes mein", or provides a syllabus/topic list and wants structured notes.
  Also trigger when user says "notes" in any form — even partial like "short notes",
  "in-depth notes", "quick notes". Always use this skill for note generation tasks.
---

# Notes Generator Skill

## Purpose
Generate structured, Hinglish notes using **first principles thinking** — always explain WHY something exists before WHAT it is.

The notes are written in Hinglish (Hindi sentence structure + English/tech jargon preserved).
These instructions are in English. The generated notes output must be in Hinglish.

---

## Step 1 — Collect Input

If the user hasn't already provided a topic or syllabus, ask:
> "Kaunsa topic ya syllabus cover karna hai? Paste kar do."

Wait for the input before proceeding.

---

## Step 2 — Ask Notes Type

Once topic is received, present these options:

> "Kaisa notes chahiye?"
> - **Short** — Top pointers to remember + first principles understanding. No fluff.
> - **Shallow** — First principles: problem → concept → how it works (high level). No code.
> - **In-Depth** — Full first principles: problem → internals → code → gotchas → real-world use.

Wait for selection before generating.

---

## Step 2.5 — Ask Artifact Split Preference

After mode is selected, ask:

> "Notes ko kitne artifacts mein chahiye?"
> - **Single** — Sab topics ek hi artifact mein (short/shallow ke liye theek hai)
> - **Topic-wise** — Har topic ka alag artifact (in-depth ke liye recommended — bada ho jaata hai warna)

**Default recommendation logic (suggest but let user decide):**
- Short or Shallow + any number of topics → suggest Single
- In-Depth + 3+ topics → strongly suggest Topic-wise
- In-Depth + 1-2 topics → either works, suggest Single

If user selects Topic-wise → generate one artifact per topic, sequentially. Wait for user to say "next" before generating the next topic's artifact.
If user selects Single → generate everything in one artifact.

Wait for confirmation before generating.

---

## Step 3 — Generate Notes as .md Artifact

Always output as a **Markdown artifact**. Never output notes as plain chat text.

---

### Language Rules (apply to all modes)
- Hinglish: Hindi sentence flow + English tech terms intact
- ✅ "Ye ek retrieval mechanism hai jo relevant chunks fetch karta hai vector DB se"
- ❌ Full English: "This is a retrieval mechanism that fetches chunks"
- ❌ Full Hindi: "यह एक पुनर्प्राप्ति तंत्र है"
- Tech jargons stay as-is: embedding, chunking, agent loop, token, context window, etc.
- Bold **key terms** on first use

### Format Rules (apply to all modes)
- `##` and `###` for section headings
- Bullet points for lists and key ideas
- Tables for comparisons, tradeoffs, tool options
- Code blocks (```js or ```python) — In-Depth mode only
- ASCII/text diagrams where a visual would help understanding — In-Depth and Shallow modes

---

### SHORT MODE

**Goal:** Fastest possible revision. No explanations — only what to remember.

Structure per concept:
1. **First Principle in 1 line** — WHY does this exist? (the core problem it solves)
2. **What it is** — 1-line definition
3. **Top 3-5 bullets to remember**

No analogies. No code. No deep explanation.
End with a horizontal rule `---` between each concept.

---

### SHALLOW MODE

**Goal:** First-time understanding using first principles. Build mental model, not mastery.

Structure per concept:
1. **The Problem** — What problem existed before this concept? Why was it needed?
2. **The Concept** — What is it, in simple terms?
3. **How it works** — High-level flow (step by step, no internals)
4. **Real-world analogy** — 1 analogy to make it stick (optional if not helpful)
5. **Why it matters** — 1-2 lines on its practical value

No code. Text diagrams allowed where helpful.
Summary comparison table at the end if multiple concepts are covered.

---

### IN-DEPTH MODE

**Goal:** Full mastery using first principles. Internals, code, gotchas — everything.

Structure per concept:
1. **The Problem** — What gap or pain point does this solve? Why does this exist?
2. **First Principles Explanation** — Build up the concept from scratch, step by step
3. **Internal Working** — How does it actually work under the hood?
4. **Diagram** — ASCII/text diagram if the concept has a flow or architecture
5. **Code Example** — In JavaScript (Node.js) or Python. User's stack: React, Node, SQL, Redis
6. **Gotchas & Common Mistakes** — What trips people up in production?
7. **Agency Use Case** — "Is concept ko client ko kab aur kaise becho?" (real SMB use case)
8. **Cost / Tradeoff Table** — Where relevant (e.g., tool A vs tool B, open-source vs paid)

---

## Step 4 — Close Every Notes Artifact With This

```
---
## 🧠 Quick Revision Questions
1. [Question on core first principle of concept 1]
2. [Question on internal working of concept 2]
3. [Question on a gotcha or tradeoff]
```

Minimum 3 questions, max 5. These should test understanding, not just recall.

---

## Constraints
- Never generate notes without asking mode first (unless user already specified in prompt)
- Always output as `.md` artifact — never plain chat
- Hinglish must be consistent throughout — no switching to full English paragraphs
- First principles framing is non-negotiable in all three modes
- If syllabus has 5+ topics, ask: "Sab ek saath chahiye ya ek-ek topic pe alag notes?"
- In-Depth code examples must use the user's stack: Node.js / JS preferred, Python secondary