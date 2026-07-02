# Alpha Lifecycle Infrastructure — Curriculum Tracker

An interactive, self-hosted tracker for a 12-month self-study program on **quantitative
signal evaluation** and the **research infrastructure** behind it — probability foundations
through a hands-on backtest-evaluation capstone.

**[▶ Open the tracker](https://dylanlmartin.github.io/quant_curriculum/)** *(once GitHub Pages is enabled — see below)*

## What it does

- **Tracks progress** — check off every book, paper, habit, capstone stage, deliverable,
  and milestone. A live progress ring and per-phase bars show where you are.
- **Links every resource** — each item carries direct links to the book, course page, paper,
  or repo it refers to.
- **Collects your outputs** — attach the Google Docs and GitHub repos you produce to the
  task they belong to. Buttons open a blank Google Doc (`docs.new`) or the new-repository
  page; paste the URL back and it's saved. Any link works (PDFs, notebooks); the type is
  detected automatically.

Everything is a single dependency-free `index.html`. Progress lives in your browser's
`localStorage` — nothing is uploaded anywhere. Use **Export** to back up or move your
progress to another device, and **Import** to restore it.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The interactive tracker (open in any browser). |
| `curriculum.md` | The full curriculum as readable Markdown. |

## Run it locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publish with GitHub Pages

1. **Settings → Pages** in this repository.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*.
3. Choose the branch (e.g. `main`) and the `/ (root)` folder, then **Save**.
4. After a minute the tracker is live at `https://<user>.github.io/quant_curriculum/`.

## The one-line test

> Does this help me correctly reject a bad signal or a bad system design? If not, cut it.
