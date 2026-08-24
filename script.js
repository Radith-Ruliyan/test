/* Ayyash → Maureen // edit this object to personalize the private signal. */
const siteConfig = {
  senderName: "Ayyash",
  recipientName: "Maureen",
  whatsappNumber: "6285788949082",
  opening: "Somewhere between ordinary conversations and quiet moments, your presence became the part of my day I looked forward to most.",
  records: [
    { code: "OBS-01", title: "The little things I remember", text: "I remember the smallest details about you, because somehow even ordinary moments feel more meaningful when they include Maureen." },
    { code: "OBS-02", title: "How ordinary days became brighter", text: "A simple conversation with you can stay in my mind long after it ends and quietly make the rest of my day feel lighter." },
    { code: "OBS-03", title: "What I genuinely admire", text: "I admire the way you remain yourself. There is a warmth in your presence that cannot be copied or replaced." },
    { code: "OBS-04", title: "When this feeling became real", text: "At some point, seeing your name stopped feeling ordinary. It became a small moment I hoped for without even realizing it." },
    { code: "OBS-05", title: "Why Ayyash made this message", text: "Because something this sincere should not remain hidden forever. You deserve to know how deeply your presence has mattered." }
  ],
  timeline: [
    { phase: "01 / FIRST DETECTION", title: "The first quiet spark", text: "It began without a dramatic moment—just a quiet curiosity about Maureen that slowly became difficult to ignore." },
    { phase: "02 / FAMILIAR SIGNAL", title: "Your presence became familiar", text: "The more familiar you became, the more naturally my thoughts began to return to you." },
    { phase: "03 / STABLE SIGNAL", title: "The small moments stayed", text: "Words, expressions, and simple moments remained with me longer than I expected, as if my heart had decided they were worth keeping." },
    { phase: "04 / EMOTIONAL CONFIRMATION", title: "The feeling became clear", text: "Eventually I understood that this was more than admiration. I cared about you in a sincere and gentle way." },
    { phase: "05 / MESSAGE TRANSMISSION", title: "Ayyash finally sent the signal", text: "Not to force an answer, but because an honest feeling deserves the courage to be spoken." }
  ],
  letter: [
    "Maureen, I never planned for you to become this important to me. It happened quietly, through small conversations, familiar moments, and the way your presence made ordinary days feel lighter.",
    "There is something about you that stays with me—the kindness in your words, the way you are simply yourself, and the calm feeling that appears whenever I think of you.",
    "I am not asking you to rush or become someone different. I only want to be honest: what I feel for you is real, gentle, and worth sharing. If you are willing, I would love to discover where this feeling could lead us."
  ],
  syncMessage: "Connection established. Ayyash's heart has found Maureen's signal.",
  responses: {
    yes: "HEART SIGNAL MATCHED / A sincere first conversation is waiting for your words.",
    no: "ANSWER RECEIVED / Your honesty is respected. A sincere feeling should never take away your freedom to choose."
  }
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)");
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function announce(message) {
  const region = $("#liveRegion");
  if (region) region.textContent = message;
}

function setupAppHeight() {
  const update = () => {
    const height = window.visualViewport?.height || window.innerHeight;
    document.documentElement.style.setProperty("--app-height", `${Math.round(height)}px`);
    if (typeof sceneManager !== "undefined" && sceneManager.state.current) {
      sceneManager.updateChrome(sceneManager.state.current);
    }
  };
  update();
  window.addEventListener("resize", update, { passive: true });
  window.addEventListener("orientationchange", update, { passive: true });
  window.visualViewport?.addEventListener("resize", update, { passive: true });
}

function applyConfig() {
  $$('[data-recipient]').forEach((node) => { node.textContent = siteConfig.recipientName; });
  $$('[data-sender]').forEach((node) => { node.textContent = siteConfig.senderName; });
  const opening = $('[data-opening]');
  if (opening) opening.textContent = siteConfig.opening;
}

const decryptTimers = new WeakMap();
function decryptText(element, finalText) {
  if (!element) return;
  const oldTimer = decryptTimers.get(element);
  if (oldTimer) clearInterval(oldTimer);
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
    iteration += 2.2;
    if (iteration >= finalText.length) {
      clearInterval(timer);
      decryptTimers.delete(element);
      element.textContent = finalText;
    }
  }, 20);
  decryptTimers.set(element, timer);
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

