import { DurableObject } from "cloudflare:workers";

const PAGE_STYLE = `
:root{color-scheme:light;--ink:#171717;--muted:#707070;--line:#dedede;--soft:#f6f6f4;--good:#147a45;--bad:#a33a32}
*{box-sizing:border-box}body{margin:0;background:#fff;color:var(--ink);font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
a{color:inherit;text-decoration:none}a:hover{text-decoration:underline}
header,main{width:min(920px,calc(100% - 36px));margin-inline:auto}
header{padding:24px 0 18px;display:flex;align-items:center;justify-content:space-between;gap:24px}
.tagline{margin:0;color:var(--muted);font-size:15px}
nav{display:flex;gap:18px;white-space:nowrap;font-size:13px;color:var(--muted)}main{padding:30px 0 48px;min-height:58vh}
h1{margin:0 0 6px;font-size:26px;line-height:1.2;letter-spacing:-.7px}h2{margin:0 0 6px;font-size:19px;letter-spacing:-.25px}
.intro{margin:0 0 24px;color:var(--muted);font-size:14px}.section-head{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:14px}.count{font-size:12px;color:var(--muted)}
.card{border:1px solid var(--line);border-radius:12px;padding:17px 18px;margin:12px 0;background:#fff}.goal-title{display:flex;gap:13px;flex:1;font-size:17px;font-weight:700;line-height:1.35;letter-spacing:-.15px}.goal-text{overflow-wrap:anywhere}
.year{display:inline-block;min-width:54px;font-size:14px;font-weight:750;color:var(--muted);font-variant-numeric:tabular-nums;padding-top:2px}.version-link{display:inline-block;margin-left:.55em;color:var(--muted);font-size:13px;font-weight:650;white-space:nowrap;text-decoration:none}.version-link:hover{color:var(--ink);text-decoration:underline}.version-link .version-times{font-size:.72em;vertical-align:middle;position:relative;top:-.20em;line-height:1;margin-right:1px}.meta{margin:9px 0 0 67px;color:var(--muted);font-size:12px}.meta a{text-decoration:underline;text-decoration-color:#bbb;text-underline-offset:2px}
.comments{margin:14px 0 0 67px}.comment{border-left:2px solid var(--line);padding:1px 0 2px 11px;margin:9px 0;color:#333;font-size:13px;white-space:pre-wrap;overflow-wrap:anywhere}.comment-time{color:#929292;font-size:11px;margin-bottom:2px}
.card-actions{display:flex;align-items:center;gap:10px;margin:13px 0 0 67px;flex-wrap:wrap}.votes{display:flex;align-items:center;gap:5px}.vote{width:32px;height:29px;border:1px solid var(--line);border-radius:7px;background:#fff;color:#444;cursor:pointer;font-size:15px}.vote:hover{background:var(--soft);border-color:#aaa}.vote.selected{border-color:#222;background:#222;color:white}.score{min-width:25px;text-align:center;font-size:13px;font-weight:750;font-variant-numeric:tabular-nums}.details-form{margin:12px 0 0 67px}.details-form summary{font-size:12px;color:var(--muted);cursor:pointer}form{margin:0}.form-panel{padding:17px;border:1px solid var(--line);border-radius:12px;background:var(--soft);margin:18px 0 24px}.form-panel h2{margin-bottom:12px}
.fields{display:grid;grid-template-columns:135px 1fr;gap:11px 14px;align-items:start}label{font-size:13px;font-weight:650;padding-top:8px}
input,textarea{width:100%;font:inherit;font-size:14px;padding:9px 10px;border:1px solid #cfcfcf;border-radius:7px;background:#fff;color:var(--ink)}textarea{min-height:74px;resize:vertical}input:focus,textarea:focus{outline:2px solid #aaa;outline-offset:1px}
button.primary{padding:9px 15px;border:1px solid #222;border-radius:7px;background:#222;color:white;font:inherit;font-size:13px;font-weight:650;cursor:pointer}button.primary:hover{background:#444}button:disabled{opacity:.5;cursor:wait}.form-buttons{grid-column:2;display:flex;align-items:center;gap:12px}
.final-warning{color:var(--bad);font-size:12px;font-weight:650}
.fork-card{border-top:1px solid var(--line);padding:18px 0}.fork-card:first-of-type{border-top:0}.fork-heading{display:flex;gap:14px;align-items:flex-start}.fork-rank{width:26px;flex:none;color:#999;font-size:12px;padding-top:4px}.fork-body{flex:1;min-width:0}.fork-card .comments,.fork-card .card-actions,.fork-card .details-form{margin-left:40px}.winner{font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:var(--good);font-weight:800;margin:0 0 5px}
.empty{padding:30px 18px;border:1px dashed #ccc;border-radius:12px;color:var(--muted);text-align:center;font-size:14px}.generated-at{width:min(920px,calc(100% - 36px));margin:0 auto;padding:10px 0 20px;text-align:center;color:#999;font-size:11px;letter-spacing:.1px}
html.read-only .vote,html.read-only .form-panel,html.read-only .details-form{display:none}
.replay-banner{background:#202020;color:white;padding:10px 18px;text-align:center;font-size:13px}.replay-banner a{color:white;text-decoration:underline;margin:0 8px}.replay-banner .primary{margin:0 3px;padding:5px 9px;font-size:11px;border-color:white}.timeline-panel{border:1px solid var(--line);border-radius:12px;padding:17px;margin:18px 0 24px}.timeline-meta{display:flex;justify-content:space-between;gap:12px;color:var(--muted);font-size:12px}.time-form{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-top:14px}.time-form input{width:auto;max-width:100%}#error{color:var(--bad);font-size:13px;margin:10px 0}
@media(max-width:620px){header{align-items:flex-start;flex-direction:column;gap:14px}.fields{grid-template-columns:1fr;gap:5px}.fields label{padding-top:5px}.form-buttons{grid-column:1}.meta,.comments,.card-actions,.details-form{margin-left:0}.goal-title{gap:8px}.card{padding:14px}.year{min-width:48px}.fork-card .comments,.fork-card .card-actions,.fork-card .details-form{margin-left:0}.replay-banner{line-height:2}}
`;

function htmlEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff"
    }
  });
}
function cleanText(value, name, max, required = true) {
  if (typeof value !== "string") throw new Error(name + " must be text.");
  const text = value.trim();
  if (required && !text) throw new Error(name + " is required.");
  if (text.length > max) throw new Error(name + " is limited to " + max + " characters.");
  return text;
}
function cleanActor(value) {
  if (typeof value !== "string" || !/^[a-zA-Z0-9-]{8,80}$/.test(value)) {
    throw new Error("A valid anonymous browser ID is required.");
  }
  return value;
}
function cleanYear(value) {
  const year = Number(value);
  if (!Number.isInteger(year) || year < 1900 || year > 9999) {
    throw new Error("Target year must be a whole number from 1900 to 9999.");
  }
  return year;
}
function sortForks(forks) {
  return forks.sort((a, b) => b.score - a.score || a.createdAt - b.createdAt || a.id.localeCompare(b.id));
}
function sortGroups(groups) {
  return groups.sort((a, b) => b.winner.score - a.winner.score || a.createdAt - b.createdAt || a.id.localeCompare(b.id));
}
function validTimeZone(zone) {
  try { new Intl.DateTimeFormat("en-US", { timeZone: zone }).format(); return zone; }
  catch { return "UTC"; }
}
function formatTime(ms, zone) {
  if (!ms) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", timeZone: zone, timeZoneName: "short"
  }).format(new Date(ms));
}
function localDateTimeValue(ms, zone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).formatToParts(new Date(ms));
  const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
