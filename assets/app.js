// Interactive curriculum tracker.
// State (checked items + collected output links) is persisted to localStorage
// so progress survives reloads. Data comes from CURRICULUM (curriculum.js).

const STORAGE_KEY = "alpha-curriculum-progress-v1";
const $ = (sel, el = document) => el.querySelector(sel);

// ---------- State ----------
// checked[id] is tri-state: true = done, "wip" = in progress, absent = not started.
function loadState() {
  const empty = { checked: {}, outputs: {}, counters: {}, startDate: null, updatedAt: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const s = JSON.parse(raw);
    return {
      checked: s.checked || {},
      outputs: s.outputs || {},
      counters: s.counters || {},
      startDate: s.startDate || null,
      updatedAt: s.updatedAt || 0,
    };
  } catch (e) {
    return empty;
  }
}
let state = loadState();

// Per-device UI prefs (collapsed phases). Kept out of the synced state on
// purpose — collapse is a viewing preference, not learning progress.
const UI_KEY = "alpha-curriculum-ui-v1";
let ui = (() => {
  try {
    return JSON.parse(localStorage.getItem(UI_KEY) || "{}");
  } catch (e) {
    return {};
  }
})();
function saveUi() {
  localStorage.setItem(UI_KEY, JSON.stringify(ui));
}

// Low-level persistence — writes exactly what it's given, no timestamp bump.
function writeStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Called for every *local* change: stamps the change time, persists, and lets
// the sync layer (if any) push it to the remote gist.
let localChangeHook = null;
function saveState() {
  state.updatedAt = Date.now();
  writeStorage();
  if (localChangeHook) localChangeHook();
}

// ---------- Helpers ----------
const CHECK_SVG =
  '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.2L4.8 8.5L9.5 3.5" stroke="#0e1116" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function classifyLink(url) {
  const u = url.toLowerCase();
  if (u.includes("docs.google.com") || u.includes("drive.google.com")) return "doc";
  if (u.includes("github.com") || u.includes("gitlab.com")) return "repo";
  return "link";
}
function tagLabel(kind) {
  return kind === "doc" ? "Doc" : kind === "repo" ? "Repo" : "Link";
}
function normalizeUrl(raw) {
  let url = raw.trim();
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try {
    new URL(url);
    return url;
  } catch (e) {
    return null;
  }
}

// Collect every checkable item id from the data model.
function allItemIds() {
  const ids = [];
  CURRICULUM.phases.forEach((p) =>
    p.sections.forEach((s) => s.items.forEach((i) => ids.push(i.id)))
  );
  return ids;
}
function phaseItemIds(phase) {
  const ids = [];
  phase.sections.forEach((s) => s.items.forEach((i) => ids.push(i.id)));
  return ids;
}

function itemStatus(id) {
  const v = state.checked[id];
  return v === true ? "done" : v === "wip" ? "wip" : "todo";
}

// First not-done item in curriculum order — the natural resume point.
function firstPending() {
  for (const p of CURRICULUM.phases)
    for (const s of p.sections)
      for (const i of s.items)
        if (itemStatus(i.id) !== "done")
          return { item: i, phaseId: p.id, phaseShort: p.name.replace(/ —.*/, "") };
  return null;
}

// Which month of the plan we're in, from the user-set start date.
// null = no start date; 0 = start date is in the future.
function monthNow() {
  if (!state.startDate) return null;
  const start = new Date(state.startDate + "T00:00:00");
  if (isNaN(start.getTime())) return null;
  const days = (Date.now() - start.getTime()) / 86400000;
  if (days < 0) return 0;
  return Math.floor(days / 30.44) + 1;
}

// ---------- Rendering ----------
function render() {
  renderMeta();
  renderNav();
  renderPhases();
  renderCheckpoints();
  renderCut();
  updateProgress();
}

