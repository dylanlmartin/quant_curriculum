// Optional cross-device sync via a private GitHub Gist.
//
// Why a gist: this is a static site (GitHub Pages, no backend). The GitHub REST
// API supports CORS, so the browser can read/write a private gist directly with
// a personal-access token that has only the `gist` scope. Progress then syncs
// across any device where you connect the same token + gist.
//
// Strategy: whole-state last-write-wins by `updatedAt` timestamp. On connect and
// on load we pull; if the remote is newer we adopt it, if local is newer we push.
// Local changes trigger a debounced push.

(function () {
  const CONFIG_KEY = "alpha-curriculum-sync-v1";
  const GIST_FILE = "alpha-curriculum-progress.json";
  const API = "https://api.github.com";

  let cfg = loadConfig(); // { token, gistId, auto }
  let pushTimer = null;
  let busy = false;

  function loadConfig() {
    try {
      return Object.assign({ token: "", gistId: "", auto: true }, JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}"));
    } catch (e) {
      return { token: "", gistId: "", auto: true };
    }
  }
  function saveConfig() {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
  }
  const connected = () => !!(cfg.token && cfg.gistId);

  // ---------- GitHub API ----------
  async function api(path, opts = {}) {
    const res = await fetch(API + path, {
      ...opts,
      headers: {
        Authorization: "Bearer " + cfg.token,
        Accept: "application/vnd.github+json",
        ...(opts.body ? { "Content-Type": "application/json" } : {}),
      },
    });
    if (!res.ok) {
      let detail = res.status + " " + res.statusText;
      try {
        const j = await res.json();
        if (j.message) detail = j.message;
      } catch (e) {}
      const err = new Error(detail);
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  function currentSnapshot() {
    const s = window.Tracker.state;
    return { checked: s.checked, outputs: s.outputs, updatedAt: s.updatedAt || 0 };
  }

  async function createGist() {
    const body = {
      description: "Alpha Lifecycle Curriculum — progress sync",
      public: false,
      files: { [GIST_FILE]: { content: JSON.stringify(currentSnapshot(), null, 2) } },
    };
    const g = await api("/gists", { method: "POST", body: JSON.stringify(body) });
    cfg.gistId = g.id;
    saveConfig();
    return g;
  }

  async function pullRemote() {
    const g = await api("/gists/" + cfg.gistId);
    const file = g.files && g.files[GIST_FILE];
    if (!file) throw new Error("Sync file not found in gist " + cfg.gistId);
    // Large gists come back truncated; fall back to the raw URL.
    let content = file.content;
    if (file.truncated && file.raw_url) content = await (await fetch(file.raw_url)).text();
    return JSON.parse(content);
  }

  async function pushLocal() {
    const body = { files: { [GIST_FILE]: { content: JSON.stringify(currentSnapshot(), null, 2) } } };
    await api("/gists/" + cfg.gistId, { method: "PATCH", body: JSON.stringify(body) });
  }

  // Pull remote, adopt if newer, otherwise push local if newer.
  async function syncNow(silent) {
    if (!connected() || busy) return;
    busy = true;
    setStatus("Syncing…");
    try {
      const remote = await pullRemote();
      const local = currentSnapshot();
      const rt = remote.updatedAt || 0;
      const lt = local.updatedAt || 0;
      if (rt > lt) {
        window.Tracker.adoptRemote(remote);
        setStatus("Pulled newer progress from sync.");
        if (!silent) window.Tracker.flash("Synced — pulled newer progress.");
      } else if (lt > rt) {
        await pushLocal();
        setStatus("Pushed your progress to sync.");
        if (!silent) window.Tracker.flash("Synced — pushed your progress.");
      } else {
        setStatus("Already up to date.");
      }
    } catch (e) {
      setStatus("Sync error: " + e.message, true);
      if (!silent) window.Tracker.flash("Sync error: " + e.message, true);
    } finally {
      busy = false;
      renderPanel();
    }
  }

  function schedulePush() {
    if (!connected() || !cfg.auto) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(async () => {
      if (busy) return;
      busy = true;
      setStatus("Auto-syncing…");
      try {
        await pushLocal();
        setStatus("Auto-synced " + timeNow() + ".");
      } catch (e) {
        setStatus("Auto-sync error: " + e.message, true);
      } finally {
        busy = false;
        renderPanel();
      }
    }, 1500);
  }

  // ---------- UI ----------
  function timeNow() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  function setStatus(msg, isErr) {
    const el = document.getElementById("sync-status");
    if (el) {
      el.textContent = msg;
      el.style.color = isErr ? "#f85149" : "var(--text-dim)";
    }
  }
  function openModal() {
    renderPanel();
    document.getElementById("sync-modal").classList.add("open");
  }
  function closeModal() {
    document.getElementById("sync-modal").classList.remove("open");
  }

  function renderPanel() {
    const body = document.getElementById("sync-body");
    if (!body) return;
    if (connected()) {
      body.innerHTML = `
        <p class="sync-connected">✓ Connected · gist <code>${cfg.gistId}</code>
          <button class="btn" id="sync-copy">Copy ID</button></p>
        <label class="sync-toggle"><input type="checkbox" id="sync-auto" ${cfg.auto ? "checked" : ""}/>
          Auto-sync when I make changes</label>
        <div class="sync-actions">
          <button class="btn primary" id="sync-now">Sync now</button>
          <button class="btn" id="sync-disconnect">Disconnect this device</button>
        </div>
        <p class="sync-hint">To sync another device: open this page there, click Sync, paste the
          same token and this gist ID, then Connect.</p>
        <p id="sync-status" class="sync-status"></p>`;
      byId("sync-copy").onclick = () => {
        navigator.clipboard?.writeText(cfg.gistId);
        window.Tracker.flash("Gist ID copied.");
      };
      byId("sync-auto").onchange = (e) => {
        cfg.auto = e.target.checked;
        saveConfig();
      };
      byId("sync-now").onclick = () => syncNow(false);
      byId("sync-disconnect").onclick = () => {
        if (confirm("Disconnect sync on this device? Your progress stays here; it just stops syncing.")) {
          cfg = { token: "", gistId: "", auto: true };
          saveConfig();
          renderPanel();
        }
      };
    } else {
      body.innerHTML = `
        <p class="sync-intro">Sync progress across devices through a <strong>private GitHub gist</strong>.
          Create a token with only the <code>gist</code> scope, paste it below, and connect.</p>
        <a class="btn new-doc" id="sync-token-link" href="https://github.com/settings/tokens/new?scopes=gist&description=Curriculum+Tracker+Sync" target="_blank" rel="noopener">Create a token ↗</a>
        <label class="sync-field">GitHub token
          <input type="password" id="sync-token" placeholder="ghp_… (gist scope only)" autocomplete="off" />
        </label>
        <label class="sync-field">Gist ID <span class="opt">(leave blank to create a new one)</span>
          <input type="text" id="sync-gistid" placeholder="paste an existing sync gist ID to join it" autocomplete="off" />
        </label>
        <div class="sync-actions">
          <button class="btn primary" id="sync-connect">Connect &amp; sync</button>
        </div>
        <p class="sync-warn">⚠ The token is stored only in this browser's localStorage. Use a token
          scoped to <code>gist</code> only, and don't do this on a shared computer.</p>
        <p id="sync-status" class="sync-status"></p>`;
      byId("sync-connect").onclick = connect;
    }
    updateButton();
  }

  async function connect() {
    const token = byId("sync-token").value.trim();
    const gistId = byId("sync-gistid").value.trim();
    if (!token) {
      setStatus("Paste a GitHub token first.", true);
      return;
    }
    cfg.token = token;
    setStatus("Connecting…");
    try {
      if (gistId) {
        cfg.gistId = gistId;
        saveConfig();
        await syncNow(true); // pull/merge
      } else {
        await createGist();
        setStatus("Created a private sync gist.");
      }
      saveConfig();
      renderPanel();
      window.Tracker.flash("Sync connected.");
    } catch (e) {
      setStatus("Could not connect: " + e.message, true);
      cfg.token = ""; // don't persist a token we couldn't use
    }
  }

  const byId = (id) => document.getElementById(id);

  // ---------- Init ----------
  function init() {
    byId("btn-sync").onclick = openModal;
    byId("sync-close").onclick = closeModal;
    byId("sync-modal").addEventListener("click", (e) => {
      if (e.target.id === "sync-modal") closeModal();
    });
    // Reflect connection state on the toolbar button.
    updateButton();
    window.Tracker.onLocalChange(() => {
      schedulePush();
      updateButton();
    });
    // On load, pull anything newer from the remote.
    if (connected() && cfg.auto) syncNow(true).then(updateButton);
  }

  function updateButton() {
    const b = byId("btn-sync");
    if (b) {
      b.textContent = connected() ? "Sync ●" : "Sync";
      b.classList.toggle("on", connected());
    }
  }

  window.CurriculumSync = { init, syncNow };
})();