let ambientAudioActive = false;
let lastInterfacePulse = 0;

function updateAudioButton() {
  const button = $("#audioButton");
  if (!button) return;
  button.textContent = ambientAudioActive ? "AUDIO / ON" : "AUDIO / OFF";
  button.setAttribute("aria-pressed", String(ambientAudioActive));
  button.setAttribute("aria-label", ambientAudioActive ? "Turn off audio" : "Turn on audio");
}

function startAmbientAudio() {
  const audio = $("#ambientAudio");
  if (!audio) return;
  audio.volume = .34;
  audio.play().then(() => {
    ambientAudioActive = true;
    updateAudioButton();
  }).catch(() => {
    ambientAudioActive = false;
    updateAudioButton();
  });
}

function playInterfaceSound() {
  const audio = $("#interfaceAudio");
  if (!audio || !ambientAudioActive) return;
  const now = performance.now();
  if (now - lastInterfacePulse < 140) return;
  lastInterfacePulse = now;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function setupAudio() {
  const button = $("#audioButton");
  const ambient = $("#ambientAudio");
  const ui = $("#interfaceAudio");
  if (!button || !ambient) return;
  ambient.volume = .34;
  if (ui) ui.volume = .24;
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
    button.textContent = "AUDIO / N/A";
    button.setAttribute("aria-pressed", "false");
  }, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && ambientAudioActive) ambient.pause();
    else if (!document.hidden && ambientAudioActive) ambient.play().catch(() => {});
  });
}

function createHoldInteraction(button, options) {
  if (!button) return null;
  const duration = options.duration || 1500;
  let progress = 0;
  let holding = false;
  let completed = false;
  let startedAt = 0;
  let frame = 0;
  let activePointerId = null;

  const paint = (value) => {
    progress = clamp(value, 0, 1);
    button.style.setProperty("--hold-progress", `${progress * 100}%`);
    options.onProgress?.(progress);
  };

  const tick = (time) => {
    if (!holding || completed) return;
    if (!startedAt) startedAt = time - progress * duration;
    paint((time - startedAt) / duration);
    if (progress >= 1) {
      completed = true;
      holding = false;
      button.classList.remove("is-holding");
      button.setAttribute("aria-pressed", "true");
      options.onComplete?.();
      return;
    }
    frame = requestAnimationFrame(tick);
  };

  const start = (event) => {
    if (completed || button.disabled || sceneManager.state.transitioning) return;
    if (event.type === "keydown" && !["Enter", " "].includes(event.key)) return;
    if (event.type === "pointerdown" && event.button !== undefined && event.button !== 0) return;
    if (event.cancelable) event.preventDefault();
    if (event.type === "pointerdown") {
      activePointerId = event.pointerId;
      try { button.setPointerCapture?.(activePointerId); } catch (_) {}
    }
    holding = true;
    button.classList.add("is-holding");
    startedAt = performance.now() - progress * duration;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(tick);
  };

  const stop = (event) => {
    if (event?.type === "keyup" && !["Enter", " "].includes(event.key)) return;
    if (event?.type?.startsWith("pointer") && activePointerId !== null && event.pointerId !== activePointerId) return;
    if (event?.cancelable) event.preventDefault();
    if (activePointerId !== null) {
      try { button.releasePointerCapture?.(activePointerId); } catch (_) {}
      activePointerId = null;
    }
    if (!holding) return;
    holding = false;
    button.classList.remove("is-holding");
    cancelAnimationFrame(frame);
    if (!completed) {
      paint(0);
      options.onCancel?.();
    }
  };

  button.addEventListener("pointerdown", start);
  button.addEventListener("pointerup", stop);
  button.addEventListener("pointercancel", stop);
  button.addEventListener("pointerleave", stop);
  button.addEventListener("keydown", start);
  button.addEventListener("keyup", stop);
  const blockNativeHoldUi = (event) => {
    if (event.cancelable) event.preventDefault();
  };
  button.addEventListener("contextmenu", blockNativeHoldUi);
  button.addEventListener("selectstart", blockNativeHoldUi);
  button.addEventListener("dragstart", blockNativeHoldUi);
  if (reduceMotion.matches) {
    button.addEventListener("click", () => {
      if (completed || button.disabled) return;
      paint(1);
      completed = true;
      options.onComplete?.();
    });
  }

  return {
    reset() {
      completed = false;
      holding = false;
      startedAt = 0;
      cancelAnimationFrame(frame);
      if (activePointerId !== null) {
        try { button.releasePointerCapture?.(activePointerId); } catch (_) {}
        activePointerId = null;
      }
      button.classList.remove("is-holding");
      button.removeAttribute("aria-pressed");
      paint(0);
    },
    complete() {
      if (completed) return;
      paint(1);
      completed = true;
      options.onComplete?.();
    }
  };
}