function applyReplayEvent(state, event) {
  const d = event.detail;
  if (event.type === "goal_created") {
    state.groups.set(d.group.id, d.group);
    state.forks.set(d.fork.id, { ...d.fork, score: 0 });
    state.comments.set(d.fork.id, d.initialComment ? [d.initialComment] : []);
  } else if (event.type === "fork_created") {
    state.forks.set(d.fork.id, { ...d.fork, score: 0 });
    state.comments.set(d.fork.id, d.initialComment ? [d.initialComment] : []);
  } else if (event.type === "comment_added") {
    const comments = state.comments.get(d.forkId) || [];
    comments.push(d.comment);
    state.comments.set(d.forkId, comments);
  } else if (event.type === "vote_cast") {
    const fork = state.forks.get(d.forkId);
    if (fork) fork.score = d.afterScore;
  }
}
function replayGroups(events) {
  const state = { groups: new Map(), forks: new Map(), comments: new Map() };
  for (const event of events) applyReplayEvent(state, event);
  const groups = [];
  for (const group of state.groups.values()) {
    const forks = [];
    for (const fork of state.forks.values()) {
      if (fork.groupId === group.id) {
        forks.push({ ...fork, comments: state.comments.get(fork.id) || [], myVote: 0 });
      }
    }
    if (forks.length) {
      sortForks(forks);
      groups.push({ ...group, forks, winner: forks[0], forkCount: forks.length });
    }
  }
  return sortGroups(groups);
}
function pageScript() {
  return `<script>
(() => {
  const oldHash = location.hash.slice(1);
  if (oldHash === "dead") { location.replace("/veto" + location.search); return; }
  if (oldHash === "replay") { location.replace("/history"); return; }
  if (oldHash.startsWith("forks/")) { location.replace("/goal/" + encodeURIComponent(oldHash.slice(6)) + location.search); return; }
  const actorKey = "the-checklist-anonymous-id";
  // Pages are fully rendered by the server; without storage, leave the page read-only.
  let actor = null;
  try {
    actor = localStorage.getItem(actorKey);
    if (!actor) {
      actor = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + "-" + Math.random().toString(16).slice(2);
      localStorage.setItem(actorKey, actor);
    }
  } catch (_) {
    actor = null;
    document.documentElement.classList.add("read-only");
  }
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  function error(message) {
    let box = $("#error");
    if (!box) { box = document.createElement("div"); box.id = "error"; $("main").prepend(box); }
    box.textContent = message;
  }
  async function post(path, data) {
    data.actor = actor;
    const response = await fetch(path, {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Request failed.");
    return result;
  }
  async function refreshVotes() {
    const buttons = $(".vote");
    if (!actor || !buttons || document.body.dataset.historical === "1") return;
    try {
      const response = await fetch("/api/state?actor=" + encodeURIComponent(actor), { cache: "no-store" });
      const data = await response.json();
      const votes = new Map();
      for (const group of data.groups) for (const fork of group.forks) votes.set(fork.id, fork.myVote);
      for (const button of $$(".vote")) {
        const selected = votes.get(button.dataset.fork) === Number(button.dataset.vote);
        button.classList.toggle("selected", selected);
      }
    } catch (_) {}
  }
  if (actor) $$(".vote").forEach(button => button.addEventListener("click", async () => {
    button.disabled = true;
    try {
      await post("/api/vote", { forkId: button.dataset.fork, value: Number(button.dataset.vote) });
      location.reload();
    } catch (e) { error(e.message); button.disabled = false; }
  }));
  if (actor) for (const form of $$(".comment-form")) form.addEventListener("submit", async event => {
    event.preventDefault();
    const button = $("button", form); button.disabled = true;
    try {
      await post("/api/comment", { forkId: form.dataset.fork, text: form.elements.text.value });
      location.reload();
    } catch (e) { error(e.message); button.disabled = false; }
  });
  const newGoal = $("#new-goal");
  if (actor && newGoal) newGoal.addEventListener("submit", async event => {
    event.preventDefault(); const button = $("button", newGoal); button.disabled = true;
    try {
      const result = await post("/api/create", {
        targetYear: newGoal.elements.targetYear.value,
        statement: newGoal.elements.statement.value,
        comments: newGoal.elements.comments.value
      });
      location.href = "/goal/" + encodeURIComponent(result.groupId);
    } catch (e) { error(e.message); button.disabled = false; }
  });
  const newFork = $("#new-fork");
  if (actor && newFork) newFork.addEventListener("submit", async event => {
    event.preventDefault(); const button = $("button", newFork); button.disabled = true;
    try {
      await post("/api/fork", {
        groupId: newFork.dataset.group,
        targetYear: newFork.elements.targetYear.value,
        statement: newFork.elements.statement.value,
        comments: newFork.elements.comments.value
      });
      location.reload();
    } catch (e) { error(e.message); button.disabled = false; }
  });

function bindFinalWarning(form) {
  if (!form) return;
  const goal = form.elements.statement;
  goal.addEventListener("input", () => {
    const isEmpty = !goal.value.trim();
    $(".final-warning", form).hidden = isEmpty;
    $('label[for="new-year"]', form).style.color = isEmpty ? "" : "var(--bad)";
    $('label[for="new-statement"]', form).style.color = isEmpty ? "" : "var(--bad)";
  });
}
bindFinalWarning(newGoal);
bindFinalWarning(newFork);
  
  const replayForm = $("#replay-time-form");
  if (replayForm) replayForm.addEventListener("submit", event => {
    event.preventDefault();
    const value = new Date($("#replay-time").value).getTime();
    if (!Number.isFinite(value)) { error("Choose a valid date and time."); return; }
    location.href = "/?at=" + String(value + 59999);
  });
  const historical = document.body.dataset.historical === "1";
  if (historical) {
    const stepButtons = $$("[data-replay-step]");
    if (stepButtons.length) fetch("/api/history", { cache: "no-store" }).then(r => r.json()).then(data => {
      const events = data.events || [];
      const at = Number(document.body.dataset.at || 0);
      const seq = document.body.dataset.seq;
      let index = seq !== "" ? events.findIndex(e => e.seq === Number(seq)) : -1;
      if (seq === "") for (let i = 0; i < events.length; i++) if (events[i].at <= at) index = i;
      for (const button of stepButtons) {
        const direction = Number(button.dataset.replayStep);
        const target = index + direction;
        button.disabled = direction < 0 ? index <= 0 : target >= events.length;
        button.addEventListener("click", () => {
          if (direction < 0 && index <= 0) location.href = "/?seq=0";
          else if (events[target]) location.href = "/?seq=" + events[target].seq;
        });
      }
    }).catch(() => {});
  } else if (actor) {
    refreshVotes();
  }
})();
</script>`;
}
function commentHTML(comments, zone) {
  if (!comments?.length) return "";
  return `<div class="comments">${comments.map(comment =>
    `<div class="comment"><div class="comment-time">${htmlEscape(formatTime(comment.at, zone))}</div><div>${htmlEscape(comment.text)}</div></div>`
  ).join("")}</div>`;
}
function votesHTML(fork, historical) {
  if (historical) return `<div class="votes"><span class="score">${htmlEscape(fork.score > 0 ? "+" + fork.score : fork.score)}</span></div>`;
  return `<div class="votes"><button class="vote" data-vote="1" data-fork="${htmlEscape(fork.id)}" aria-label="Upvote">&#9650;</button><span class="score">${htmlEscape(fork.score > 0 ? "+" + fork.score : fork.score)}</span><button class="vote" data-vote="-1" data-fork="${htmlEscape(fork.id)}" aria-label="Downvote">&#9660;</button></div>`;
}
function commentFormHTML(forkId, historical) {
  if (historical) return "";
  return `<details class="details-form"><summary>Add a comment</summary><form class="comment-form" data-fork="${htmlEscape(forkId)}"><textarea name="text" maxlength="2000" required placeholder="Add a comment&#8230;"></textarea><div class="form-buttons"><button class="primary" type="submit">Append comment</button></div></form></details>`;
}
function groupCardHTML(group, historical, zone, query) {
  const fork = group.winner;
  const countLabel = `${group.forkCount} ${group.forkCount === 1 ? "version" : "versions"}`;
  const versionLink = `<a class="version-link" href="/goal/${encodeURIComponent(group.id)}${query}" aria-label="View ${htmlEscape(countLabel)}"><span class="version-times">&#215;</span>${group.forkCount}</a>`;
  return `<article class="card"><div class="goal-title"><span class="year">${fork.targetYear}</span><span class="goal-text">${htmlEscape(fork.statement)}${versionLink}</span></div><div class="card-actions">${votesHTML(fork, historical)}</div>${commentHTML(fork.comments, zone)}${commentFormHTML(fork.id, historical)}</article>`;
}
function forkFormHTML(groupId, historical) {
  if (historical) return "";
  return `<section class="form-panel"><h2>Add alternate version</h2><form id="new-fork" data-group="${htmlEscape(groupId)}"><div class="fields"><label for="new-year">Target year</label><input id="new-year" name="targetYear" type="number" min="1900" max="9999" value="${new Date().getUTCFullYear() + 1}" required><label for="new-statement">Goal</label><textarea id="new-statement" name="statement" maxlength="600" required placeholder="A different version of the goal&#8230;"></textarea><label for="new-comments">Comments</label><textarea id="new-comments" name="comments" maxlength="2000" placeholder="Optional comments"></textarea><div class="form-buttons"><button class="primary" type="submit">Submit</button><span class="final-warning" hidden>Please check carefully. Submissions are final and cannot be edited.</span></div></div></form></section>`;
}
function newGoalFormHTML(historical) {
  if (historical) return "";
  return `<section class="form-panel"><h2>Propose a new goal</h2><form id="new-goal"><div class="fields"><label for="new-year">Target year</label><input id="new-year" name="targetYear" type="number" min="1900" max="9999" value="${new Date().getUTCFullYear() + 1}" required><label for="new-statement">Goal</label><textarea id="new-statement" name="statement" maxlength="600" required placeholder="What should society achieve?"></textarea><label for="new-comments">Comments</label><textarea id="new-comments" name="comments" maxlength="2000" placeholder="Optional comments"></textarea><div class="form-buttons"><button class="primary" type="submit">Submit</button><span class="final-warning" hidden>Please check carefully. Submissions are final and cannot be edited.</span></div></div></form></section>`;
}
function generationFooter(generatedAt) {
  const label = generatedAt.slice(0, 19).replace("T", " ") + " UTC";
  return `<footer class="generated-at">Page generated: ${htmlEscape(label)}</footer>`;
}
function pageLayout({ title, body, path, historical, at, seq, zone, generatedAt }) {
  const query = historical ? (seq !== null ? `?seq=${seq}` : `?at=${at}`) : "";
  const banner = historical
    ? `<div class="replay-banner">This is what users saw ${htmlEscape(formatTime(at, zone) || "before the first saved action")} <a href="${htmlEscape(path)}">Return to live page</a> <a href="/history">Choose another time</a> <button class="primary" data-replay-step="-1">&#8592; Previous</button> <button class="primary" data-replay-step="1">Next &#8594;</button></div>`
    : "";
  const description = "An AI dream timeline.";
  const documentTitle = title === "An AI dream timeline" ? title : `${title} | An AI dream timeline`;
  const footer = historical || path == "/history" ? "" : generationFooter(generatedAt);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${description}"><meta name="theme-color" content="#fff"><title>${htmlEscape(documentTitle)}</title><style>${PAGE_STYLE}</style></head><body data-historical="${historical ? "1" : "0"}" data-at="${at || 0}" data-seq="${seq === null ? "" : seq}" data-timezone="${htmlEscape(zone)}">${banner}<header><a class="tagline" href="/${query}">An AI dream timeline</a><nav><a href="/veto${query}">Vetoes</a><a href="/history">History</a></nav></header><main>${body}</main>${footer}${pageScript()}</body></html>`;
}
function renderList(groups, vetoes, historical, zone, query) {
  const visible = groups.filter(group => vetoes ? group.winner.score < 0 : group.winner.score >= 0);
  const heading = vetoes
    ? `<div class="section-head"><h1>Vetoes</h1><span class="count">${visible.length} ${visible.length === 1 ? "goal" : "goals"}</span></div>`
    : `<div class="section-head"><span class="count">${visible.length} ${visible.length === 1 ? "goal" : "goals"}</span></div>`;
  const cards = visible.length
    ? visible.map(group => groupCardHTML(group, historical, zone, query)).join("")
    : `<div class="empty">${vetoes ? "No goals are currently vetoed." : "No goals yet."}</div>`;
  return heading + (vetoes ? "" : newGoalFormHTML(historical)) + cards;
}
function renderGoal(group, historical, zone) {
  if (!group) return `<h1>Goal not found</h1><div class="empty">This goal did not exist at the selected time, or it no longer exists.</div>`;
  const forks = group.forks.map((fork, index) => `<article class="fork-card"><div class="fork-heading"><div class="fork-rank">#${index + 1}</div><div class="fork-body">${index === 0 ? `<div class="winner">Leading version</div>` : ""}<div class="goal-title"><span class="year">${fork.targetYear}</span><span class="goal-text">${htmlEscape(fork.statement)}</span></div><div class="meta" style="margin-left:0">Submitted ${htmlEscape(formatTime(fork.createdAt, zone))}</div></div></div><div class="card-actions">${votesHTML(fork, historical)}</div>${commentHTML(fork.comments, zone)}${commentFormHTML(fork.id, historical)}</article>`).join("");
  return `${forkFormHTML(group.id, historical)}<div class="section-head"><h2>Versions</h2><span class="count">${group.forks.length}</span></div>${forks}`;  
}
function renderHistory(events, zone) {
  const latest = events.length ? events[events.length - 1].at : Date.now();
  const inputValue = localDateTimeValue(latest, zone);
  return `<h1>Browse history</h1><p class="intro">Choose a date and time to view the website as it appeared then.</p><section class="timeline-panel"><div class="timeline-meta"><span>${events.length} saved actions</span><span>${events.length ? `Latest: ${htmlEscape(formatTime(latest, zone))}` : "No saved actions yet"}</span></div><form id="replay-time-form" class="time-form"><label for="replay-time">Show website through this minute (${htmlEscape(zone)}):</label><input id="replay-time" type="datetime-local" step="60" value="${inputValue}" required><button class="primary" type="submit">View website</button></form></section>`;
}

