// Curriculum data model.
// Every item has a stable `id` used as the localStorage key for progress and
// output links, so ids must never change once shipped.
//
// Item shape:
//   { id, title, html?, links?: [{label, url}], output?: true }
// `output: true` marks a deliverable that collects result links (Google Docs /
// GitHub repos) in the tracker UI.

const CURRICULUM = {
  title: "Alpha Lifecycle & Research Infrastructure",
  subtitle: "A self-study curriculum in signal evaluation and quant research systems",
  meta: {
    assumptions:
      "~12-month study window, 20–25 hrs/week. Adjust phase lengths proportionally if the window is shorter.",
    test:
      "The one-line test for everything here: Does this help me correctly reject a bad signal or a bad system design? If not, cut it.",
    allocation: [
      "8–10 hrs — primary track study (textbook + problem sets)",
      "6–8 hrs — capstone build",
      "3–4 hrs — design-doc review habit + papers",
      "2–3 hrs — management/org reading",
    ],
  },

  phases: [
    {
      id: "p1",
      name: "Phase 1 — Foundations",
      months: "Months 1–3",
      blurb:
        "Build the statistical spine and the systems vocabulary everything later depends on.",
      sections: [
        {
          id: "p1-a",
          name: "Track A — Probability & Statistics",
          note: "Primary, ~10 hrs/week.",
          items: [
            {
              id: "p1-a-blitzstein",
              title: "Blitzstein & Hwang, Introduction to Probability",
              html:
                "Free book + Harvard Stat 110 lectures and problem sets. Full coverage, Chs. 1–13. <strong>Do the problem sets — that is the course.</strong> Target pace ~1.5 chapters/week → done by end of Month 2.",
              links: [
                { label: "probabilitybook.net", url: "https://probabilitybook.net" },
                { label: "Stat 110 course page", url: "https://projects.iq.harvard.edu/stat110" },
              ],
            },
            {
              id: "p1-a-wasserman",
              title: "Wasserman, All of Statistics",
              html:
                "Part I & II (Chs. 1–12), Month 3. Skim what overlaps with Blitzstein; slow down on inference, likelihood, multiple-testing foundations. <strong>Deliberately deep on:</strong> hypothesis-testing mechanics, p-value pathologies, bootstrap/resampling — the statistical spine of backtest evaluation.",
              links: [
                {
                  label: "Springer",
                  url: "https://link.springer.com/book/10.1007/978-0-387-21736-9",
                },
              ],
            },
            {
              id: "p1-a-skip",
              title: "Skip / skim",
              html:
                "Measure theory, Bayesian computation beyond basics, causal-inference chapters.",
            },
          ],
        },
        {
          id: "p1-b",
          name: "Track B — Engineering Management",
          note: "Light, ~2–3 hrs/week.",
          items: [
            {
              id: "p1-b-larson",
              title: "Larson, An Elegant Puzzle",
              html:
                "Month 1. Focus: platform teams, team sizing, managing teams whose customers are internal researchers.",
              links: [{ label: "lethain.com/elegant-puzzle", url: "https://lethain.com/elegant-puzzle/" }],
            },
            {
              id: "p1-b-accelerate",
              title: "Forsgren et al., Accelerate",
              html:
                "Month 2. Extract the four key metrics (deployment frequency, lead time, change failure rate, MTTR) and the capability model — the evidence base for judging team health and arbitrating “we need six months to refactor” claims.",
              links: [{ label: "IT Revolution", url: "https://itrevolution.com/product/accelerate/" }],
            },
            {
              id: "p1-b-ddia",
              title: "Kleppmann, Designing Data-Intensive Applications",
              html:
                "Start Month 2, ~1 chapter/week, runs into Phase 2. For every chapter, write one paragraph mapping the concept to a real production data system you know of or have read about — that mapping exercise is the actual learning. Priority chapters: 1–5 (foundations, storage, encoding), 7 (transactions), 10–11 (batch/stream — directly relevant to signal pipelines), 12 (future of data systems).",
              links: [{ label: "dataintensive.net", url: "https://dataintensive.net" }],
            },
          ],
        },
        {
          id: "p1-c",
          name: "Standing habit — Design-doc reviews, 1/week",
          note: "Starts Month 2, continues throughout.",
          items: [
            {
              id: "p1-c-method",
              title: "The method",
              html:
                "Read one real architecture writeup per week. <strong>Before</strong> reading conclusions/outcomes, write down: what would I challenge? What breaks at 10x? Where's the single point of failure? What's the migration path? Keep a running log — one page per doc: what I challenged, what the authors actually did, what I missed.",
            },
            {
              id: "p1-c-arcticdb",
              title: "Man Group ArcticDB",
              html: "The best public example of quant research infrastructure reasoning.",
              links: [
                { label: "arcticdb.io", url: "https://arcticdb.io/" },
                { label: "GitHub", url: "https://github.com/man-group/ArcticDB" },
                { label: "docs", url: "https://docs.arcticdb.io/" },
              ],
            },
            {
              id: "p1-c-michelangelo",
              title: "Uber Michelangelo",
              links: [
                {
                  label: "uber.com/blog",
                  url: "https://www.uber.com/blog/michelangelo-machine-learning-platform/",
                },
              ],
            },
            {
              id: "p1-c-chronon",
              title: "Airbnb Chronon",
              links: [
                {
                  label: "core concepts",
                  url: "https://medium.com/airbnb-engineering/chronon-a-declarative-feature-engineering-framework-b7b8ce796e04",
                },
                {
                  label: "open-source announcement",
                  url: "https://medium.com/airbnb-engineering/chronon-airbnbs-ml-feature-platform-is-now-open-source-d9c4dba859e8",
                },
                { label: "project page", url: "https://airbnb.tech/opensource/chronon/" },
              ],
            },
            {
              id: "p1-c-featurestore",
              title: "Feature-store landscape",
              links: [
                { label: "featurestore.org", url: "https://www.featurestore.org/" },
                {
                  label: "Databricks explainer",
                  url: "https://www.databricks.com/blog/what-is-a-feature-store",
                },
              ],
            },
            {
              id: "p1-c-adr",
              title: "Architecture Decision Record (ADR) examples",
              links: [
                {
                  label: "joelparkerhenderson/architecture-decision-record",
                  url: "https://github.com/joelparkerhenderson/architecture-decision-record",
                },
              ],
            },
          ],
        },
        {
          id: "p1-d",
          name: "Phase 1 deliverables",
          items: [
            {
              id: "p1-del-stat110",
              title: "Stat 110 problem sets complete",
              output: true,
            },
            {
              id: "p1-del-ddia",
              title: "DDIA mapping notes (one paragraph per chapter)",
              output: true,
            },
            {
              id: "p1-del-log",
              title: "Design-review log started (4+ entries)",
              output: true,
            },
          ],
        },
      ],
    },

    {
      id: "p2",
      name: "Phase 2 — Alpha Evaluation Core",
      months: "Months 3–6",
      blurb:
        "The highest-leverage phase. Everything converges on one skill: separating real signal from overfit noise.",
      sections: [
        {
          id: "p2-a",
          name: "Track A — Signal & Backtest Evaluation",
          note: "Primary, ~10 hrs/week.",
          items: [
            {
              id: "p2-a-gk",
              title: "Grinold & Kahn, Active Portfolio Management (2nd ed.)",
              html:
                "The framework text (print/ebook only, no legitimate free version). Priority: Chs. 1–6 (fundamental law, IR, IC, breadth), 10–12 (forecasting, information analysis), 14–17 (portfolio construction, implementation, transaction costs), 19–20 (performance analysis). Months 3–4. This vocabulary (IR, IC, breadth, transfer coefficient) is the working language of alpha evaluation.",
            },
            {
              id: "p2-a-apm",
              title: "Paleologo, Advanced Portfolio Management",
              html:
                "Month 4. Fast read, written for exactly this evaluation problem: factor risk models, sizing, what PMs get wrong.",
            },
            {
              id: "p2-a-eqi",
              title: "Paleologo, The Elements of Quantitative Investing",
              html:
                "Month 5. Deeper treatment; slow down on risk-model construction and alpha combination.",
            },
            {
              id: "p2-a-papers",
              title: "Core papers",
              html:
                "Months 4–6, ~2/week, annotate each. These are the intellectual core of backtest skepticism.",
              links: [
                {
                  label: "Deflated Sharpe Ratio",
                  url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2460551",
                },
                {
                  label: "Probability of Backtest Overfitting",
                  url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2326253",
                },
                {
                  label: "Pseudo-Mathematics & Financial Charlatanism",
                  url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2308659",
                },
                {
                  label: "Sharpe Ratio Efficient Frontier",
                  url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1821643",
                },
                {
                  label: "...and the Cross-Section of Expected Returns",
                  url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2249314",
                },
                {
                  label: "Backtesting (Harvey & Liu)",
                  url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2345489",
                },
                {
                  label: "A Backtesting Protocol in the Era of ML",
                  url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3275654",
                },
                {
                  label: "Backtesting Protocol (published PDF)",
                  url: "https://people.duke.edu/~charvey/Research/Published_Papers/P138_A_backtesting_protocol.pdf",
                },
                {
                  label: "Optimal Execution (Almgren & Chriss)",
                  url: "https://www.smallake.kr/wp-content/uploads/2016/03/optliq.pdf",
                },
                {
                  label: "Trading Costs (Frazzini et al.)",
                  url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3229719",
                },
                {
                  label: "Trading Costs of Asset Pricing Anomalies",
                  url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2294498",
                },
                {
                  label: "A Taxonomy of Anomalies & Their Trading Costs",
                  url: "https://www.semanticscholar.org/paper/A-Taxonomy-of-Anomalies-and-Their-Trading-Costs-Novy-Marx-Velikov/e4e55002cc2adb8a902f76e070c4563ebe105d63",
                },
              ],
            },
            {
              id: "p2-a-afml",
              title: "López de Prado, Advances in Financial Machine Learning",
              html:
                "Months 5–6. Priority: Chs. 7–9 (cross-validation, purging/embargo), 10–14 (backtesting, backtest statistics, strategy risk). <strong>Read critically</strong> — the book has known issues with overfitting to its own methods; read Paleologo's and practitioners' critiques alongside it. Knowing where AFML is wrong is itself credibility.",
            },
            {
              id: "p2-a-ruppert",
              title: "Ruppert & Matteson, Statistics and Data Analysis for Financial Engineering",
              html:
                "Selective, Months 5–6. Priority: returns/time-series chapters, GARCH, factor models. Skip fixed income and copula depth.",
              links: [
                {
                  label: "Springer",
                  url: "https://link.springer.com/book/10.1007/978-1-4939-2614-5",
                },
              ],
            },
          ],
        },
        {
          id: "p2-b",
          name: "Track B — Research Platform Architecture",
          note: "~4–5 hrs/week. Finish DDIA (Month 4), then build written mental models (2–3 pages each).",
          items: [
            {
              id: "p2-b-pit",
              title: "Point-in-time correctness",
              html:
                "Bitemporal data, avoiding lookahead in the data layer. Read ArcticDB's versioning design and survey the bitemporal-database literature.",
              links: [{ label: "ArcticDB docs", url: "https://docs.arcticdb.io/" }],
            },
            {
              id: "p2-b-fs",
              title: "Feature stores",
              html: "What problems they solve, what they cost.",
              links: [
                {
                  label: "Michelangelo",
                  url: "https://www.uber.com/blog/michelangelo-machine-learning-platform/",
                },
                {
                  label: "Chronon",
                  url: "https://medium.com/airbnb-engineering/chronon-a-declarative-feature-engineering-framework-b7b8ce796e04",
                },
              ],
            },
            {
              id: "p2-b-engine",
              title: "Backtest engine design",
              html: "Event-driven vs. vectorized — what each hides. Read the architecture docs and their known criticisms.",
              links: [
                { label: "Zipline", url: "https://github.com/quantopian/zipline" },
                { label: "vectorbt", url: "https://github.com/polakowo/vectorbt" },
              ],
            },
            {
              id: "p2-b-repro",
              title: "Reproducibility & lineage",
              html:
                "Can any backtest be rerun bit-identically a year later? Data versioning, code/config pinning.",
              links: [
                { label: "DVC", url: "https://dvc.org" },
                { label: "lakeFS", url: "https://lakefs.io" },
              ],
            },
            {
              id: "p2-b-sim",
              title: "Sim-to-live reconciliation",
              html:
                "Slippage attribution, paper-vs-live divergence. Thinner public literature — Almgren–Chriss plus practitioner posts; flag as an area with sparse sources, one to keep learning.",
            },
          ],
        },
        {
          id: "p2-d",
          name: "Phase 2 deliverables",
          items: [
            {
              id: "p2-del-papers",
              title: "Annotated paper library (one-page notes each)",
              output: true,
            },
            {
              id: "p2-del-models",
              title:
                "Five architecture mental-model docs (point-in-time, feature store, backtest engine, reproducibility, sim-to-live)",
              output: true,
            },
            {
              id: "p2-del-log",
              title: "Design-review log at 12+ entries",
              output: true,
            },
          ],
        },
      ],
    },

    {
      id: "p3",
      name: "Phase 3 — Capstone Build",
      months: "Months 4–10 (overlapping)",
      blurb:
        "Feel every pain point a research team describes, and build the evaluation harness that is the core of the whole curriculum. Guardrail: public data only, paper trading only, nothing published, no capital deployed.",
      sections: [
        {
          id: "p3-s",
          name: "Stages",
          items: [
            {
              id: "p3-s1",
              title: "Stage 1 — Deliberately naive build (Months 4–5)",
              html:
                "Pipeline: earnings-call transcripts (public) → LLM feature extraction → signal construction → simple loop-based backtester. Flat files, no database, no framework. Let it be ugly. Then scale it — more tickers, history, signals — until it breaks or becomes unbearable. <strong>Write down each breaking point.</strong> This is the pressure real research infrastructure teams describe; now you'll have felt it firsthand.",
              output: true,
            },
            {
              id: "p3-s2",
              title: "Stage 2 — The refactor (Months 6–7)",
              html:
                "Fix only what broke: introduce a point-in-time data layer, a feature-store pattern, an event-driven or properly vectorized backtest engine — driven by experienced necessity, not tutorial cargo-culting. Keep an ADR log: every architecture decision, alternatives considered, why.",
              links: [
                {
                  label: "ADR format examples",
                  url: "https://github.com/joelparkerhenderson/architecture-decision-record",
                },
              ],
              output: true,
            },
            {
              id: "p3-s3",
              title: "Stage 3 — The evaluation harness (Months 7–9)",
              html:
                "The deliverable at the heart of the curriculum: walk-forward validation with purging and embargo; deflated Sharpe ratio and PBO computation; transaction-cost model + capacity curve (PnL vs. AUM deployed); turnover and signal-decay analysis; multiple-testing tracking (log every variant tried, haircut accordingly).",
              output: true,
            },
            {
              id: "p3-s4",
              title: "Stage 4 — Red team yourself (Months 9–10)",
              html:
                "Deliberately construct an overfit signal (in-sample mining, lookahead leak, survivorship bias — one of each). Confirm the harness catches all three; if it doesn't, fix the harness. Then write a one-page “how to spot a fraudulent backtest” memo in your own words — the distilled skill the whole curriculum builds toward.",
              output: true,
            },
          ],
        },
      ],
    },

    {
      id: "p4",
      name: "Phase 4 — Synthesis & Integration",
      months: "Months 10–12",
      blurb: "Turn the parts into judgment you can apply cold.",
      sections: [
        {
          id: "p4-s",
          name: "Exercises",
          items: [
            {
              id: "p4-mock",
              title: "Mock design reviews",
              html:
                "Take 3–4 of your logged design docs and your own capstone ADRs; write the review you'd give as a senior technical reviewer. Compare against outcomes.",
              output: true,
            },
            {
              id: "p4-approval",
              title: "Approval-workflow design exercise",
              html:
                "Draft an alpha approval process — stages, evidence required at each gate, kill criteria, escalation paths. A considered strawman is worth far more than a blank page.",
              output: true,
            },
            {
              id: "p4-gaps",
              title: "Gap list",
              html:
                "Write down what you still can't evaluate confidently. These become your continued learning agenda — the questions worth pursuing next, asked from a position of demonstrated preparation.",
              output: true,
            },
            {
              id: "p4-reread",
              title: "Reread Grinold & Kahn, Chs. 1–6",
              html: "It will read differently after the capstone.",
            },
          ],
        },
      ],
    },
  ],

  cut: [
    "LeetCode / algorithm grinding",
    "Professional-level coding, C++, systems programming",
    "Low-latency / HFT infrastructure",
    "Kubernetes-level infrastructure operations",
    "Derivatives math, stochastic calculus",
    "General ML breadth beyond what the capstone requires (skim ISLR only if a specific gap appears)",
  ],
  cutNote:
    "The failure mode isn't insufficient depth — it's pretending to more depth than you have. This curriculum builds evaluation judgment plus firsthand respect for the builders' craft. That combination, not coding ability, is the goal.",

  checkpoints: [
    { month: "2", text: "Stat 110 problem sets done; Larson + Accelerate read; design-review habit running" },
    { month: "4", text: "DDIA finished with mapping notes; Grinold & Kahn core chapters done; naive capstone breaking" },
    { month: "6", text: "Paper library annotated; refactor underway with ADR log; Paleologo x2 done" },
    { month: "9", text: "Evaluation harness complete; AFML critical read done" },
    { month: "10", text: "Red-team exercise passed; fraud-detection memo written" },
    { month: "12", text: "Mock reviews + approval-workflow strawman + gap list complete" },
  ],
};
