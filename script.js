/* Edit this object to personalize the website. */
const siteConfig = {
  senderName: "Avicenna",
  recipientName: "Maureeen",
  opening: "A feeling that grew quietly, recorded between small conversations and simple moments that always seemed to matter.",
  records: [
    { code: "OBS-01", title: "The small things that always stand out", text: "[Write about a small habit that makes her feel special.]" },
    { code: "OBS-02", title: "A conversation worth remembering", text: "[Write about a conversation or simple moment you still remember.]" },
    { code: "OBS-03", title: "Something worth admiring", text: "[Write about a quality, way of thinking, or kindness you genuinely appreciate.]" },
    { code: "OBS-04", title: "When her presence began to feel different", text: "[Write about when you realized that her presence mattered.]" },
    { code: "OBS-05", title: "Why this message was made", text: "[Share an honest, simple reason without asking for anything in return.]" }
  ],
  timeline: [
    { phase: "01 / FIRST DETECTION", title: "The first realization", text: "[Describe your first impression or the moment she first caught your attention.]" },
    { phase: "02 / FAMILIAR SIGNAL", title: "Her presence became familiar", text: "[Describe a small thing that made her presence feel increasingly comforting.]" },
    { phase: "03 / STABLE SIGNAL", title: "The small things began to matter", text: "[Add a personal detail without making it feel excessive.]" },
    { phase: "04 / EMOTIONAL CONFIRMATION", title: "The feeling became clear", text: "[Calmly explain when you began to recognize that feeling.]" },
    { phase: "05 / MESSAGE TRANSMISSION", title: "The message was finally sent", text: "Not to force an answer, but to keep something sincere from remaining unspoken forever." }
  ],
  letter: [
    "There are many ways to express something, but this message was chosen so that every part could be arranged calmly and honestly.",
    "Your presence has made a few simple moments easier to remember. Not because you have to be perfect, but because the way you are yourself already means something.",
    "This message does not ask for an immediate answer or take away your right to decide how you feel. It has only one purpose: to let you know that you are genuinely appreciated."
  ],
  syncMessage: "Connection established. A sincere message is ready to be received.",
  responses: {
    talk: "CHANNEL OPEN / Thank you. A calm conversation matters more than a rushed answer.",
    time: "TIME REQUEST ACCEPTED / That is completely okay. Your time and space will always be respected.",
    appreciate: "SIGNAL RECEIVED / Thank you for receiving this message kindly. No other answer is being demanded."
  }
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)");

function announce(message) {
  const region = $("#liveRegion");
  if (region) region.textContent = message;
}

/* ==========================================================================
   CONTENT
   ========================================================================== */
function applyConfig() {
  $$('[data-recipient]').forEach((node) => { node.textContent = siteConfig.recipientName; });
  $$('[data-sender]').forEach((node) => { node.textContent = siteConfig.senderName; });
  const opening = $('[data-opening]');
  if (opening) opening.textContent = siteConfig.opening;
  renderRecordDots();
  renderTimelineDots();
  renderLetter();
}

function decryptText(element, finalText) {
  if (reduceMotion.matches) {
    element.textContent = finalText;
    return;
  }
  const chars = "01AXREI#?+<>/";
  let iteration = 0;
  const timer = window.setInterval(() => {
    element.textContent = [...finalText].map((char, index) => {
      if (char === " ") return " ";
      return index < iteration ? char : chars[Math.floor(Math.random() * chars.length)];
    }).join("");
    iteration += 1.8;
    if (iteration >= finalText.length) {
      clearInterval(timer);
      element.textContent = finalText;
    }
  }, 22);
}

function renderLetter() {
  const copy = $("#letterCopy");
  if (!copy) return;
  copy.innerHTML = "";
  siteConfig.letter.forEach((text) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    copy.append(paragraph);
  });
}

let letterRevealed = false;
function revealLetterOnce() {
  if (letterRevealed) return;
  letterRevealed = true;
  $$("#letterCopy p").forEach((paragraph, index) => {
    window.setTimeout(() => paragraph.classList.add("is-visible"), reduceMotion.matches ? 0 : index * 480);
  });
}