function createHorizontalDrag(options) {
  const { track, handle } = options;
  if (!track || !handle) return null;
  let progress = 0;
  let dragging = false;
  let completed = false;
  let pointerId = null;
  let startX = 0;
  let startProgress = 0;

  const maxDistance = () => Math.max(1, track.clientWidth - handle.offsetWidth - 7);
  const paint = (value, animate = false) => {
    progress = clamp(value, 0, 1);
    handle.style.transition = animate ? "transform .28s cubic-bezier(.2,.8,.2,1)" : "none";
    handle.style.setProperty("--drag-x", `${progress * maxDistance()}px`);
    track.style.setProperty("--drag-progress", `${progress * 100}%`);
    options.onProgress?.(progress);
    if (animate) window.setTimeout(() => { handle.style.transition = ""; }, 300);
  };

  const finish = () => {
    if (completed || progress < (options.threshold || .86)) {
      if (!completed) paint(0, true);
      return;
    }
    completed = true;
    paint(1, true);
    handle.classList.remove("is-dragging");
    options.onComplete?.();
  };

  handle.addEventListener("pointerdown", (event) => {
    if (completed || sceneManager.state.transitioning) return;
    event.preventDefault();
    dragging = true;
    pointerId = event.pointerId;
    startX = event.clientX;
    startProgress = progress;
    handle.classList.add("is-dragging");
    handle.setPointerCapture?.(pointerId);
  });

  handle.addEventListener("pointermove", (event) => {
    if (!dragging || event.pointerId !== pointerId) return;
    event.preventDefault();
    paint(startProgress + (event.clientX - startX) / maxDistance());
  });

  const release = (event) => {
    if (!dragging || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
    dragging = false;
    handle.classList.remove("is-dragging");
    try { handle.releasePointerCapture?.(pointerId); } catch (_) {}
    pointerId = null;
    finish();
  };
  handle.addEventListener("pointerup", release);
  handle.addEventListener("pointercancel", release);

  handle.addEventListener("keydown", (event) => {
    if (completed) return;
    if (["Enter", " "].includes(event.key)) {
      event.preventDefault();
      paint(1, true);
      completed = true;
      options.onComplete?.();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      paint(progress + .16, true);
      if (progress >= (options.threshold || .86)) finish();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      paint(progress - .16, true);
    }
  });

  window.addEventListener("resize", () => paint(progress), { passive: true });
  return {
    reset() {
      completed = false;
      dragging = false;
      handle.classList.remove("is-dragging");
      paint(0, true);
    },
    set(value) { paint(value); }
  };
}

const sceneOrder = ["hero", "connection", "records", "timeline", "barrier", "letter", "response", "reply"];
const chapterMeta = {
  hero: { number: "01", title: "SIGNAL DETECTED", transition: "SIGNAL RECOGNIZED" },
  connection: { number: "02", title: "CONNECTION", transition: "EMOTIONAL FREQUENCY MATCHED" },
  records: { number: "03", title: "PERSONAL RECORDS", transition: "PERSONAL RECORD CHANNEL OPEN" },
  timeline: { number: "04", title: "SIGNAL HISTORY", transition: "MEMORY PATH RESTORED" },
  barrier: { number: "05", title: "EMOTIONAL BARRIER", transition: "EMOTIONAL BARRIER DETECTED" },
  letter: { number: "06", title: "PRIVATE MESSAGE", transition: "PRIVATE MESSAGE RECOVERED" },
  response: { number: "07", title: "HEART QUESTION", transition: "FINAL HEART SIGNAL OPEN" },
  reply: { number: "08", title: "PRIVATE REPLY", transition: "TWO SIGNALS MATCHED" }
};

const savedUnlock = Number.parseInt(sessionStorage.getItem("reiSignalUnlocked") || "-1", 10);
const sceneManager = {
  state: {
    current: "boot",
    transitioning: false,
    maxUnlocked: Number.isFinite(savedUnlock) ? savedUnlock : -1,
    recordIndex: 0,
    timelineIndex: 0,
    letterIndex: 0
  },

  unlock(name) {
    const index = sceneOrder.indexOf(name);
    if (index < 0) return;
    this.state.maxUnlocked = Math.max(this.state.maxUnlocked, index);
    sessionStorage.setItem("reiSignalUnlocked", String(this.state.maxUnlocked));
  },

  canEnter(name) {
    if (name === "boot") return true;
    const index = sceneOrder.indexOf(name);
    return index >= 0 && index <= this.state.maxUnlocked;
  },

  advanceTo(name) {
    this.unlock(name);
    this.goTo(name, { direction: "forward" });
  },

  goTo(name, options = {}) {
    if (this.state.transitioning || name === this.state.current) return;
    if (!this.canEnter(name)) return;
    this.state.transitioning = true;
    const overlay = $("#chapterTransition");
    const targetMeta = chapterMeta[name];
    $("#transitionNumber").textContent = targetMeta?.number || "00";
    $("#transitionText").textContent = targetMeta?.transition || "RETURNING TO SIGNAL";
    $("#transitionBar").style.width = "0%";
    overlay?.classList.add("is-active");
    requestAnimationFrame(() => { $("#transitionBar").style.width = "100%"; });

    const swapDelay = reduceMotion.matches ? 30 : 360;
    const finishDelay = reduceMotion.matches ? 60 : 760;
    window.setTimeout(() => {
      this.swap(name);
      this.state.current = name;
      this.updateChrome(name);
      this.updateHash(name, options.historyMode);
    }, swapDelay);
    window.setTimeout(() => {
      overlay?.classList.remove("is-active");
      this.state.transitioning = false;
      onSceneEntered(name);
      const scene = $(`.scene[data-scene="${name}"]`);
      scene?.setAttribute("tabindex", "-1");
      scene?.focus({ preventScroll: true });
    }, finishDelay);
  },

  swap(name) {
    $$(".scene").forEach((scene) => {
      const active = scene.dataset.scene === name;
      scene.classList.toggle("is-active", active);
      scene.setAttribute("aria-hidden", String(!active));
    });
    document.body.dataset.activeScene = name;
  },

  updateHash(name, mode) {
    if (mode === "skip") return;
    const hash = `#${name}`;
    if (mode === "replace" || !location.hash) history.replaceState({ scene: name }, "", hash);
    else if (location.hash !== hash) history.pushState({ scene: name }, "", hash);
  },

  updateChrome(name) {
    const label = $("#topbarChapter");
    if (label) {
      const compact = window.innerWidth < 560;
      const total = String(sceneOrder.length).padStart(2, "0");
      label.textContent = name === "boot"
        ? "SYSTEM BOOT"
        : compact
          ? `CH. ${chapterMeta[name].number} / ${total}`
          : `CH. ${chapterMeta[name].number} / ${total} — ${chapterMeta[name].title}`;
    }
    const currentIndex = sceneOrder.indexOf(name);
    $$("#chapterPips i").forEach((pip, index) => {
      pip.classList.toggle("is-active", index === currentIndex);
      pip.classList.toggle("is-past", index < currentIndex);
    });
  },

  buildPips() {
    const wrap = $("#chapterPips");
    if (!wrap) return;
    wrap.innerHTML = "";
    sceneOrder.forEach(() => wrap.append(document.createElement("i")));
  }
};

let bootHold;
let heroDrag;
let connectionHold;
let recordDrag;
let timelineDrag;
let barrierHold;
let letterHold;

function setupBoot() {
  const bar = $("#bootBar");
  const percent = $("#bootPercent");
  const log = $("#bootLog");
  const button = $("#enterButton");
  if (!bar || !percent || !log || !button) return;
  const logs = [
    "INITIALIZING PRIVATE TRANSMISSION...",
    "EMOTIONAL SIGNAL DETECTED...",
    "UNKNOWN EMOTIONAL PATTERN FOUND...",
    "RECIPIENT IDENTITY LOADED...",
    "UNSENT MESSAGE RECOVERED...",
    "TRANSMISSION READY."
  ];
  let value = sessionStorage.getItem("reiSignalIntro") === "seen" || reduceMotion.matches ? 100 : 0;
  const finish = () => {
    value = 100;
    bar.style.width = "100%";
    percent.textContent = "100";
    log.textContent = logs.at(-1);
    button.disabled = false;
  };
  if (value === 100) finish();
  else {
    const timer = window.setInterval(() => {
      value = Math.min(100, value + Math.ceil(Math.random() * 5));
      bar.style.width = `${value}%`;
      percent.textContent = String(value).padStart(2, "0");
      log.textContent = logs[Math.min(logs.length - 1, Math.floor(value / 20))];
      if (value >= 100) {
        clearInterval(timer);
        finish();
      }
    }, 90);
  }
  bootHold = createHoldInteraction(button, {
    duration: 1250,
    onComplete: () => {
      startAmbientAudio();
      playInterfaceSound();
      sessionStorage.setItem("reiSignalIntro", "seen");
      sceneManager.advanceTo("hero");
    }
  });
}

function setupHeroInteraction() {
  const track = $("#heroSignalTrack");
  const handle = $("#heroSignalHandle");
  const align = $("#heroSignalAlign");
  const beam = $("#heroSignalBeam");
  const distance = $("#heroSignalDistance");
  heroDrag = createHorizontalDrag({
    track,
    handle,
    threshold: .82,
    onProgress: (progress) => {
      if (beam) beam.style.width = `${progress * Math.max(0, track.clientWidth - 62)}px`;
      if (distance) distance.textContent = String(Math.round((1 - progress) * 100)).padStart(2, "0");
    },
    onComplete: () => {
      align?.classList.add("is-complete");
      announce("Both signals are aligned.");
      playInterfaceSound();
      window.setTimeout(() => sceneManager.advanceTo("connection"), reduceMotion.matches ? 40 : 650);
    }
  });
}

function resetConnectionView() {
  $("#syncPanel")?.classList.remove("is-complete");
  $("#syncValue").textContent = "00";
  $("#syncLine").style.width = "0%";
  $("#syncStatus").textContent = "CONNECTION STANDBY";
  $("#syncMessage").textContent = "The signal has not been sent yet.";
  const button = $("#syncButton");
  if (button) {
    button.disabled = false;
    button.querySelector("span").textContent = "PRESS & HOLD TO CONNECT";
  }
}

function setupConnection() {
  const panel = $("#syncPanel");
  const button = $("#syncButton");
  const value = $("#syncValue");
  const line = $("#syncLine");
  const status = $("#syncStatus");
  const message = $("#syncMessage");
  connectionHold = createHoldInteraction(button, {
    duration: 1800,
    onProgress: (progress) => {
      const amount = Math.round(progress * 100);
      value.textContent = String(amount).padStart(2, "0");
      line.style.width = `${amount}%`;
      status.textContent = amount < 34 ? "SEARCHING" : amount < 72 ? "SIGNAL FOUND" : "FREQUENCY MATCHED";
    },
    onComplete: () => {
      panel.classList.add("is-complete");
      status.textContent = "CONNECTION ESTABLISHED";
      message.textContent = siteConfig.syncMessage;
      button.querySelector("span").textContent = "SIGNALS CONNECTED";
      announce("Signal connection complete.");
      playInterfaceSound();
      window.setTimeout(() => sceneManager.advanceTo("records"), reduceMotion.matches ? 40 : 750);
    }
  });
}

function showRecord(index) {
  const record = siteConfig.records[index];
  if (!record) return;
  sceneManager.state.recordIndex = index;
  $("#recordCounter").textContent = `RECORD ${String(index + 1).padStart(2, "0")} / ${String(siteConfig.records.length).padStart(2, "0")}`;
  $("#recordCode").textContent = record.code;
  $("#recordNumber").textContent = String(index + 1).padStart(2, "0");
  $("#recordTitle").textContent = record.title;
  $("#recordStatus").textContent = "PERSONAL RECORD READY";
  $("#recordCard")?.classList.remove("is-decrypting");
  decryptText($("#recordText"), record.text);
  $("#recordActionLabel").textContent = index === siteConfig.records.length - 1 ? "SWIPE TO COMPLETE THE MEMORY ARCHIVE" : "SWIPE TO DECRYPT THIS MEMORY";
  recordDrag?.reset();
  announce(`Personal record ${index + 1} of ${siteConfig.records.length}.`);
}

function setupRecords() {
  const track = $("#recordTrack");
  const handle = $("#recordHandle");
  recordDrag = createHorizontalDrag({
    track,
    handle,
    threshold: .84,
    onProgress: (progress) => {
      $("#recordTrackFill")?.style.setProperty("width", `${progress * 100}%`);
      $("#recordScan")?.style.setProperty("width", `${progress * 100}%`);
    },
    onComplete: () => {
      $("#recordCard")?.classList.add("is-decrypting");
      $("#recordStatus").textContent = "RECORD DECRYPTED";
      playInterfaceSound();
      const next = sceneManager.state.recordIndex + 1;
      window.setTimeout(() => {
        if (next < siteConfig.records.length) showRecord(next);
        else sceneManager.advanceTo("timeline");
      }, reduceMotion.matches ? 40 : 650);
    }
  });
}

function showTimeline(index) {
  const item = siteConfig.timeline[index];
  if (!item) return;
  sceneManager.state.timelineIndex = index;
  $("#timelineCounter").textContent = `MILESTONE ${String(index + 1).padStart(2, "0")} / ${String(siteConfig.timeline.length).padStart(2, "0")}`;
  $("#timelinePhase").textContent = item.phase;
  $("#timelineTitle").textContent = item.title;
  decryptText($("#timelineText"), item.text);
  $("#timelineActionLabel").textContent = index === siteConfig.timeline.length - 1 ? "TRACE THE FINAL MEMORY PATH" : "TRACE THE MEMORY PATH";
  timelineDrag?.reset();
  announce(`Signal history ${index + 1} of ${siteConfig.timeline.length}.`);
}

function setupTimeline() {
  const track = $("#timelineTrack");
  const handle = $("#timelineHandle");
  timelineDrag = createHorizontalDrag({
    track,
    handle,
    threshold: .84,
    onProgress: (progress) => {
      $("#timelineTrackFill")?.style.setProperty("width", `${progress * 100}%`);
    },
    onComplete: () => {
      playInterfaceSound();
      const next = sceneManager.state.timelineIndex + 1;
      window.setTimeout(() => {
        if (next < siteConfig.timeline.length) showTimeline(next);
        else sceneManager.advanceTo("barrier");
      }, reduceMotion.matches ? 40 : 650);
    }
  });
}

function resetBarrierView() {
  const scene = $('.scene[data-scene="barrier"]');
  scene?.classList.remove("is-open");
  $("#barrierNumber").textContent = "100";
  $("#barrierBar").style.width = "0%";
  const button = $("#barrierButton");
  if (button) button.querySelector("span").textContent = "HOLD TO OPEN THE BARRIER";
}

function setupBarrier() {
  const scene = $('.scene[data-scene="barrier"]');
  const button = $("#barrierButton");
  barrierHold = createHoldInteraction(button, {
    duration: 2100,
    onProgress: (progress) => {
      $("#barrierNumber").textContent = String(Math.max(0, 100 - Math.round(progress * 100))).padStart(2, "0");
      $("#barrierBar").style.width = `${progress * 100}%`;
    },
    onComplete: () => {
      scene?.classList.add("is-open");
      button.querySelector("span").textContent = "BARRIER OPENED";
      announce("The barrier is open. The private message can be recovered.");
      playInterfaceSound();
      window.setTimeout(() => sceneManager.advanceTo("letter"), reduceMotion.matches ? 40 : 850);
    }
  });
}

function showLetterFragment(index) {
  const text = siteConfig.letter[index];
  if (!text) return;
  sceneManager.state.letterIndex = index;
  const copy = $("#letterCopy");
  copy.innerHTML = "";
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  copy.append(paragraph);
  requestAnimationFrame(() => paragraph.classList.add("is-visible"));
  $("#letterCounter").textContent = `MESSAGE FRAGMENT ${String(index + 1).padStart(2, "0")} / ${String(siteConfig.letter.length).padStart(2, "0")}`;
  $("#letterActionLabel").textContent = index === siteConfig.letter.length - 1 ? "HOLD TO OPEN THE RESPONSE CHANNEL" : "HOLD TO RECOVER NEXT FRAGMENT";
  const sealNumber = $("#letterSeal .message-seal__rings b");
  if (sealNumber) sealNumber.textContent = String(index + 1).padStart(2, "0");
  letterHold?.reset();
  announce(`Private message fragment ${index + 1} of ${siteConfig.letter.length}.`);
}

function setupLetter() {
  const seal = $("#letterSeal");
  letterHold = createHoldInteraction(seal, {
    duration: 1150,
    onComplete: () => {
      playInterfaceSound();
      const next = sceneManager.state.letterIndex + 1;
      window.setTimeout(() => {
        if (next < siteConfig.letter.length) showLetterFragment(next);
        else sceneManager.advanceTo("response");
      }, reduceMotion.matches ? 40 : 520);
    }
  });
}

function setupResponses() {
  const options = $("#responseOptions");
  const feedback = $("#responseFeedback");
  const change = $("#changeResponse");
  const noButton = $("#noResponseButton");
  const noHint = $("#noHint");
  if (!options || !feedback || !change || !noButton || !noHint) return;

  const maxDodges = reduceMotion.matches ? 0 : 2;
  let noDodges = 0;

  const resetNoPosition = () => {
    noButton.style.removeProperty("left");
    noButton.style.removeProperty("top");
    noButton.classList.remove("is-drifting", "is-catchable");
    noHint.textContent = "THE ‘NO’ SIGNAL MAY DRIFT TWICE, THEN IT WILL STAY STILL—THE CHOICE IS ALWAYS YOURS.";
  };

  const dodgeNo = (event) => {
    if (noDodges >= maxDodges) return false;
    event?.preventDefault();
    noDodges += 1;
    const maxX = Math.max(0, options.clientWidth - noButton.offsetWidth);
    const maxY = Math.max(0, options.clientHeight - noButton.offsetHeight);
    const x = noDodges === 1 ? 0 : maxX;
    const y = noDodges === 1 ? maxY : Math.max(0, maxY * .72);
    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;
    noButton.classList.add("is-drifting");
    feedback.textContent = noDodges === 1
      ? "SIGNAL INTERFERENCE / THE ‘NO’ SIGNAL DRIFTED AWAY."
      : "SIGNAL SETTLED / ‘NO’ WILL NOW STAY STILL IF THAT IS YOUR CHOICE.";
    if (noDodges >= maxDodges) {
      noButton.classList.remove("is-drifting");
      noButton.classList.add("is-catchable");
      noHint.textContent = "THE SIGNAL HAS SETTLED. BOTH ANSWERS ARE NOW FULLY SELECTABLE.";
    }
    playInterfaceSound();
    return true;
  };

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
    if (key === "no" && event.detail !== 0 && dodgeNo(event)) return;
    localStorage.setItem("reiSignalResponse", key);
    apply(key);
    playInterfaceSound();
    if (key === "yes") {
      announce("Both heart signals matched. A private reply channel is opening.");
      window.setTimeout(() => sceneManager.advanceTo("reply"), reduceMotion.matches ? 30 : 700);
    } else {
      announce("Maureen's answer was received and respected.");
    }
  });

  noButton.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "touch") dodgeNo(event);
  });
  noButton.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") dodgeNo(event);
  });

  change.addEventListener("click", () => {
    localStorage.removeItem("reiSignalResponse");
    apply("");
    noDodges = 0;
    resetNoPosition();
  });
  apply(localStorage.getItem("reiSignalResponse") || "");
  resetNoPosition();
}

