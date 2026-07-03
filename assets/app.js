/* ------------------------------------------------------------------ *
 *  Interactive curriculum tracker
 *  - Progress and collected outputs are stored in localStorage, so this
 *    page is fully static and works from GitHub Pages or a local file.
 *  - Nothing leaves your browser. Use Export to back up / move devices.
 * ------------------------------------------------------------------ */

const STORE_KEY = "quant_curriculum_state_v1";

const KIND_ICON = {
  book: "📕", course: "🎓", video: "🎬", docs: "📄",
  paper: "📎", tool: "🛠️", article: "🔗",
};
const OUTPUT_ICON = { doc: "📝", repo: "🐙", link: "🔗" };

/* ---------- state ---------- */
function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { topics: {}, outputs: {}, collapsed: {} };
    const s = JSON.parse(raw);
    return { topics: s.topics || {}, outputs: s.outputs || {}, collapsed: s.collapsed || {} };
  } catch (e) {
    return { topics: {}, outputs: {}, collapsed: {} };
  }
}
let state = loadState();
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

/* ---------- helpers ---------- */
const el = (tag, cls, txt) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (txt != null) n.textContent = txt;
  return n;
};
const topicKey = (moduleId, i) => `${moduleId}::${i}`;
function isChecked(moduleId, i) { return !!state.topics[topicKey(moduleId, i)]; }

function moduleStats(m) {
  const total = m.topics.length;
  let done = 0;
  for (let i = 0; i < total; i++) if (isChecked(m.id, i)) done++;
  return { done, total };
}
function phaseStats(p) {
  let done = 0, total = 0;
  p.modules.forEach((m) => { const s = moduleStats(m); done += s.done; total += s.total; });
  return { done, total };
}
function overallStats() {
  let done = 0, total = 0, modulesDone = 0, modulesTotal = 0;
  CURRICULUM.phases.forEach((p) =>
    p.modules.forEach((m) => {
      const s = moduleStats(m);
      done += s.done; total += s.total;
      modulesTotal++;
      if (s.total > 0 && s.done === s.total) modulesDone++;
    })
  );
  return { done, total, modulesDone, modulesTotal };
}
function outputCount() {
  return Object.values(state.outputs).reduce((a, arr) => a + (arr ? arr.length : 0), 0);
}
const pct = (done, total) => (total === 0 ? 0 : Math.round((done / total) * 100));

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 1600);
}

/* classify a pasted URL */
function classifyUrl(url) {
  const u = url.toLowerCase();
  if (u.includes("docs.google.com") || u.includes("drive.google.com")) return "doc";
  if (u.includes("github.com") || u.includes("gitlab.com") || u.includes("bitbucket.org")) return "repo";
  return "link";
}
function labelForUrl(url, kind) {
  try {
    const u = new URL(url);
    if (kind === "repo") {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
      return u.hostname;
    }
    if (kind === "doc") return "Google Doc";
    return u.hostname.replace(/^www\./, "");
  } catch (e) {
    return url.slice(0, 40);
  }
}

/* ---------- rendering ---------- */
function render() {
  const root = document.getElementById("phases");
  root.innerHTML = "";
  CURRICULUM.phases.forEach((p) => root.appendChild(renderPhase(p)));
  renderHeaderStats();
  renderGather();
}

function renderHeaderStats() {
  const o = overallStats();
  const p = pct(o.done, o.total);
  document.getElementById("hdr-pct").textContent = p + "%";
  document.getElementById("hdr-bar").style.width = p + "%";
  document.getElementById("stat-overall").textContent = p + "%";
  document.getElementById("stat-topics").textContent = `${o.done} / ${o.total}`;
  document.getElementById("stat-modules").textContent = `${o.modulesDone} / ${o.modulesTotal}`;
  document.getElementById("stat-outputs").textContent = outputCount();
}

function renderPhase(p) {
  const s = phaseStats(p);
  const collapsed = !!state.collapsed[p.id];
  const wrap = el("section", "phase" + (collapsed ? " collapsed" : ""));

  const head = el("div", "phase-head");
  head.appendChild(el("span", "chev", "▾"));
  const titles = el("div", "titles");
  titles.appendChild(el("h2", null, p.title));
  titles.appendChild(el("div", "goal", p.goal));
  head.appendChild(titles);

  const mini = el("div", "mini");
  const bar = el("div", "bar" + (s.done === s.total && s.total ? " done" : ""));
  const fill = el("span");
  fill.style.width = pct(s.done, s.total) + "%";
  bar.appendChild(fill);
  mini.appendChild(bar);
  mini.appendChild(el("span", "frac", `${s.done}/${s.total}`));
  head.appendChild(mini);

  head.addEventListener("click", () => {
    state.collapsed[p.id] = !state.collapsed[p.id];
    save();
    wrap.classList.toggle("collapsed");
  });
  wrap.appendChild(head);

  const body = el("div", "phase-body");
  p.modules.forEach((m) => body.appendChild(renderModule(m)));
  wrap.appendChild(body);
  return wrap;
}

