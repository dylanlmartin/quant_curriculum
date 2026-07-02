# Alpha Lifecycle & Research Infrastructure — Curriculum Tracker

An interactive, self-contained webpage for working through a ~12-month self-study
curriculum in **signal evaluation and quant research systems**. It tracks your
progress, links every reading and resource, and gives you a place to collect the
outputs you produce along the way (Google Docs and GitHub repos).

## Features

- **Progress tracking** — check off every item; an overall completion ring plus
  per-phase progress bars update live. Progress is saved in your browser
  (`localStorage`), so it persists across visits on the same device.
- **All materials linked** — books, papers, course pages, and reference
  architectures are one click away from each item.
- **Output collection** — every deliverable and capstone stage has an *Outputs*
  panel. Paste a Google Doc or GitHub URL to record where the work lives; the
  link is auto-tagged as **Doc**, **Repo**, or **Link**. Quick **＋ New Doc**
  (opens `docs.new`) and **＋ New Repo** (opens `github.com/new`) buttons let you
  spin one up and paste the URL straight back.
- **Export / import** — download your progress as JSON to back it up or move it
  to another device, and import it anywhere.
- **Checkpoints timeline** and an **explicitly-cut** list to keep scope honest.

## Running it

It's a static site with no build step or dependencies.

- **Locally:** open `index.html` in any modern browser, or serve the folder:
  ```bash
  python3 -m http.server 8000
  # then visit http://localhost:8000
  ```
- **GitHub Pages:** in the repository settings, enable Pages from the branch and
  `/ (root)` folder. The included `.nojekyll` file ensures the `assets/`
  directory is served as-is. The site will be available at
  `https://<user>.github.io/quant_curriculum/`.

## Editing the curriculum

All content lives in [`assets/curriculum.js`](assets/curriculum.js) as a single
data object — phases, sections, items, links, and checkpoints. Add or edit items
there; the page rebuilds itself from that data on load.

> **Note on ids:** each item's `id` is the key used to store its checked state
> and saved output links. Don't rename an existing `id` or that item's saved
> progress will be orphaned.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page shell |
| `assets/curriculum.js` | Curriculum content (the data) |
| `assets/app.js` | Rendering, progress tracking, output collection |
| `assets/styles.css` | Styling |