export class Checklist extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS goals (id TEXT PRIMARY KEY, created_at INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS forks (id TEXT PRIMARY KEY, group_id TEXT NOT NULL, target_year INTEGER NOT NULL, statement TEXT NOT NULL, score INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS votes (actor TEXT NOT NULL, fork_id TEXT NOT NULL, value INTEGER NOT NULL CHECK (value IN (-1, 1)), PRIMARY KEY (actor, fork_id));
      CREATE TABLE IF NOT EXISTS comments (id TEXT PRIMARY KEY, fork_id TEXT NOT NULL, actor TEXT NOT NULL, text TEXT NOT NULL, created_at INTEGER NOT NULL, event_seq INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS events (seq INTEGER PRIMARY KEY AUTOINCREMENT, at INTEGER NOT NULL, type TEXT NOT NULL, actor TEXT NOT NULL, detail TEXT NOT NULL);
      CREATE INDEX IF NOT EXISTS forks_by_group ON forks(group_id, score DESC, created_at ASC);
      CREATE INDEX IF NOT EXISTS comments_by_fork ON comments(fork_id, created_at ASC);
      CREATE INDEX IF NOT EXISTS events_by_time ON events(at, seq);
    `);
  }
  log(type, actor, at, detail) {
    this.sql.exec("INSERT INTO events (at, type, actor, detail) VALUES (?, ?, ?, ?)", at, type, actor, JSON.stringify(detail));
    return Number(this.sql.exec("SELECT last_insert_rowid() AS seq").one().seq);
  }
  readEvents(where = "", ...args) {
    return this.sql.exec("SELECT seq, at, type, actor, detail FROM events " + where + " ORDER BY seq ASC", ...args).toArray().map(row => ({
      seq: Number(row.seq), at: Number(row.at), type: row.type, actor: row.actor, detail: JSON.parse(row.detail)
    }));
  }
  getData(actor) {
    const groups = this.sql.exec("SELECT id, created_at AS createdAt FROM goals ORDER BY created_at ASC").toArray();
    const forks = this.sql.exec("SELECT id, group_id AS groupId, target_year AS targetYear, statement, score, created_at AS createdAt FROM forks").toArray();
    const comments = this.sql.exec("SELECT id, fork_id AS forkId, actor, text, created_at AS at FROM comments ORDER BY event_seq ASC").toArray();
    const votes = actor ? this.sql.exec("SELECT fork_id AS forkId, value FROM votes WHERE actor = ?", actor).toArray() : [];
    const commentsByFork = new Map();
    for (const comment of comments) {
      if (!commentsByFork.has(comment.forkId)) commentsByFork.set(comment.forkId, []);
      commentsByFork.get(comment.forkId).push({ id: comment.id, actor: comment.actor, text: comment.text, at: Number(comment.at) });
    }
    const votesByFork = new Map(votes.map(vote => [vote.forkId, Number(vote.value)]));
    const byId = new Map(groups.map(group => [group.id, { id: group.id, createdAt: Number(group.createdAt), forks: [] }]));
    for (const fork of forks) {
      const group = byId.get(fork.groupId);
      if (group) group.forks.push({
        id: fork.id, groupId: fork.groupId, targetYear: Number(fork.targetYear), statement: fork.statement,
        score: Number(fork.score), createdAt: Number(fork.createdAt), comments: commentsByFork.get(fork.id) || [],
        myVote: votesByFork.get(fork.id) || 0
      });
    }
    const result = [];
    for (const group of byId.values()) {
      if (!group.forks.length) continue;
      sortForks(group.forks);
      group.winner = group.forks[0];
      group.forkCount = group.forks.length;
      result.push(group);
    }
    return sortGroups(result);
  }
  historicalData(url) {
    let events, at, seq = null;
    if (url.searchParams.has("seq")) {
      seq = Number(url.searchParams.get("seq"));
      if (!Number.isSafeInteger(seq) || seq < 0) throw new Error("Invalid history sequence.");
      events = seq ? this.readEvents("WHERE seq <= ?", seq) : [];
      at = events.length ? events[events.length - 1].at : 0;
    } else {
      at = Number(url.searchParams.get("at"));
      if (!Number.isFinite(at) || at < 0) throw new Error("Invalid replay date.");
      events = this.readEvents("WHERE at <= ?", at);
      seq = events.length ? events[events.length - 1].seq : 0;
    }
    return { groups: replayGroups(events), seq, at };
  }
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const historical = url.searchParams.has("at") || url.searchParams.has("seq");
    try {
      if (path.startsWith("/api/")) return await this.handleAPI(request, url, path);
      if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
      }
      const zone = validTimeZone(request.cf?.timezone || "UTC");
      // Keep the former route working as a permanent redirect to the new name.
      if (path === "/dead") return Response.redirect(new URL("/veto" + url.search, url), 308);
      const snapshot = historical ? this.historicalData(url) : null;
      const groups = snapshot ? snapshot.groups : this.getData("");
      const query = snapshot ? (snapshot.seq !== null && url.searchParams.has("seq") ? `?seq=${snapshot.seq}` : `?at=${snapshot.at}`) : "";
      let title, body, pagePath = path;
      if (path === "/" || path === "/index.html") {
        title = "An AI dream timeline";
        body = renderList(groups, false, historical, zone, query);
        pagePath = "/";
      } else if (path === "/veto") {
        title = "Vetoes";
        body = renderList(groups, true, historical, zone, query);
      } else if (path === "/history") {
        title = "Browse history";
        const events = this.sql.exec("SELECT seq, at FROM events ORDER BY seq ASC").toArray().map(row => ({ seq: Number(row.seq), at: Number(row.at) }));
        body = renderHistory(events, zone);
      } else if (path.startsWith("/goal/")) {
        const id = decodeURIComponent(path.slice(6));
        const group = groups.find(item => item.id === id) || null;
        title = group ? group.winner.statement : "Goal not found";
        body = renderGoal(group, historical, zone);
      } else {
        const notFoundGeneratedAt = new Date().toISOString();
        const notFoundFooter = historical ? "" : generationFooter(notFoundGeneratedAt);
        const notFound = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Not found | An AI dream timeline</title><style>${PAGE_STYLE}</style></head><body><main><h1>Page not found</h1><p><a href="/">An AI dream timeline</a></p></main>${notFoundFooter}</body></html>`;
        return new Response(request.method === "HEAD" ? null : notFound, { status: 404, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" } });
      }
      const at = snapshot ? snapshot.at : 0;
      const seq = historical && url.searchParams.has("seq") ? snapshot.seq : null;
      const generatedAt = new Date().toISOString();
      const html = pageLayout({ title, body, path: pagePath, historical, at, seq, zone, generatedAt });
      return new Response(request.method === "HEAD" ? null : html, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "x-content-type-options": "nosniff",
          "referrer-policy": "strict-origin-when-cross-origin"
        }
      });
    } catch (error) {
      if (path.startsWith("/api/")) return json({ error: error?.message || "Request failed." }, 400);
      const message = htmlEscape(error?.message || "Request failed.");
      const generatedAt = new Date().toISOString();
      const footer = historical ? "" : generationFooter(generatedAt);
      return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Error | An AI dream timeline</title><style>${PAGE_STYLE}</style></head><body><main><h1>Unable to display this page</h1><p>${message}</p><p><a href="/">An AI dream timeline</a></p></main>${footer}</body></html>`, {
        status: 400, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }
      });
    }
  }
  async handleAPI(request, url, path) {
    if (path === "/api/state" && request.method === "GET") {
      const actor = url.searchParams.get("actor");
      const data = url.searchParams.has("at") || url.searchParams.has("seq")
        ? this.historicalData(url) : { groups: this.getData(actor ? cleanActor(actor) : "") };
      return json(data);
    }
    if (path === "/api/group" && request.method === "GET") {
      const id = url.searchParams.get("id") || "";
      const actor = url.searchParams.get("actor");
      const groups = url.searchParams.has("at") || url.searchParams.has("seq")
        ? this.historicalData(url).groups : this.getData(actor ? cleanActor(actor) : "");
      return json({ group: groups.find(group => group.id === id) || null });
    }
    if (path === "/api/history" && request.method === "GET") {
      const rows = this.sql.exec("SELECT seq, at FROM events ORDER BY seq ASC").toArray();
      return json({ events: rows.map(row => ({ seq: Number(row.seq), at: Number(row.at) })) });
    }
    if (path === "/api/replay" && request.method === "GET") return json(this.historicalData(url));
    if (request.method !== "POST") return json({ error: "Not found." }, 404);
    if (url.searchParams.has("at") || url.searchParams.has("seq")) return json({ error: "Historical pages are read-only." }, 403);

    const body = await request.json();
    const actor = cleanActor(body.actor);
    const at = Date.now();
    if (path === "/api/create") {
      const targetYear = cleanYear(body.targetYear);
      const statement = cleanText(body.statement, "Goal", 600);
      const commentText = cleanText(body.comments || "", "Comments", 2000, false);
      const group = { id: crypto.randomUUID(), createdAt: at };
      const fork = { id: crypto.randomUUID(), groupId: group.id, targetYear, statement, createdAt: at };
      const initialComment = commentText ? { id: crypto.randomUUID(), actor, text: commentText, at } : null;
      this.ctx.storage.transactionSync(() => {
        this.sql.exec("INSERT INTO goals (id, created_at) VALUES (?, ?)", group.id, at);
        this.sql.exec("INSERT INTO forks (id, group_id, target_year, statement, score, created_at) VALUES (?, ?, ?, ?, 0, ?)", fork.id, group.id, targetYear, statement, at);
        const seq = this.log("goal_created", actor, at, { group, fork, initialComment });
        if (initialComment) this.sql.exec("INSERT INTO comments (id, fork_id, actor, text, created_at, event_seq) VALUES (?, ?, ?, ?, ?, ?)", initialComment.id, fork.id, actor, initialComment.text, at, seq);
      });
      return json({ ok: true, groupId: group.id, forkId: fork.id });
    }
    if (path === "/api/fork") {
      const groupId = cleanText(body.groupId, "Goal ID", 80);
      if (!this.sql.exec("SELECT id FROM goals WHERE id = ?", groupId).toArray().length) throw new Error("That goal no longer exists.");
      const targetYear = cleanYear(body.targetYear);
      const statement = cleanText(body.statement, "Goal", 600);
      const commentText = cleanText(body.comments || "", "Comments", 2000, false);
      const fork = { id: crypto.randomUUID(), groupId, targetYear, statement, createdAt: at };
      const initialComment = commentText ? { id: crypto.randomUUID(), actor, text: commentText, at } : null;
      this.ctx.storage.transactionSync(() => {
        this.sql.exec("INSERT INTO forks (id, group_id, target_year, statement, score, created_at) VALUES (?, ?, ?, ?, 0, ?)", fork.id, groupId, targetYear, statement, at);
        const seq = this.log("fork_created", actor, at, { fork, initialComment });
        if (initialComment) this.sql.exec("INSERT INTO comments (id, fork_id, actor, text, created_at, event_seq) VALUES (?, ?, ?, ?, ?, ?)", initialComment.id, fork.id, actor, initialComment.text, at, seq);
      });
      return json({ ok: true, forkId: fork.id });
    }
    if (path === "/api/vote") {
      const forkId = cleanText(body.forkId, "Fork ID", 80);
      const requested = Number(body.value);
      if (requested !== 1 && requested !== -1) throw new Error("Vote must be up or down.");
      let result;
      this.ctx.storage.transactionSync(() => {
        const fork = this.sql.exec("SELECT score FROM forks WHERE id = ?", forkId).toArray()[0];
        if (!fork) throw new Error("That version no longer exists.");
        const prior = this.sql.exec("SELECT value FROM votes WHERE actor = ? AND fork_id = ?", actor, forkId).toArray()[0];
        const previousVote = prior ? Number(prior.value) : 0;
        const newVote = previousVote === requested ? 0 : requested;
        const beforeScore = Number(fork.score);
        const afterScore = beforeScore + newVote - previousVote;
        if (newVote === 0) this.sql.exec("DELETE FROM votes WHERE actor = ? AND fork_id = ?", actor, forkId);
        else this.sql.exec("INSERT INTO votes (actor, fork_id, value) VALUES (?, ?, ?) ON CONFLICT(actor, fork_id) DO UPDATE SET value = excluded.value", actor, forkId, newVote);
        this.sql.exec("UPDATE forks SET score = ? WHERE id = ?", afterScore, forkId);
        this.log("vote_cast", actor, at, { forkId, previousVote, newVote, beforeScore, afterScore });
        result = { previousVote, newVote, score: afterScore };
      });
      return json({ ok: true, ...result });
    }
    if (path === "/api/comment") {
      const forkId = cleanText(body.forkId, "Fork ID", 80);
      const text = cleanText(body.text, "Comment", 2000);
      if (!this.sql.exec("SELECT id FROM forks WHERE id = ?", forkId).toArray().length) throw new Error("That version no longer exists.");
      const comment = { id: crypto.randomUUID(), actor, text, at };
      this.ctx.storage.transactionSync(() => {
        const seq = this.log("comment_added", actor, at, { forkId, comment });
        this.sql.exec("INSERT INTO comments (id, fork_id, actor, text, created_at, event_seq) VALUES (?, ?, ?, ?, ?, ?)", comment.id, forkId, actor, text, at, seq);
      });
      return json({ ok: true, commentId: comment.id });
    }
    return json({ error: "Unknown API endpoint." }, 404);
  }
}

export default {
  async fetch(request, env) {
    const id = env.CHECKLIST.idFromName("the-checklist-global");
    return env.CHECKLIST.get(id).fetch(request);
  }
};