function setupAssetFallbacks() {
  $$(".asset-frame img").forEach((image) => {
    const frame = image.closest(".asset-frame");
    const fail = () => {
      image.hidden = true;
      frame?.classList.add("is-fallback");
    };
    image.addEventListener("error", fail, { once: true });
    if (image.complete && image.naturalWidth === 0) fail();
  });
}

/* ==========================================================================
   RECORDS (single-item pager)
   ========================================================================== */
function renderRecordDots() {
  const wrap = $("#recordDots");
  if (!wrap) return;
  wrap.innerHTML = "";
  siteConfig.records.forEach((record, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `Record ${index + 1} of ${siteConfig.records.length}`);
    button.addEventListener("click", () => {
      sceneManager.state.recordIndex = index;
      showRecord(index);
      playInterfaceSound();
    });
    wrap.append(button);
  });
}

function showRecord(index) {
  const record = siteConfig.records[index];
  if (!record) return;
  $("#recordNumber").textContent = String(index + 1).padStart(2, "0");
  $("#recordCode").textContent = record.code;
  $("#recordTitle").textContent = record.title;
  const status = $("#recordStatus");
  status.textContent = "DECRYPTING RECORD...";
  const textEl = $("#recordText");
  decryptText(textEl, record.text);
  window.setTimeout(() => { status.textContent = "RECORD DECRYPTED"; }, reduceMotion.matches ? 0 : Math.min(900, record.text.length * 12));
  $$("#recordDots button").forEach((button, i) => button.classList.toggle("is-active", i === index));
  announce(`Personal record ${index + 1} of ${siteConfig.records.length}.`);
}

function recordStep(delta) {
  const total = siteConfig.records.length;
  const nextIndex = sceneManager.state.recordIndex + delta;
  if (nextIndex < 0) { sceneManager.goTo("connection", { direction: "backward" }); return; }
  if (nextIndex >= total) { sceneManager.goTo("timeline", { direction: "forward" }); return; }
  sceneManager.state.recordIndex = nextIndex;
  showRecord(nextIndex);
  playInterfaceSound();
}

/* ==========================================================================
   TIMELINE (single-item pager)
   ========================================================================== */
function renderTimelineDots() {
  const wrap = $("#timelineDots");
  if (!wrap) return;
  wrap.innerHTML = "";
  siteConfig.timeline.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `Milestone ${index + 1} of ${siteConfig.timeline.length}`);
    button.addEventListener("click", () => {
      sceneManager.state.timelineIndex = index;
      showTimeline(index);
      playInterfaceSound();
    });
    wrap.append(button);
  });
}

function showTimeline(index) {
  const item = siteConfig.timeline[index];
  if (!item) return;
  $("#timelinePhase").textContent = item.phase;
  $("#timelineTitle").textContent = item.title;
  $("#timelineText").textContent = item.text;
  $("#timelineProgress").style.width = `${((index + 1) / siteConfig.timeline.length) * 100}%`;
  $$("#timelineDots button").forEach((button, i) => button.classList.toggle("is-active", i === index));
  announce(`Signal history ${index + 1} of ${siteConfig.timeline.length}.`);
}

function timelineStep(delta) {
  const total = siteConfig.timeline.length;
  const nextIndex = sceneManager.state.timelineIndex + delta;
  if (nextIndex < 0) { sceneManager.goTo("records", { direction: "backward" }); return; }
  if (nextIndex >= total) { sceneManager.goTo("barrier", { direction: "forward" }); return; }
  sceneManager.state.timelineIndex = nextIndex;
  showTimeline(nextIndex);
  playInterfaceSound();
}

/* ==========================================================================
   HOLD INTERACTION (shared by connection + barrier)
   ========================================================================== */
