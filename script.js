/* ==========================================================================
   AYYASH -> MAUREEN // PRIVATE EMOTIONAL SIGNAL INSTRUMENT
   Interaction Architecture, Mechanics & Geometry Controller (AI #3 Recovery)
   ========================================================================== */

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

/* --------------------------------------------------------------------------
   UTILITY HELPERS & QUERY SELECTORS
   -------------------------------------------------------------------------- */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function announce(message) {
  const region = $("#liveRegion");
  if (region) region.textContent = message;
}

function applyConfig() {
  $$("[data-recipient]").forEach(el => { el.textContent = siteConfig.recipientName; });
  $$("[data-sender]").forEach(el => { el.textContent = siteConfig.senderName; });
  const openingEl = $("[data-opening]");
  if (openingEl) openingEl.textContent = siteConfig.opening;
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
    iteration += 2.4;
    if (iteration >= finalText.length) {
      clearInterval(timer);
      decryptTimers.delete(element);
      element.textContent = finalText;
    }
  }, 20);
  decryptTimers.set(element, timer);
}

/* --------------------------------------------------------------------------
   INPUT MODE TRACKER (pointer | touch | keyboard | wheel)
   -------------------------------------------------------------------------- */
const inputModeTracker = {
  current: "pointer",
  init() {
    window.addEventListener("pointerdown", (e) => {
      this.setMode(e.pointerType === "touch" ? "touch" : "pointer");
    }, { passive: true });
    window.addEventListener("keydown", () => {
      this.setMode("keyboard");
    }, { passive: true });
    window.addEventListener("wheel", () => {
      this.setMode("wheel");
    }, { passive: true });
  },
  setMode(mode) {
    if (this.current === mode) return;
    this.current = mode;
    document.body.dataset.inputMode = mode;
    hintController.updateInstruction();
  }
};

/* --------------------------------------------------------------------------
   AUDIO SYSTEM (Safe Unlock, Ambient Synth, Interface SFX)
   -------------------------------------------------------------------------- */
const soundSystem = {
  ambientAudio: null,
  interfaceAudio: null,
  audioBtn: null,
  enabled: false,
  unlocked: false,

  init() {
    this.ambientAudio = $("#ambientAudio");
    this.interfaceAudio = $("#interfaceAudio");
    this.audioBtn = $("#audioButton");

    if (this.audioBtn) {
      this.audioBtn.addEventListener("click", () => this.toggleAudio());
    }

    const unlock = () => {
      if (!this.unlocked) {
        this.unlocked = true;
        if (this.enabled && this.ambientAudio) {
          this.ambientAudio.play().catch(() => {});
        }
      }
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock, { passive: true });
  },

  toggleAudio() {
    this.enabled = !this.enabled;
    if (this.audioBtn) {
      this.audioBtn.setAttribute("aria-pressed", String(this.enabled));
      this.audioBtn.textContent = this.enabled ? "AUDIO / ON" : "AUDIO / OFF";
    }
    if (this.enabled) {
      this.playAmbient();
      this.playInterface();
    } else {
      this.stopAmbient();
    }
  },

  playAmbient() {
    if (this.enabled && this.ambientAudio) {
      this.ambientAudio.play().catch(() => {});
    }
  },

  stopAmbient() {
    if (this.ambientAudio) {
      this.ambientAudio.pause();
    }
  },

  playInterface() {
    if (this.enabled && this.interfaceAudio) {
      try {
        this.interfaceAudio.currentTime = 0;
        this.interfaceAudio.play().catch(() => {});
      } catch (e) {}
    }
  }
};

/* --------------------------------------------------------------------------
   PROGRESSIVE HINT CONTROLLER (Levels 1 to 4)
   -------------------------------------------------------------------------- */
const hintController = {
  activeGuide: null,
  timers: [],
  level: 1,

  attach(sceneElement) {
    this.detach();
    if (!sceneElement) return;
    this.activeGuide = sceneElement.querySelector(".interaction-guide");
    if (!this.activeGuide) return;

    this.level = 1;
    this.activeGuide.setAttribute("data-hint-level", "1");
    this.activeGuide.classList.remove("is-softened");
    this.updateInstruction();

    const replayBtn = this.activeGuide.querySelector("[data-hint-replay]");
    if (replayBtn) {
      replayBtn.onclick = () => {
        this.level = 2;
        this.activeGuide.setAttribute("data-hint-level", "2");
      };
    }

    this.scheduleTimers();
  },

  scheduleTimers() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
    this.timers.push(window.setTimeout(() => this.setLevel(2), 3200));
    this.timers.push(window.setTimeout(() => this.setLevel(3), 7500));
    this.timers.push(window.setTimeout(() => this.setLevel(4), 12500));
  },

  setLevel(lvl) {
    if (!this.activeGuide) return;
    this.level = Math.max(this.level, lvl);
    this.activeGuide.setAttribute("data-hint-level", String(this.level));
  },

  notifyProgress() {
    if (!this.activeGuide) return;
    this.activeGuide.classList.add("is-softened");
    this.scheduleTimers();
  },

  updateInstruction() {
    if (!this.activeGuide) return;
    const textEl = this.activeGuide.querySelector(".interaction-guide__text");
    if (!textEl) return;

    const mode = inputModeTracker.current;
    let msg = this.activeGuide.dataset.pointerInstruction;
    if (mode === "touch" && this.activeGuide.dataset.touchInstruction) {
      msg = this.activeGuide.dataset.touchInstruction;
    } else if (mode === "keyboard" && this.activeGuide.dataset.keyboardInstruction) {
      msg = this.activeGuide.dataset.keyboardInstruction;
    }
    if (msg) textEl.textContent = msg;
  },

  detach() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
    if (this.activeGuide) {
      this.activeGuide.classList.remove("is-softened");
      this.activeGuide = null;
    }
  }
};

/* --------------------------------------------------------------------------
   CENTRAL DEBOUNCED GEOMETRY MANAGER
   -------------------------------------------------------------------------- */
const geometryManager = {
  timeoutId: null,

  init() {
    const trigger = () => this.queueRecalculate();
    window.addEventListener("resize", trigger, { passive: true });
    window.addEventListener("orientationchange", trigger, { passive: true });
    window.visualViewport?.addEventListener("resize", trigger, { passive: true });
    document.fonts?.ready?.then(trigger);
  },

  queueRecalculate() {
    if (this.timeoutId) cancelAnimationFrame(this.timeoutId);
    this.timeoutId = requestAnimationFrame(() => {
      this.recalculate();
    });
  },

  recalculate() {
    setupAppHeight();
    const activeScene = sceneManager.currentScene;
    const mod = sceneModules[activeScene];
    if (mod?.recalculateGeometry) {
      mod.recalculateGeometry();
    }
  }
};

/* --------------------------------------------------------------------------
   CHAPTER TRANSITION SHAPES
   Each entry in SHAPE_LIBRARY describes a single recognizable object that is
   drawn (stroke-dashoffset), held complete for ~300-500ms, then released
   (morphed/dissolved) by CSS as the next scene is revealed. Keyed by the
   scene being entered, so it visually announces what's coming.
   -------------------------------------------------------------------------- */
const SVGNS = "http://www.w3.org/2000/svg";