function renderMeta() {
  const m = CURRICULUM.meta;
  $("#hero-title").textContent = CURRICULUM.title;
  $("#hero-sub").textContent = CURRICULUM.subtitle;
  document.title = CURRICULUM.title + " — Tracker";
  $("#meta").innerHTML = `
    <p class="test">${m.test}</p>
    <p class="assump">${m.assumptions}</p>
    <h4>Weekly time allocation (steady state)</h4>
    <ul>${m.allocation.map((a) => `<li>${a}</li>`).join("")}</ul>
    <p class="hint">Checkboxes have three states — tap once for <strong>in progress</strong>,
    again for <strong>done</strong>, a third time to clear. Set your start date in the header
    to see which phase and checkpoint you should be on.</p>`;
}

function renderNav() {
  $("#jump").innerHTML = CURRICULUM.phases
    .map((p) => `<a href="#${p.id}">${p.name.replace(/ —.*/, "")}</a>`)
    .join("") + `<a href="#checkpoints">Checkpoints</a>`;
}

function renderPhases() {
  const root = $("#phases");
  root.innerHTML = "";
  const cur = monthNow();
  CURRICULUM.phases.forEach((phase) => {
    const pids = phaseItemIds(phase);
    const allDone = pids.length > 0 && pids.every((id) => itemStatus(id) === "done");
    // Explicit user preference wins; otherwise collapse finished phases.
    const collapsed = ui.collapsed?.[phase.id] ?? allDone;
    const inWindow =
      cur && phase.monthRange && cur >= phase.monthRange[0] && cur <= phase.monthRange[1];
    const el = document.createElement("section");
    el.className = "phase" + (collapsed ? " collapsed" : "");
    el.id = phase.id;
    el.innerHTML = `
      <div class="phase-head">
        <div class="row" data-phead="${phase.id}" role="button" tabindex="0" aria-expanded="${!collapsed}">
          <span class="chev" aria-hidden="true">▾</span>
          <h2>${phase.name}</h2>
          <span class="months">${phase.months}</span>
          ${inWindow ? '<span class="now-badge">now</span>' : ""}
        </div>
        <p class="blurb">${phase.blurb}</p>
        <div class="pbar" data-phase="${phase.id}"><span></span></div>
        <div class="pcount" data-pcount="${phase.id}"></div>
      </div>
      <div class="phase-body">${phase.sections.map(renderSection).join("")}</div>`;
    root.appendChild(el);
  });
}

function renderSection(section) {
  return `
    <div class="section">
      <h3>${section.name}</h3>
      ${section.note ? `<p class="snote">${section.note}</p>` : ""}
      ${section.items.map(renderItem).join("")}
    </div>`;
}

function renderItem(item) {
  const s = itemStatus(item.id);
  const aria = s === "done" ? "true" : s === "wip" ? "mixed" : "false";
  const links = item.links
    ? `<div class="links">${item.links
        .map((l) => `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`)
        .join("")}</div>`
    : "";
  return `
    <div class="item ${s === "done" ? "checked" : s === "wip" ? "wip" : ""}" data-id="${item.id}">
      <div class="box" role="checkbox" aria-checked="${aria}" tabindex="0" data-toggle="${item.id}">${CHECK_SVG}<span class="wipdot"></span></div>
      <div class="body">
        <div class="title">${item.title}</div>
        ${item.html ? `<div class="desc">${item.html}</div>` : ""}
        ${links}
        ${item.counter ? renderCounter(item.counter) : ""}
        ${item.output ? renderOutputs(item.id) : ""}
      </div>
    </div>`;
}

function renderCounter(c) {
  const n = state.counters[c.key] || 0;
  const met = n >= c.target;
  return `
    <div class="counter ${met ? "met" : ""}" data-key="${c.key}" data-target="${c.target}" data-unit="${c.unit}">
      <button class="btn cbtn" data-cminus="${c.key}" aria-label="decrease">−</button>
      <span class="cn">${n}</span><span class="ct">/ ${c.target} ${c.unit}</span>
      <button class="btn cbtn" data-cplus="${c.key}" aria-label="increase">+</button>
      ${met ? '<span class="cok">✓ target met</span>' : ""}
    </div>`;
}