function createHoldInteraction(button, onProgress, onComplete, duration = 2200) {
  if (!button) return;
  let holding = false;
  let completed = false;
  let progress = 0;
  let startedAt = 0;
  let frame = 0;

  const tick = (time) => {
    if (!holding || completed) return;
    if (!startedAt) startedAt = time - progress * duration;
    progress = Math.min(1, (time - startedAt) / duration);
    onProgress(progress);
    if (progress >= 1) {
      completed = true;
      holding = false;
      button.setAttribute("aria-pressed", "true");
      onComplete();
      return;
    }
    frame = requestAnimationFrame(tick);
  };
  const start = (event) => {
    if (completed) return;
    if (event.type === "keydown" && !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    holding = true;
    button.classList.add("is-active");
    startedAt = performance.now() - progress * duration;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(tick);
  };
  const stop = (event) => {
    if (event?.type === "keyup" && !["Enter", " "].includes(event.key)) return;
    holding = false;
    button.classList.remove("is-active");
    cancelAnimationFrame(frame);
  };
  button.addEventListener("pointerdown", start);
  button.addEventListener("pointerup", stop);
  button.addEventListener("pointercancel", stop);
  button.addEventListener("pointerleave", stop);
  button.addEventListener("keydown", start);
  button.addEventListener("keyup", stop);
  if (reduceMotion.matches) button.addEventListener("click", () => {
    if (!completed) {
      progress = 1;
      onProgress(1);
      completed = true;
      onComplete();
    }
  });
}

function setupConnection() {
  const panel = $("#syncPanel");
  const button = $("#syncButton");
  const value = $("#syncValue");
  const line = $("#syncLine");
  const status = $("#syncStatus");
  const message = $("#syncMessage");
  if (!panel || !button || !value || !line || !status || !message) return;
  createHoldInteraction(button, (progress) => {
    const percent = Math.round(progress * 100);
    value.textContent = String(percent).padStart(2, "0");
    line.style.width = `${percent}%`;
    status.textContent = percent < 35 ? "SEARCHING" : percent < 72 ? "SIGNAL FOUND" : "BARRIER READING";
  }, () => {
    panel.classList.add("is-complete");
    status.textContent = "CONNECTION ESTABLISHED";
    message.textContent = siteConfig.syncMessage;
    button.textContent = "SIGNALS CONNECTED";
    button.disabled = true;
    sceneManager.state.syncComplete = true;
    sceneManager.refreshLocks();
    announce("Signal connection complete. The next chapter is now unlocked.");
    playInterfaceSound();
  });
}

function setupBarrier() {
  const scene = document.querySelector('.scene[data-scene="barrier"]');
  const button = $("#barrierButton");
  const number = $("#barrierNumber");
  const bar = $("#barrierBar");
  if (!scene || !button || !number || !bar) return;
  createHoldInteraction(button, (progress) => {
    number.textContent = String(Math.max(0, 100 - Math.round(progress * 100))).padStart(2, "0");
    bar.style.width = `${progress * 100}%`;
  }, () => {
    scene.classList.add("is-open");
    button.textContent = "MESSAGE RELEASED";
    button.disabled = true;
    sceneManager.state.barrierComplete = true;
    sceneManager.refreshLocks();
    announce("Barrier opened. The message can now be read.");
    playInterfaceSound();
  }, 2700);
}

function setupResponses() {
  const options = $("#responseOptions");
  const feedback = $("#responseFeedback");
  const change = $("#changeResponse");
  if (!options || !feedback || !change) return;
  const apply = (key) => {
    $$("button[data-response]", options).forEach((button) => {
      const selected = button.dataset.response === key;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    feedback.textContent = siteConfig.responses[key] || "RESPONSE CHANNEL / WAITING";
    change.hidden = !key;
  };
  options.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-response]");
    if (!button) return;
    const key = button.dataset.response;
    localStorage.setItem("reiSignalResponse", key);
    apply(key);
    playInterfaceSound();
  });
  change.addEventListener("click", () => {
    localStorage.removeItem("reiSignalResponse");
    apply("");
  });
  apply(localStorage.getItem("reiSignalResponse") || "");
}

/* ==========================================================================
   AUDIO
   ========================================================================== */