function setupWhatsAppReply() {
  const textarea = $("#replyMessage");
  const link = $("#whatsappReply");
  if (!textarea || !link) return;

  const updateLink = () => {
    const customReply = textarea.value.trim();
    const introduction = `Hi ${siteConfig.senderName}, I just finished reading your message. Yes, I would be happy to get to know you more.`;
    const message = customReply
      ? `${introduction}\n\nWhat I want to tell you is:\n${customReply}`
      : `${introduction}\n\nYour message reached me, and I want to tell you more about how it made me feel.`;
    const number = siteConfig.whatsappNumber.replace(/\D/g, "");
    link.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    link.setAttribute("aria-label", `Reply to ${siteConfig.senderName} on WhatsApp`);
  };

  textarea.addEventListener("input", updateLink);
  link.addEventListener("click", updateLink);
  updateLink();

  $("#replayButton")?.addEventListener("click", () => {
    sessionStorage.removeItem("reiSignalIntro");
    sessionStorage.removeItem("reiSignalUnlocked");
    localStorage.removeItem("reiSignalResponse");
    location.hash = "";
    location.reload();
  });
}

function onSceneEntered(name) {
  if (name === "boot") {
    $("#enterButton").disabled = false;
    bootHold?.reset();
  }
  if (name === "hero" && sceneManager.state.maxUnlocked > 0) {
    $("#heroSignalAlign")?.classList.remove("is-complete");
    heroDrag?.reset();
  }
  if (name === "connection" && sceneManager.state.maxUnlocked > 1) {
    resetConnectionView();
    connectionHold?.reset();
  }
  if (name === "records") showRecord(sceneManager.state.recordIndex);
  if (name === "timeline") showTimeline(sceneManager.state.timelineIndex);
  if (name === "barrier" && sceneManager.state.maxUnlocked > 4) {
    resetBarrierView();
    barrierHold?.reset();
  }
  if (name === "letter") showLetterFragment(sceneManager.state.letterIndex);
}