function renderModule(m) {
  const s = moduleStats(m);
  const complete = s.total > 0 && s.done === s.total;
  const wrap = el("div", "module" + (complete ? " complete" : ""));
  wrap.dataset.moduleId = m.id;

  const head = el("div", "module-head");
  const t = el("div", "m-titles");
  t.appendChild(el("h3", null, m.title));
  t.appendChild(el("div", "m-sum", m.summary));
  head.appendChild(t);
  head.appendChild(el("span", "m-frac", `${s.done}/${s.total}`));
  wrap.appendChild(head);

  const grid = el("div", "m-grid");

  /* topics column */
  const left = el("div");
  left.appendChild(el("div", "col-label", "Topics"));
  const ul = el("ul", "topics");
  m.topics.forEach((topic, i) => {
    const li = el("li");
    const label = el("label", isChecked(m.id, i) ? "checked" : null);
    const cb = el("input");
    cb.type = "checkbox";
    cb.checked = isChecked(m.id, i);
    cb.addEventListener("change", () => {
      state.topics[topicKey(m.id, i)] = cb.checked;
      if (!cb.checked) delete state.topics[topicKey(m.id, i)];
      save();
      label.classList.toggle("checked", cb.checked);
      refreshCounts(m);
    });
    label.appendChild(cb);
    label.appendChild(el("span", null, topic));
    li.appendChild(label);
    ul.appendChild(li);
  });
  left.appendChild(ul);
  grid.appendChild(left);

  /* resources column */
  const right = el("div");
  right.appendChild(el("div", "col-label", "Materials"));
  const rlist = el("div", "resources");
  m.resources.forEach((r) => {
    const row = el("div", "res");
    row.appendChild(el("span", "kind", r.kind || "link"));
    const a = el("a", null, r.label);
    a.href = r.url; a.target = "_blank"; a.rel = "noopener";
    row.appendChild(a);
    rlist.appendChild(row);
  });
  right.appendChild(rlist);
  grid.appendChild(right);
  wrap.appendChild(grid);

  /* deliverable */
  if (m.deliverable) {
    const d = el("div", "deliverable");
    d.appendChild(el("div", "d-label", "Deliverable"));
    d.appendChild(el("div", null, m.deliverable));
    wrap.appendChild(d);
  }

  /* outputs */
  wrap.appendChild(renderOutputs(m));
  return wrap;
}