function playInterfaceSound() {
  const audio = $("#interfaceAudio");
  const enabled = $("#audioButton")?.getAttribute("aria-pressed") === "true";
  if (!audio || !enabled) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

let ambientAudioActive = false;

function updateAudioButton() {
  const button = $("#audioButton");
  if (!button) return;
  button.textContent = ambientAudioActive ? "AUDIO / ON" : "AUDIO / OFF";
  button.setAttribute("aria-pressed", String(ambientAudioActive));
  button.setAttribute("aria-label", ambientAudioActive ? "Turn off audio" : "Turn on audio");
}

function startAmbientAudio() {
  const ambient = $("#ambientAudio");
  if (!ambient) return;
  ambient.volume = 0.34;
  ambient.play().then(() => {
    ambientAudioActive = true;
    updateAudioButton();
  }).catch(() => {
    ambientAudioActive = false;
    updateAudioButton();
  });
}

function setupAudio() {
  const button = $("#audioButton");
  const ambient = $("#ambientAudio");
  if (!button || !ambient) return;
  ambient.volume = 0.34;
  const interfaceAudio = $("#interfaceAudio");
  if (interfaceAudio) interfaceAudio.volume = 0.26;
  button.addEventListener("click", () => {
    if (ambientAudioActive) {
      ambient.pause();
      ambientAudioActive = false;
      updateAudioButton();
    } else {
      startAmbientAudio();
    }
  });
  ambient.addEventListener("error", () => {
    ambientAudioActive = false;
    button.textContent = "AUDIO / ADD FILE";
    button.setAttribute("aria-pressed", "false");
  }, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && ambientAudioActive) ambient.pause();
    else if (!document.hidden && ambientAudioActive) ambient.play().catch(() => {});
  });
}

/* ==========================================================================
   BOOT
   ========================================================================== */
function setupBoot() {
  const bar = $("#bootBar");
  const percent = $("#bootPercent");
  const log = $("#bootLog");
  const enter = $("#enterButton");
  const skip = $("#skipButton");
  if (!bar || !percent || !log || !enter || !skip) return;
  const logs = [
    "INITIALIZING PRIVATE TRANSMISSION...",
    "EMOTIONAL SIGNAL DETECTED...",
    "UNKNOWN EMOTIONAL PATTERN FOUND...",
    "RECIPIENT IDENTITY LOADED...",
    "UNSENT MESSAGE RECOVERED...",
    "TRANSMISSION READY."
  ];
  let value = reduceMotion.matches ? 100 : 0;
  let timer;
  const finish = () => {
    value = 100;
    bar.style.width = "100%";
    percent.textContent = "100";
    log.textContent = logs.at(-1);
    enter.disabled = false;
  };
  if (value === 100) finish();
  else {
    timer = window.setInterval(() => {
      value = Math.min(100, value + Math.ceil(Math.random() * 5));
      bar.style.width = `${value}%`;
      percent.textContent = String(value).padStart(2, "0");
      log.textContent = logs[Math.min(logs.length - 1, Math.floor(value / 20))];
      if (value >= 100) {
        clearInterval(timer);
        finish();
      }
    }, 105);
  }
  const enterSignal = () => {
    clearInterval(timer);
    startAmbientAudio();
    sessionStorage.setItem("reiSignalIntro", "seen");
    sceneManager.goTo("hero", { historyMode: "replace" });
  };
  enter.addEventListener("click", enterSignal);
  skip.addEventListener("click", () => { finish(); enterSignal(); });
}

function setupReplay() {
  // The "REPLAY" action lives on the bottom-nav Next button while on the
  // response chapter (see sceneManager.updateNavButtons). This clears the
  // one-time boot flag so the intro plays again; the saved response choice
  // is intentionally left in localStorage.
  window.reiSignalReplay = () => {
    sessionStorage.removeItem("reiSignalIntro");
    window.location.hash = "";
    window.location.reload();
  };
}

/* ==========================================================================
   AMBIENT VISUALS
   ========================================================================== */
function setupPointerLight() {
  const light = $("#pointerLight");
  if (!light || coarsePointer.matches || reduceMotion.matches) return;
  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let targetX = x;
  let targetY = y;
  document.addEventListener("pointermove", (event) => { targetX = event.clientX; targetY = event.clientY; }, { passive: true });
  const move = () => {
    x += (targetX - x) * 0.12;
    y += (targetY - y) * 0.12;
    light.style.left = `${x}px`;
    light.style.top = `${y}px`;
    requestAnimationFrame(move);
  };
  move();
}