function renderOutputs(id) {
  const list = state.outputs[id] || [];
  return `
    <div class="outputs" data-outputs="${id}">
      <div class="oh">◆ Outputs — collect your Google Docs &amp; GitHub repos here</div>
      <ul class="out-list">${list.map((o, i) => renderOutputRow(id, o, i)).join("")}</ul>
      <div class="out-add">
        <input type="text" placeholder="Paste a Google Doc or GitHub URL…" data-input="${id}" />
        <button class="btn primary" data-save="${id}">Save link</button>
        <button class="btn new-doc" data-newdoc="${id}">＋ New Doc</button>
        <button class="btn new-repo" data-newrepo="${id}">＋ New Repo</button>
      </div>
    </div>`;
}

function renderOutputRow(id, o, i) {
  const kind = classifyLink(o.url);
  return `<li>
    <span class="tag ${kind}">${tagLabel(kind)}</span>
    <a href="${o.url}" target="_blank" rel="noopener" title="${o.url}">${o.url}</a>
    <button class="rm" data-rm="${id}" data-idx="${i}" title="Remove">✕</button>
  </li>`;
}

function renderCheckpoints() {
  $("#checkpoints").innerHTML = `
    <h2>Progress checkpoints</h2>
    <div class="timeline">
      ${CURRICULUM.checkpoints
        .map(
          (c) =>
            `<div class="cp" data-month="${c.month}"><div class="m">Mo ${c.month}</div><div class="t">${c.text}</div></div>`
        )
        .join("")}
    </div>`;
  decorateCheckpoints();
}

// Mark checkpoints as behind-you / the-one-to-aim-for based on the plan month.
function decorateCheckpoints() {
  const cur = monthNow();
  let marked = false;
  document.querySelectorAll(".cp").forEach((row) => {
    row.classList.remove("past", "current");
    if (!cur) return;
    const m = Number(row.dataset.month);
    if (m < cur) row.classList.add("past");
    else if (!marked) {
      row.classList.add("current");
      marked = true;
    }
  });
}

function renderCut() {
  $("#cut").innerHTML = `
    <h2>Explicitly cut (resist the temptation)</h2>
    <p class="cutnote">${CURRICULUM.cutNote}</p>
    <ul>${CURRICULUM.cut.map((c) => `<li>${c}</li>`).join("")}</ul>`;
}

// ---------- Progress ----------
function updateProgress() {
  const ids = allItemIds();
  const done = ids.filter((id) => itemStatus(id) === "done").length;
  const wip = ids.filter((id) => itemStatus(id) === "wip").length;
  const pct = ids.length ? Math.round((done / ids.length) * 100) : 0;

  $("#ring-fg").style.strokeDashoffset = String(264 - (264 * pct) / 100);
  $("#ring-pct").textContent = pct + "%";
  $("#stat-done").textContent = done;
  $("#stat-total").textContent = ids.length;
  $("#stat-wip").textContent = wip;

  const outCount = Object.values(state.outputs).reduce((n, arr) => n + arr.length, 0);
  $("#stat-outputs").textContent = outCount;

  CURRICULUM.phases.forEach((phase) => {
    const pids = phaseItemIds(phase);
    const pdone = pids.filter((id) => itemStatus(id) === "done").length;
    const pwip = pids.filter((id) => itemStatus(id) === "wip").length;
    const ppct = pids.length ? Math.round((pdone / pids.length) * 100) : 0;
    const bar = document.querySelector(`.pbar[data-phase="${phase.id}"]`);
    if (bar) {
      bar.querySelector("span").style.width = ppct + "%";
      bar.classList.toggle("done", ppct === 100);
    }
    const count = document.querySelector(`[data-pcount="${phase.id}"]`);
    if (count)
      count.textContent = `${pdone} done${pwip ? ` · ${pwip} in progress` : ""} / ${pids.length}`;
  });

  renderUpNext();
  updatePacing();
  decorateCheckpoints();
}

function renderUpNext() {
  const el = $("#upnext");
  if (!el) return;
  const nxt = firstPending();
  el.innerHTML = nxt
    ? `Up next: <a href="#" id="upnext-link">${nxt.item.title}</a> <span class="un-phase">${nxt.phaseShort}</span>`
    : "Every item complete — curriculum finished 🎉";
}

