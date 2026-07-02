# Curriculum: Alpha Lifecycle Infrastructure

**Assumptions:** ~12-month full-time study window, 20–25 hrs/week. Adjust phase lengths proportionally if the window is shorter.

**The one-line test for everything here:** Does this help me correctly reject a bad signal or a bad system design? If not, cut it.

**Weekly time allocation (steady state):**
- 8–10 hrs: primary track study (textbook + problem sets)
- 6–8 hrs: capstone build
- 3–4 hrs: design-doc review habit + papers
- 2–3 hrs: management/org reading

---

## Phase 1 — Foundations (Months 1–3)

### Track A: Probability & Statistics (primary, ~10 hrs/week)

1. **Blitzstein & Hwang, *Introduction to Probability*** — free book + Harvard Stat 110 lectures and problem sets: [probabilitybook.net](https://probabilitybook.net) | [Stat 110 course page (lectures, psets, solutions)](https://projects.iq.harvard.edu/stat110)
   - Full coverage, Chs. 1–13. Do the problem sets — that is the course.
   - Target pace: ~1.5 chapters/week → done by end of Month 2.
2. **Wasserman, *All of Statistics*** — [Springer](https://link.springer.com/book/10.1007/978-0-387-21736-9)
   - Part I & II (Chs. 1–12). Month 3. Skim what overlaps with Blitzstein; slow down on inference, likelihood, multiple testing foundations.
   - Deliberately deep on: hypothesis testing mechanics, p-value pathologies, bootstrap/resampling. These are the statistical spine of backtest evaluation.

**Skip/skim:** measure theory, Bayesian computation beyond basics, causal inference chapters.

### Track B: Engineering Management (light, ~2–3 hrs/week)

3. **Larson, *An Elegant Puzzle*** — [lethain.com/elegant-puzzle](https://lethain.com/elegant-puzzle/) — Month 1. Focus: platform teams, team sizing, managing teams whose customers are internal researchers.
4. **Forsgren et al., *Accelerate*** — [IT Revolution](https://itrevolution.com/product/accelerate/) — Month 2. Extract the four key metrics (deployment frequency, lead time, change failure rate, MTTR) and the capability model. This is your evidence base for judging team health and arbitrating "we need six months to refactor" claims.
5. **Kleppmann, *Designing Data-Intensive Applications*** — [dataintensive.net](https://dataintensive.net) — start Month 2, ~1 chapter/week, runs into Phase 2.
   - For every chapter: write one paragraph mapping the concept to a production system you've worked with or studied. That mapping exercise is the actual learning.
   - Priority chapters: 1–5 (foundations, storage, encoding), 7 (transactions), 10–11 (batch/stream — directly relevant to signal pipelines), 12 (future of data systems).

### Standing habit (starts Month 2, continues throughout): Design-doc reviews, 1/week

- Read one real architecture writeup per week. Before reading conclusions/outcomes, write down: what would I challenge? What breaks at 10x? Where's the single point of failure? What's the migration path?
- Source list to start:
  - **Man Group ArcticDB** — the best public example of quant research infrastructure reasoning: [arcticdb.io](https://arcticdb.io/) | [GitHub](https://github.com/man-group/ArcticDB) | [docs](https://docs.arcticdb.io/)
  - **Uber Michelangelo** — [uber.com/blog/michelangelo-machine-learning-platform](https://www.uber.com/blog/michelangelo-machine-learning-platform/)
  - **Airbnb Chronon** — [core concepts post](https://medium.com/airbnb-engineering/chronon-a-declarative-feature-engineering-framework-b7b8ce796e04) | [open-source announcement](https://medium.com/airbnb-engineering/chronon-airbnbs-ml-feature-platform-is-now-open-source-d9c4dba859e8) | [project page](https://airbnb.tech/opensource/chronon/)
  - **Feature store landscape** — [featurestore.org](https://www.featurestore.org/) (catalog of company implementations) | [Databricks explainer](https://www.databricks.com/blog/what-is-a-feature-store)
  - Architecture Decision Record (ADR) examples — [github.com/joelparkerhenderson/architecture-decision-record](https://github.com/joelparkerhenderson/architecture-decision-record)
- Keep a running log: one page per doc — what I challenged, what the authors actually did, what I missed.

### Phase 1 deliverables
- Stat 110 problem sets complete
- DDIA mapping notes (one paragraph per chapter)
- Design-review log started (4+ entries)

---

## Phase 2 — Alpha Evaluation Core (Months 3–6)

This is the highest-leverage phase. Evaluation credibility rests here.

### Track A: Signal & Backtest Evaluation (primary, ~10 hrs/week)

6. **Grinold & Kahn, *Active Portfolio Management*** (2nd ed., McGraw-Hill — print/ebook only, no legitimate free version)
   - The framework text. Priority: Chs. 1–6 (fundamental law, IR, IC, breadth), 10–12 (forecasting, information analysis), 14–17 (portfolio construction, implementation, transaction costs), 19–20 (performance analysis).
   - Month 3–4. This vocabulary (IR, IC, breadth, transfer coefficient) is the language of alpha approval meetings.
7. **Paleologo, *Advanced Portfolio Management*** (Wiley) — Month 4. Fast read: factor risk models, sizing, what PMs get wrong.
8. **Paleologo, *The Elements of Quantitative Investing*** (Wiley) — Month 5. Deeper treatment; slow down on risk model construction and alpha combination.
9. **Core papers (Months 4–6, ~2/week, annotate each):**
   - Bailey & López de Prado — ["The Deflated Sharpe Ratio"](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2460551)
   - Bailey, Borwein, López de Prado, Zhu — ["The Probability of Backtest Overfitting"](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2326253)
   - Bailey, Borwein, López de Prado, Zhu — ["Pseudo-Mathematics and Financial Charlatanism"](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2308659) (short, readable — good first entry point)
   - Bailey & López de Prado — ["The Sharpe Ratio Efficient Frontier"](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1821643)
   - Harvey, Liu & Zhu — ["...and the Cross-Section of Expected Returns"](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2249314)
   - Harvey & Liu — ["Backtesting"](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2345489)
   - Arnott, Harvey, Markowitz — ["A Backtesting Protocol in the Era of Machine Learning"](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3275654) | [published PDF](https://people.duke.edu/~charvey/Research/Published_Papers/P138_A_backtesting_protocol.pdf)
   - Almgren & Chriss — ["Optimal Execution of Portfolio Transactions"](https://www.smallake.kr/wp-content/uploads/2016/03/optliq.pdf) (Journal of Risk, 2001)
   - Frazzini, Israel, Moskowitz — ["Trading Costs"](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3229719) and ["Trading Costs of Asset Pricing Anomalies"](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2294498)
   - Novy-Marx & Velikov — ["A Taxonomy of Anomalies and Their Trading Costs"](https://www.semanticscholar.org/paper/A-Taxonomy-of-Anomalies-and-Their-Trading-Costs-Novy-Marx-Velikov/e4e55002cc2adb8a902f76e070c4563ebe105d63)
10. **López de Prado, *Advances in Financial Machine Learning*** (Wiley) — Month 5–6.
    - Priority: Chs. 7–9 (cross-validation, purging/embargo), 10–14 (backtesting, backtest statistics, strategy risk).
    - Read critically: the book has known issues with overfitting to its own methods. Also read Paleologo's and practitioners' critiques. Knowing where AFML is wrong is itself credibility.
11. **Ruppert & Matteson, *Statistics and Data Analysis for Financial Engineering*** — [Springer](https://link.springer.com/book/10.1007/978-1-4939-2614-5) — selective, Months 5–6. Priority: returns/time series chapters, GARCH, factor models. Skip fixed income and copula depth.

### Track B: Research Platform Architecture (~4–5 hrs/week)

- Finish DDIA (Month 4).
- Applied layer — build a written mental model (2–3 pages each) of:
  - **Point-in-time correctness:** bitemporal data, avoiding lookahead in the data layer. Read [ArcticDB's versioning design](https://docs.arcticdb.io/) and survey bitemporal database literature.
  - **Feature stores:** [Michelangelo](https://www.uber.com/blog/michelangelo-machine-learning-platform/), [Chronon](https://medium.com/airbnb-engineering/chronon-a-declarative-feature-engineering-framework-b7b8ce796e04). What problems they solve, what they cost.
  - **Backtest engine design:** event-driven vs. vectorized — what each hides. Read [Zipline](https://github.com/quantopian/zipline) and [vectorbt](https://github.com/polakowo/vectorbt) architecture docs and their known criticisms.
  - **Reproducibility & lineage:** can any backtest be rerun bit-identically a year later? Data versioning concepts: [DVC](https://dvc.org) | [lakeFS](https://lakefs.io). Code/config pinning.
  - **Sim-to-live reconciliation:** slippage attribution, paper-vs-live divergence. Thinner public literature — Almgren-Chriss plus practitioner posts; flag as an area to learn in practice.

### Phase 2 deliverables
- Annotated paper library (the core papers, one-page notes each)
- Five architecture mental-model docs (point-in-time, feature store, backtest engine, reproducibility, sim-to-live)
- Design-review log at 12+ entries

---

## Phase 3 — Capstone Build (Months 4–10, overlapping)

**Goal:** Personally feel every pain point your engineers will describe, and build the evaluation harness that is the core of the discipline.

**Guardrail:** public data only, paper trading only, nothing published, no capital deployed. Confirm compliance with any agreements you're bound by before starting.

### Stage 1 — Deliberately naive build (Months 4–5)
- Pipeline: earnings call transcripts (public) → LLM feature extraction → signal construction → simple loop-based backtester.
- Flat files, no database, no framework. Let it be ugly.
- Scale it: more tickers, more history, more signals — until it breaks or becomes unbearable. **Write down each breaking point.** This is the pressure your engineers will describe; you'll have felt it.

### Stage 2 — The refactor (Months 6–7)
- Fix only what broke: introduce a point-in-time data layer, a feature store pattern, an event-driven or properly vectorized backtest engine — driven by experienced necessity, not tutorial cargo-culting.
- Keep an ADR log ([format examples](https://github.com/joelparkerhenderson/architecture-decision-record)): every architecture decision, alternatives considered, why. This doubles as design-review practice from the author's side.

### Stage 3 — The evaluation harness (Months 7–9)
This is the deliverable that maps directly to the evaluation discipline:
- Walk-forward validation with purging and embargo
- Deflated Sharpe ratio and PBO computation
- Transaction cost model + capacity curve (PnL vs. AUM deployed)
- Turnover and signal decay analysis
- Multiple-testing tracking: log every variant tried, haircut accordingly

### Stage 4 — Red team yourself (Months 9–10)
- Deliberately construct an overfit signal (in-sample mining, lookahead leak, survivorship bias — one of each).
- Confirm the harness catches all three. If it doesn't, fix the harness.
- Write a one-page "how to spot a fraudulent backtest" memo in your own words. This memo is the distilled skill of alpha evaluation.

---

## Phase 4 — Synthesis (Months 10–12)

- **Mock design reviews:** take 3–4 of your logged design docs and your own capstone ADRs; write the review you'd give as the responsible decision-maker. Compare against outcomes.
- **Approval workflow design exercise:** draft the alpha approval process you'd want to run — stages, evidence required at each gate, kill criteria, escalation paths. You'll revise it completely in practice, but arriving with a considered strawman beats arriving blank.
- **Gap list:** write down what you still can't evaluate confidently. These become an early learning agenda and the questions to investigate further — asked from a position of demonstrated preparation, not ignorance.
- Reread Grinold & Kahn Chs. 1–6. It will read differently after the capstone.

---

## Explicitly cut (resist the temptation)

- LeetCode / algorithm grinding
- Professional-level coding, C++, systems programming
- Low-latency / HFT infrastructure
- Kubernetes-level infrastructure operations
- Derivatives math, stochastic calculus
- General ML breadth beyond what the capstone requires (skim ISLR only if a specific gap appears)

The failure mode isn't insufficient depth — it's pretending to more depth than you have. The curriculum builds evaluation judgment plus firsthand respect for the builders' craft. That combination, not coding ability, is what earns the room.

---

## Progress checkpoints

| Month | Checkpoint |
|-------|-----------|
| 2 | Stat 110 problem sets done; Larson + Accelerate read; design-review habit running |
| 4 | DDIA finished with mapping notes; Grinold & Kahn core chapters done; naive capstone breaking |
| 6 | Paper library annotated; refactor underway with ADR log; Paleologo x2 done |
| 9 | Evaluation harness complete; AFML critical read done |
| 10 | Red-team exercise passed; fraud-detection memo written |
| 12 | Mock reviews + approval-workflow strawman + gap list complete |