function setupAmbientCanvas() {
  const canvas = $("#ambientCanvas");
  if (!canvas || reduceMotion.matches) return;
  const context = canvas.getContext("2d");
  if (!context) return;
  let particles = [];
  let width = 0;
  let height = 0;
  let animationFrame = 0;
  const resize = () => {
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    width = innerWidth;
    height = innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = coarsePointer.matches ? 16 : 40;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + .5,
      speed: Math.random() * .24 + .08,
      drift: Math.random() * .16 - .08
    }));
  };
  const draw = () => {
    if (document.hidden) return;
    context.clearRect(0, 0, width, height);
    context.fillStyle = "rgba(0, 159, 227, .45)";
    particles.forEach((particle) => {
      particle.y -= particle.speed;
      particle.x += particle.drift;
      if (particle.y < -5) { particle.y = height + 5; particle.x = Math.random() * width; }
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });
    animationFrame = requestAnimationFrame(draw);
  };
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    cancelAnimationFrame(animationFrame);
    if (!document.hidden) draw();
  });
  resize();
  draw();
}

/* ==========================================================================
   SCENE MANAGER
   Fullscreen chapters, cinematic transitions, hash sync, swipe + keyboard.
   ========================================================================== */
const sceneOrder = ["hero", "connection", "records", "timeline", "barrier", "letter", "response"];
const chapterMeta = {
  hero: { num: "01", title: "SIGNAL DETECTED", transition: "LOCKING ONTO SIGNAL..." },
  connection: { num: "02", title: "CONNECTION", transition: "ESTABLISHING CONNECTION..." },
  records: { num: "03", title: "PERSONAL RECORDS", transition: "DECRYPTING PERSONAL RECORD..." },
  timeline: { num: "04", title: "SIGNAL HISTORY", transition: "TRACING SIGNAL HISTORY..." },
  barrier: { num: "05", title: "EMOTIONAL BARRIER", transition: "A.T. FIELD DETECTED..." },
  letter: { num: "06", title: "PRIVATE MESSAGE", transition: "RECOVERING PRIVATE MESSAGE..." },
  response: { num: "07", title: "RESPONSE CHANNEL", transition: "OPENING RESPONSE CHANNEL..." }
};