const SHAPE_LIBRARY = {
  // hero: "signal detected" -> a scanning eye completing (lid, iris, pupil)
  hero: [
    { tag: "path", cls: "shape-line", attrs: { d: "M40,100 Q100,58 160,100 Q100,142 40,100 Z" } },
    { tag: "circle", cls: "shape-line", attrs: { cx: 100, cy: 100, r: 21 } },
    { tag: "circle", cls: "shape-dot shape-dot--accent", attrs: { cx: 100, cy: 100, r: 7 } }
  ],
  // connection: two signals rotary-tuning into a single locked link
  connection: [
    { tag: "circle", cls: "shape-line", attrs: { cx: 54, cy: 100, r: 15 } },
    { tag: "circle", cls: "shape-line", attrs: { cx: 146, cy: 100, r: 15 } },
    { tag: "path", cls: "shape-line shape-line--accent", attrs: { d: "M69,100 L131,100" } },
    { tag: "circle", cls: "shape-dot shape-dot--accent", attrs: { cx: 100, cy: 100, r: 5 } }
  ],
  // records: radar lens locking onto a target reticle
  records: [
    { tag: "circle", cls: "shape-line", attrs: { cx: 100, cy: 100, r: 52 } },
    { tag: "circle", cls: "shape-line", attrs: { cx: 100, cy: 100, r: 27 } },
    { tag: "path", cls: "shape-line shape-line--accent", attrs: { d: "M100,32 L100,50 M100,150 L100,168 M32,100 L50,100 M150,100 L168,100" } },
    { tag: "circle", cls: "shape-dot shape-dot--accent", attrs: { cx: 100, cy: 100, r: 4 } }
  ],
  // timeline: a vertical journey path marked by milestones
  timeline: [
    { tag: "path", cls: "shape-line", attrs: { d: "M100,32 L100,168" } },
    { tag: "circle", cls: "shape-dot", attrs: { cx: 100, cy: 32, r: 5 } },
    { tag: "circle", cls: "shape-dot", attrs: { cx: 100, cy: 78, r: 5 } },
    { tag: "circle", cls: "shape-dot", attrs: { cx: 100, cy: 122, r: 5 } },
    { tag: "circle", cls: "shape-dot shape-dot--accent", attrs: { cx: 100, cy: 168, r: 7 } }
  ],
  // barrier: an A.T. Field hexagon locking into place
  barrier: [
    { tag: "path", cls: "shape-line shape-line--fill", attrs: { d: "M100,42 L152,71 L152,129 L100,158 L48,129 L48,71 Z" } },
    { tag: "path", cls: "shape-line", attrs: { d: "M100,42 L152,71 L152,129 L100,158 L48,129 L48,71 Z" } },
    { tag: "circle", cls: "shape-dot shape-dot--accent", attrs: { cx: 100, cy: 100, r: 5 } }
  ],
  // letter: an envelope assembling from its fold lines, then sealed
  letter: [
    { tag: "path", cls: "shape-line", attrs: { d: "M42,66 L158,66 L158,146 L42,146 Z" } },
    { tag: "path", cls: "shape-line shape-line--accent", attrs: { d: "M42,66 L100,112 L158,66" } },
    { tag: "circle", cls: "shape-dot shape-dot--accent", attrs: { cx: 100, cy: 136, r: 5 } }
  ],
  // response: a question forming inside a speech bubble
  response: [
    { tag: "path", cls: "shape-line", attrs: { d: "M46,58 Q38,58 38,68 L38,116 Q38,126 48,126 L72,126 L92,150 L96,126 L152,126 Q162,126 162,116 L162,68 Q162,58 152,58 Z" } },
    { tag: "path", cls: "shape-line shape-line--accent", attrs: { d: "M84,80 Q84,66 100,66 Q116,66 116,80 Q116,90 104,96 Q98,99 98,108" } },
    { tag: "circle", cls: "shape-dot shape-dot--accent", attrs: { cx: 98, cy: 120, r: 4 } }
  ],
  // reply: two answered signals resolving into one shared heart
  reply: [
    { tag: "path", cls: "shape-line shape-line--fill", attrs: { d: "M100,152 C62,124 34,96 34,68 C34,44 55,30 76,38 C90,43 98,54 100,64 C102,54 110,43 124,38 C145,30 166,44 166,68 C166,96 138,124 100,152 Z" } },
    { tag: "path", cls: "shape-line shape-line--accent", attrs: { d: "M100,152 C62,124 34,96 34,68 C34,44 55,30 76,38 C90,43 98,54 100,64 C102,54 110,43 124,38 C145,30 166,44 166,68 C166,96 138,124 100,152 Z" } }
  ]
};

const transitionForms = {
  container: null,

  init() {
    this.container = $("#bridgeShape");
  },

  render(sceneName) {
    if (!this.container) this.init();
    if (!this.container) return;
    const shapeDefs = SHAPE_LIBRARY[sceneName];
    this.container.innerHTML = "";
    if (!shapeDefs) return;

    shapeDefs.forEach((def, i) => {
      const el = document.createElementNS(SVGNS, def.tag);
      Object.entries(def.attrs).forEach(([key, value]) => el.setAttribute(key, String(value)));
      el.setAttribute("class", def.cls);
      // Stagger each element slightly so the object visibly assembles
      // piece by piece rather than popping in all at once.
      el.style.transitionDelay = `${i * 70}ms`;
      this.container.appendChild(el);

      if (def.tag === "path") {
        // Measure the real path length so the draw-in offset is precise.
        try {
          const len = el.getTotalLength();
          el.style.setProperty("--len", String(Math.max(len, 1)));
        } catch (err) { /* ignore in unsupported environments */ }
      }
    });
  }
};

/* --------------------------------------------------------------------------
   SCENE MANAGER & CHAPTER TRANSITIONS
   -------------------------------------------------------------------------- */
