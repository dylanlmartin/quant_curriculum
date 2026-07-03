# Alpha Lifecycle & Research Infrastructure — Curriculum Tracker

An interactive, self-contained webpage for working through a ~12-month self-study
curriculum in **signal evaluation and quant research systems**. It tracks your
progress, links every reading and resource, and gives you a place to collect the
outputs you produce along the way (Google Docs and GitHub repos).

## Features

- **Tri-state progress tracking** — each item cycles *not started → in progress
  → done*, so multi-week readings show momentum instead of sitting unchecked
  for a month. An overall completion ring plus per-phase progress bars update
  live. Progress is saved in your browser (`localStorage`), so it persists
  across visits on the same device.
- **Pacing** — set your start date and the page computes which plan month you're
  in, badges the phase(s) you should be working (`now`), and marks checkpoints
  as behind you or up next. Ahead/behind is visible at a glance.
- **Resume where you left off** — an "Up next" link in the header jumps straight
  to your first unfinished item.
- **Habit counters** — countable deliverables (design-review log entries, DDIA
  chapter notes, annotated papers) have +/− counters with targets, so weekly
  habits earn visible credit before the deliverable is done.
- **Collapsible phases** — completed phases fold away automatically; any phase
  can be collapsed from its header to keep focus on current work.
- **All materials linked** — books, papers, course pages, and reference
  architectures are one click away from each item.
- **Output collection** — every deliverable and capstone stage has an *Outputs*
  panel. Paste a Google Doc or GitHub URL to record where the work lives; the
  link is auto-tagged as **Doc**, **Repo**, or **Link**. Quick **＋ New Doc**
  (opens `docs.new`) and **＋ New Repo** (opens `github.com/new`) buttons let you
  spin one up and paste the URL straight back.
- **Cross-device sync** — sync progress between devices through a *private
  GitHub gist* (no backend required). See below.
- **Export / import** — download your progress as JSON to back it up or move it
  to another device, and import it anywhere.
- **Checkpoints timeline** and an **explicitly-cut** list to keep scope honest.

## Cross-device sync

Progress is stored per-browser by default. To sync across devices, the tracker
can mirror your state to a **private GitHub gist** — the site is fully static,
so it talks to the GitHub REST API directly from the browser (which supports
CORS) and needs no server of its own.

Setup (once per device):

1. Click **Sync** in the bottom toolbar.
2. Create a GitHub personal-access token with **only the `gist` scope** (the
   modal links straight to the token page with the scope preselected).
3. Paste the token and click **Connect & sync**. On the first device this
   creates a private gist and shows its **Gist ID**.
4. On another device, open the page, click **Sync**, paste the same token and
   that **Gist ID**, then **Connect & sync**.

Behavior:

- **Last-write-wins** by timestamp — on load and on connect the tracker pulls,
  adopting the remote if it's newer and pushing local if it's newer.
- **Auto-sync** pushes local changes (debounced) while connected; toggle it off
  in the modal if you prefer manual **Sync now**.
- The token lives only in that browser's `localStorage`. Use a `gist`-scoped
  token and don't connect on a shared computer. **Disconnect this device**
  clears it locally without touching your progress.

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
| `assets/sync.js` | Optional cross-device sync via a private GitHub gist |
| `assets/styles.css` | Styling |
