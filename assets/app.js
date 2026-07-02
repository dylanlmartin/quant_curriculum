// Interactive curriculum tracker.
// State (checked items + collected output links) is persisted to localStorage
// so progress survives reloads. Data comes from CURRICULUM (curriculum.js).

const STORAGE_KEY = "alpha-curriculum-progress-v1";
const $ = (sel, el = document) => el.querySelector(sel);

// ---------- State ----------
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { checked: {}, outputs: {} };
    const s = JSON.parse(raw);
    return { checked: s.checked || {}, outputs: s.outputs || {} };
  } catch (e) {
    return { checked: {}, outputs: {} };
  }
}
let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
    <ul>${m.allocation.map((a) => `<li>${a}</li>`).join("")}</ul>`;
}

function renderNav() {
  $("#jump").innerHTML = CURRICULUM.phases
    .map((p) => `<a href="#${p.id}">${p.name.replace(/ —.*/, "")}</a>`)
    .join("") + `<a href="#checkpoints">Checkpoints</a>`;
}

function renderPhases() {
  const root = $("#phases");
  root.innerHTML = "";
  CURRICULUM.phases.forEach((phase) => {
    const el = document.createElement("section");
    el.className = "phase";
    el.id = phase.id;
    el.innerHTML = `
      <div class="phase-head">
        <div class="row">
          <h2>${phase.name}</h2>
          <span class="months">${phase.months}</span>
        </div>
        <p class="blurb">${phase.blurb}</p>
        <div class="pbar" data-phase="${phase.id}"><span></span></div>
        <div class="pcount" data-pcount="${phase.id}"></div>
      </div>
      ${phase.sections.map(renderSection).join("")}`;
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
  const checked = !!state.checked[item.id];
  const links = item.links
    ? `<div class="links">${item.links
        .map((l) => `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`)
        .join("")}</div>`
    : "";
  return `
    <div class="item ${checked ? "checked" : ""}" data-id="${item.id}">
      <div class="box" role="checkbox" aria-checked="${checked}" tabindex="0" data-toggle="${item.id}">${CHECK_SVG}</div>
      <div class="body">
        <div class="title">${item.title}</div>
        ${item.html ? `<div class="desc">${item.html}</div>` : ""}
        ${links}
        ${item.output ? renderOutputs(item.id) : ""}
      </div>
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
          (c) => `<div class="cp"><div class="m">Mo ${c.month}</div><div class="t">${c.text}</div></div>`
        )
        .join("")}
    </div>`;
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
  const done = ids.filter((id) => state.checked[id]).length;
  const pct = ids.length ? Math.round((done / ids.length) * 100) : 0;

  $("#ring-fg").style.strokeDashoffset = String(264 - (264 * pct) / 100);
  $("#ring-pct").textContent = pct + "%";
  $("#stat-done").textContent = done;
  $("#stat-total").textContent = ids.length;

  const outCount = Object.values(state.outputs).reduce((n, arr) => n + arr.length, 0);
  $("#stat-outputs").textContent = outCount;

  CURRICULUM.phases.forEach((phase) => {
    const pids = phaseItemIds(phase);
    const pdone = pids.filter((id) => state.checked[id]).length;
    const ppct = pids.length ? Math.round((pdone / pids.length) * 100) : 0;
    const bar = document.querySelector(`.pbar[data-phase="${phase.id}"]`);
    if (bar) {
      bar.querySelector("span").style.width = ppct + "%";
      bar.classList.toggle("done", ppct === 100);
    }
    const count = document.querySelector(`[data-pcount="${phase.id}"]`);
    if (count) count.textContent = `${pdone} / ${pids.length} complete`;
  });
}

// ---------- Events ----------
function toggle(id) {
  state.checked[id] = !state.checked[id];
  saveState();
  const item = document.querySelector(`.item[data-id="${id}"]`);
  if (item) {
    item.classList.toggle("checked", !!state.checked[id]);
    const box = item.querySelector(".box");
    if (box) box.setAttribute("aria-checked", String(!!state.checked[id]));
  }
  updateProgress();
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
  const t = e.target.closest("[data-toggle],[data-save],[data-newdoc],[data-newrepo],[data-rm]");
  if (!t) return;

  if (t.dataset.toggle) return toggle(t.dataset.toggle);

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
      state = { checked: s.checked || {}, outputs: s.outputs || {} };
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
    state = { checked: {}, outputs: {} };
    saveState();
    render();
    flash("Progress reset.");
  }
});

// ---------- Go ----------
render();