const sceneManager = {
  scenes: ["boot", "hero", "connection", "records", "timeline", "barrier", "letter", "response", "reply"],
  currentScene: "boot",
  isTransitioning: false,
  _activeTimers: [],

  clearTimers() {
    this._activeTimers.forEach((id) => window.clearTimeout(id));
    this._activeTimers = [];
  },

  init() {
    this.createPips();
    this.updateChrome("boot");
    setupAppHeight();
  },

  createPips() {
    const container = $("#chapterPips");
    if (!container) return;
    container.innerHTML = "";
    for (let i = 1; i <= 8; i++) {
      const pip = document.createElement("i");
      pip.dataset.pipIndex = String(i);
      container.appendChild(pip);
    }
  },

  updateChrome(sceneName) {
    document.body.dataset.activeScene = sceneName;
    const topbarChapter = $("#topbarChapter");
    const sceneIndex = this.scenes.indexOf(sceneName);

    const chapterTitles = {
      boot: "SYSTEM BOOT",
      hero: "CHAPTER 01 / SIGNAL DETECTED",
      connection: "CHAPTER 02 / FREQUENCY TUNE",
      records: "CHAPTER 03 / PERSONAL ARCHIVE",
      timeline: "CHAPTER 04 / SIGNAL DEVELOPMENT",
      barrier: "CHAPTER 05 / A.T. FIELD RESONANCE",
      letter: "CHAPTER 06 / MESSAGE RECONSTRUCTION",
      response: "CHAPTER 07 / RESPONSE CHANNEL",
      reply: "CHAPTER 08 / SINCERE TRANSMISSION"
    };

    if (topbarChapter) {
      topbarChapter.textContent = chapterTitles[sceneName] || "REI TRANSMISSION";
    }

    const pips = $$("#chapterPips i");
    pips.forEach((pip, idx) => {
      const pipChapter = idx + 1;
      pip.classList.toggle("is-past", pipChapter < sceneIndex);
      pip.classList.toggle("is-active", pipChapter === sceneIndex);
    });
  },

  advanceTo(nextScene) {
    if (this.isTransitioning || this.currentScene === nextScene) return;
    this.isTransitioning = true;
    this.clearTimers();

    soundSystem.playInterface();
    const currentEl = $(`.scene[data-scene="${this.currentScene}"]`);
    const nextEl = $(`.scene[data-scene="${nextScene}"]`);
    const transitionOverlay = $("#chapterTransition");
    const transitionNum = $("#transitionNumber");
    const transitionText = $("#transitionText");
    const transitionBar = $("#transitionBar");

    // Exit active module
    const currentModule = sceneModules[this.currentScene];
    if (currentModule?.exit) currentModule.exit();
    hintController.detach();

    if (transitionOverlay && nextScene !== "boot") {
      const nextIndex = this.scenes.indexOf(nextScene);
      if (transitionNum) transitionNum.textContent = String(nextIndex).padStart(2, "0");
      if (transitionText) transitionText.textContent = `PHASE 0${nextIndex} / INITIALIZING`;

      const DRAW_MS = 720;   // object assembles, synced to interaction that triggered it
      const HOLD_MS = 400;   // object sits complete and recognizable (300-500ms)
      const RELEASE_MS = 360; // object morphs/dissolves toward the next scene

      // 1. Build the meaningful object for the scene we're entering and
      //    start its draw-in the instant the user's action fires the
      //    transition (never before the interaction completes).
      transitionForms.render(nextScene);
      transitionOverlay.dataset.shapeStage = "draw";
      transitionOverlay.classList.add("is-active", `is-${nextScene}`);
      if (transitionBar) transitionBar.style.width = "100%";

      // 2. Object finishes forming and is held fully visible/recognizable.
      const holdTimer = window.setTimeout(() => {
        transitionOverlay.dataset.shapeStage = "hold";
      }, DRAW_MS);

      // 3. Swap the actual scenes underneath while the object is held, then
      //    begin its morph/dissolve as the next scene becomes visible.
      const swapTimer = window.setTimeout(() => {
        if (currentEl) {
          currentEl.classList.remove("is-active");
          currentEl.setAttribute("aria-hidden", "true");
        }
        if (nextEl) {
          nextEl.classList.add("is-active");
          nextEl.setAttribute("aria-hidden", "false");
          nextEl.scrollTop = 0; // Scene-local overflow reset
        }

        this.currentScene = nextScene;
        this.updateChrome(nextScene);

        const nextModule = sceneModules[nextScene];
        if (nextModule?.enter) nextModule.enter();
        if (nextModule?.recalculateGeometry) nextModule.recalculateGeometry();
        hintController.attach(nextEl);

        transitionOverlay.dataset.shapeStage = "release";

        const releaseTimer = window.setTimeout(() => {
          transitionOverlay.classList.remove("is-active", `is-${nextScene}`);
          transitionOverlay.dataset.shapeStage = "";
          if (transitionBar) transitionBar.style.width = "0%";
          if (transitionForms.container) transitionForms.container.innerHTML = "";
          this.isTransitioning = false;
        }, RELEASE_MS);
        this._activeTimers.push(releaseTimer);
      }, DRAW_MS + HOLD_MS);

      this._activeTimers.push(holdTimer, swapTimer);
    } else {
      if (currentEl) {
        currentEl.classList.remove("is-active");
        currentEl.setAttribute("aria-hidden", "true");
      }
      if (nextEl) {
        nextEl.classList.add("is-active");
        nextEl.setAttribute("aria-hidden", "false");
        nextEl.scrollTop = 0;
      }
      this.currentScene = nextScene;
      this.updateChrome(nextScene);

      const nextModule = sceneModules[nextScene];
      if (nextModule?.enter) nextModule.enter();
      if (nextModule?.recalculateGeometry) nextModule.recalculateGeometry();
      hintController.attach(nextEl);
      this.isTransitioning = false;
    }
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 0: BOOT (CRITICAL FINGERPRINT SCANNER PRESERVED)
   -------------------------------------------------------------------------- */
const HOLD_DURATION_MS = 900;

const bootScene = {
  enterButton: null,
  bootBar: null,
  bootPercent: null,
  bootLog: null,
  progress: 0,
  holdRAF: null,
  holdStartTime: null,
  activePointerId: null,
  isHolding: false,
  isComplete: false,
  readyTimer: null,
  successTimer: null,

  init() {
    this.enterButton = $("#enterButton");
    this.bootBar = $("#bootBar");
    this.bootPercent = $("#bootPercent");
    this.bootLog = $("#bootLog");

    // Calibration must sit at a silent, untouched 0% until the user
    // actually presses and holds the fingerprint scanner.
    this.setProgress(0);

    // Short "system ready" delay before the scanner accepts input. This
    // does not touch the calibration progress bar/number in any way.
    this.readyTimer = window.setTimeout(() => {
      if (this.bootLog) this.bootLog.textContent = "AUTHENTICATION REQUIRED / PLACE FINGERPRINT";
      if (this.enterButton) this.enterButton.disabled = false;
    }, 450);

    this.setupHold();
  },

  setProgress(value) {
    const clamped = Math.max(0, Math.min(100, value));
    this.progress = clamped;
    if (this.bootBar) this.bootBar.style.width = `${clamped}%`;
    if (this.bootPercent) this.bootPercent.textContent = String(Math.round(clamped)).padStart(2, "0");
  },

  cancelFrame() {
    if (this.holdRAF !== null) {
      cancelAnimationFrame(this.holdRAF);
      this.holdRAF = null;
    }
  },

  setupHold() {
    if (!this.enterButton) return;
    const btn = this.enterButton;

    const tick = (now) => {
      if (!this.isHolding) return;
      const elapsed = now - this.holdStartTime;
      const pct = (elapsed / HOLD_DURATION_MS) * 100;

      if (pct >= 100) {
        this.setProgress(100);
        this.completeHold();
        return;
      }

      this.setProgress(pct);
      this.holdRAF = requestAnimationFrame(tick);
    };

    const start = (event) => {
      // Primary pointer/button only, and only one hold at a time.
      if (btn.disabled || this.isHolding || this.isComplete) return;
      if (event.button !== undefined && event.button !== 0) return;

      this.isHolding = true;
      this.activePointerId = event.pointerId;
      try { btn.setPointerCapture(event.pointerId); } catch (err) { /* no-op */ }

      btn.classList.add("is-holding");
      soundSystem.playInterface();

      this.holdStartTime = performance.now();
      this.setProgress(0);
      this.cancelFrame();
      this.holdRAF = requestAnimationFrame(tick);
    };

    const cancelHold = (event) => {
      if (event && event.pointerId !== undefined && this.activePointerId !== null && event.pointerId !== this.activePointerId) {
        return;
      }
      if (!this.isHolding) return;

      this.isHolding = false;
      this.activePointerId = null;
      this.cancelFrame();
      btn.classList.remove("is-holding");
      this.setProgress(0);
    };

    btn.addEventListener("pointerdown", start);
    btn.addEventListener("pointerup", cancelHold);
    btn.addEventListener("pointercancel", cancelHold);
    btn.addEventListener("lostpointercapture", cancelHold);
    btn.addEventListener("contextmenu", (event) => event.preventDefault());
  },

  completeHold() {
    if (this.isComplete) return;
    this.isComplete = true;
    this.isHolding = false;
    this.activePointerId = null;
    this.cancelFrame();

    const btn = this.enterButton;
    if (btn) {
      btn.classList.remove("is-holding");
      btn.disabled = true;
    }
    if (this.bootLog) this.bootLog.textContent = "SIGNAL VERIFIED / ACCESS GRANTED";
    announce("Authentication complete. Entering private signal.");

    this.successTimer = window.setTimeout(() => {
      sceneManager.advanceTo("hero");
    }, 450);
  },

  enter() {},
  exit() {
    this.cancelFrame();
    window.clearTimeout(this.readyTimer);
    window.clearTimeout(this.successTimer);
  },
  reset() {
    this.cancelFrame();
    window.clearTimeout(this.successTimer);
    this.progress = 0;
    this.isHolding = false;
    this.isComplete = false;
    this.activePointerId = null;
    if (this.enterButton) {
      this.enterButton.disabled = false;
      this.enterButton.classList.remove("is-holding");
    }
    this.setProgress(0);
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 1: HERO (ATTRACT) â€” MEASURED CENTER COORDINATES
   -------------------------------------------------------------------------- */
const heroScene = {
  handle: null,
  target: null,
  track: null,
  distanceEl: null,
  beamEl: null,
  curvePath: null,
  fieldEl: null,
  isDragging: false,
  progress: 0, // single source of truth, 0..1, drives both node position and beam length
  maxDrag: 240,
  handleRadius: 26,
  nodeLeftOffset: 4,
  activePointerId: null,
  rafId: null,
  pendingProgress: null,
  returnRafId: null,
  completed: false,

  init() {
    this.handle = $("#heroSignalHandle");
    this.target = $("#heroSignalTarget");
    this.track = $("#heroSignalTrack");
    this.distanceEl = $("#heroSignalDistance");
    this.beamEl = $("#heroSignalBeam");
    this.curvePath = $("#heroSignalCurvePath");
    this.fieldEl = $("#heroSignalField");

    if (this.handle) {
      this.handle.addEventListener("pointerdown", (e) => this.onPointerDown(e));
      window.addEventListener("pointermove", (e) => this.onPointerMove(e));
      window.addEventListener("pointerup", (e) => this.onPointerUp(e));
      window.addEventListener("pointercancel", (e) => this.onPointerUp(e));
      this.handle.addEventListener("lostpointercapture", (e) => this.onPointerUp(e));

      this.handle.addEventListener("keydown", (e) => {
        if (this.completed) return;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          this.setProgressImmediate(this.progress + (e.shiftKey ? 0.12 : 0.05));
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          this.setProgressImmediate(this.progress - (e.shiftKey ? 0.12 : 0.05));
        } else if (e.key === "Enter" || e.key === " ") {
          if (this.progress >= 0.8) {
            this.complete();
          }
        }
      });

      window.addEventListener("resize", () => this.recalculateGeometry());
      window.addEventListener("orientationchange", () => this.recalculateGeometry());
    }
  },

  recalculateGeometry() {
    if (!this.track || !this.handle || !this.target) return;
    const trackRect = this.track.getBoundingClientRect();
    const targetRect = this.target.getBoundingClientRect();

    this.handleRadius = (this.handle.offsetWidth || 52) / 2;
    this.nodeLeftOffset = parseFloat(getComputedStyle(this.handle).left) || 4;

    // Actual travel distance between start handle center and target node center
    this.maxDrag = Math.max(
      60,
      (targetRect.left + targetRect.width / 2) - (trackRect.left + this.nodeLeftOffset + this.handleRadius)
    );

    if (this.beamEl) {
      this.beamEl.style.left = `${this.nodeLeftOffset + this.handleRadius - 1}px`;
      this.beamEl.style.width = `${this.maxDrag + 1}px`;
    }

    this.renderProgress(this.completed ? 1 : this.progress);
  },

  onPointerDown(e) {
    if (this.completed) return;
    this.cancelReturnAnimation();
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isDragging = true;
    this.activePointerId = e.pointerId;
    this.handle.classList.add("is-dragging");
    if (this.beamEl) this.beamEl.classList.add("is-dragging");
    try { this.handle.setPointerCapture(e.pointerId); } catch (err) { /* no-op */ }
    hintController.notifyProgress();
  },

  onPointerMove(e) {
    if (!this.isDragging || this.completed || !this.track) return;
    if (this.activePointerId !== null && e.pointerId !== this.activePointerId) return;
    const rect = this.track.getBoundingClientRect();
    const x = e.clientX - rect.left - this.nodeLeftOffset - this.handleRadius;
    this.pendingProgress = clamp(x / this.maxDrag, 0, 1);

    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => this.flushPendingProgress());
    }
  },

  flushPendingProgress() {
    this.rafId = null;
    if (this.pendingProgress === null) return;
    const ratio = this.pendingProgress;
    this.pendingProgress = null;
    this.renderProgress(ratio);
    if (ratio >= 0.93 && !this.completed) {
      this.complete();
    }
  },

  setProgressImmediate(val) {
    this.cancelReturnAnimation();
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.pendingProgress = null;
    this.renderProgress(clamp(val, 0, 1));
    if (this.progress >= 0.93) this.complete();
  },

  renderProgress(ratio) {
    this.progress = clamp(ratio, 0, 1);
    const dragX = this.progress * this.maxDrag;

    if (this.handle) this.handle.style.transform = `translateX(${dragX}px)`;
    if (this.beamEl) this.beamEl.style.transform = `scaleX(${this.progress})`;

    const distValue = Math.round((1 - this.progress) * 100);
    if (this.distanceEl) this.distanceEl.textContent = String(distValue);

    if (this.curvePath) {
      const originX = this.nodeLeftOffset + this.handleRadius;
      const midX = originX + dragX / 2;
      const heightOffset = 31 - Math.sin(this.progress * Math.PI) * 16;
      this.curvePath.setAttribute("d", `M ${originX},31 Q ${midX},${heightOffset} ${originX + dragX},31`);
    }

    if (this.fieldEl) {
      if (this.progress >= 0.78) {
        this.fieldEl.classList.add("is-captured");
      } else {
        this.fieldEl.classList.remove("is-captured");
      }
    }
  },

  onPointerUp(e) {
    if (this.activePointerId !== null && e && e.pointerId !== undefined && e.pointerId !== this.activePointerId) return;
    if (!this.isDragging) return;
    this.isDragging = false;
    this.activePointerId = null;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.pendingProgress = null;
    if (this.handle) this.handle.classList.remove("is-dragging");
    if (this.beamEl) this.beamEl.classList.remove("is-dragging");

    if (!this.completed) {
      this.animateReturn();
    }
  },

  animateReturn() {
    this.cancelReturnAnimation();
    const startProgress = this.progress;
    if (startProgress <= 0.001) {
      this.renderProgress(0);
      return;
    }
    const duration = 280;
    const startTime = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const t = clamp((now - startTime) / duration, 0, 1);
      const eased = ease(t);
      this.renderProgress(startProgress * (1 - eased));
      if (t < 1) {
        this.returnRafId = requestAnimationFrame(step);
      } else {
        this.returnRafId = null;
        this.renderProgress(0);
      }
    };
    this.returnRafId = requestAnimationFrame(step);
  },

  cancelReturnAnimation() {
    if (this.returnRafId !== null) {
      cancelAnimationFrame(this.returnRafId);
      this.returnRafId = null;
    }
  },

  complete() {
    if (this.completed) return;
    this.completed = true;
    this.isDragging = false;
    this.activePointerId = null;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.cancelReturnAnimation();
    if (this.handle) this.handle.classList.remove("is-dragging");
    if (this.beamEl) this.beamEl.classList.remove("is-dragging");
    this.renderProgress(1);

    const alignRoot = $("#heroSignalAlign");
    if (alignRoot) alignRoot.classList.add("is-complete");

    soundSystem.playInterface();
    announce("Signals connected. Stabilizing channel.");

    window.setTimeout(() => {
      sceneManager.advanceTo("connection");
    }, 850);
  },

  enter() {
    this.recalculateGeometry();
  },
  exit() {
    this.isDragging = false;
    this.activePointerId = null;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.cancelReturnAnimation();
  },
  reset() {
    this.completed = false;
    this.isDragging = false;
    this.activePointerId = null;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.cancelReturnAnimation();
    this.renderProgress(0);
    if (this.handle) this.handle.classList.remove("is-dragging");
    if (this.beamEl) this.beamEl.classList.remove("is-dragging");
    const alignRoot = $("#heroSignalAlign");
    if (alignRoot) alignRoot.classList.remove("is-complete");
    if (this.distanceEl) this.distanceEl.textContent = "100";
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 2: CONNECTION (TUNE) â€” CONGRUENT POLAR ARC & ROTATION
   -------------------------------------------------------------------------- */
const connectionScene = {
  dial: null,
  needle: null,
  targetArc: null,
  syncValEl: null,
  syncMsgEl: null,
  freqEl: null,
  angle: 0,
  targetAngle: 135,
  tolerance: 18,
  isTuning: false,
  lockTimer: null,
  completed: false,

  init() {
    this.dial = $("#connectionDial");
    this.needle = $("#connectionNeedle");
    this.targetArc = $("#connectionTargetArc");
    this.syncValEl = $("#syncValue");
    this.syncMsgEl = $("#syncMessage");
    this.freqEl = $("#connectionFrequency");

    this.drawTargetArc();

    if (this.dial) {
      this.dial.addEventListener("pointerdown", (e) => this.onStart(e));
      window.addEventListener("pointermove", (e) => this.onMove(e));
      window.addEventListener("pointerup", () => this.onEnd());
      window.addEventListener("pointercancel", () => this.onEnd());

      this.dial.addEventListener("wheel", (e) => {
        e.preventDefault();
        this.updateAngle(this.angle + (e.deltaY > 0 ? 6 : -6));
      }, { passive: false });

      this.dial.addEventListener("keydown", (e) => {
        if (this.completed) return;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          this.updateAngle(this.angle + (e.shiftKey ? 15 : 4));
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          this.updateAngle(this.angle - (e.shiftKey ? 15 : 4));
        } else if (e.key === "Home") {
          this.updateAngle(0);
        } else if (e.key === "End") {
          this.updateAngle(360);
        }
      });
    }
  },

  drawTargetArc() {
    if (!this.targetArc) return;
    const cx = 100;
    const cy = 100;
    const r = 70;
    const startDeg = this.targetAngle - this.tolerance;
    const endDeg = this.targetAngle + this.tolerance;

    const startRad = (startDeg - 90) * (Math.PI / 180);
    const endRad = (endDeg - 90) * (Math.PI / 180);

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    this.targetArc.setAttribute("d", `M ${x1.toFixed(2)},${y1.toFixed(2)} A ${r},${r} 0 0,1 ${x2.toFixed(2)},${y2.toFixed(2)}`);
  },

  recalculateGeometry() {
    this.drawTargetArc();
  },

  onStart(e) {
    if (this.completed) return;
    this.isTuning = true;
    this.dial.classList.add("is-tuning");
    this.dial.setPointerCapture?.(e.pointerId);
    this.onMove(e);
    hintController.notifyProgress();
  },

  onMove(e) {
    if (!this.isTuning || this.completed || !this.dial) return;
    const rect = this.dial.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const radians = Math.atan2(e.clientY - cy, e.clientX - cx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    this.updateAngle(degrees);
  },

  updateAngle(deg) {
    this.angle = (deg % 360 + 360) % 360;
    if (this.needle) this.needle.style.setProperty("--tuner-angle", `${this.angle}deg`);
    if (this.dial) this.dial.setAttribute("aria-valuenow", String(Math.round(this.angle)));

    const diff = Math.abs(this.angle - this.targetAngle);
    const error = Math.min(180, diff > 180 ? 360 - diff : diff);
    const stability = Math.max(0, Math.round(100 - (error / 90) * 100));

    if (this.syncValEl) this.syncValEl.textContent = String(stability).padStart(2, "0");
    if (this.freqEl) this.freqEl.textContent = `${(100 + (this.angle * 0.3)).toFixed(2)} MHz`;

    const syncPanel = $("#syncPanel");
    if (syncPanel) {
      syncPanel.style.setProperty("--frequency-error", String(error));
      syncPanel.style.setProperty("--signal-stability", String(stability));
    }

    if (error <= this.tolerance) {
      if (this.dial) this.dial.classList.add("is-matched");
      if (!this.lockTimer) {
        this.lockTimer = window.setTimeout(() => this.complete(), 480);
      }
    } else {
      if (this.dial) this.dial.classList.remove("is-matched");
      if (this.lockTimer) {
        clearTimeout(this.lockTimer);
        this.lockTimer = null;
      }
    }
  },

  onEnd() {
    this.isTuning = false;
    if (this.dial) this.dial.classList.remove("is-tuning");
  },

  complete() {
    if (this.completed) return;
    this.completed = true;
    this.isTuning = false;

    const syncPanel = $("#syncPanel");
    if (syncPanel) syncPanel.classList.add("is-complete");
    if (this.syncMsgEl) this.syncMsgEl.textContent = siteConfig.syncMessage;

    soundSystem.playInterface();
    announce(siteConfig.syncMessage);

    window.setTimeout(() => {
      sceneManager.advanceTo("records");
    }, 850);
  },

  enter() {
    this.recalculateGeometry();
  },
  exit() {
    this.isTuning = false;
    if (this.lockTimer) clearTimeout(this.lockTimer);
  },
  reset() {
    this.completed = false;
    this.isTuning = false;
    this.angle = 0;
    this.updateAngle(0);
    const syncPanel = $("#syncPanel");
    if (syncPanel) syncPanel.classList.remove("is-complete");
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 3: RECORDS (SEARCH) â€” NORMALIZED COORDINATE PLANE
   -------------------------------------------------------------------------- */
const recordsScene = {
  radar: null,
  plane: null,
  lens: null,
  echoes: [],
  recovered: new Set(),
  currentIndex: 0,
  lensX: 50,
  lensY: 50,
  isScanning: false,
  coords: [
    { x: 25, y: 35 },
    { x: 45, y: 70 },
    { x: 60, y: 30 },
    { x: 75, y: 65 },
    { x: 85, y: 40 }
  ],

  init() {
    this.radar = $("#recordRadar");
    this.plane = $("#radarPlane");
    this.lens = $("#recordLens");
    this.echoes = $$(".radar__echo");

    if (this.radar) {
      this.radar.addEventListener("pointerdown", (e) => this.onPointerDown(e));
      window.addEventListener("pointermove", (e) => this.onPointerMove(e));
      window.addEventListener("pointerup", () => { this.isScanning = false; });
    }

    this.echoes.forEach((echo) => {
      echo.addEventListener("click", () => {
        const idx = parseInt(echo.dataset.recordIndex, 10);
        this.selectEcho(idx);
      });
    });

    const continueBtn = $("#recordArchiveContinue");
    if (continueBtn) {
      continueBtn.addEventListener("click", () => {
        sceneManager.advanceTo("timeline");
      });
    }

    this.positionEchoes();
  },

  positionEchoes() {
    this.echoes.forEach((echo, idx) => {
      const pt = this.coords[idx] || { x: 50, y: 50 };
      echo.style.left = `${pt.x}%`;
      echo.style.top = `${pt.y}%`;
    });
  },

  recalculateGeometry() {
    this.positionEchoes();
  },

  onPointerDown(e) {
    this.isScanning = true;
    this.onPointerMove(e);
    hintController.notifyProgress();
  },

  onPointerMove(e) {
    if (!this.isScanning || !this.radar) return;
    const rect = this.radar.getBoundingClientRect();
    this.lensX = clamp(((e.clientX - rect.left) / rect.width) * 100, 8, 92);
    this.lensY = clamp(((e.clientY - rect.top) / rect.height) * 100, 8, 92);

    if (this.lens) {
      this.lens.style.left = `${this.lensX}%`;
      this.lens.style.top = `${this.lensY}%`;
    }

    this.checkProximity();
  },

  checkProximity() {
    this.coords.forEach((pt, idx) => {
      const dist = Math.hypot(this.lensX - pt.x, this.lensY - pt.y);
      const echo = this.echoes[idx];
      if (!echo) return;

      if (dist <= 13) {
        echo.classList.add("is-found");
        if (!this.recovered.has(idx)) {
          this.recoverEcho(idx);
        }
      }
    });
  },

  recoverEcho(idx) {
    this.recovered.add(idx);
    const echo = this.echoes[idx];
    if (echo) echo.classList.add("is-decrypted");

    this.selectEcho(idx);
    soundSystem.playInterface();

    const countEl = $("#recordArchiveCount");
    if (countEl) countEl.textContent = `${this.recovered.size} / 5`;

    if (this.recovered.size === 5) {
      const continueBtn = $("#recordArchiveContinue");
      if (continueBtn) continueBtn.hidden = false;
      announce("All personal records recovered. Ready to proceed to timeline.");
    }
  },

  selectEcho(idx) {
    this.currentIndex = idx;
    this.echoes.forEach((e, i) => e.classList.toggle("is-current", i === idx));

    const rec = siteConfig.records[idx];
    if (!rec) return;

    const numEl = $("#recordNumber");
    const codeEl = $("#recordCode");
    const titleEl = $("#recordTitle");
    const textEl = $("#recordText");
    const counterEl = $("#recordCounter");
    const card = $("#recordCard");

    if (numEl) numEl.textContent = String(idx + 1).padStart(2, "0");
    if (codeEl) codeEl.textContent = rec.code;
    if (counterEl) counterEl.textContent = `RECORD 0${idx + 1} / 05`;
    if (titleEl) titleEl.textContent = rec.title;

    if (card) {
      card.classList.add("is-decrypting");
      window.setTimeout(() => card.classList.remove("is-decrypting"), 500);
    }
    if (textEl) decryptText(textEl, rec.text);
  },

  enter() {
    this.selectEcho(0);
    this.recalculateGeometry();
  },
  exit() {
    this.isScanning = false;
  },
  reset() {
    this.recovered.clear();
    this.echoes.forEach(e => {
      e.classList.remove("is-found", "is-current", "is-decrypted");
    });
    const continueBtn = $("#recordArchiveContinue");
    if (continueBtn) continueBtn.hidden = true;
    const countEl = $("#recordArchiveCount");
    if (countEl) countEl.textContent = "0 / 5";
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 4: TIMELINE (TRAVEL) â€” REAL CHECKPOINT MEASUREMENTS
   -------------------------------------------------------------------------- */
const timelineScene = {
  scrollRegion: null,
  checkpoints: [],
  basePath: null,
  progressPath: null,
  pulseDot: null,
  continueBtn: null,
  currentMilestone: 0,
  checkpointCenters: [],

  init() {
    this.scrollRegion = $("#timelineScrollRegion");
    this.checkpoints = $$(".timeline-checkpoint");
    this.basePath = $("#timelineBasePath");
    this.progressPath = $("#timelineProgressPath");
    this.pulseDot = $("#timelinePulse");
    this.continueBtn = $("#timelineFinalContinue");

    if (this.scrollRegion) {
      this.scrollRegion.addEventListener("scroll", () => this.onScroll(), { passive: true });
    }

    this.checkpoints.forEach((cp, idx) => {
      const btn = cp.querySelector("button");
      if (btn) {
        btn.addEventListener("click", () => {
          this.setMilestone(idx);
        });
      }
    });

    if (this.continueBtn) {
      this.continueBtn.addEventListener("click", () => {
        sceneManager.advanceTo("barrier");
      });
    }
  },

  recalculateGeometry() {
    if (!this.scrollRegion || this.checkpoints.length === 0) return;
    const regionRect = this.scrollRegion.getBoundingClientRect();
    const scrollTop = this.scrollRegion.scrollTop;

    this.checkpointCenters = this.checkpoints.map(cp => {
      const rect = cp.getBoundingClientRect();
      return (rect.top - regionRect.top + scrollTop) + (rect.height / 2);
    });

    const firstY = this.checkpointCenters[0] || 20;
    const lastY = this.checkpointCenters[this.checkpointCenters.length - 1] || 580;

    const svg = $("#timelineJourneyPath");
    if (svg) {
      svg.setAttribute("viewBox", `0 0 20 ${Math.max(600, lastY + 40)}`);
    }
    if (this.basePath) {
      this.basePath.setAttribute("d", `M 10,${firstY.toFixed(1)} L 10,${lastY.toFixed(1)}`);
    }
    if (this.progressPath) {
      this.progressPath.setAttribute("d", `M 10,${firstY.toFixed(1)} L 10,${lastY.toFixed(1)}`);
    }

    this.onScroll();
  },

  onScroll() {
    if (!this.scrollRegion) return;
    hintController.notifyProgress();
    const maxScroll = this.scrollRegion.scrollHeight - this.scrollRegion.clientHeight;
    const ratio = maxScroll > 0 ? this.scrollRegion.scrollTop / maxScroll : 0;

    const idx = clamp(Math.floor(ratio * 5), 0, 4);
    if (idx !== this.currentMilestone) {
      this.setMilestone(idx);
    }

    if (this.progressPath) {
      this.progressPath.style.strokeDashoffset = `${1000 - (ratio * 1000)}`;
    }
    if (this.pulseDot) {
      const firstY = this.checkpointCenters[0] || 20;
      const lastY = this.checkpointCenters[this.checkpointCenters.length - 1] || 580;
      const cy = firstY + ratio * (lastY - firstY);
      this.pulseDot.setAttribute("cy", String(cy.toFixed(1)));
    }

    if (ratio >= 0.88 && this.continueBtn) {
      this.continueBtn.hidden = false;
    }
  },

  setMilestone(idx) {
    this.currentMilestone = idx;
    this.checkpoints.forEach((cp, i) => {
      cp.classList.toggle("is-current", i === idx);
      cp.classList.toggle("is-completed", i < idx);
    });

    const data = siteConfig.timeline[idx];
    if (!data) return;

    const phaseEl = $("#timelinePhase");
    const titleEl = $("#timelineTitle");
    const textEl = $("#timelineText");
    const counterEl = $("#timelineCounter");

    if (phaseEl) phaseEl.textContent = data.phase;
    if (titleEl) titleEl.textContent = data.title;
    if (counterEl) counterEl.textContent = `MILESTONE 0${idx + 1} / 05`;
    if (textEl) decryptText(textEl, data.text);

    soundSystem.playInterface();
  },

  enter() {
    this.setMilestone(0);
    this.recalculateGeometry();
  },
  exit() {},
  reset() {
    this.currentMilestone = 0;
    if (this.scrollRegion) this.scrollRegion.scrollTop = 0;
    if (this.continueBtn) this.continueBtn.hidden = true;
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 5: BARRIER (RESONATE) â€” SHARED RING PHASE & ARC WINDOW
   -------------------------------------------------------------------------- */
const barrierScene = {
  button: null,
  visual: null,
  numberEl: null,
  barEl: null,
  feedbackEl: null,
  pulseDot: null,
  windowArc: null,
  pulsePhase: 0,
  loopTimer: null,
  windowTarget: 0.5,
  windowTolerance: 0.14,
  completed: false,

  init() {
    this.button = $("#barrierButton");
    this.visual = $("#barrierVisual");
    this.numberEl = $("#barrierNumber");
    this.barEl = $("#barrierBar");
    this.feedbackEl = $("#barrierFeedback");
    this.pulseDot = $("#barrierPulseDot");
    this.windowArc = $("#barrierWindowArc");

    this.drawWindowArc();

    if (this.button) {
      this.button.addEventListener("click", () => this.releasePulse());
    }

    window.addEventListener("keydown", (e) => {
      if (sceneManager.currentScene === "barrier" && !this.completed) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          this.releasePulse();
        }
      }
    });
  },

  drawWindowArc() {
    if (!this.windowArc) return;
    const cx = 100;
    const cy = 100;
    const r = 70;
    const startPhase = this.windowTarget - this.windowTolerance;
    const endPhase = this.windowTarget + this.windowTolerance;

    const startRad = (startPhase * 2 * Math.PI) - Math.PI / 2;
    const endRad = (endPhase * 2 * Math.PI) - Math.PI / 2;

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    this.windowArc.setAttribute("d", `M ${x1.toFixed(2)},${y1.toFixed(2)} A ${r},${r} 0 0,1 ${x2.toFixed(2)},${y2.toFixed(2)}`);
  },

  recalculateGeometry() {
    this.drawWindowArc();
  },

  startLoop() {
    clearInterval(this.loopTimer);
    this.loopTimer = setInterval(() => {
      this.pulsePhase = (this.pulsePhase + 0.016) % 1;

      // Move pulse along the track
      if (this.pulseDot) {
        const rad = (this.pulsePhase * 2 * Math.PI) - Math.PI / 2;
        const cx = 100 + 70 * Math.cos(rad);
        const cy = 100 + 70 * Math.sin(rad);
        this.pulseDot.setAttribute("cx", cx.toFixed(2));
        this.pulseDot.setAttribute("cy", cy.toFixed(2));
      }
    }, 25);
  },

  releasePulse() {
    if (this.completed) return;
    hintController.notifyProgress();
    soundSystem.playInterface();

    const diff = Math.abs(this.pulsePhase - this.windowTarget);

    if (diff <= this.windowTolerance) {
      this.complete();
    } else {
      if (this.pulsePhase < this.windowTarget) {
        if (this.feedbackEl) this.feedbackEl.textContent = "EARLY PULSE / ADJUST TIMING";
      } else {
        if (this.feedbackEl) this.feedbackEl.textContent = "LATE PULSE / RELEASE WHEN PULSE ENTERS WINDOW";
      }
      this.windowTolerance = Math.min(0.28, this.windowTolerance + 0.02);
      this.drawWindowArc();
    }
  },

  complete() {
    if (this.completed) return;
    this.completed = true;
    clearInterval(this.loopTimer);

    if (this.feedbackEl) this.feedbackEl.textContent = "RESONANCE SYNCHRONIZED / BARRIER BREACHED";
    if (this.visual) this.visual.classList.add("is-open");

    let step = 0;
    const steps = [100, 67, 33, 0];
    const countInterval = setInterval(() => {
      step++;
      const val = steps[step] ?? 0;
      if (this.numberEl) this.numberEl.textContent = String(val);
      if (this.barEl) this.barEl.style.width = `${val}%`;

      if (step >= steps.length - 1) {
        clearInterval(countInterval);
        announce("Emotional barrier opened. Sincere message ready.");
        window.setTimeout(() => {
          sceneManager.advanceTo("letter");
        }, 650);
      }
    }, 200);
  },

  enter() {
    this.recalculateGeometry();
    this.startLoop();
  },
  exit() {
    clearInterval(this.loopTimer);
  },
  reset() {
    this.completed = false;
    this.pulsePhase = 0;
    this.windowTolerance = 0.14;
    this.drawWindowArc();
    if (this.visual) this.visual.classList.remove("is-open");
    if (this.numberEl) this.numberEl.textContent = "100";
    if (this.barEl) this.barEl.style.width = "100%";
    if (this.feedbackEl) this.feedbackEl.textContent = "PULSE READY / TIMING CRITICAL";
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 6: LETTER (RECONSTRUCT) â€” REAL COLLISION & PROGRESSIVE UNLOCK
   -------------------------------------------------------------------------- */
const letterScene = {
  field: null,
  orb: null,
  zone: null,
  fragments: [],
  statusEl: null,
  counterEl: null,
  copyEl: null,
  sealBtn: null,
  orbX: 30,
  orbY: 50,
  placedCount: 0,
  isDragging: false,
  attractedFragment: null,
  fragCoords: [
    { x: 15, y: 25 },
    { x: 45, y: 55 },
    { x: 75, y: 25 }
  ],

  init() {
    this.field = $("#letterReconstructField");
    this.orb = $("#letterOrb");
    this.zone = $("#letterReconstructZone");
    this.fragments = $$(".reconstruct__fragment");
    this.statusEl = $("#letterReconstructStatus");
    this.counterEl = $("#letterCounter");
    this.copyEl = $("#letterCopy");
    this.sealBtn = $("#letterSeal");

    if (this.field) {
      this.field.addEventListener("pointerdown", (e) => this.onPointerDown(e));
      window.addEventListener("pointermove", (e) => this.onPointerMove(e));
      window.addEventListener("pointerup", () => { this.isDragging = false; });
    }

    if (this.sealBtn) {
      this.sealBtn.addEventListener("click", () => {
        sceneManager.advanceTo("response");
      });
    }
  },

  onPointerDown(e) {
    this.isDragging = true;
    this.onPointerMove(e);
    hintController.notifyProgress();
  },

  onPointerMove(e) {
    if (!this.isDragging || !this.field) return;
    const rect = this.field.getBoundingClientRect();
    this.orbX = clamp(((e.clientX - rect.left) / rect.width) * 100, 6, 94);
    this.orbY = clamp(((e.clientY - rect.top) / rect.height) * 100, 10, 90);

    if (this.orb) {
      this.orb.style.left = `${this.orbX}%`;
      this.orb.style.top = `${this.orbY}%`;
    }

    this.checkFragments();
  },

  checkFragments() {
    this.fragCoords.forEach((pt, idx) => {
      const frag = this.fragments[idx];
      if (!frag || frag.classList.contains("is-placed")) return;

      const dist = Math.hypot(this.orbX - pt.x, this.orbY - pt.y);
      if (dist <= 16) {
        frag.classList.add("is-attracted");
        this.attractedFragment = idx;
      }
    });

    // Check if attracted fragment is brought to the Target Zone (right side >= 72%)
    if (this.attractedFragment !== null && this.orbX >= 72) {
      this.placeFragment(this.attractedFragment);
      this.attractedFragment = null;
    }
  },

  placeFragment(idx) {
    const frag = this.fragments[idx];
    if (!frag || frag.classList.contains("is-placed")) return;

    frag.classList.add("is-placed");
    frag.classList.remove("is-attracted");
    this.placedCount++;

    soundSystem.playInterface();
    this.showFragmentText(this.placedCount - 1);

    if (this.counterEl) {
      this.counterEl.textContent = `MESSAGE FRAGMENT 0${this.placedCount} / 03`;
    }

    if (this.placedCount >= 3) {
      if (this.statusEl) this.statusEl.textContent = "LETTER RESTORED / SEAL READY";
      if (this.sealBtn) {
        this.sealBtn.disabled = false;
        this.sealBtn.hidden = false;
      }
      announce("Letter completely reconstructed. Open response channel.");
    }
  },

  showFragmentText(idx) {
    const text = siteConfig.letter[idx];
    if (!text || !this.copyEl) return;

    let p = this.copyEl.children[idx];
    if (!p) {
      p = document.createElement("p");
      this.copyEl.appendChild(p);
    }
    p.classList.add("is-visible");
    decryptText(p, text);
  },

  enter() {
    if (this.copyEl && this.copyEl.children.length === 0) {
      this.showFragmentText(0);
      this.placeFragment(0);
    }
  },
  exit() {
    this.isDragging = false;
  },
  reset() {
    this.placedCount = 0;
    this.attractedFragment = null;
    this.fragments.forEach(f => f.classList.remove("is-attracted", "is-placed"));
    if (this.sealBtn) {
      this.sealBtn.disabled = true;
      this.sealBtn.hidden = true;
    }
    if (this.copyEl) this.copyEl.innerHTML = "";
    if (this.counterEl) this.counterEl.textContent = "MESSAGE FRAGMENT 00 / 03";
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 7: RESPONSE (CHOOSE) â€” SAFE BOUNDED DRIFT
   -------------------------------------------------------------------------- */
const responseScene = {
  options: null,
  noBtn: null,
  feedbackEl: null,
  changeBtn: null,
  driftCount: 0,

  init() {
    this.options = $("#responseOptions");
    this.noBtn = $("#noResponseButton");
    this.feedbackEl = $("#responseFeedback");
    this.changeBtn = $("#changeResponse");

    const yesBtn = $('[data-response="yes"]');
    if (yesBtn) {
      yesBtn.addEventListener("click", () => this.selectResponse("yes"));
    }

    if (this.noBtn) {
      const evade = () => {
        if (this.driftCount < 2) {
          this.driftCount++;
          this.noBtn.classList.add("is-drifting");
          // Safely drift without leaving container or overlapping Yes button
          const offsetY = this.driftCount * 28;
          this.noBtn.style.transform = `translateY(${offsetY}px)`;
          if (this.driftCount === 2) {
            this.noBtn.classList.add("is-catchable");
          }
        }
      };
      this.noBtn.addEventListener("mouseenter", evade);
      this.noBtn.addEventListener("touchstart", evade, { passive: true });
      this.noBtn.addEventListener("click", () => this.selectResponse("no"));
    }

    if (this.changeBtn) {
      this.changeBtn.addEventListener("click", () => {
        this.changeBtn.hidden = true;
        $$(".response-options--binary button").forEach(b => b.classList.remove("is-selected"));
        if (this.feedbackEl) this.feedbackEl.textContent = "RESPONSE CHANNEL / WAITING";
      });
    }
  },

  recalculateGeometry() {
    if (this.noBtn && this.driftCount === 0) {
      this.noBtn.style.transform = "";
    }
  },

  selectResponse(choice) {
    const msg = siteConfig.responses[choice];
    if (this.feedbackEl) this.feedbackEl.textContent = msg;
    if (this.changeBtn) this.changeBtn.hidden = false;

    $$(".response-options--binary button").forEach(b => {
      b.classList.toggle("is-selected", b.dataset.response === choice);
    });

    soundSystem.playInterface();
    announce(msg);

    try {
      localStorage.setItem("rei_response", choice);
    } catch (e) {}

    window.setTimeout(() => {
      sceneManager.advanceTo("reply");
    }, 1200);
  },

  enter() {
    this.recalculateGeometry();
  },
  exit() {},
  reset() {
    this.driftCount = 0;
    if (this.noBtn) {
      this.noBtn.style.transform = "";
      this.noBtn.classList.remove("is-drifting", "is-catchable");
    }
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 8: REPLY (SEND / WHATSAPP) â€” VIRTUAL KEYBOARD TOLERANCE
   -------------------------------------------------------------------------- */
const replyScene = {
  textarea: null,
  whatsappBtn: null,
  replayBtn: null,

  init() {
    this.textarea = $("#replyMessage");
    this.whatsappBtn = $("#whatsappReply");
    this.replayBtn = $("#replayButton");

    if (this.textarea && this.whatsappBtn) {
      this.textarea.addEventListener("input", () => this.updateLink());
      this.textarea.addEventListener("focus", () => {
        window.setTimeout(() => {
          this.textarea?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 200);
      });
    }

    if (this.replayBtn) {
      this.replayBtn.addEventListener("click", () => this.replayAll());
    }
  },

  updateLink() {
    if (!this.whatsappBtn || !this.textarea) return;
    const msg = this.textarea.value.trim() || `Halo ${siteConfig.senderName}, aku sudah menerima sinyalmu.`;
    const encoded = encodeURIComponent(msg);
    this.whatsappBtn.href = `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
  },

  replayAll() {
    soundSystem.playInterface();
    Object.values(sceneModules).forEach(mod => {
      if (mod.reset) mod.reset();
    });
    sceneManager.advanceTo("boot");
  },

  enter() {
    this.updateLink();
  },
  exit() {},
  reset() {}
};

/* --------------------------------------------------------------------------
   SCENE MODULES MAP
   -------------------------------------------------------------------------- */
const sceneModules = {
  boot: bootScene,
  hero: heroScene,
  connection: connectionScene,
  records: recordsScene,
  timeline: timelineScene,
  barrier: barrierScene,
  letter: letterScene,
  response: responseScene,
  reply: replyScene
};

/* --------------------------------------------------------------------------
   RESPONSIVE VIEWPORT & CANVAS BACKGROUND
   -------------------------------------------------------------------------- */
function setupAppHeight() {
  const height = window.visualViewport?.height || window.innerHeight;
  document.documentElement.style.setProperty("--app-height", `${Math.round(height)}px`);
}

function setupAmbientCanvas() {
  const canvas = $("#ambientCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let particles = [];

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = Array.from({ length: 26 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.35 + 0.1
    }));
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });

  const render = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#009fe3";
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
      ctx.globalAlpha = p.alpha;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    requestAnimationFrame(render);
  };

  if (!reduceMotion.matches) {
    requestAnimationFrame(render);
  }
}

/* --------------------------------------------------------------------------
   INITIALIZATION LIFECYCLE
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  inputModeTracker.init();
  soundSystem.init();
  transitionForms.init();
  sceneManager.init();
  geometryManager.init();

  Object.values(sceneModules).forEach(mod => {
    if (mod.init) mod.init();
  });

  setupAmbientCanvas();
});