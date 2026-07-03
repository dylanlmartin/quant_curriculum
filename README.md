# Quant Research & Trading Curriculum

An interactive, self-paced curriculum for learning quantitative research and
trading — from mathematical foundations through capstone projects. The page
tracks your progress, links the materials for every topic, and gives you one
place to collect your outputs as Google Docs and GitHub repos.

**[▶ Open the tracker](https://dylanlmartin.github.io/quant_curriculum/)**
_(available once GitHub Pages is enabled — see below)_

## What it does

- **Progress tracking** — check off topics as you finish them. Module, phase,
  and overall completion update live, and everything is saved in your browser.
- **Linked materials** — each module lists vetted books, courses, docs, and
  papers, one click away.
- **Output collection** — create a fresh Google Doc or GitHub repo for a
  deliverable in one click, paste the link back, and every doc and repo you
  produce gathers into a single "Collected outputs" view.
- **Portable** — Export your progress to JSON and Import it on another device.

There is no backend and no tracking. Your progress and links live only in your
browser's `localStorage`; the Export button is how you back them up.

## The curriculum

Eight phases, each with focused modules, a topic checklist, materials, and a
concrete deliverable:

1. **Mathematical Foundations** — linear algebra, calculus & optimization, probability, statistics
2. **Programming & Data Engineering** — Python for data, software engineering, data & SQL
3. **Financial Markets & Instruments** — markets & instruments, market microstructure
4. **Quantitative Methods** — time series analysis, stochastic processes
5. **Machine Learning for Finance** — ML foundations, financial ML, NLP & alternative data
6. **Portfolio Construction & Risk** — portfolio theory & factor models, risk management
7. **Strategy, Backtesting & Execution** — backtesting, execution
8. **Capstone Projects** — situation monitor, research backtester, factor study

The **Situation Monitor** capstone pairs with the companion
[`situation_monitor`](https://github.com/dylanlmartin/situation_monitor)
repository.

## Editing the curriculum

Everything on the page is generated from one file: **`assets/curriculum.js`**.
Add, remove, or reorder phases, modules, topics, and resources there and the UI
adapts automatically. Keep each `id` stable — saved progress is keyed to it, so
renaming an id resets that item's saved state.

## Running it

It's a static site — no build step.

```bash
# from the repo root
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` directly in a browser.

## Deploying to GitHub Pages

A workflow at `.github/workflows/pages.yml` publishes the site on every push to
`main`. To turn it on: repository **Settings → Pages → Build and deployment →
Source: GitHub Actions**. The site then serves at
`https://dylanlmartin.github.io/quant_curriculum/`.

## Layout

```
index.html              # page shell
assets/curriculum.js    # the curriculum data — edit this
assets/app.js           # tracker logic (progress, outputs, export/import)
assets/styles.css       # styling (light + dark, follows your OS)
.github/workflows/      # GitHub Pages deploy
```