const sceneManager = {
  state: {
    current: "boot",
    transitioning: false,
    syncComplete: false,
    barrierComplete: false,
    recordIndex: 0,
    timelineIndex: 0
  },

  maxUnlockedIndex() {
    if (!this.state.syncComplete) return 1;      // hero, connection
    if (!this.state.barrierComplete) return 4;   // + records, timeline, barrier
    return sceneOrder.length - 1;                // everything
  },

  canEnter(name) {
    const idx = sceneOrder.indexOf(name);
    if (idx < 0) return name === "boot";
    return idx <= this.maxUnlockedIndex();
  },

  computeDirection(targetName) {
    const curIdx = sceneOrder.indexOf(this.state.current);
    const tgtIdx = sceneOrder.indexOf(targetName);
    if (curIdx < 0 || tgtIdx < 0) return "forward";
    return tgtIdx >= curIdx ? "forward" : "backward";
  },

  goTo(name, opts = {}) {
    if (this.state.transitioning) return;
    if (name === this.state.current && !opts.force) return;
    if (name !== "boot" && !this.canEnter(name)) {
      const fallback = sceneOrder[this.maxUnlockedIndex()];
      this.lockedHint();
      if (fallback === this.state.current || !fallback) return;
      name = fallback;
    }
    this.transitionTo(name, opts);
  },

  lockedHint() {
    const next = $("#navNext");
    if (next) {
      next.classList.remove("is-locked");
      void next.offsetWidth;
      next.classList.add("is-locked");
    }
    announce("Complete this step before continuing.");
  },

  transitionTo(targetName, opts) {
    this.state.transitioning = true;
    const direction = opts.direction || this.computeDirection(targetName);
    this.playOverlay(targetName, () => {
      this.swapScene(targetName);
      this.updateChrome(targetName);
      this.updateHash(targetName, opts.historyMode);
      this.state.current = targetName;
      this.state.transitioning = false;

      if (targetName === "records") {
        this.state.recordIndex = direction === "backward" ? siteConfig.records.length - 1 : 0;
        showRecord(this.state.recordIndex);
      }
      if (targetName === "timeline") {
        this.state.timelineIndex = direction === "backward" ? siteConfig.timeline.length - 1 : 0;
        showTimeline(this.state.timelineIndex);
      }
      if (targetName === "letter") revealLetterOnce();

      const el = document.querySelector(`.scene[data-scene="${targetName}"]`);
      if (el) { el.setAttribute("tabindex", "-1"); el.focus({ preventScroll: true }); }
    });
  },

  playOverlay(targetName, callback) {
    const overlay = $("#chapterTransition");
    const numberEl = $("#transitionNumber");
    const textEl = $("#transitionText");
    const bar = $("#transitionBar");
    if (!overlay) { callback(); return; }
    const meta = chapterMeta[targetName];
    numberEl.textContent = meta ? meta.num : "00";
    textEl.textContent = meta ? meta.transition : "RETURNING TO BOOT...";
    bar.style.width = "0%";
    overlay.classList.add("is-active");
    requestAnimationFrame(() => { bar.style.width = "100%"; });
    const holdTime = reduceMotion.matches ? 80 : 620;
    window.setTimeout(() => {
      callback();
      window.setTimeout(() => overlay.classList.remove("is-active"), reduceMotion.matches ? 40 : 220);
    }, holdTime);
  },

  swapScene(targetName) {
    $$(".scene").forEach((scene) => scene.classList.remove("is-active"));
    const target = document.querySelector(`.scene[data-scene="${targetName}"]`);
    if (target) target.classList.add("is-active");
    document.body.dataset.activeScene = targetName;
  },

  updateHash(name, mode) {
    const hash = `#${name}`;
    if (mode === "skip") return;
    if (mode === "replace" || location.hash === "") history.replaceState({ scene: name }, "", hash);
    else if (location.hash !== hash) history.pushState({ scene: name }, "", hash);
  },

  updateChrome(targetName) {
    const topbar = $("#topbarChapter");
    if (topbar) topbar.textContent = targetName === "boot" ? "SYSTEM BOOT" : `CH. ${chapterMeta[targetName].num} / 07 — ${chapterMeta[targetName].title}`;
    this.updateNavButtons(targetName);
    this.updateDots(targetName);
  },

  updateNavButtons(targetName) {
    const back = $("#navBack");
    const next = $("#navNext");
    if (!back || !next) return;
    if (targetName === "boot") return;
    const idx = sceneOrder.indexOf(targetName);
    back.disabled = idx <= 0;

    if (targetName === "response") {
      next.textContent = "REPLAY ↻";
      next.setAttribute("aria-label", "Replay the whole experience");
      next.disabled = false;
    } else {
      next.textContent = "NEXT ›";
      next.setAttribute("aria-label", "Next chapter");
      const locked = (targetName === "connection" && !this.state.syncComplete) ||
                     (targetName === "barrier" && !this.state.barrierComplete);
      next.disabled = locked;
    }
  },

  buildDots() {
    const wrap = $("#sceneDots");
    if (!wrap) return;
    wrap.innerHTML = "";
    sceneOrder.forEach((name) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.scene = name;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-label", chapterMeta[name].title);
      button.addEventListener("click", () => { this.goTo(name); playInterfaceSound(); });
      wrap.append(button);
    });
  },

  updateDots(targetName) {
    const maxIdx = this.maxUnlockedIndex();
    $$("#sceneDots button").forEach((button, i) => {
      button.classList.toggle("is-active", button.dataset.scene === targetName);
      const reachable = i <= maxIdx;
      button.disabled = !reachable;
      button.setAttribute("aria-selected", String(button.dataset.scene === targetName));
    });
  },

  refreshLocks() {
    this.updateNavButtons(this.state.current);
    this.updateDots(this.state.current);
  }
};

