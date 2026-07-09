# LSAT Daily

A phone-friendly daily LSAT practice app that stores your progress in **your own GitHub repo**, so it syncs across every device.

**Your goal (from day one):** LSAT **170+**, daily practice, **mixed** Logical Reasoning + Reading Comprehension (LR-heavy — Logic Games was dropped in Aug 2024), pitched at **difficulty 4–5**. Every question comes with a full explanation, **why each wrong answer is a trap**, and a takeaway to fix the underlying habit. You write your reasoning *before* revealing — that's how you catch the process slips that cost points at the 170 level.

---

## What's here

```
index.html              The app (self-contained: HTML + CSS + JS)
manifest.webmanifest    Makes it installable to your home screen
sw.js                   Offline cache for the app + question bank
questions/lr.json       Logical Reasoning question bank
questions/rc.json       Reading Comprehension passages + questions
progress/progress.json  Your progress (the app writes here via the GitHub API)
```

---

## One-time setup (about 5 minutes)

### 1. Put this on GitHub
Create a **public** repo (e.g. `lsat-daily`) and push these files:

```bash
cd lsat-daily
git add -A
git commit -m "LSAT Daily: initial app + question bank"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/lsat-daily.git
git push -u origin main
```

### 2. Turn on GitHub Pages
Repo → **Settings → Pages** → *Build and deployment* → Source: **Deploy from a branch**, Branch: **main**, folder **/(root)** → Save.
After a minute your app is live at:
`https://<YOUR_USERNAME>.github.io/lsat-daily/`

Open that on your phone and **Add to Home Screen** (Share menu on iOS) so it behaves like an app.

### 3. Create a token so the app can save progress
GitHub → **Settings → Developer settings → Fine-grained personal access tokens → Generate new token**:
- **Repository access:** *Only select repositories* → pick `lsat-daily` (this repo only).
- **Permissions:** *Repository permissions → Contents → **Read and write***. Nothing else.
- Generate, copy the `github_pat_…` value.

Open the app, enter your **username**, **repo name**, and paste the **token**. Done — every session now saves to `progress/progress.json`.

> **Security note:** the token lives only in your phone browser's local storage and is scoped to this one repo with only Contents access. If your phone is lost, revoke it on GitHub and generate a new one. Because the repo is public, don't put anything private in it — it holds only LSAT questions and your score history.

---

## The daily routine

1. Open the app, pick a **focus** (Mixed / LR / RC / Target my weak areas / Review my mistakes), set length, **Start practice**.
2. For each question: choose an answer, **write your reasoning**, then reveal.
3. Read the explanation, the trap analysis, and the takeaway.
4. At the end it auto-saves to GitHub.

Aim for one session a day. The streak counter is there to protect the habit.

## Analytical tools on the dashboard

- **Streak / accuracy / answered today / overall** — habit + headline numbers.
- **Accuracy by question type** (weakest first) — where you're losing points.
- **Progress trend** — a rolling-accuracy line chart, a rough **estimated score band**, and **pace** stats (average time per question and % answered within the ~90s target). Score band appears once you've answered 15+.
- **Trap profile** — categorizes *what kind* of wrong answer pulls you (overly strong wording, out of scope, reversed logic, half-right, real-flaw-wrong-argument, backwards effect, premise-not-conclusion), with a fix for each. This is the strategic core: it tells you the *thinking habit* to correct, not just the topic.
- **Review my mistakes** — a focus mode that re-serves only questions you last got wrong (oldest first), so misses convert into knowledge.
- **Per-question timer** — every question is timed; the time is stored so pace analysis and the "speed after accuracy" phase work.

---

## Keep it adaptive with Claude

The app practices from a fixed bank; Claude keeps the bank growing and tuned to *your* weak spots. Any time, tell Claude:

> "Look at `progress/progress.json` in my lsat-daily repo. Which question types am I weakest on? Add 6 new difficulty-5 questions targeting those to `questions/lr.json` (and an RC passage if RC is weak), following the existing schema, then commit."

That closes the loop from your first chat: practice → progress → adaptive new questions aimed at getting you to 170+.

### Question schema (for adding questions)

**LR** — an object in `questions/lr.json`:
```json
{
  "id": "lr-0013",
  "section": "LR",
  "type": "Weaken",
  "difficulty": 5,
  "stimulus": "The argument text.",
  "prompt": "The question stem.",
  "choices": { "A": "...", "B": "...", "C": "...", "D": "...", "E": "..." },
  "answer": "C",
  "explanation": "Why the correct answer is right.",
  "traps": { "A": "why A is wrong", "B": "...", "D": "...", "E": "..." },
  "trapTags": { "A": "too-strong", "B": "out-of-scope", "D": "reversed", "E": "half-right" },
  "takeaway": "The transferable lesson / method.",
  "tags": ["weaken", "causal"]
}
```

`trapTags` powers the trap profile. Each wrong choice gets one of:
`too-strong`, `out-of-scope`, `reversed`, `half-right`, `real-but-elsewhere`, `opposite`, `premise-restate`.

**RC** — an object in `questions/rc.json` (one passage, several questions):
```json
{
  "id": "rc-p3",
  "section": "RC",
  "difficulty": 4,
  "title": "Short passage title",
  "passage": "The full passage text.",
  "questions": [
    {
      "id": "rc-p3-q1",
      "type": "Main Point",
      "prompt": "The question stem.",
      "choices": { "A": "...", "B": "...", "C": "...", "D": "...", "E": "..." },
      "answer": "B",
      "explanation": "...",
      "traps": { "A": "...", "C": "...", "D": "...", "E": "..." },
      "takeaway": "..."
    }
  ]
}
```

Rules: unique `id`s; `answer` is a key in `choices`; `traps` covers every wrong choice; keep difficulty at 4–5.

---

## Study principles baked in (toward 170+)

- **Always write reasoning first.** You can't fix a slip you can't see.
- **Necessary Assumption → negation test.** Negate a choice; if the argument is *destroyed* (not just weakened), it's required. Negate logically, not dramatically ("not accurately" = "slightly off," not "wildly wrong"). Use it to break your final two.
- **Flaw → absence of evidence ≠ evidence of absence**, and beware answers that inflate a narrow claim into a universal one, or name a real flaw the argument doesn't actually commit.
- **Accuracy before speed.** Lock the method; add timing once you're consistently right.