function goToNext() {
  const nxt = firstPending();
  if (!nxt) return;
  const phaseEl = document.getElementById(nxt.phaseId);
  if (phaseEl && phaseEl.classList.contains("collapsed")) toggleCollapse(nxt.phaseId);
  const el = document.querySelector(`.item[data-id="${nxt.item.id}"]`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.remove("pulse");
  void el.offsetWidth; // restart the animation
  el.classList.add("pulse");
}

function updatePacing() {
  const input = $("#start-date");
  const ind = $("#month-ind");
  if (!input || !ind) return;
  if (document.activeElement !== input) input.value = state.startDate || "";
  const cur = monthNow();
  ind.textContent = !state.startDate
    ? ""
    : cur === 0
      ? "starts soon"
      : cur <= 12
        ? `Month ${cur} of 12`
        : `Month ${cur} — beyond the 12-month window`;
}

// ---------- Events ----------
// Cycle: not started → in progress → done → not started.
function toggle(id) {
  const cur = itemStatus(id);
  if (cur === "todo") state.checked[id] = "wip";
  else if (cur === "wip") state.checked[id] = true;
  else delete state.checked[id];
  saveState();
  const s = itemStatus(id);
  const item = document.querySelector(`.item[data-id="${id}"]`);
  if (item) {
    item.classList.toggle("checked", s === "done");
    item.classList.toggle("wip", s === "wip");
    const box = item.querySelector(".box");
    if (box)
      box.setAttribute("aria-checked", s === "done" ? "true" : s === "wip" ? "mixed" : "false");
  }
  updateProgress();
}

function toggleCollapse(pid) {
  const el = document.getElementById(pid);
  if (!el) return;
  const nowCollapsed = !el.classList.contains("collapsed");
  ui.collapsed = ui.collapsed || {};
  ui.collapsed[pid] = nowCollapsed;
  saveUi();
  el.classList.toggle("collapsed", nowCollapsed);
  const head = el.querySelector("[data-phead]");
  if (head) head.setAttribute("aria-expanded", String(!nowCollapsed));
}

function bumpCounter(key, delta) {
  state.counters[key] = Math.max(0, (state.counters[key] || 0) + delta);
  saveState();
  document.querySelectorAll(`.counter[data-key="${key}"]`).forEach((c) => {
    const n = state.counters[key] || 0;
    const target = Number(c.dataset.target);
    c.querySelector(".cn").textContent = n;
    const met = n >= target;
    c.classList.toggle("met", met);
    const ok = c.querySelector(".cok");
    if (met && !ok) c.insertAdjacentHTML("beforeend", '<span class="cok">✓ target met</span>');
    if (!met && ok) ok.remove();
  });
}

function addOutput(id, rawUrl) {
  const url = normalizeUrl(rawUrl);
  if (!url) {
    flash("That doesn't look like a valid URL.", true);
    return false;
  }
  if (!state.outputs[id]) state.outputs[id] = [];
  state.outputs[id].push({ url });
  saveState();
  refreshOutputs(id);
  updateProgress();
  flash("Output link saved.");
  return true;
}

function removeOutput(id, idx) {
  if (!state.outputs[id]) return;
  state.outputs[id].splice(idx, 1);
  if (state.outputs[id].length === 0) delete state.outputs[id];
  saveState();
  refreshOutputs(id);
  updateProgress();
}

function refreshOutputs(id) {
  const container = document.querySelector(`[data-outputs="${id}"] .out-list`);
  if (!container) return;
  const list = state.outputs[id] || [];
  container.innerHTML = list.map((o, i) => renderOutputRow(id, o, i)).join("");
}

let flashTimer = null;
function flash(msg, isError = false) {
  const el = $("#toolbar-msg");
  el.textContent = msg;
  el.style.color = isError ? "#f85149" : "var(--good)";
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => (el.textContent = ""), 2600);
}