function handleDirectionalInput(direction) {
  if (sceneManager.state.current === "records") { recordStep(direction === "forward" ? 1 : -1); return; }
  if (sceneManager.state.current === "timeline") { timelineStep(direction === "forward" ? 1 : -1); return; }
  const back = $("#navBack");
  const next = $("#navNext");
  if (direction === "forward") {
    if (!next || next.disabled) { sceneManager.lockedHint(); return; }
    next.click();
  } else {
    if (!back || back.disabled) return;
    back.click();
  }
}

function setupSceneNav() {
  const back = $("#navBack");
  const next = $("#navNext");
  const viewport = $("#sceneViewport");
  if (!back || !next || !viewport) return;

  back.addEventListener("click", () => {
    if (back.disabled) return;
    const idx = sceneOrder.indexOf(sceneManager.state.current);
    if (idx <= 0) return;
    playInterfaceSound();
    sceneManager.goTo(sceneOrder[idx - 1], { direction: "backward" });
  });

  next.addEventListener("click", () => {
    if (sceneManager.state.current === "response") {
      playInterfaceSound();
      window.reiSignalReplay?.();
      return;
    }
    if (next.disabled) { sceneManager.lockedHint(); return; }
    const idx = sceneOrder.indexOf(sceneManager.state.current);
    const target = sceneOrder[idx + 1];
    if (!target) return;
    playInterfaceSound();
    sceneManager.goTo(target, { direction: "forward" });
  });

  $("#recordPrev")?.addEventListener("click", () => recordStep(-1));
  $("#recordNext")?.addEventListener("click", () => recordStep(1));
  $("#timelinePrev")?.addEventListener("click", () => timelineStep(-1));
  $("#timelineNext")?.addEventListener("click", () => timelineStep(1));

  document.addEventListener("keydown", (event) => {
    if (sceneManager.state.current === "boot") return;
    if (event.target instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(event.target.tagName)) return;
    if (event.key === "ArrowRight") handleDirectionalInput("forward");
    else if (event.key === "ArrowLeft") handleDirectionalInput("backward");
  });

  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartT = 0;
  let swiping = false;
  viewport.addEventListener("touchstart", (event) => {
    if (sceneManager.state.transitioning || sceneManager.state.current === "boot") return;
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartT = Date.now();
    swiping = true;
  }, { passive: true });
  viewport.addEventListener("touchend", (event) => {
    if (!swiping) return;
    swiping = false;
    if (sceneManager.state.transitioning || sceneManager.state.current === "boot") return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    const dt = Date.now() - touchStartT;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.4 || dt > 700) return;
    handleDirectionalInput(dx < 0 ? "forward" : "backward");
  }, { passive: true });

  window.addEventListener("popstate", () => {
    if (sceneManager.state.transitioning) return;
    const raw = (location.hash || "").slice(1);
    if (raw === "boot" || raw === "") return;
    const target = sceneOrder.includes(raw) ? raw : "hero";
    if (target === sceneManager.state.current) return;
    sceneManager.goTo(target, { historyMode: "skip" });
  });
}

function bootstrapScene() {
  sceneManager.buildDots();
  const introSeen = sessionStorage.getItem("reiSignalIntro") === "seen";
  let initial = "boot";
  if (introSeen) {
    const raw = (location.hash || "").slice(1);
    initial = (sceneOrder.includes(raw) && sceneManager.canEnter(raw)) ? raw : "hero";
  }
  sceneManager.swapScene(initial);
  sceneManager.state.current = initial;
  sceneManager.updateChrome(initial);
  history.replaceState({ scene: initial }, "", `#${initial}`);
  if (initial === "records") showRecord(sceneManager.state.recordIndex);
  if (initial === "timeline") showTimeline(sceneManager.state.timelineIndex);
  if (initial === "letter") revealLetterOnce();
}

/* ==========================================================================
   INIT
   ========================================================================== */
function init() {
  applyConfig();
  setupAssetFallbacks();
  setupBoot();
  setupConnection();
  setupBarrier();
  setupResponses();
  setupAudio();
  setupReplay();
  setupSceneNav();
  setupPointerLight();
  setupAmbientCanvas();
  bootstrapScene();
}

document.addEventListener("DOMContentLoaded", init);