import { DurableObject } from "cloudflare:workers";

const PAGE = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#ffffff">
<title>The Checklist</title>
<style>
:root{color-scheme:light;--ink:#171717;--muted:#707070;--line:#dedede;--soft:#f6f6f4;--accent:#202020;--good:#147a45;--bad:#a33a32}
*{box-sizing:border-box}
body{margin:0;background:#fff;color:var(--ink);font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
a{color:inherit;text-decoration:none}
a:hover{text-decoration:underline}
header,main,footer{width:min(920px,calc(100% - 36px));margin-inline:auto}
header{padding:28px 0 22px;border-bottom:1px solid var(--line);display:flex;align-items:end;justify-content:space-between;gap:24px}
.brand{font-size:27px;line-height:1;font-weight:850;letter-spacing:-1.3px}
.tagline{margin:8px 0 0;color:var(--muted);font-size:13px}
nav{display:flex;gap:18px;white-space:nowrap;font-size:13px;color:var(--muted)}
nav a:hover,.quiet-link:hover{color:var(--ink)}
main{padding:30px 0 48px;min-height:58vh}
h1{margin:0 0 6px;font-size:26px;line-height:1.2;letter-spacing:-.7px}
h2{margin:0 0 6px;font-size:19px;letter-spacing:-.25px}
.intro{margin:0 0 24px;color:var(--muted);font-size:14px}
.section-head{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:14px}
.count{font-size:12px;color:var(--muted)}
.card{border:1px solid var(--line);border-radius:12px;padding:17px 18px;margin:12px 0;background:#fff}
.card-top{display:flex;gap:14px;align-items:flex-start}
.year{display:inline-block;min-width:54px;font-size:14px;font-weight:750;color:var(--muted);font-variant-numeric:tabular-nums;padding-top:2px}
.goal-title{display:flex;gap:13px;flex:1;font-size:17px;font-weight:700;line-height:1.35;letter-spacing:-.15px}
.goal-title:hover .goal-text{text-decoration:underline}
.goal-text{overflow-wrap:anywhere}
.meta{margin:9px 0 0 67px;color:var(--muted);font-size:12px}
.comments{margin:14px 0 0 67px}
.comment{border-left:2px solid var(--line);padding:1px 0 2px 11px;margin:9px 0;color:#333;font-size:13px;white-space:pre-wrap;overflow-wrap:anywhere}
.comment-time{color:#929292;font-size:11px;margin-bottom:2px}
.no-comments{color:#999;font-size:12px}
.card-actions{display:flex;align-items:center;gap:10px;margin:13px 0 0 67px;flex-wrap:wrap}
.votes{display:flex;align-items:center;gap:5px}
.vote{width:32px;height:29px;border:1px solid var(--line);border-radius:7px;background:#fff;color:#444;cursor:pointer;font-size:15px}
.vote:hover{background:var(--soft);border-color:#aaa}
.vote.selected{border-color:#222;background:#222;color:white}
.score{min-width:25px;text-align:center;font-size:13px;font-weight:750;font-variant-numeric:tabular-nums}
.small{font-size:12px;color:var(--muted)}
.details-form{margin:12px 0 0 67px}
.details-form summary{font-size:12px;color:var(--muted);cursor:pointer}
form{margin:0}
.form-panel{padding:17px;border:1px solid var(--line);border-radius:12px;background:var(--soft);margin:18px 0 24px}
.form-panel h2{margin-bottom:12px}
.fields{display:grid;grid-template-columns:135px 1fr;gap:11px 14px;align-items:start}
label{font-size:13px;font-weight:650;padding-top:8px}
input,textarea{width:100%;font:inherit;font-size:14px;padding:9px 10px;border:1px solid #cfcfcf;border-radius:7px;background:#fff;color:var(--ink)}
textarea{min-height:74px;resize:vertical}
input:focus,textarea:focus{outline:2px solid #aaa;outline-offset:1px}
button.primary{padding:9px 15px;border:1px solid #222;border-radius:7px;background:#222;color:white;font:inherit;font-size:13px;font-weight:650;cursor:pointer}
button.primary:hover{background:#444}
button:disabled{opacity:.5;cursor:wait}
.form-buttons{grid-column:2;display:flex;align-items:center;gap:12px}
.form-note{font-size:11px;color:var(--muted)}
.back{display:inline-block;margin-bottom:18px;color:var(--muted);font-size:13px}
.fork-card{border-top:1px solid var(--line);padding:18px 0}
.fork-card:first-of-type{border-top:0}
.fork-heading{display:flex;gap:14px;align-items:flex-start}
.fork-rank{width:26px;flex:none;color:#999;font-size:12px;padding-top:4px}
.fork-body{flex:1;min-width:0}
.fork-card .comments,.fork-card .card-actions,.fork-card .details-form{margin-left:40px}
.winner{font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:var(--good);font-weight:800;margin:0 0 5px}
.empty{padding:30px 18px;border:1px dashed #ccc;border-radius:12px;color:var(--muted);text-align:center;font-size:14px}
footer{border-top:1px solid var(--line);padding:18px 0 28px;color:var(--muted);font-size:12px;display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap}
footer a{margin-right:15px}
.notice{border-left:3px solid #aaa;padding:9px 12px;background:var(--soft);color:#555;font-size:12px;margin:12px 0 18px}
.timeline-panel{border:1px solid var(--line);border-radius:12px;padding:17px;margin:18px 0 24px}
.timeline-panel input[type=range]{padding:0;border:0;accent-color:#222}
.timeline-meta{display:flex;justify-content:space-between;gap:12px;color:var(--muted);font-size:12px}
.time-form{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-top:14px}
.time-form input{width:auto;max-width:100%}
.event-detail{background:#f6f6f4;border-radius:8px;padding:12px;overflow:auto;font-size:11px;white-space:pre-wrap;overflow-wrap:anywhere}
.replay-group{border:1px solid var(--line);border-radius:10px;padding:14px;margin:12px 0}
.replay-fork{border-top:1px solid var(--line);padding:12px 0 2px;margin-top:10px}
.replay-fork:first-of-type{border-top:0}
.dead-label{color:var(--bad);font-size:10px;text-transform:uppercase;letter-spacing:.8px;font-weight:800}
.loading{color:var(--muted);padding:32px 0}
#error{color:var(--bad);font-size:13px;margin:10px 0}
@media(max-width:620px){header{align-items:flex-start;flex-direction:column;gap:14px}.fields{grid-template-columns:1fr;gap:5px}.fields label{padding-top:5px}.form-buttons{grid-column:1}.meta,.comments,.card-actions,.details-form{margin-left:0}.goal-title{gap:8px}.card{padding:14px}.year{min-width:48px}.fork-card .comments,.fork-card .card-actions,.fork-card .details-form{margin-left:0}}
</style>
</head>
<body>
<header>
  <div><a class="brand" href="#">THE CHECKLIST</a><p class="tagline">A public scorecard for a post-singularity society</p></div>
  <nav><a href="#">Checklist</a><a href="#dead">Dead checklist</a><a href="#replay">Replay</a></nav>
</header>
<main id="main"><div class="loading">Loading checklist…</div></main>
<footer><div><a href="#dead">Dead checklist</a><a href="#replay">Replay history</a></div><div>No accounts. Plain text. Public history.</div></footer>
<script>
(function(){
'use strict';
var main=document.getElementById('main');
var actorKey='the-checklist-anonymous-id';
var actor=localStorage.getItem(actorKey);
if(!actor){actor=(crypto.randomUUID?crypto.randomUUID():String(Date.now())+'-'+Math.random().toString(16).slice(2));localStorage.setItem(actorKey,actor);}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function fmt(t){if(!t)return '';return new Date(t).toLocaleString([], {year:'numeric',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});}
function localValue(t){var d=new Date(t);d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,16);}
function scoreText(n){return n>0?'+'+n:String(n);}
async function api(url,opts){var r=await fetch(url,opts||{});var data=await r.json();if(!r.ok)throw new Error(data.error||'Request failed');return data;}
function post(path,data){data.actor=actor;return api(path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});}
function commentsHTML(comments){if(!comments||!comments.length)return '<div class="no-comments">No comments yet.</div>';return comments.map(function(c){return '<div class="comment"><div class="comment-time">'+esc(fmt(c.at))+'</div><div>'+esc(c.text)+'</div></div>';}).join('');}
function voteHTML(f){return '<div class="votes"><button class="vote '+(f.myVote===1?'selected':'')+'" data-vote="1" data-fork="'+esc(f.id)+'" aria-label="Upvote">▲</button><span class="score">'+esc(scoreText(f.score))+'</span><button class="vote '+(f.myVote===-1?'selected':'')+'" data-vote="-1" data-fork="'+esc(f.id)+'" aria-label="Downvote">▼</button></div>';}
function commentFormHTML(forkId){return '<details class="details-form"><summary>Append a comment</summary><form class="comment-form" data-fork="'+esc(forkId)+'"><textarea name="text" maxlength="2000" required placeholder="Add a comment…"></textarea><div class="form-buttons"><button class="primary" type="submit">Append comment</button><span class="form-note">Up to 2,000 characters</span></div></form></details>';}
function cardHTML(g){var f=g.winner;return '<article class="card"><div class="card-top"><a class="goal-title" href="#forks/'+esc(g.id)+'"><span class="year">'+esc(f.targetYear)+'</span><span class="goal-text">'+esc(f.statement)+'</span></a></div><div class="meta">'+esc(g.forkCount)+' '+(g.forkCount===1?'version':'versions')+' · highest-scoring version</div><div class="comments">'+commentsHTML(f.comments)+'</div><div class="card-actions">'+voteHTML(f)+'<span class="small">Vote on this version</span></div>'+commentFormHTML(f.id)+'</article>';}
function groupFormHTML(){return '<section class="form-panel"><h2>Propose a new goal</h2><form id="new-goal"><div class="fields"><label for="new-year">Target year</label><input id="new-year" name="targetYear" type="number" min="1900" max="9999" value="'+(new Date().getFullYear()+1)+'" required><label for="new-statement">Goal</label><textarea id="new-statement" name="statement" maxlength="600" required placeholder="What should society achieve?"></textarea><label for="new-comments">Comments</label><textarea id="new-comments" name="comments" maxlength="2000" placeholder="Why does this goal matter? (optional)"></textarea><div class="form-buttons"><button class="primary" type="submit">Submit goal</button><span class="form-note">No account required</span></div></div></form></section>';}
function bindVotes(){Array.prototype.forEach.call(document.querySelectorAll('.vote'),function(b){b.addEventListener('click',async function(){b.disabled=true;try{await post('/api/vote',{forkId:b.dataset.fork,value:Number(b.dataset.vote)});await render();}catch(e){showError(e.message);b.disabled=false;}});});}
function bindComments(){Array.prototype.forEach.call(document.querySelectorAll('.comment-form'),function(form){form.addEventListener('submit',async function(e){e.preventDefault();var button=form.querySelector('button');button.disabled=true;try{await post('/api/comment',{forkId:form.dataset.fork,text:form.elements.text.value});await render();}catch(err){showError(err.message);button.disabled=false;}});});}
function showError(message){var el=document.getElementById('error');if(el)el.textContent=message;else{var n=document.createElement('div');n.id='error';n.textContent=message;main.prepend(n);}}
async function renderList(dead){var data=await api('/api/state?actor='+encodeURIComponent(actor));var groups=data.groups.filter(function(g){return dead?g.winner.score<0:g.winner.score>=0;});main.innerHTML='<a class="back" href="#">← Main checklist</a><div class="section-head"><div><h1>'+(dead?'Dead checklist':'The Checklist')+'</h1><p class="intro">'+(dead?'Goals whose leading version has a negative score.':'Goals for our post-singularity AI-powered society. The leading version of each goal is shown.')+'</p></div><span class="count">'+groups.length+' '+(groups.length===1?'goal':'goals')+'</span></div>'+(dead?'':'<div class="notice">Each goal can have multiple forks. The highest-scoring fork is the version displayed here.</div>')+(dead?'':groupFormHTML())+(groups.length?groups.map(cardHTML).join(''):'<div class="empty">'+(dead?'No goals are currently below zero.':'No goals yet. Submit the first one.')+'</div>');
if(!dead){document.getElementById('new-goal').addEventListener('submit',async function(e){e.preventDefault();var form=e.currentTarget;var button=form.querySelector('button');button.disabled=true;try{await post('/api/create',{targetYear:form.elements.targetYear.value,statement:form.elements.statement.value,comments:form.elements.comments.value});location.hash='#';await render();}catch(err){showError(err.message);button.disabled=false;}});}
bindVotes();bindComments();}
async function renderForks(id){var data=await api('/api/group?id='+encodeURIComponent(id)+'&actor='+encodeURIComponent(actor));if(!data.group){main.innerHTML='<a class="back" href="#">← Main checklist</a><div class="empty">That goal does not exist.</div>';return;}
var g=data.group;var forks=g.forks;var form='<section class="form-panel"><h2>Add a fork</h2><p class="intro">Submit an interchangeable version of this goal, perhaps with a different target year or metric.</p><form id="new-fork"><div class="fields"><label for="fork-year">Target year</label><input id="fork-year" name="targetYear" type="number" min="1900" max="9999" value="'+(new Date().getFullYear()+1)+'" required><label for="fork-statement">Goal</label><textarea id="fork-statement" name="statement" maxlength="600" required placeholder="A slightly different version of the goal…"></textarea><label for="fork-comments">Comments</label><textarea id="fork-comments" name="comments" maxlength="2000" placeholder="Optional comments"></textarea><div class="form-buttons"><button class="primary" type="submit">Submit fork</button></div></div></form></section>';
var content=forks.map(function(f,i){return '<article class="fork-card"><div class="fork-heading"><div class="fork-rank">#'+(i+1)+'</div><div class="fork-body">'+(i===0?'<div class="winner">Leading version</div>':'')+'<div class="goal-title"><span class="year">'+esc(f.targetYear)+'</span><span class="goal-text">'+esc(f.statement)+'</span></div><div class="meta" style="margin-left:0">Submitted '+esc(fmt(f.createdAt))+'</div></div></div><div class="comments">'+commentsHTML(f.comments)+'</div><div class="card-actions">'+voteHTML(f)+'</div>'+commentFormHTML(f.id)+'</article>';}).join('');
main.innerHTML='<a class="back" href="#">← Main checklist</a><h1>Forks of this goal</h1><p class="intro">All versions are interchangeable proposals. The highest score wins; ties favor the oldest version.</p>'+form+'<div class="section-head"><h2>All versions</h2><span class="count">'+forks.length+' '+(forks.length===1?'fork':'forks')+'</span></div>'+(content||'<div class="empty">No forks yet.</div>');
document.getElementById('new-fork').addEventListener('submit',async function(e){e.preventDefault();var form=e.currentTarget;var button=form.querySelector('button');button.disabled=true;try{await post('/api/fork',{groupId:id,targetYear:form.elements.targetYear.value,statement:form.elements.statement.value,comments:form.elements.comments.value});await render();}catch(err){showError(err.message);button.disabled=false;}});bindVotes();bindComments();}
function replayForkHTML(f,isWinner){return '<div class="replay-fork">'+(isWinner?'<div class="winner">Displayed version at this time</div>':'')+'<div class="goal-title"><span class="year">'+esc(f.targetYear)+'</span><span class="goal-text">'+esc(f.statement)+'</span></div><div class="meta" style="margin-left:0">Score: <b>'+esc(scoreText(f.score))+'</b> · Submitted '+esc(fmt(f.createdAt))+'</div><div class="comments" style="margin-left:0">'+commentsHTML(f.comments)+'</div></div>';}
function replayGroupHTML(g){var dead=g.winner.score<0;return '<article class="replay-group">'+(dead?'<div class="dead-label">In dead checklist at this time</div>':'')+'<div class="section-head"><b>'+esc(g.winner.targetYear)+' · '+esc(g.winner.statement)+'</b><span class="count">'+g.forks.length+' versions</span></div>'+g.forks.map(function(f,i){return replayForkHTML(f,i===0);}).join('')+'</article>';}
var replayEvents=[];
async function showReplaySeq(seq){var data=await api('/api/replay?seq='+encodeURIComponent(seq));var host=document.getElementById('replay-state');if(!host)return;var e=data.event;var label=e?({goal_created:'New goal submitted',fork_created:'New fork submitted',vote_cast:'Vote changed',comment_added:'Comment appended'}[e.type]||e.type):'Before the first action';
host.innerHTML='<div class="section-head"><div><h2>Checklist at this point</h2><p class="intro">'+(e?'After action #'+esc(e.seq)+' · '+esc(fmt(e.at))+' · '+esc(label):'No saved actions yet at this time.')+'</p></div><span class="count">'+data.groups.length+' goals</span></div>'+(e?'<details><summary class="small">Full details of this saved action</summary><pre class="event-detail">'+esc(JSON.stringify({sequence:e.seq,timestamp:new Date(e.at).toISOString(),type:e.type,actor:e.actor,detail:e.detail},null,2))+'</pre></details>':'')+(data.groups.length?data.groups.map(replayGroupHTML).join(''):'<div class="empty">The checklist was empty at this point in history.</div>');
var count=document.getElementById('replay-position');if(count)count.textContent=e?'Action '+e.seq+' of '+replayEvents.length:'Before first action';var time=document.getElementById('replay-time');if(time&&e)time.value=localValue(e.at);}
async function renderReplay(){var data=await api('/api/history');replayEvents=data.events;main.innerHTML='<a class="back" href="#">← Main checklist</a><h1>Replay history</h1><p class="intro">Move through saved actions or choose a date and time. The display is reconstructed from the event log, not from a periodic snapshot.</p>'+(replayEvents.length?'<section class="timeline-panel"><div class="timeline-meta"><span id="replay-position">Action</span><span>'+replayEvents.length+' saved actions</span></div><input id="replay-slider" type="range" min="0" max="'+(replayEvents.length-1)+'" value="'+(replayEvents.length-1)+'"><form id="replay-time-form" class="time-form"><label for="replay-time">Show state at:</label><input id="replay-time" type="datetime-local" value="'+localValue(replayEvents[replayEvents.length-1].at)+'"><button class="primary" type="submit">Go to time</button></form></section><div id="replay-state" class="loading">Reconstructing history…</div>':'<div class="empty">No saved actions yet. Submissions, votes, forks, and comments will appear here.</div>');
if(!replayEvents.length)return;var slider=document.getElementById('replay-slider');slider.addEventListener('change',function(){showReplaySeq(replayEvents[Number(slider.value)].seq).catch(showError);});document.getElementById('replay-time-form').addEventListener('submit',async function(e){e.preventDefault();var t=new Date(document.getElementById('replay-time').value).getTime();if(!Number.isFinite(t)){showError('Choose a valid date and time.');return;}try{var r=await api('/api/replay?at='+t);var idx=replayEvents.findIndex(function(ev){return ev.seq===r.seq;});if(idx>=0)slider.value=idx;await showReplaySeq(r.seq);}catch(err){showError(err.message);}});await showReplaySeq(replayEvents[replayEvents.length-1].seq);}
async function render(){main.innerHTML='<div class="loading">Loading…</div>';try{var hash=decodeURIComponent(location.hash.slice(1)||'');if(hash==='dead')await renderList(true);else if(hash==='replay')await renderReplay();else if(hash.indexOf('forks/')===0)await renderForks(hash.slice(6));else await renderList(false);}catch(e){main.innerHTML='<div id="error">'+esc(e.message)+'</div>';}}
window.addEventListener('hashchange',render);
render();
})();
</script>
</body>
</html>`;

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

function applyReplayEvent(state, event) {
  const d = event.detail;
  if (event.type === "goal_created") {
    state.groups.set(d.group.id, d.group);
    state.forks.set(d.fork.id, { ...d.fork, score: 0 });
    state.comments.set(d.fork.id, d.initialComment ? [d.initialComment] : []);
    state.votes.set(d.fork.id, new Map());
  } else if (event.type === "fork_created") {
    state.forks.set(d.fork.id, { ...d.fork, score: 0 });
    state.comments.set(d.fork.id, d.initialComment ? [d.initialComment] : []);
    state.votes.set(d.fork.id, new Map());
  } else if (event.type === "comment_added") {
    const list = state.comments.get(d.forkId) || [];
    list.push(d.comment);
    state.comments.set(d.forkId, list);
  } else if (event.type === "vote_cast") {
    const fork = state.forks.get(d.forkId);
    if (fork) fork.score = d.afterScore;
    const votes = state.votes.get(d.forkId) || new Map();
    if (d.newVote === 0) votes.delete(event.actor);
    else votes.set(event.actor, d.newVote);
    state.votes.set(d.forkId, votes);
  }
}

function replayGroups(events) {
  const state = { groups: new Map(), forks: new Map(), comments: new Map(), votes: new Map() };
  for (const event of events) applyReplayEvent(state, event);
  const groups = [];
  for (const group of state.groups.values()) {
    const forks = [];
    for (const f of state.forks.values()) {
      if (f.groupId === group.id) {
        forks.push({
          ...f,
          comments: state.comments.get(f.id) || [],
          myVote: null
        });
      }
    }
    if (forks.length) {
      sortForks(forks);
      groups.push({ ...group, forks, winner: forks[0], forkCount: forks.length });
    }
  }
  return sortGroups(groups);
}

export class Checklist extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS goals (
        id TEXT PRIMARY KEY,
        created_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS forks (
        id TEXT PRIMARY KEY,
        group_id TEXT NOT NULL,
        target_year INTEGER NOT NULL,
        statement TEXT NOT NULL,
        score INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS votes (
        actor TEXT NOT NULL,
        fork_id TEXT NOT NULL,
        value INTEGER NOT NULL CHECK (value IN (-1, 1)),
        PRIMARY KEY (actor, fork_id)
      );
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        fork_id TEXT NOT NULL,
        actor TEXT NOT NULL,
        text TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        event_seq INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS events (
        seq INTEGER PRIMARY KEY AUTOINCREMENT,
        at INTEGER NOT NULL,
        type TEXT NOT NULL,
        actor TEXT NOT NULL,
        detail TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS forks_by_group ON forks(group_id, score DESC, created_at ASC);
      CREATE INDEX IF NOT EXISTS comments_by_fork ON comments(fork_id, created_at ASC);
      CREATE INDEX IF NOT EXISTS events_by_time ON events(at, seq);
    `);
  }

  log(type, actor, at, detail) {
    this.sql.exec(
      "INSERT INTO events (at, type, actor, detail) VALUES (?, ?, ?, ?)",
      at, type, actor, JSON.stringify(detail)
    );
    return Number(this.sql.exec("SELECT last_insert_rowid() AS seq").one().seq);
  }

  readEvents(where = "", ...args) {
    const rows = this.sql.exec(
      "SELECT seq, at, type, actor, detail FROM events " + where + " ORDER BY seq ASC",
      ...args
    ).toArray();
    return rows.map(row => ({
      seq: Number(row.seq),
      at: Number(row.at),
      type: row.type,
      actor: row.actor,
      detail: JSON.parse(row.detail)
    }));
  }

  getData(actor) {
    const groupsRows = this.sql.exec(
      "SELECT id, created_at AS createdAt FROM goals ORDER BY created_at ASC"
    ).toArray();
    const forkRows = this.sql.exec(
      "SELECT id, group_id AS groupId, target_year AS targetYear, statement, score, created_at AS createdAt FROM forks"
    ).toArray();
    const commentRows = this.sql.exec(
      "SELECT id, fork_id AS forkId, actor, text, created_at AS at FROM comments ORDER BY event_seq ASC"
    ).toArray();
    const voteRows = actor ? this.sql.exec(
      "SELECT fork_id AS forkId, value FROM votes WHERE actor = ?", actor
    ).toArray() : [];

    const comments = new Map();
    for (const row of commentRows) {
      if (!comments.has(row.forkId)) comments.set(row.forkId, []);
      comments.get(row.forkId).push({ id: row.id, actor: row.actor, text: row.text, at: Number(row.at) });
    }
    const myVotes = new Map(voteRows.map(row => [row.forkId, Number(row.value)]));
    const goals = new Map(groupsRows.map(row => [row.id, {
      id: row.id,
      createdAt: Number(row.createdAt),
      forks: []
    }]));
    for (const row of forkRows) {
      const group = goals.get(row.groupId);
      if (!group) continue;
      group.forks.push({
        id: row.id,
        groupId: row.groupId,
        targetYear: Number(row.targetYear),
        statement: row.statement,
        score: Number(row.score),
        createdAt: Number(row.createdAt),
        comments: comments.get(row.id) || [],
        myVote: myVotes.get(row.id) || 0
      });
    }
    const result = [];
    for (const group of goals.values()) {
      if (!group.forks.length) continue;
      sortForks(group.forks);
      group.winner = group.forks[0];
      group.forkCount = group.forks.length;
      result.push(group);
    }
    return sortGroups(result);
  }

  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    try {
      if (path === "/api/state" && request.method === "GET") {
        const actor = url.searchParams.get("actor");
        return json({ groups: this.getData(actor ? cleanActor(actor) : "") });
      }

      if (path === "/api/group" && request.method === "GET") {
        const id = url.searchParams.get("id") || "";
        const actor = url.searchParams.get("actor");
        const group = this.getData(actor ? cleanActor(actor) : "").find(g => g.id === id);
        return json({ group: group || null });
      }

      if (path === "/api/history" && request.method === "GET") {
        const rows = this.sql.exec(
          "SELECT seq, at, type, actor FROM events ORDER BY seq ASC"
        ).toArray();
        return json({ events: rows.map(row => ({
          seq: Number(row.seq), at: Number(row.at), type: row.type, actor: row.actor
        })) });
      }

      if (path === "/api/replay" && request.method === "GET") {
        let row;
        if (url.searchParams.has("seq")) {
          const seq = Number(url.searchParams.get("seq"));
          if (!Number.isSafeInteger(seq) || seq < 0) throw new Error("Invalid history sequence.");
          row = this.sql.exec("SELECT MAX(seq) AS seq FROM events WHERE seq <= ?", seq).toArray()[0];
        } else if (url.searchParams.has("at")) {
          const at = Number(url.searchParams.get("at"));
          if (!Number.isFinite(at)) throw new Error("Invalid replay date.");
          row = this.sql.exec("SELECT MAX(seq) AS seq FROM events WHERE at <= ?", at).toArray()[0];
        } else {
          row = this.sql.exec("SELECT MAX(seq) AS seq FROM events").toArray()[0];
        }
        const seq = row && row.seq != null ? Number(row.seq) : 0;
        const events = seq ? this.readEvents("WHERE seq <= ?", seq) : [];
        return json({
          seq,
          event: events.length ? events[events.length - 1] : null,
          groups: replayGroups(events)
        });
      }

      if (path.startsWith("/api/") && request.method === "POST") {
        const body = await request.json();
        const actor = cleanActor(body.actor);
        const at = Date.now();

        if (path === "/api/create") {
          const targetYear = cleanYear(body.targetYear);
          const statement = cleanText(body.statement, "Goal", 600);
          const commentText = cleanText(body.comments || "", "Comments", 2000, false);
          const group = { id: crypto.randomUUID(), createdAt: at };
          const fork = {
            id: crypto.randomUUID(), groupId: group.id,
            targetYear, statement, createdAt: at
          };
          const initialComment = commentText ? {
            id: crypto.randomUUID(), actor, text: commentText, at
          } : null;
          const detail = { group, fork, initialComment };
          this.ctx.storage.transactionSync(() => {
            this.sql.exec("INSERT INTO goals (id, created_at) VALUES (?, ?)", group.id, at);
            this.sql.exec(
              "INSERT INTO forks (id, group_id, target_year, statement, score, created_at) VALUES (?, ?, ?, ?, 0, ?)",
              fork.id, group.id, targetYear, statement, at
            );
            const seq = this.log("goal_created", actor, at, detail);
            if (initialComment) this.sql.exec(
              "INSERT INTO comments (id, fork_id, actor, text, created_at, event_seq) VALUES (?, ?, ?, ?, ?, ?)",
              initialComment.id, fork.id, actor, initialComment.text, at, seq
            );
          });
          return json({ ok: true, groupId: group.id, forkId: fork.id });
        }

        if (path === "/api/fork") {
          const groupId = cleanText(body.groupId, "Goal ID", 80);
          const exists = this.sql.exec("SELECT id FROM goals WHERE id = ?", groupId).toArray()[0];
          if (!exists) throw new Error("That goal no longer exists.");
          const targetYear = cleanYear(body.targetYear);
          const statement = cleanText(body.statement, "Goal", 600);
          const commentText = cleanText(body.comments || "", "Comments", 2000, false);
          const fork = {
            id: crypto.randomUUID(), groupId,
            targetYear, statement, createdAt: at
          };
          const initialComment = commentText ? {
            id: crypto.randomUUID(), actor, text: commentText, at
          } : null;
          const detail = { fork, initialComment };
          this.ctx.storage.transactionSync(() => {
            this.sql.exec(
              "INSERT INTO forks (id, group_id, target_year, statement, score, created_at) VALUES (?, ?, ?, ?, 0, ?)",
              fork.id, groupId, targetYear, statement, at
            );
            const seq = this.log("fork_created", actor, at, detail);
            if (initialComment) this.sql.exec(
              "INSERT INTO comments (id, fork_id, actor, text, created_at, event_seq) VALUES (?, ?, ?, ?, ?, ?)",
              initialComment.id, fork.id, actor, initialComment.text, at, seq
            );
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
            const priorRow = this.sql.exec(
              "SELECT value FROM votes WHERE actor = ? AND fork_id = ?", actor, forkId
            ).toArray()[0];
            const previousVote = priorRow ? Number(priorRow.value) : 0;
            const newVote = previousVote === requested ? 0 : requested;
            const beforeScore = Number(fork.score);
            const afterScore = beforeScore + newVote - previousVote;
            if (newVote === 0) {
              this.sql.exec("DELETE FROM votes WHERE actor = ? AND fork_id = ?", actor, forkId);
            } else {
              this.sql.exec(
                "INSERT INTO votes (actor, fork_id, value) VALUES (?, ?, ?) ON CONFLICT(actor, fork_id) DO UPDATE SET value = excluded.value",
                actor, forkId, newVote
              );
            }
            this.sql.exec("UPDATE forks SET score = ? WHERE id = ?", afterScore, forkId);
            const detail = { forkId, previousVote, newVote, beforeScore, afterScore };
            this.log("vote_cast", actor, at, detail);
            result = { previousVote, newVote, score: afterScore };
          });
          return json({ ok: true, ...result });
        }

        if (path === "/api/comment") {
          const forkId = cleanText(body.forkId, "Fork ID", 80);
          const text = cleanText(body.text, "Comment", 2000);
          const exists = this.sql.exec("SELECT id FROM forks WHERE id = ?", forkId).toArray()[0];
          if (!exists) throw new Error("That version no longer exists.");
          const comment = { id: crypto.randomUUID(), actor, text, at };
          this.ctx.storage.transactionSync(() => {
            const seq = this.log("comment_added", actor, at, { forkId, comment });
            this.sql.exec(
              "INSERT INTO comments (id, fork_id, actor, text, created_at, event_seq) VALUES (?, ?, ?, ?, ?, ?)",
              comment.id, forkId, actor, text, at, seq
            );
          });
          return json({ ok: true, commentId: comment.id });
        }

        return json({ error: "Unknown API endpoint." }, 404);
      }

      if (path.startsWith("/api/")) return json({ error: "Not found." }, 404);

      return new Response(PAGE, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "x-content-type-options": "nosniff"
        }
      });
    } catch (error) {
      const message = error && error.message ? error.message : "Request failed.";
      return json({ error: message }, 400);
    }
  }
}

export default {
  async fetch(request, env) {
    const id = env.CHECKLIST.idFromName("the-checklist-global");
    return env.CHECKLIST.get(id).fetch(request);
  }
};
