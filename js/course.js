(function () {
  "use strict";

  var PASS = 80;

  /* ---------- Content ---------- */
  var KC = {
    k1: {
      q: "You finish reading a chapter. Which next step builds the strongest memory?",
      o: ["Re-read it once more, highlighting key lines", "Close the book and write down everything you can recall", "Copy the chapter summary into your notebook", "Listen to a recording of the chapter"],
      a: 1,
      ok: "Right. Retrieving from memory is the active ingredient. Check afterwards and fix the gaps.",
      no: "Those feel productive but are mostly re-exposure. Closing the book and recalling is the effortful step that sticks."
    },
    k2: {
      q: "You have 6 hours to prepare for an exam in 2 weeks. What's the best plan?",
      o: ["One 6-hour session the day before", "Six 1-hour sessions spread over the two weeks", "Six hours the first day, then nothing", "Study only when you feel anxious"],
      a: 1,
      ok: "Exactly. Spacing lets forgetting happen between sessions, so each review strengthens the memory.",
      no: "Same hours, better spread: six shorter sessions across the two weeks produce longer-lasting memory."
    },
    k3: {
      q: "A learner practises 10 problems of type A, then 10 of type B, then 10 of type C. How could this improve?",
      o: ["Do all of type A again for mastery", "Mix A, B and C together in one set", "Skip type C", "Use easier problems only"],
      a: 1,
      ok: "Yes. Mixing types forces the learner to identify which method applies, just like the real task.",
      no: "Blocked practice hides the hardest part: choosing the right approach. Mix the types."
    },
    k4: {
      q: "Which is the best example of dual coding?",
      o: ["Adding a decorative stock photo to a slide", "Pairing a labelled process diagram with a short explanation", "Increasing the font size", "Reading the text aloud twice"],
      a: 1,
      ok: "Correct. A relevant diagram plus words gives two routes to the same idea.",
      no: "The visual must carry meaning. A labelled diagram with words does that; decoration doesn't."
    },
    k5: {
      q: "A lesson slide has 12 bullet points on one topic. What's the best fix?",
      o: ["Shrink the font to fit", "Group them into 3 labelled chunks and show one at a time", "Add more bullets for completeness", "Add background music"],
      a: 1,
      ok: "Yes. Chunking and sequencing lower load so attention goes to understanding.",
      no: "Reduce load: group items into a few meaningful chunks and reveal them step by step."
    }
  };

  var FINAL = [
    { q: "A student always re-reads notes and feels confident but scores poorly. What explains this?",
      o: ["Illusion of mastery from familiarity", "They need a different learning style", "Not enough highlighting", "Bad luck"], a: 0,
      ok: "Familiarity feels like knowing. Test yourself to see what you really know.", no: "Re-reading creates familiarity, which feels like knowledge but isn't." },
    { q: "Which is the best use of 20 minutes at the end of a lesson?",
      o: ["Recap by re-reading the slides", "Short quiz from memory, then feedback", "Start a new unrelated topic", "Free time"], a: 1,
      ok: "Retrieval plus feedback is a high-yield close.", no: "A short recall quiz with feedback strengthens memory far more." },
    { q: "A new employee needs to remember a procedure for six months. Which schedule fits?",
      o: ["Single day-long workshop", "Short refreshers at 1 day, 1 week and 1 month", "A handout to keep", "One reminder at month 6"], a: 1,
      ok: "Expanding intervals fight forgetting just as it begins.", no: "Spaced refreshers with growing gaps keep the memory alive." },
    { q: "Which slide design best supports learning?",
      o: ["A dense paragraph and a logo", "A relevant diagram with 2 short labels", "Eight bullets with clip-art", "Full transcript on screen"], a: 1,
      ok: "Relevant visual, minimal text: dual coding with low load.", no: "Choose a meaningful diagram with minimal text to limit load." },
    { q: "Why can interleaved practice feel worse yet work better?",
      o: ["It's easier, so we relax", "It adds desirable difficulty that strengthens learning", "It shortens study time", "It removes the need to review"], a: 1,
      ok: "Right: struggle during practice often signals deeper learning.", no: "It feels harder because it adds desirable difficulty, which boosts long-term learning." }
  ];

  var CAL = {
    cram: { study: [12, 13], test: [14], text: "All study packed into the last two days. Short-term performance may be fine, but most of it is forgotten soon after." },
    spaced: { study: [1, 3, 6, 10], test: [14], text: "Sessions are spread with growing gaps. Each review catches the memory as it fades, so it lasts." }
  };

  /* ---------- Branching scenario data ---------- */
  var SCN = {
    start: {
      stage: "Week 1", who: "Maya", pts: 0,
      story: "Maya starts a new job and must pass a compliance certification in <b>three weeks</b>. She can study about six hours a week. The manual is 300 pages. It's Monday evening and she opens it for the first time.",
      choices: [
        { t: "Read the first chapters twice and highlight the important lines.", next: "weak2", pts: 0, tone: "wrong", why: "Re-reading and highlighting feel productive, but they mostly build familiarity, not memory." },
        { t: "Read one section, close the manual, and write down what she remembers. Then check and fix gaps.", next: "strong2", pts: 2, tone: "right", why: "Retrieval practice with feedback: the effort of recalling is what makes it stick." },
        { t: "Copy the key points into a neat, colour-coded summary sheet.", next: "weak2", pts: 0, tone: "wrong", why: "Copying is passive. The sheet looks great, but the brain did little work." }
      ]
    },
    weak2: {
      stage: "Week 2", who: "Maya", pts: 0,
      story: "A practice quiz shows Maya recognises the terms but can't answer the questions. She has <b>two weeks</b> left and feels a rising worry: <i>\"I read this. Why can't I recall it?\"</i>",
      choices: [
        { t: "Go back to chapter 1 and read everything again more slowly.", next: "n3", pts: 0, tone: "wrong", why: "More of the same. Familiarity rises, but recall doesn't." },
        { t: "Quiz herself on a few chapters every other day, and revisit missed items a few days later.", next: "n3", pts: 2, tone: "right", why: "Retrieval plus spacing. Maya switches strategy at the right time." },
        { t: "Plan one long weekend session to cover everything at once.", next: "n3", pts: 0, tone: "wrong", why: "Massed practice can feel solid but fades quickly." }
      ]
    },
    strong2: {
      stage: "Week 2", who: "Maya", pts: 0,
      story: "Maya's recall quizzes work. She spots gaps in chapters 2 and 5 and still has <b>two weeks</b> left. How should she use them?",
      choices: [
        { t: "Revisit chapters 2 and 5 after a day and again after three days, mixed in with other chapters.", next: "n3", pts: 2, tone: "right", why: "Spacing plus interleaving: reviews arrive as memory starts to fade, and mixing builds the skill of choosing the right rule." },
        { t: "Move on to new chapters and skip the reviews.", next: "n3", pts: 0, tone: "wrong", why: "Gaps stay open and the early chapters will fade." },
        { t: "Restart the whole manual from page one.", next: "n3", pts: 1, tone: "mid", why: "Thorough, but slow. Targeted review of the weak spots is more efficient." }
      ]
    },
    n3: {
      stage: "Week 3", who: "Maya", pts: 0,
      story: "The exam is in <b>two days</b>. Maya has a lot to pull together. What's her best plan?",
      choices: [
        { t: "Pull an all-nighter and re-read every chapter.", next: "end", pts: 0, tone: "wrong", why: "Cramming and sleep loss hurt recall and focus." },
        { t: "Take a timed, mixed-topic practice test, review misses by drawing the key process as a simple diagram, then sleep well.", next: "end", pts: 2, tone: "right", why: "Retrieval, interleaving and dual coding (words plus a diagram), with rest to consolidate memory." },
        { t: "Redo only her favourite chapters, since they feel easy.", next: "end", pts: 1, tone: "mid", why: "Comfortable, but she's practising what she already knows." }
      ]
    }
  };

  var ENDINGS = {
    strong: { cls: "strong", h: "Maya passes with confidence", p: "Her sessions were spaced, active and mixed. She walks into the exam recalling, not just recognising." },
    okay:   { cls: "okay",   h: "Maya scrapes through", p: "She used some strong strategies but fell back on comfortable habits. A few more effortful recall sessions would have made the difference." },
    weak:   { cls: "weak",   h: "Maya struggles on exam day", p: "Her habits felt productive but built familiarity, not memory. The good news: the strategies you've learned are exactly what she needed." }
  };

  var state = { viewed: {}, kc: {}, final: null, scn: 0, loc: "s0" };

  /* ---------- Helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  var SECS = $$("section[data-sec]");
  var TOTAL = SECS.length + Object.keys(KC).length + 2; /* sections + checks + scenario + final */

  /* ---------- Persistence ---------- */
  function save() {
    var data = JSON.stringify(state);
    SCORM.set("cmi.core.lesson_location", state.loc);
    SCORM.set("cmi.suspend_data", data);
    updateStatus();
    SCORM.commit();
  }

  function progressCount() {
    return Object.keys(state.viewed).length + Object.keys(state.kc).length + (state.scn ? 1 : 0) + (state.final ? 1 : 0);
  }

  function updateStatus() {
    var pct = Math.round(progressCount() / TOTAL * 100);
    $("#pfill").style.width = pct + "%";
    $("#ptext").textContent = pct + "%";
    $("#pbar").setAttribute("aria-valuenow", pct);
    if (state.final) {
      SCORM.set("cmi.core.score.min", 0);
      SCORM.set("cmi.core.score.max", 100);
      SCORM.set("cmi.core.score.raw", state.final.score);
      var done = progressCount() >= TOTAL;
      SCORM.set("cmi.core.lesson_status", state.final.score >= PASS && done ? "passed" : "incomplete");
    } else {
      SCORM.set("cmi.core.lesson_status", "incomplete");
    }
  }

  /* ---------- Knowledge checks ---------- */
  function buildOptions(box, item, onPick) {
    var wrap = el("div", "opts");
    wrap.setAttribute("role", "radiogroup");
    item.o.forEach(function (t, i) {
      var b = el("button", "opt", '<span class="dot"></span><span>' + t + "</span>");
      b.type = "button"; b.setAttribute("role", "radio"); b.setAttribute("aria-checked", "false"); b.dataset.i = i;
      b.addEventListener("click", function () {
        if (b.disabled) return;
        $$(".opt", wrap).forEach(function (x) { x.setAttribute("aria-checked", "false"); });
        b.setAttribute("aria-checked", "true");
        onPick(i);
      });
      wrap.appendChild(b);
    });
    return wrap;
  }

  function lockAndMark(wrap, item, picked) {
    $$(".opt", wrap).forEach(function (b, i) {
      b.disabled = true;
      if (i === item.a) b.classList.add("right");
      else if (i === picked) b.classList.add("wrong");
    });
  }

  function renderKC(box) {
    var id = box.dataset.kc, item = KC[id], picked = null;
    box.innerHTML = "";
    box.appendChild(el("span", "kc-tag", "Knowledge check"));
    box.appendChild(el("div", "kc-q", item.q));
    var wrap = buildOptions(box, item, function (i) { picked = i; check.disabled = false; });
    box.appendChild(wrap);
    var fb = el("div", "fb"); fb.setAttribute("role", "status"); fb.setAttribute("aria-live", "polite");
    var actions = el("div", "kc-actions");
    var check = el("button", "btn", "Check answer"); check.type = "button"; check.disabled = true;
    actions.appendChild(check); box.appendChild(actions); box.appendChild(fb);

    function showResult(correct) {
      lockAndMark(wrap, item, picked);
      fb.className = "fb show " + (correct ? "ok" : "no");
      fb.innerHTML = "<b>" + (correct ? "Correct. " : "Not quite. ") + "</b>" + (correct ? item.ok : item.no);
      actions.innerHTML = "";
      if (!correct) {
        var retry = el("button", "btn ghost", "Try again"); retry.type = "button";
        retry.addEventListener("click", function () { renderKC(box); });
        actions.appendChild(retry);
      }
    }

    check.addEventListener("click", function () {
      var correct = picked === item.a;
      showResult(correct);
      if (!state.kc[id]) { state.kc[id] = { c: correct ? 1 : 0 }; save(); }
      else if (correct) { state.kc[id].c = 1; save(); }
    });
  }

  /* ---------- Final assessment ---------- */
  var fin = { i: 0, score: 0, picked: null };

  function renderFinal() {
    var box = $("#final");
    box.innerHTML = "";
    if (fin.i >= FINAL.length) return renderResults(box);
    var item = FINAL[fin.i], answered = false;
    var card = el("div", "kc");
    card.appendChild(el("span", "kc-tag", "Question " + (fin.i + 1) + " of " + FINAL.length));
    card.appendChild(el("div", "kc-q", item.q));
    var wrap = buildOptions(card, item, function (i) { fin.picked = i; submit.disabled = false; });
    card.appendChild(wrap);
    var fb = el("div", "fb"); fb.setAttribute("role", "status"); fb.setAttribute("aria-live", "polite");
    var actions = el("div", "kc-actions");
    var submit = el("button", "btn", "Submit"); submit.type = "button"; submit.disabled = true;
    actions.appendChild(submit); card.appendChild(actions); card.appendChild(fb);
    box.appendChild(card);

    submit.addEventListener("click", function () {
      if (answered) return;
      answered = true;
      var correct = fin.picked === item.a;
      if (correct) fin.score++;
      lockAndMark(wrap, item, fin.picked);
      fb.className = "fb show " + (correct ? "ok" : "no");
      fb.innerHTML = "<b>" + (correct ? "Correct. " : "Not quite. ") + "</b>" + (correct ? item.ok : item.no);
      actions.innerHTML = "";
      var next = el("button", "btn", fin.i === FINAL.length - 1 ? "See results" : "Next question"); next.type = "button";
      next.addEventListener("click", function () { fin.i++; fin.picked = null; renderFinal(); });
      actions.appendChild(next);
      next.focus();
    });
  }

  function renderResults(box) {
    var pct = Math.round(fin.score / FINAL.length * 100);
    var passed = pct >= PASS;
    var prev = state.final ? state.final.score : -1;
    if (pct > prev) { state.final = { score: pct }; }
    save();
    var card = el("div", "card score");
    card.innerHTML =
      '<div class="ring" style="--p:' + pct + '"><span>' + pct + "%</span></div>" +
      "<h3>" + (passed ? "Well done. You passed." : "Almost there.") + "</h3>" +
      "<p>" + fin.score + " of " + FINAL.length + " correct. " + (passed ? "You can apply these five strategies right away." : "Pass mark is " + PASS + "%. Review the lessons and try again.") + "</p>" +
      '<ul class="recap" style="text-align:left;max-width:520px;margin:12px auto"><li><b>Retrieval:</b> test yourself</li><li><b>Spacing:</b> spread it out</li><li><b>Interleaving:</b> mix it up</li><li><b>Dual coding:</b> words + meaningful visuals</li><li><b>Load:</b> chunk and simplify</li></ul>';
    var retry = el("button", "btn ghost", "Retake the challenge"); retry.type = "button";
    retry.addEventListener("click", function () { fin = { i: 0, score: 0, picked: null }; renderFinal(); });
    card.appendChild(retry);
    box.appendChild(card);
  }

  /* ---------- Branching scenario engine ---------- */
  function renderScenario(nodeId, score, trail) {
    var box = $("#scn"), node = SCN[nodeId], next = $("#scnNext");
    box.innerHTML = "";
    if (!node) return renderEnding(score, trail);
    var meter = '<span class="scn-meter" aria-label="Confidence: ' + Math.ceil(score / 2) + ' of 3">';
    for (var m = 0; m < 3; m++) meter += '<i class="' + (m < Math.ceil(score / 2) ? "on" : "") + '"></i>';
    meter += "</span>";
    box.appendChild(el("div", "scn-meta", "<span>" + node.stage + "</span><span>Confidence " + meter + "</span>"));
    box.appendChild(el("div", "scn-story", '<div class="who"><span class="av">M</span>' + node.who + "</div><p>" + node.story + "</p><p><b>What should Maya do?</b></p>"));
    var picked = null, locked = false;
    var wrap = el("div", "opts"); wrap.setAttribute("role", "radiogroup");
    node.choices.forEach(function (c, i) {
      var b = el("button", "opt", '<span class="dot"></span><span>' + c.t + "</span>");
      b.type = "button"; b.setAttribute("role", "radio"); b.setAttribute("aria-checked", "false");
      b.addEventListener("click", function () {
        if (locked) return;
        locked = true;
        $$(".opt", wrap).forEach(function (x, xi) {
          x.disabled = true;
          if (xi === i) x.classList.add(c.tone);
        });
        b.setAttribute("aria-checked", "true");
        var fb = el("div", "fb show " + (c.tone === "right" ? "ok" : c.tone === "mid" ? "mid" : "no"),
          "<b>" + (c.tone === "right" ? "Strong choice. " : c.tone === "mid" ? "Okay, but not the best. " : "Not ideal. ") + "</b>" + c.why);
        box.appendChild(fb);
        var go = el("button", "btn", c.next === "end" ? "See how it ends" : "Continue the story"); go.type = "button";
        var row = el("div", "kc-actions"); row.appendChild(go); box.appendChild(row);
        go.addEventListener("click", function () {
          trail.push({ stage: node.stage, pick: c.t, tone: c.tone });
          renderScenario(c.next, score + c.pts, trail);
          box.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        go.focus();
      });
      wrap.appendChild(b);
    });
    box.appendChild(wrap);
  }

  function renderEnding(score, trail) {
    var box = $("#scn"), key = score >= 5 ? "strong" : score >= 3 ? "okay" : "weak", e = ENDINGS[key];
    box.innerHTML = "";
    var list = "";
    trail.forEach(function (t) {
      list += "<li><b>" + t.stage + ":</b> " + t.pick + " " + (t.tone === "right" ? "&#10003;" : t.tone === "mid" ? "&#126;" : "&#10007;") + "</li>";
    });
    box.appendChild(el("div", "ending " + e.cls, "<h3>" + e.h + "</h3><p>" + e.p + '</p><p><b>Your path</b></p><ul class="path">' + list + "</ul>"));
    var again = el("button", "btn ghost", "Try a different path"); again.type = "button";
    again.style.marginTop = "16px";
    again.addEventListener("click", function () { renderScenario("start", 0, []); });
    box.appendChild(again);
    $("#scnNext").disabled = false;
    if (!state.scn) { state.scn = 1; save(); }
  }

  /* ---------- Interactions ---------- */
  function initFlips() {
    $$(".flip").forEach(function (f) {
      f.addEventListener("click", function () {
        var on = f.classList.toggle("on");
        f.setAttribute("aria-pressed", on);
      });
    });
  }

  function initDump() {
    $("#dumpBtn").addEventListener("click", function () { $("#dumpReveal").classList.add("show"); });
  }

  function drawCal(key) {
    var cal = $("#cal"), cfg = CAL[key];
    cal.innerHTML = "";
    for (var d = 1; d <= 14; d++) {
      var c = el("div", "day", d);
      if (cfg.study.indexOf(d) > -1) c.className += " study";
      if (cfg.test.indexOf(d) > -1) c.className += " test";
      cal.appendChild(c);
    }
    $("#schedText").textContent = cfg.text;
  }

  function drawBlocks(mode) {
    var box = $("#blocks"), seq = [];
    box.innerHTML = "";
    if (mode === "blocked") seq = "AAAABBBBCCCC".split("");
    else seq = "ABCABCABCABC".split("");
    seq.forEach(function (l, i) {
      var b = el("div", "bl " + l, l);
      b.style.animationDelay = (i * 40) + "ms";
      box.appendChild(b);
    });
    $("#orderText").textContent = mode === "blocked"
      ? "Blocked: finish all of A, then B, then C. Smooth in the moment, but you always know which method to use."
      : "Interleaved: A, B and C alternate. Harder in the moment, but you practise choosing the right method.";
  }

  function initTabs(selector, attr, cb) {
    var tabs = $$(selector);
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        tabs.forEach(function (x) { x.setAttribute("aria-selected", x === t); });
        cb(t.dataset[attr]);
      });
    });
  }

  function initChunk() {
    var chunked = false, d = $("#digits"), b = $("#chunkBtn");
    b.addEventListener("click", function () {
      chunked = !chunked;
      d.textContent = chunked ? "495 · 281 · 7360" : "4 9 5 2 8 1 7 3 6 0";
      b.textContent = chunked ? "Show original" : "Chunk it";
    });
  }

  /* ---------- Navigation and view tracking ---------- */
  function initNav() {
    $$("[data-next]").forEach(function (b) {
      b.addEventListener("click", function () {
        var t = document.getElementById(b.dataset.next);
        if (t) { t.scrollIntoView({ behavior: "smooth", block: "start" }); }
      });
    });
  }

  function initViews() {
    if (!("IntersectionObserver" in window)) {
      SECS.forEach(function (s) { state.viewed[s.dataset.sec] = 1; }); save(); return;
    }
    var io = new IntersectionObserver(function (entries) {
      var changed = false;
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var k = e.target.dataset.sec;
          state.loc = e.target.id;
          if (!state.viewed[k]) { state.viewed[k] = 1; }
          changed = true;
        }
      });
      if (changed) save();
    }, { threshold: 0.25 });
    SECS.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Restore ---------- */
  function restore() {
    SCORM.init();
    var raw = SCORM.get("cmi.suspend_data");
    if (raw) { try { var d = JSON.parse(raw); if (d && typeof d === "object") { state.viewed = d.viewed || {}; state.kc = d.kc || {}; state.final = d.final || null; state.scn = d.scn || 0; state.loc = d.loc || "s0"; } } catch (e) {} }
    var status = SCORM.get("cmi.core.lesson_status");
    if (!status || status === "not attempted") SCORM.set("cmi.core.lesson_status", "incomplete");
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    restore();
    $$(".kc[data-kc]").forEach(renderKC);
    renderFinal();
    renderScenario("start", 0, []);
    if (state.scn) $("#scnNext").disabled = false;
    initFlips(); initDump(); initChunk(); initNav();
    drawCal("cram"); drawBlocks("blocked");
    initTabs("[data-sched]", "sched", drawCal);
    initTabs("[data-order]", "order", drawBlocks);
    updateStatus();
    if (state.loc && state.loc !== "s0") {
      var t = document.getElementById(state.loc);
      if (t) setTimeout(function () { t.scrollIntoView({ block: "start" }); }, 200);
    }
    initViews();
  });

  window.addEventListener("beforeunload", function () { SCORM.finish(); });
  window.addEventListener("pagehide", function () { SCORM.finish(); });
})();