function setupHistory() {
  window.addEventListener("popstate", () => {
    if (sceneManager.state.transitioning) return;
    const target = (location.hash || "").slice(1);
    if (target === "boot" || !target) {
      sceneManager.goTo("boot", { historyMode: "skip" });
      return;
    }
    if (sceneManager.canEnter(target)) sceneManager.goTo(target, { historyMode: "skip" });
  });
}

function bootstrapScene() {
  sceneManager.buildPips();
  const introSeen = sessionStorage.getItem("reiSignalIntro") === "seen";
  const requested = (location.hash || "").slice(1);
  let initial = "boot";
  if (introSeen) {
    if (sceneManager.canEnter(requested)) initial = requested;
    else {
      sceneManager.unlock("hero");
      initial = "hero";
    }
  }
  sceneManager.swap(initial);
  sceneManager.state.current = initial;
  sceneManager.updateChrome(initial);
  history.replaceState({ scene: initial }, "", `#${initial}`);
  onSceneEntered(initial);
}

function setupAmbientCanvas() {
  const canvas = $("#ambientCanvas");
  if (!canvas || reduceMotion.matches) return;
  const context = canvas.getContext("2d");
  if (!context) return;
  let particles = [];
  let width = 0;
  let height = 0;
  let frame = 0;

  const resize = () => {
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    width = innerWidth;
    height = window.visualViewport?.height || innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = coarsePointer.matches ? 16 : 38;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.7 + .4,
      speed: Math.random() * .22 + .06,
      drift: Math.random() * .14 - .07
    }));
  };

  const draw = () => {
    if (document.hidden) return;
    context.clearRect(0, 0, width, height);
    context.fillStyle = "rgba(0, 159, 227, .42)";
    particles.forEach((particle) => {
      particle.y -= particle.speed;
      particle.x += particle.drift;
      if (particle.y < -5) {
        particle.y = height + 5;
        particle.x = Math.random() * width;
      }
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });
    frame = requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    cancelAnimationFrame(frame);
    if (!document.hidden) draw();
  });
  resize();
  draw();
}

function init() {
  setupAppHeight();
  applyConfig();
  setupAssetFallbacks();
  setupAudio();
  setupBoot();
  setupHeroInteraction();
  setupConnection();
  setupRecords();
  setupTimeline();
  setupBarrier();
  setupLetter();
  setupResponses();
  setupWhatsAppReply();
  setupHistory();
  setupAmbientCanvas();
  bootstrapScene();
}

document.addEventListener("DOMContentLoaded", init);