function renderOutputs(m) {
  const wrap = el("div", "outputs");
  wrap.appendChild(el("div", "col-label", "Your outputs"));

  const list = el("div", "output-list");
  const items = state.outputs[m.id] || [];
  if (items.length === 0) {
    list.appendChild(el("div", "empty-note", "No outputs linked yet — create one, then paste its link."));
  } else {
    items.forEach((o, idx) => list.appendChild(renderChip(m, o, idx)));
  }
  wrap.appendChild(list);

  const actions = el("div", "output-actions");

  const newDoc = el("button", "btn tiny", "");
  newDoc.innerHTML = '<span class="ico">📝</span> New Google Doc';
  newDoc.title = "Opens docs.new to create a fresh Google Doc, then paste its link here";
  newDoc.addEventListener("click", () => window.open("https://docs.new", "_blank", "noopener"));

  const newRepo = el("button", "btn tiny", "");
  newRepo.innerHTML = '<span class="ico">🐙</span> New GitHub repo';
  newRepo.title = "Opens github.com/new to create a repo, then paste its link here";
  newRepo.addEventListener("click", () => window.open("https://github.com/new", "_blank", "noopener"));

  actions.appendChild(newDoc);
  actions.appendChild(newRepo);

  const add = el("div", "output-add");
  const input = el("input");
  input.type = "url";
  input.placeholder = "Paste a Google Doc or GitHub link…";
  const addBtn = el("button", "btn tiny primary", "Save");
  const commit = () => {
    const url = input.value.trim();
    if (!url) return;
    let normalized = url;
    if (!/^https?:\/\//i.test(normalized)) normalized = "https://" + normalized;
    const kind = classifyUrl(normalized);
    if (!state.outputs[m.id]) state.outputs[m.id] = [];
    state.outputs[m.id].push({ url: normalized, kind, label: labelForUrl(normalized, kind) });
    save();
    input.value = "";
    rerenderModule(m);
    renderHeaderStats();
    renderGather();
    toast("Output linked");
  };
  addBtn.addEventListener("click", commit);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") commit(); });
  add.appendChild(input);
  add.appendChild(addBtn);
  actions.appendChild(add);

  wrap.appendChild(actions);
  return wrap;
}

function renderChip(m, o, idx) {
  const chip = el("div", "output-chip");
  chip.appendChild(el("span", "kind-ico", OUTPUT_ICON[o.kind] || "🔗"));
  const a = el("a", null, o.label || o.url);
  a.href = o.url; a.target = "_blank"; a.rel = "noopener";
  chip.appendChild(a);
  const rm = el("button", "rm", "×");
  rm.title = "Remove this link";
  rm.addEventListener("click", () => {
    state.outputs[m.id].splice(idx, 1);
    if (state.outputs[m.id].length === 0) delete state.outputs[m.id];
    save();
    rerenderModule(m);
    renderHeaderStats();
    renderGather();
  });
  chip.appendChild(rm);
  return chip;
}

/* re-render a single module in place */
function rerenderModule(m) {
  const old = document.querySelector(`.module[data-module-id="${m.id}"]`);
  if (old) old.replaceWith(renderModule(m));
}
function refreshCounts(m) {
  // update module frac + phase mini + header without full rerender
  const modEl = document.querySelector(`.module[data-module-id="${m.id}"]`);
  const s = moduleStats(m);
  if (modEl) {
    modEl.classList.toggle("complete", s.total > 0 && s.done === s.total);
    modEl.querySelector(".m-frac").textContent = `${s.done}/${s.total}`;
  }
  // simplest reliable path for phase bars + header: re-render bars
  CURRICULUM.phases.forEach((p) => {
    if (!p.modules.some((mm) => mm.id === m.id)) return;
    const ps = phaseStats(p);
    // find phase element by matching heading text is brittle; re-render everything cheaply:
  });
  renderPhaseBars();
  renderHeaderStats();
}

/* update every phase mini bar from state (cheap) */
function renderPhaseBars() {
  const phases = document.querySelectorAll(".phase");
  phases.forEach((node, idx) => {
    const p = CURRICULUM.phases[idx];
    if (!p) return;
    const s = phaseStats(p);
    const bar = node.querySelector(".mini .bar");
    bar.querySelector("span").style.width = pct(s.done, s.total) + "%";
    bar.classList.toggle("done", s.done === s.total && s.total > 0);
    node.querySelector(".mini .frac").textContent = `${s.done}/${s.total}`;
  });
}

/* ---------- gather (outputs summary) ---------- */
function renderGather() {
  const box = document.getElementById("gather-body");
  box.innerHTML = "";
  const total = outputCount();
  if (total === 0) {
    box.appendChild(
      el("div", "gather-empty",
        "Nothing collected yet. As you complete deliverables, link the Google Docs and GitHub repos on each module — they'll all gather here for a single review.")
    );
    return;
  }
  const groups = { doc: [], repo: [], link: [] };
  CURRICULUM.phases.forEach((p) =>
    p.modules.forEach((m) => {
      (state.outputs[m.id] || []).forEach((o) =>
        groups[o.kind === "doc" ? "doc" : o.kind === "repo" ? "repo" : "link"].push({ m, o })
      );
    })
  );
  const titles = { doc: "📝 Google Docs", repo: "🐙 GitHub repos", link: "🔗 Other links" };
  ["doc", "repo", "link"].forEach((k) => {
    if (groups[k].length === 0) return;
    const g = el("div", "gather-group");
    g.appendChild(el("h4", null, `${titles[k]} · ${groups[k].length}`));
    const list = el("div", "output-list");
    groups[k].forEach(({ m, o }) => {
      const chip = el("div", "output-chip");
      chip.appendChild(el("span", "kind-ico", OUTPUT_ICON[o.kind] || "🔗"));
      const a = el("a", null, `${o.label} — ${m.title}`);
      a.href = o.url; a.target = "_blank"; a.rel = "noopener";
      chip.appendChild(a);
      list.appendChild(chip);
    });
    g.appendChild(list);
    box.appendChild(g);
  });
}

/* ---------- export / import / reset ---------- */
function exportState() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "curriculum-progress.json";
  a.click();
  URL.revokeObjectURL(url);
  toast("Progress exported");
}
function importState(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const s = JSON.parse(reader.result);
      state = { topics: s.topics || {}, outputs: s.outputs || {}, collapsed: s.collapsed || {} };
      save();
      render();
      toast("Progress imported");
    } catch (e) {
      toast("Could not read that file");
    }
  };
  reader.readAsText(file);
}
function resetAll() {
  if (!confirm("Reset all progress and clear all linked outputs? This cannot be undone.")) return;
  state = { topics: {}, outputs: {}, collapsed: {} };
  save();
  render();
  toast("Everything reset");
}
function setCollapsed(val) {
  CURRICULUM.phases.forEach((p) => { state.collapsed[p.id] = val; });
  save();
  render();
}

/* ---------- wire up ---------- */
document.addEventListener("DOMContentLoaded", () => {
  render();
  document.getElementById("btn-export").addEventListener("click", exportState);
  document.getElementById("btn-reset").addEventListener("click", resetAll);
  document.getElementById("btn-expand").addEventListener("click", () => setCollapsed(false));
  document.getElementById("btn-collapse").addEventListener("click", () => setCollapsed(true));
  const importInput = document.getElementById("import-file");
  document.getElementById("btn-import").addEventListener("click", () => importInput.click());
  importInput.addEventListener("change", (e) => {
    if (e.target.files[0]) importState(e.target.files[0]);
    e.target.value = "";
  });
});