// Delegated click handling for the whole document.
document.addEventListener("click", (e) => {
  if (e.target.id === "upnext-link") {
    e.preventDefault();
    return goToNext();
  }
  const t = e.target.closest(
    "[data-toggle],[data-save],[data-newdoc],[data-newrepo],[data-rm],[data-phead],[data-cplus],[data-cminus]"
  );
  if (!t) return;

  if (t.dataset.toggle) return toggle(t.dataset.toggle);
  if (t.dataset.phead) return toggleCollapse(t.dataset.phead);
  if (t.dataset.cplus) return bumpCounter(t.dataset.cplus, 1);
  if (t.dataset.cminus) return bumpCounter(t.dataset.cminus, -1);

  if (t.dataset.save) {
    const input = document.querySelector(`[data-input="${t.dataset.save}"]`);
    if (input && addOutput(t.dataset.save, input.value)) input.value = "";
    return;
  }
  if (t.dataset.rm) return removeOutput(t.dataset.rm, Number(t.dataset.idx));

  if (t.dataset.newdoc) {
    window.open("https://docs.new", "_blank", "noopener");
    focusInput(t.dataset.newdoc);
    flash("New Google Doc opened — paste its URL back here when ready.");
    return;
  }
  if (t.dataset.newrepo) {
    window.open("https://github.com/new", "_blank", "noopener");
    focusInput(t.dataset.newrepo);
    flash("New-repo page opened — paste the repo URL back here when ready.");
    return;
  }
});

function focusInput(id) {
  const input = document.querySelector(`[data-input="${id}"]`);
  if (input) input.focus();
}

// Enter-to-save inside output inputs; Space/Enter toggles a focused checkbox.
document.addEventListener("keydown", (e) => {
  if (e.target.matches("input[data-input]") && e.key === "Enter") {
    e.preventDefault();
    const id = e.target.dataset.input;
    if (addOutput(id, e.target.value)) e.target.value = "";
  }
  if (e.target.matches(".box[data-toggle]") && (e.key === " " || e.key === "Enter")) {
    e.preventDefault();
    toggle(e.target.dataset.toggle);
  }
  if (e.target.matches("[data-phead]") && (e.key === " " || e.key === "Enter")) {
    e.preventDefault();
    toggleCollapse(e.target.dataset.phead);
  }
});

// Start-date control drives the pacing display.
$("#start-date").addEventListener("change", (e) => {
  state.startDate = e.target.value || null;
  saveState();
  render();
});

// ---------- Export / import / reset ----------
function exportState() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "curriculum-progress.json";
  a.click();
  URL.revokeObjectURL(url);
  flash("Progress exported.");
}

function importState(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const s = JSON.parse(reader.result);
      state = {
        checked: s.checked || {},
        outputs: s.outputs || {},
        counters: s.counters || {},
        startDate: s.startDate || null,
      };
      saveState();
      render();
      flash("Progress imported.");
    } catch (err) {
      flash("Could not read that file.", true);
    }
  };
  reader.readAsText(file);
}

$("#btn-export").addEventListener("click", exportState);
$("#btn-import").addEventListener("click", () => $("#import-file").click());
$("#import-file").addEventListener("change", (e) => {
  if (e.target.files[0]) importState(e.target.files[0]);
  e.target.value = "";
});
$("#btn-reset").addEventListener("click", () => {
  if (confirm("Reset all progress and saved output links? This cannot be undone.")) {
    state = { checked: {}, outputs: {}, counters: {}, startDate: null };
    saveState();
    render();
    flash("Progress reset.");
  }
});

// ---------- Public API (used by the optional sync layer) ----------
window.Tracker = {
  STORAGE_KEY,
  get state() {
    return state;
  },
  // Replace local state with a remote snapshot WITHOUT bumping updatedAt,
  // then re-render. Used when a newer version is pulled from the sync gist.
  adoptRemote(remote) {
    state = {
      checked: remote.checked || {},
      outputs: remote.outputs || {},
      counters: remote.counters || {},
      startDate: remote.startDate || null,
      updatedAt: remote.updatedAt || 0,
    };
    writeStorage();
    render();
  },
  // Register a callback fired after every local change (for auto-push).
  onLocalChange(cb) {
    localChangeHook = cb;
  },
  flash,
  render,
};

// ---------- Go ----------
render();
if (window.CurriculumSync) window.CurriculumSync.init();
