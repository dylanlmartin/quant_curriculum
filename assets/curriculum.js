/*
 * Curriculum data.
 *
 * This file is intentionally the ONLY place you need to edit to change the
 * curriculum. Everything on the page is rendered from the structure below.
 *
 * Shape:
 *   CURRICULUM = {
 *     title, subtitle,
 *     phases: [{
 *       id, title, goal,
 *       modules: [{
 *         id, title, summary,
 *         topics: [ "checklist item", ... ],   // each becomes a checkbox
 *         resources: [ { label, url, kind } ], // kind: book|course|video|docs|paper|tool|article
 *         deliverable: "what you should produce for this module"
 *       }]
 *     }]
 *   }
 *
 * Notes:
 *  - `id` values must be unique and stable — progress is saved against them,
 *    so renaming an id resets that item's saved state.
 *  - Add / remove / reorder freely; the UI adapts.
 */
const CURRICULUM = {
  title: "Quant Research & Trading Curriculum",
  subtitle:
    "A self-paced path from mathematical foundations to a working research and trading toolkit. Check off what you finish, keep your notes and code linked in one place, and let the progress take care of itself.",

  phases: [
    {
      id: "foundations",
      title: "Phase 1 · Mathematical Foundations",
      goal: "Build the linear algebra, calculus, probability, and statistics fluency that everything else rests on.",
      modules: [
        {
          id: "linear-algebra",
          title: "Linear Algebra",
          summary:
            "Vectors, matrices, decompositions, and the geometry behind them — the language of data and models.",
          topics: [
            "Vectors, spans, and linear independence",
            "Matrix multiplication as composition of transforms",
            "Solving Ax = b; rank and null space",
            "Eigenvalues, eigenvectors, and diagonalization",
            "Orthogonality, projections, and least squares",
            "SVD and low-rank approximation",
          ],
          resources: [
            { label: "3Blue1Brown — Essence of Linear Algebra", url: "https://www.3blue1brown.com/topics/linear-algebra", kind: "video" },
            { label: "MIT 18.06 Linear Algebra (Strang)", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", kind: "course" },
            { label: "Introduction to Linear Algebra (Strang)", url: "https://math.mit.edu/~gs/linearalgebra/", kind: "book" },
          ],
          deliverable:
            "A notebook implementing least squares and PCA from scratch with NumPy, checked against a library implementation.",
        },
        {
          id: "calculus-optimization",
          title: "Calculus & Optimization",
          summary:
            "Derivatives, gradients, and convex optimization — how models are fit and how objectives are minimized.",
          topics: [
            "Single and multivariable derivatives, chain rule",
            "Gradients, Jacobians, Hessians",
            "Taylor expansions and local approximation",
            "Lagrange multipliers and constrained optimization",
            "Convex sets, convex functions, and duality",
            "Gradient descent and its variants",
          ],
          resources: [
            { label: "3Blue1Brown — Essence of Calculus", url: "https://www.3blue1brown.com/topics/calculus", kind: "video" },
            { label: "Convex Optimization (Boyd & Vandenberghe) — free PDF", url: "https://web.stanford.edu/~boyd/cvxbook/", kind: "book" },
            { label: "MIT 18.02 Multivariable Calculus", url: "https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/", kind: "course" },
          ],
          deliverable:
            "Implement gradient descent for a small convex problem and visualize the optimization path and convergence.",
        },
        {
          id: "probability",
          title: "Probability",
          summary:
            "Random variables, distributions, and expectation — the vocabulary of uncertainty and returns.",
          topics: [
            "Sample spaces, events, and conditional probability",
            "Bayes' theorem and independence",
            "Common distributions (normal, lognormal, Poisson, t)",
            "Expectation, variance, covariance",
            "Law of large numbers and the central limit theorem",
            "Joint, marginal, and conditional distributions",
          ],
          resources: [
            { label: "Harvard Stat 110 (Blitzstein)", url: "https://projects.iq.harvard.edu/stat110/home", kind: "course" },
            { label: "Introduction to Probability (Blitzstein & Hwang) — free PDF", url: "https://projects.iq.harvard.edu/stat110/home", kind: "book" },
            { label: "Seeing Theory — visual probability", url: "https://seeing-theory.brown.edu/", kind: "article" },
          ],
          deliverable:
            "A Monte Carlo notebook demonstrating the CLT and estimating a non-trivial probability by simulation.",
        },
        {
          id: "statistics-inference",
          title: "Statistics & Inference",
          summary:
            "Estimation, hypothesis testing, and regression — turning data into defensible claims.",
          topics: [
            "Estimators, bias, variance, and consistency",
            "Maximum likelihood estimation",
            "Confidence intervals and the bootstrap",
            "Hypothesis testing and p-values (and their traps)",
            "Ordinary least squares regression and assumptions",
            "Multiple testing and the danger of overfitting",
          ],
          resources: [
            { label: "All of Statistics (Wasserman)", url: "https://link.springer.com/book/10.1007/978-0-387-21736-9", kind: "book" },
            { label: "StatQuest — Statistics Fundamentals", url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9", kind: "video" },
          ],
          deliverable:
            "A short report fitting a regression to a real dataset, with residual diagnostics and a bootstrap confidence interval.",
        },
      ],
    },

    {
      id: "programming",
      title: "Phase 2 · Programming & Data Engineering",
      goal: "Become fluent in Python for data, write tested code, and handle real data pipelines.",
      modules: [
        {
          id: "python-core",
          title: "Python for Data",
          summary:
            "Idiomatic Python plus the NumPy / pandas stack that quant work runs on.",
          topics: [
            "Core Python: data structures, comprehensions, generators",
            "NumPy arrays and vectorized computation",
            "pandas: indexing, groupby, joins, time indexing",
            "Plotting with matplotlib",
            "Virtual environments and dependency management",
            "Notebooks vs. scripts vs. packages",
          ],
          resources: [
            { label: "Python for Data Analysis (McKinney) — free online", url: "https://wesmckinney.com/book/", kind: "book" },
            { label: "pandas — Getting Started", url: "https://pandas.pydata.org/docs/getting_started/index.html", kind: "docs" },
            { label: "NumPy — Absolute Beginner's Guide", url: "https://numpy.org/doc/stable/user/absolute_beginners.html", kind: "docs" },
          ],
          deliverable:
            "A reusable data-loading module that pulls a time series, cleans it, and returns a tidy pandas DataFrame.",
        },
        {
          id: "software-engineering",
          title: "Software Engineering Practice",
          summary:
            "Version control, testing, and packaging — the difference between a script and a system.",
          topics: [
            "Git: branches, rebasing, resolving conflicts",
            "Writing unit tests with pytest",
            "Project layout and packaging (pyproject.toml)",
            "Type hints and static checking",
            "Logging, configuration, and reproducibility",
            "Continuous integration basics",
          ],
          resources: [
            { label: "Pro Git (free book)", url: "https://git-scm.com/book/en/v2", kind: "book" },
            { label: "pytest documentation", url: "https://docs.pytest.org/en/stable/", kind: "docs" },
            { label: "Python Packaging User Guide", url: "https://packaging.python.org/en/latest/", kind: "docs" },
          ],
          deliverable:
            "A small, pip-installable package with a test suite and CI that runs the tests on every push.",
        },
        {
          id: "data-sql",
          title: "Data & SQL",
          summary:
            "Getting data in and out — SQL, APIs, and storage patterns for market and alternative data.",
          topics: [
            "SQL: SELECT, JOIN, GROUP BY, window functions",
            "Schema design for time series data",
            "Pulling data from REST APIs",
            "Rate limits, retries, and caching",
            "Storing panels: wide vs. long, parquet vs. SQL",
            "Data validation and quality checks",
          ],
          resources: [
            { label: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/", kind: "course" },
            { label: "SQLite documentation", url: "https://www.sqlite.org/docs.html", kind: "docs" },
            { label: "Apache Parquet — overview", url: "https://parquet.apache.org/docs/", kind: "docs" },
          ],
          deliverable:
            "An ingestion script that fetches data from an API into a local database with retries and a validation step.",
        },
      ],
    },

    {
      id: "markets",
      title: "Phase 3 · Financial Markets & Instruments",
      goal: "Understand what is being traded, how, and why prices move — the domain knowledge under the math.",
      modules: [
        {
          id: "markets-overview",
          title: "Markets & Instruments",
          summary:
            "Equities, fixed income, futures, and options — payoffs, conventions, and how they relate.",
          topics: [
            "Equities, indices, and ETFs",
            "Bonds, yields, and the term structure",
            "Futures and forwards: pricing and roll",
            "Options: payoffs, put-call parity, the greeks",
            "Corporate actions and adjusted prices",
            "Order types and the mechanics of a trade",
          ],
          resources: [
            { label: "Options, Futures, and Other Derivatives (Hull)", url: "https://www.pearson.com/en-us/subject-catalog/p/options-futures-and-other-derivatives/P200000005938", kind: "book" },
            { label: "Khan Academy — Finance & Capital Markets", url: "https://www.khanacademy.org/economics-finance-domain/core-finance", kind: "course" },
          ],
          deliverable:
            "A one-page cheat sheet of instrument payoffs and a script that plots option payoff diagrams.",
        },
        {
          id: "microstructure",
          title: "Market Microstructure",
          summary:
            "How prices actually form in the order book, and why execution is a research problem of its own.",
          topics: [
            "Limit order books and price-time priority",
            "Bid-ask spread and its components",
            "Market impact and liquidity",
            "Adverse selection and informed trading",
            "Market makers vs. takers",
            "Transaction cost analysis basics",
          ],
          resources: [
            { label: "Trading and Exchanges (Larry Harris)", url: "https://global.oup.com/academic/product/trading-and-exchanges-9780195144703", kind: "book" },
            { label: "Algorithmic and High-Frequency Trading (Cartea et al.)", url: "https://www.cambridge.org/core/books/algorithmic-and-highfrequency-trading/", kind: "book" },
          ],
          deliverable:
            "A notebook reconstructing a simple limit order book from message data and measuring the effective spread.",
        },
      ],
    },

    {
      id: "quant-methods",
      title: "Phase 4 · Quantitative Methods",
      goal: "Model returns over time with the core toolkit of time series and stochastic processes.",
      modules: [
        {
          id: "time-series",
          title: "Time Series Analysis",
          summary:
            "Autocorrelation, stationarity, and the models used to describe and forecast financial series.",
          topics: [
            "Stationarity, differencing, and unit roots",
            "Autocorrelation and partial autocorrelation",
            "AR, MA, ARMA, and ARIMA models",
            "Volatility clustering: ARCH and GARCH",
            "Cointegration and pairs relationships",
            "Backtesting a forecast honestly (no look-ahead)",
          ],
          resources: [
            { label: "Analysis of Financial Time Series (Tsay)", url: "https://onlinelibrary.wiley.com/doi/book/10.1002/9780470644560", kind: "book" },
            { label: "Forecasting: Principles and Practice (Hyndman) — free", url: "https://otexts.com/fpp3/", kind: "book" },
            { label: "statsmodels — Time Series Analysis", url: "https://www.statsmodels.org/stable/tsa.html", kind: "docs" },
          ],
          deliverable:
            "Fit an ARIMA and a GARCH model to a real return series and evaluate out-of-sample forecasts.",
        },
        {
          id: "stochastic-calculus",
          title: "Stochastic Processes",
          summary:
            "Brownian motion, Itô calculus, and the continuous-time models behind derivatives pricing.",
          topics: [
            "Random walks and Brownian motion",
            "Martingales and the Markov property",
            "Itô's lemma (intuition and use)",
            "Geometric Brownian motion for asset prices",
            "The Black–Scholes PDE and its assumptions",
            "Monte Carlo pricing of a simple option",
          ],
          resources: [
            { label: "Stochastic Calculus for Finance I & II (Shreve)", url: "https://link.springer.com/book/10.1007/978-0-387-22527-2", kind: "book" },
            { label: "MIT 18.S096 Topics in Mathematics with Applications in Finance", url: "https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/", kind: "course" },
          ],
          deliverable:
            "A Monte Carlo option pricer, validated against the Black–Scholes closed form for a European call.",
        },
      ],
    },

    {
      id: "ml-finance",
      title: "Phase 5 · Machine Learning for Finance",
      goal: "Apply statistical learning to financial data without fooling yourself.",
      modules: [
        {
          id: "ml-foundations",
          title: "Machine Learning Foundations",
          summary:
            "Supervised learning, model selection, and the bias–variance tradeoff, grounded in real practice.",
          topics: [
            "Train/validation/test discipline and leakage",
            "Linear and logistic regression, regularization",
            "Trees, random forests, gradient boosting",
            "Cross-validation and hyperparameter tuning",
            "Feature engineering and selection",
            "Evaluating classifiers and regressors properly",
          ],
          resources: [
            { label: "An Introduction to Statistical Learning — free PDF", url: "https://www.statlearning.com/", kind: "book" },
            { label: "Hands-On Machine Learning (Géron)", url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/", kind: "book" },
            { label: "scikit-learn — User Guide", url: "https://scikit-learn.org/stable/user_guide.html", kind: "docs" },
          ],
          deliverable:
            "A cleanly cross-validated model on a tabular dataset with an honest report of generalization error.",
        },
        {
          id: "financial-ml",
          title: "Financial Machine Learning",
          summary:
            "The pitfalls specific to financial data: non-stationarity, overlapping labels, and backtest overfitting.",
          topics: [
            "Why financial labels overlap and how to fix it",
            "Purged and embargoed cross-validation",
            "Sample weighting and meta-labeling",
            "Feature importance without leakage",
            "The deflated Sharpe ratio and multiple testing",
            "From signal to sized position",
          ],
          resources: [
            { label: "Advances in Financial Machine Learning (López de Prado)", url: "https://www.wiley.com/en-us/Advances+in+Financial+Machine+Learning-p-9781119482086", kind: "book" },
            { label: "The Probability of Backtest Overfitting (paper)", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2326253", kind: "paper" },
          ],
          deliverable:
            "A research notebook applying purged cross-validation to a predictive feature and reporting a deflated performance metric.",
        },
        {
          id: "nlp-signals",
          title: "NLP & Alternative Data",
          summary:
            "Turning text and news into structured signals — the theme your capstone monitor is built around.",
          topics: [
            "Text cleaning, tokenization, and embeddings",
            "Sentiment and event extraction from news",
            "Entity linking and deduplication",
            "Aggregating noisy signals over time",
            "Evaluating a text-derived signal",
            "Pipelines: ingestion → NLP → synthesis",
          ],
          resources: [
            { label: "spaCy — Advanced NLP course (free)", url: "https://course.spacy.io/en/", kind: "course" },
            { label: "Hugging Face — NLP Course", url: "https://huggingface.co/learn/nlp-course", kind: "course" },
          ],
          deliverable:
            "A pipeline that ingests a news feed, extracts entities and sentiment, and writes structured records to a database.",
        },
      ],
    },

    {
      id: "portfolio-risk",
      title: "Phase 6 · Portfolio Construction & Risk",
      goal: "Combine signals into portfolios and understand the risk you are taking.",
      modules: [
        {
          id: "portfolio-theory",
          title: "Portfolio Theory & Factor Models",
          summary:
            "From mean-variance optimization to factor models and the practical realities of position sizing.",
          topics: [
            "Mean-variance optimization and the efficient frontier",
            "The CAPM and single-factor intuition",
            "Multi-factor models (value, momentum, quality)",
            "Covariance estimation and shrinkage",
            "Risk parity and alternative weighting schemes",
            "Turnover, constraints, and transaction costs",
          ],
          resources: [
            { label: "Active Portfolio Management (Grinold & Kahn)", url: "https://www.mhprofessional.com/active-portfolio-management-a-quantitative-approach-for-producing-superior-returns-and-controlling-risk-9780070248823-usa", kind: "book" },
            { label: "PyPortfolioOpt documentation", url: "https://pyportfolioopt.readthedocs.io/en/latest/", kind: "tool" },
          ],
          deliverable:
            "Build an optimizer that takes expected returns and a covariance matrix and produces a constrained portfolio.",
        },
        {
          id: "risk-management",
          title: "Risk Management",
          summary:
            "Measuring, decomposing, and limiting risk — and knowing where the standard measures break.",
          topics: [
            "Volatility, drawdown, and the Sharpe ratio",
            "Value at Risk and Expected Shortfall",
            "Factor risk decomposition",
            "Stress testing and scenario analysis",
            "Leverage, margin, and liquidity risk",
            "Position limits and risk budgets",
          ],
          resources: [
            { label: "Quantitative Risk Management (McNeil, Frey, Embrechts)", url: "https://press.princeton.edu/books/hardcover/9780691166278/quantitative-risk-management", kind: "book" },
          ],
          deliverable:
            "A risk report for a sample portfolio: rolling volatility, drawdown, VaR/ES, and a factor exposure breakdown.",
        },
      ],
    },

    {
      id: "strategy-execution",
      title: "Phase 7 · Strategy, Backtesting & Execution",
      goal: "Turn ideas into testable strategies and understand the gap between backtest and reality.",
      modules: [
        {
          id: "backtesting",
          title: "Backtesting",
          summary:
            "Simulating a strategy over history without the many ways a backtest quietly lies to you.",
          topics: [
            "Vectorized vs. event-driven backtests",
            "Avoiding look-ahead and survivorship bias",
            "Realistic fills, slippage, and costs",
            "Walk-forward evaluation",
            "Performance and attribution metrics",
            "Sensitivity and parameter stability",
          ],
          resources: [
            { label: "vectorbt documentation", url: "https://vectorbt.dev/", kind: "tool" },
            { label: "backtrader documentation", url: "https://www.backtrader.com/docu/", kind: "tool" },
          ],
          deliverable:
            "A reusable backtesting harness that takes a signal and returns performance stats with costs applied.",
        },
        {
          id: "execution",
          title: "Execution",
          summary:
            "Getting into and out of positions well — scheduling, impact, and measuring your own slippage.",
          topics: [
            "Execution benchmarks (arrival, VWAP, TWAP)",
            "Scheduling to minimize impact",
            "Almgren–Chriss optimal execution intuition",
            "Measuring implementation shortfall",
            "Smart order routing basics",
            "Feedback loop from execution to strategy",
          ],
          resources: [
            { label: "Optimal Execution of Portfolio Transactions (Almgren & Chriss)", url: "https://www.smallake.kr/wp-content/uploads/2016/03/optliq.pdf", kind: "paper" },
          ],
          deliverable:
            "A simulator comparing TWAP and a simple impact-aware schedule, reporting implementation shortfall for each.",
        },
      ],
    },

    {
      id: "capstones",
      title: "Phase 8 · Capstone Projects",
      goal: "Tie it all together in projects that produce something real and reviewable.",
      modules: [
        {
          id: "capstone-situation-monitor",
          title: "Capstone · Situation Monitor",
          summary:
            "An end-to-end system that ingests news feeds, runs NLP, and synthesizes a monitored view of unfolding situations — combining Phase 2 engineering with Phase 5 NLP.",
          topics: [
            "Design the ingestion → storage → NLP → synthesis pipeline",
            "Implement feed ingestion with retries and dedup",
            "Add entity and sentiment extraction",
            "Persist structured records to a database",
            "Build a dashboard view over the synthesized data",
            "Write tests and document how to run it",
          ],
          resources: [
            { label: "situation_monitor — companion repository", url: "https://github.com/dylanlmartin/situation_monitor", kind: "tool" },
            { label: "Streamlit — build the dashboard", url: "https://docs.streamlit.io/", kind: "docs" },
          ],
          deliverable:
            "A running situation-monitor with ingestion, NLP, storage, and a dashboard — linked as a GitHub repo below.",
        },
        {
          id: "capstone-backtester",
          title: "Capstone · Research Backtester",
          summary:
            "A backtesting engine you trust, plus one fully documented strategy research report built on top of it.",
          topics: [
            "Event-driven engine with realistic costs",
            "Pluggable signal interface",
            "Walk-forward evaluation harness",
            "One strategy researched end to end",
            "Honest write-up including what didn't work",
            "Reproducible from a single command",
          ],
          resources: [
            { label: "vectorbt documentation", url: "https://vectorbt.dev/", kind: "tool" },
          ],
          deliverable:
            "A backtesting repo plus a research write-up (Google Doc) with results, caveats, and next steps.",
        },
        {
          id: "capstone-factor-study",
          title: "Capstone · Factor Study",
          summary:
            "A rigorous study of a single factor from hypothesis to portfolio, with all the anti-overfitting discipline applied.",
          topics: [
            "State a clear economic hypothesis",
            "Build and clean the factor",
            "Purged cross-validation and robustness checks",
            "Portfolio construction from the factor",
            "Risk and cost analysis of the result",
            "Deflated performance and honest conclusion",
          ],
          resources: [
            { label: "Advances in Financial Machine Learning (López de Prado)", url: "https://www.wiley.com/en-us/Advances+in+Financial+Machine+Learning-p-9781119482086", kind: "book" },
          ],
          deliverable:
            "A factor research report (Google Doc) backed by a reproducible code repo.",
        },
      ],
    },
  ],
};

if (typeof module !== "undefined") { module.exports = CURRICULUM; }
