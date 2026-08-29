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
    { phase: "01 / FIRST DETECTION", title: "The first quiet spark", text: "It began as a quiet curiosity—a simple awareness of Maureen that grew with each conversation and slowly became impossible to ignore." },
    { phase: "02 / STABLE SIGNAL", title: "Your presence became familiar", text: "As your presence became familiar, small moments and conversations stayed with me, as if my heart had decided they were worth keeping." },
    { phase: "03 / TRANSMISSION", title: "Ayyash finally sent the signal", text: "Once the feeling became clear, it was no longer just admiration. Ayyash sent this signal because an honest feeling deserves the courage to be spoken." }
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
const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, reduceMotion.matches ? Math.min(ms, 40) : ms));

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
/**
 * Scrambles-in `finalText` onto `element`. Returns a Promise that resolves
 * only once the final text has actually been committed to the element,
 * so callers can await full completion of the type-in animation.
 */
function decryptText(element, finalText) {
  if (!element) return Promise.resolve();
  const oldTimer = decryptTimers.get(element);
  if (oldTimer) clearInterval(oldTimer);
  if (reduceMotion.matches) {
    element.textContent = finalText;
    return Promise.resolve();
  }
  const chars = "01AXREI#?+<>/";
  let iteration = 0;
  return new Promise((resolve) => {
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
        resolve();
      }
    }, 20);
    decryptTimers.set(element, timer);
  });
}

/**
 * Resolves once the given font specs are loaded (or `document.fonts.ready`
 * fires), with a safety timeout so a failed Google Fonts load can never
 * lock an interaction forever.
 */
function waitForFonts(fontSpecs, timeoutMs = 2000) {
  let loadPromise;
  try {
    const loaders = (fontSpecs || []).map((spec) => {
      try {
        return document.fonts.load(spec);
      } catch (err) {
        return Promise.resolve();
      }
    });
    loadPromise = Promise.all([document.fonts.ready, ...loaders]).catch(() => {});
  } catch (err) {
    loadPromise = Promise.resolve();
  }
  const timeoutPromise = new Promise((resolve) => window.setTimeout(resolve, timeoutMs));
  return Promise.race([loadPromise, timeoutPromise]);
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

const TRANSITION_CONFIG = {
  initializing: { file: "transition-01-eye-scanner.png", alt: "Eye Scanner", label: "INITIALIZING" },
  calibration: { file: "transition-03-target-locked.png", alt: "Target Locked", label: "CALIBRATION" },
  "emotional-signal": { file: "transition-04-pulse-heart.png", alt: "Pulse Heart", label: "EMOTIONAL SIGNAL" },
  synchronization: { file: "transition-05-dual-node-link.png", alt: "Dual Node Link", label: "SYNCHRONIZATION" },
  decoding: { file: "transition-06-message-packet.png", alt: "Message Packet", label: "DECODING" },
  memory: { file: "transition-07-polaroid-data.png", alt: "Polaroid Data", label: "MEMORY" },
  connection: { file: "transition-08-merge-pulse.png", alt: "Merge Pulse", label: "CONNECTION" },
  question: { file: "transition-09-question-dialogue.png", alt: "Question Dialogue", label: "QUESTION" }
};

const SCENE_TRANSITION_MAP = {
  hero: "initializing",
  connection: "calibration",
  records: "emotional-signal",
  timeline: "synchronization",
  barrier: "decoding",
  letter: "memory",
  response: "question",
  reply: "connection"
};

const transitionForms = {
  container: null,
  init() {
    this.container = $("#bridgeShape");
  },
  render(sceneName) {
    if (this.container) {
      this.container.innerHTML = "";
    }
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
      const semanticId = SCENE_TRANSITION_MAP[nextScene];
      const config = semanticId ? TRANSITION_CONFIG[semanticId] : null;

      let drawMs = 720;   // default or themed draw duration
      let holdMs = 400;   // default or themed hold duration
      let releaseMs = 360; // default or themed release duration

      const transitionImg = $("#transitionAssetImg");
      const transitionSlot = $(".transition-asset-slot");

      if (!config) {
        // Neutral transition: shorter duration, no PNG.
        // Fires only for scenes with no semantic mapping — warn clearly.
        drawMs = 300;
        holdMs = 200;
        releaseMs = 300;

        console.warn(`[TransitionSystem] No semantic ID found for scene: "${nextScene}". Neutral transition used.`);

        // Collapse slot so it takes no space in the stack (no broken-image icon)
        if (transitionSlot) transitionSlot.style.display = "none";
        if (transitionImg) {
          transitionImg.removeAttribute("src");
          transitionImg.removeAttribute("alt");
        }
        if (transitionOverlay) {
          transitionOverlay.className = "chapter-transition is-active is-neutral";
        }
        if (transitionNum) transitionNum.textContent = String(nextIndex).padStart(2, "0");
        if (transitionText) transitionText.textContent = `PHASE ${String(nextIndex).padStart(2, "0")}`;
      } else {
        // Themed transition — restore slot to normal flow, then load PNG
        if (transitionSlot) {
          transitionSlot.style.display = "";   // remove any neutral-path collapse
          transitionSlot.className = "transition-asset-slot";
          transitionSlot.classList.add(`is-${semanticId}`);
        }
        if (transitionImg) {
          transitionImg.src = `assets/transition/${config.file}`;
          transitionImg.alt = config.alt;
          transitionImg.style.display = "";    // let CSS handle it
        }
        if (transitionOverlay) {
          transitionOverlay.className = "chapter-transition is-active";
          transitionOverlay.classList.add(`is-${nextScene}`);
        }
        // Logical phase number (01–08) based on scene order
        if (transitionNum) transitionNum.textContent = String(nextIndex).padStart(2, "0");
        if (transitionText) transitionText.textContent = `PHASE ${String(nextIndex).padStart(2, "0")}`;
      }

      transitionForms.render(nextScene);
      transitionOverlay.dataset.shapeStage = "draw";
      if (transitionBar) transitionBar.style.width = "100%";

      // 2. Object finishes forming and is held
      const holdTimer = window.setTimeout(() => {
        transitionOverlay.dataset.shapeStage = "hold";
      }, drawMs);

      // 3. Swap scenes
      const swapTimer = window.setTimeout(() => {
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

        transitionOverlay.dataset.shapeStage = "release";

        const releaseTimer = window.setTimeout(() => {
          transitionOverlay.classList.remove("is-active");
          transitionOverlay.classList.remove(`is-${nextScene}`);
          transitionOverlay.classList.remove("is-neutral");
          transitionOverlay.dataset.shapeStage = "";
          if (transitionBar) transitionBar.style.width = "0%";
          if (transitionForms.container) transitionForms.container.innerHTML = "";
          // Reset slot and img so the next transition always starts clean
          if (transitionSlot) transitionSlot.style.display = "";
          if (transitionImg) {
            transitionImg.removeAttribute("src");
            transitionImg.removeAttribute("alt");
            transitionImg.style.display = "";
          }
          this.isTransitioning = false;
        }, releaseMs);
        this._activeTimers.push(releaseTimer);
      }, drawMs + holdMs);

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
   SCENE MODULE 2: CONNECTION (TUNE) — POLISHED ROTARY FREQUENCY TUNER
   -------------------------------------------------------------------------- */
const connectionScene = {
  // DOM refs
  dial: null,
  needle: null,
  targetArc: null,
  targetDot: null,
  energyFill: null,
  ringSecondary: null,
  rotor: null,
  handle: null,
  scanLine: null,
  dragHint: null,
  syncValEl: null,
  syncMsgEl: null,
  syncStatusEl: null,
  freqEl: null,
  waveBlue: null,
  wavePink: null,
  waveMerged: null,

  // State
  angle: 0,           // current unwrapped display angle (0–360)
  prevAngle: null,    // previous raw atan2 angle for unwrap
  targetAngle: 135,   // degrees (0=top, CW)
  tolerance: 18,
  isTuning: false,
  hintDismissed: false,
  lockTimer: null,
  completed: false,
  rafId: null,

  // Inertia
  velocity: 0,
  lastAngle: 0,
  lastTime: 0,

  // Detent / magnetic state
  magneticActive: false,

  // RAF-driven render target
  _renderAngle: 0,

  init() {
    this.dial       = $("#connectionDial");
    this.needle     = $("#connectionNeedle");
    this.targetArc  = $("#connectionTargetArc");
    this.targetDot  = $("#connectionTargetDot");
    this.energyFill = $("#dialEnergyFill");
    this.ringSecondary = $("#dialRingSecondary");
    this.rotor      = $("#dialRotor");
    this.handle     = $("#connectionHandle");
    this.scanLine   = $("#dialScanLine");
    this.dragHint   = this.dial ? this.dial.querySelector(".dial__drag-hint") : null;
    this.syncValEl  = $("#syncValue");
    this.syncMsgEl  = $("#syncMessage");
    this.syncStatusEl = $("#syncStatus");
    this.freqEl     = $("#connectionFrequency");
    this.waveBlue   = $("#connectionWaveBlue path");
    this.wavePink   = $("#connectionWavePink path");
    this.waveMerged = $("#connectionWaveMerged path");

    this.drawTargetArc();
    this.placeTargetDot();
    this.drawTicks();
    this.initEnergyFill();
    this.renderFrame(0);   // kick off RAF loop

    if (!this.dial) return;

    // Pointer events — capture on dial only
    this.dial.addEventListener("pointerdown", (e) => this.onStart(e));
    this.dial.addEventListener("pointermove", (e) => this.onMove(e));
    this.dial.addEventListener("pointerup",   (e) => this.onEnd(e));
    this.dial.addEventListener("pointercancel",(e) => this.onEnd(e));
    this.dial.addEventListener("lostpointercapture", (e) => this.onEnd(e));

    // Wheel on dial only (prevents page scroll hijacking)
    this.dial.addEventListener("wheel", (e) => {
      e.preventDefault();
      this.dismissHint();
      const step = e.shiftKey ? 15 : 6;
      this.setAngle(this.angle + (e.deltaY > 0 ? step : -step));
    }, { passive: false });

    // Keyboard
    this.dial.addEventListener("keydown", (e) => {
      if (this.completed) return;
      let delta = 0;
      if (e.key === "ArrowRight" || e.key === "ArrowUp")   delta =  (e.shiftKey ? 15 : 4);
      if (e.key === "ArrowLeft"  || e.key === "ArrowDown") delta = -(e.shiftKey ? 15 : 4);
      if (e.key === "Home") { this.setAngle(0); return; }
      if (e.key === "End")  { this.setAngle(360); return; }
      if (delta) { this.dismissHint(); this.setAngle(this.angle + delta); }
    });

    // ARIA slider attributes
    this.dial.setAttribute("aria-valuemin", "0");
    this.dial.setAttribute("aria-valuemax", "360");
    this.dial.setAttribute("aria-valuenow", "0");
    this.dial.setAttribute("aria-valuetext", "0 degrees");
  },

  /* ---- Geometry builders ---- */

  drawTicks() {
    const g = $("#connectionTickmarks");
    if (!g) return;
    g.innerHTML = "";
    const cx = 100, cy = 100;
    const r1 = 92, r2minor = 87, r2major = 84;
    for (let i = 0; i < 72; i++) {
      const deg = i * 5;
      const rad = (deg - 90) * (Math.PI / 180);
      const isMajor = i % 6 === 0;
      const r2 = isMajor ? r2major : r2minor;
      const x1 = cx + r1 * Math.cos(rad);
      const y1 = cy + r1 * Math.sin(rad);
      const x2 = cx + r2 * Math.cos(rad);
      const y2 = cy + r2 * Math.sin(rad);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1.toFixed(2));
      line.setAttribute("y1", y1.toFixed(2));
      line.setAttribute("x2", x2.toFixed(2));
      line.setAttribute("y2", y2.toFixed(2));
      if (isMajor) line.classList.add("major");
      g.appendChild(line);
    }
  },

  initEnergyFill() {
    if (!this.energyFill) return;
    const r = 78;
    const circ = 2 * Math.PI * r;
    this.energyFill.style.strokeDasharray = `${circ.toFixed(2)}`;
    this.energyFill.style.strokeDashoffset = `${circ.toFixed(2)}`;
    this.energyFill.setAttribute("transform", "rotate(-90 100 100)");
  },

  drawTargetArc() {
    if (!this.targetArc) return;
    const cx = 100, cy = 100, r = 70;
    const startDeg = this.targetAngle - this.tolerance;
    const endDeg   = this.targetAngle + this.tolerance;
    const s = (startDeg - 90) * (Math.PI / 180);
    const e = (endDeg   - 90) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    this.targetArc.setAttribute("d", `M ${x1.toFixed(2)},${y1.toFixed(2)} A ${r},${r} 0 0,1 ${x2.toFixed(2)},${y2.toFixed(2)}`);
  },

  placeTargetDot() {
    if (!this.targetDot) return;
    const cx = 100, cy = 100, r = 78;
    const rad = (this.targetAngle - 90) * (Math.PI / 180);
    const x = cx + r * Math.cos(rad);
    const y = cy + r * Math.sin(rad);
    this.targetDot.setAttribute("cx", x.toFixed(2));
    this.targetDot.setAttribute("cy", y.toFixed(2));
  },

  recalculateGeometry() {
    this.drawTargetArc();
    this.placeTargetDot();
  },

  /* ---- Pointer handlers ---- */

  onStart(e) {
    if (this.completed) return;
    this.isTuning = true;
    this.prevAngle = null; // reset unwrap
    this.dial.classList.add("is-tuning");
    this.dial.setPointerCapture(e.pointerId);
    this.dismissHint();
    // Init velocity tracking
    const raw = this._rawAngle(e);
    this.lastAngle = raw;
    this.lastTime  = performance.now();
    this.velocity  = 0;
    this._moveFrom(e);
    hintController.notifyProgress();
  },

  onMove(e) {
    if (!this.isTuning || this.completed) return;
    this._moveFrom(e);
  },

  onEnd(e) {
    if (!this.isTuning) return;
    this.isTuning = false;
    this.dial.classList.remove("is-tuning");
    // Release pointer capture
    try { this.dial.releasePointerCapture(e.pointerId); } catch(_) {}
    // Apply slight inertia
    this._startInertia();
  },

  _rawAngle(e) {
    const rect = this.dial.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    let deg = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI) + 90;
    if (deg < 0) deg += 360;
    return deg;
  },

  _moveFrom(e) {
    const raw = this._rawAngle(e);
    const now = performance.now();

    // Angle unwrapping: prevent jumps across 0/360
    let newAngle = this.angle;
    if (this.prevAngle !== null) {
      let delta = raw - this.prevAngle;
      if (delta >  180) delta -= 360;
      if (delta < -180) delta += 360;
      newAngle = this.angle + delta;
    } else {
      newAngle = raw;
    }
    this.prevAngle = raw;

    // Track velocity (deg/ms)
    const dt = now - this.lastTime;
    if (dt > 0) {
      let velDelta = newAngle - this.lastAngle;
      this.velocity = velDelta / dt;
    }
    this.lastAngle = newAngle;
    this.lastTime  = now;

    this.setAngle(newAngle);
  },

  _startInertia() {
    if (reduceMotion.matches || Math.abs(this.velocity) < 0.05) return;
    const inertiaStart = performance.now();
    const startVel = this.velocity;
    const startAngle = this.angle;
    const damping = 0.92; // per-frame damping factor

    const tick = (now) => {
      if (this.isTuning || this.completed) return;
      const elapsed = now - inertiaStart;
      const frames  = elapsed / 16.67; // ~60fps frames elapsed
      const vel     = startVel * Math.pow(damping, frames);
      const newAngle = this.angle + vel * 16.67;
      this.setAngle(newAngle);
      if (Math.abs(vel) > 0.02) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  },

  /* ---- Core angle update ---- */

  setAngle(deg) {
    // Normalize to 0..360
    let a = ((deg % 360) + 360) % 360;

    // Compute error
    const diff = Math.abs(a - this.targetAngle);
    const error = Math.min(180, diff > 180 ? 360 - diff : diff);

    // Gentle magnetic pull when within 2× tolerance
    if (!this.completed && error < this.tolerance * 2) {
      const pull = (1 - error / (this.tolerance * 2)) * 0.08;
      a = a + (this.targetAngle - a) * pull;
      a = ((a % 360) + 360) % 360;
    }

    // Soft detent at target (within tolerance)
    if (!this.completed && error < this.tolerance) {
      const detentStrength = (1 - error / this.tolerance) * 0.18;
      a = a + (this.targetAngle - a) * detentStrength;
      a = ((a % 360) + 360) % 360;
    }

    this.angle = a;
    this._renderAngle = a;
    this.updateVisuals(a, error);
  },

  /* ---- Visual updates (RAF-driven) ---- */

  renderFrame(ts) {
    if (!this.completed) {
      this.rafId = requestAnimationFrame((t) => this.renderFrame(t));
    }
    // Visual rotation elements — driven by current angle
    const a = this._renderAngle;
    if (this.needle)       this.needle.style.transform        = `rotate(${a}deg)`;
    if (this.ringSecondary) this.ringSecondary.style.transform = `rotate(${(-0.35 * a).toFixed(2)}deg)`;
    if (this.rotor)        this.rotor.style.transform         = `rotate(${a.toFixed(2)}deg)`;
    if (this.handle)       this.handle.style.transform        = `rotate(${(0.55 * a).toFixed(2)}deg)`;
  },

  updateVisuals(angle, error) {
    const stability = Math.max(0, Math.round(100 - (error / this.tolerance) * 100));
    const pct = Math.max(0, Math.min(100, stability));

    // ARIA
    if (this.dial) {
      this.dial.setAttribute("aria-valuenow",   String(Math.round(angle)));
      this.dial.setAttribute("aria-valuetext",  `${Math.round(angle)} degrees, ${pct}% signal stability`);
    }

    // Sync panel CSS vars
    const syncPanel = $("#syncPanel");
    if (syncPanel) {
      syncPanel.style.setProperty("--frequency-error",   String(error));
      syncPanel.style.setProperty("--signal-stability",  String(pct));
    }

    // Readout %
    if (this.syncValEl) this.syncValEl.textContent = String(pct).padStart(2, "0");

    // Frequency display
    const freq = (100 + angle * 0.3).toFixed(2);
    if (this.freqEl) this.freqEl.textContent = `${freq} MHz`;

    // Energy fill arc
    if (this.energyFill) {
      const r    = 78;
      const circ = 2 * Math.PI * r;
      const fill = circ * (pct / 100);
      this.energyFill.style.strokeDashoffset = (circ - fill).toFixed(2);
    }

    // Waveforms: cyan and pink converge as stability rises
    if (this.waveBlue && this.wavePink && this.waveMerged) {
      const t    = pct / 100;          // 0 → 1
      const amp  = 22 * (1 - t);       // amplitude shrinks to 0 at lock
      const pAmp = 22 * (1 - t);       // pink amplitude also shrinks
      const bluePath = `M 0,30 Q 75,${(30 - amp).toFixed(1)} 150,30 Q 225,${(30 + amp).toFixed(1)} 300,30`;
      const pinkPath = `M 0,30 Q 75,${(30 + pAmp).toFixed(1)} 150,30 Q 225,${(30 - pAmp).toFixed(1)} 300,30`;
      // At 100%, both collapse to flat line
      this.waveBlue.setAttribute("d", bluePath);
      this.wavePink.setAttribute("d", pinkPath);
      this.waveMerged.setAttribute("d", `M 0,30 Q 75,30 150,30 T 300,30`);
    }

    // Status text with 5 states
    let statusText;
    if (pct === 0)         statusText = "STANDBY";
    else if (pct < 25)     statusText = "SEARCHING";
    else if (pct < 60)     statusText = "SIGNAL DETECTED";
    else if (pct < 100)    statusText = "FINE TUNING";
    else                   statusText = "FREQUENCY LOCKED";

    if (this.syncStatusEl) this.syncStatusEl.textContent = statusText;

    // Message
    if (this.syncMsgEl && !this.completed) {
      if (pct < 25)        this.syncMsgEl.textContent = "Rotate the dial to align the two waveforms.";
      else if (pct < 60)   this.syncMsgEl.textContent = "Signal detected. Keep tuning for a stable lock.";
      else if (pct < 100)  this.syncMsgEl.textContent = "Fine tuning... hold steady near the target.";
      else                 this.syncMsgEl.textContent = "Frequency locked. Stabilizing connection…";
    }

    // Lock state
    if (error <= this.tolerance) {
      if (this.dial) this.dial.classList.add("is-matched");
      if (!this.lockTimer && !this.completed) {
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

  dismissHint() {
    if (this.hintDismissed || !this.dragHint) return;
    this.hintDismissed = true;
    this.dragHint.classList.add("is-hidden");
  },

  /* ---- Completion ---- */

  complete() {
    if (this.completed) return;
    this.completed = true;
    this.isTuning  = false;

    // Stop RAF loop
    if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; }

    const syncPanel = $("#syncPanel");
    if (syncPanel) syncPanel.classList.add("is-complete");
    if (this.syncMsgEl) this.syncMsgEl.textContent = siteConfig.syncMessage;
    if (this.syncStatusEl) this.syncStatusEl.textContent = "FREQUENCY LOCKED";

    soundSystem.playInterface();
    announce(siteConfig.syncMessage);

    window.setTimeout(() => {
      sceneManager.advanceTo("records");
    }, 850);
  },

  /* ---- Lifecycle ---- */

  enter() {
    this.recalculateGeometry();
    // Re-kick RAF loop if returning to scene
    if (!this.completed && !this.rafId) {
      this.rafId = requestAnimationFrame((t) => this.renderFrame(t));
    }
  },

  exit() {
    this.isTuning = false;
    if (this.lockTimer) clearTimeout(this.lockTimer);
    if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; }
  },

  reset() {
    this.completed        = false;
    this.isTuning         = false;
    this.hintDismissed    = false;
    this.angle            = 0;
    this._renderAngle     = 0;
    this.velocity         = 0;
    this.prevAngle        = null;
    if (this.lockTimer) { clearTimeout(this.lockTimer); this.lockTimer = null; }
    // Reset hint
    if (this.dragHint) this.dragHint.classList.remove("is-hidden");
    // Reset state
    const syncPanel = $("#syncPanel");
    if (syncPanel) syncPanel.classList.remove("is-complete");
    if (this.dial)  this.dial.classList.remove("is-matched", "is-tuning");
    this.setAngle(0);
    // Re-kick RAF
    if (!this.rafId) this.rafId = requestAnimationFrame((t) => this.renderFrame(t));
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 3: RECORDS (SEARCH) â€” NORMALIZED COORDINATE PLANE
   -------------------------------------------------------------------------- */
const recordsScene = {
  radar: null,
  plane: null,
  lens: null,
  progressPathEl: null,
  echoes: [],
  recovered: new Set(),

  // Fixed zigzag waypoints (percent-of-radar space). Index 0 is the
  // permanent start; the rest line up 1:1 with the five checkpoints, the
  // SVG path, and the recordConstellation geometry.
  START: { x: 50, y: 50 },
  coords: [
    { x: 25, y: 35 },
    { x: 45, y: 70 },
    { x: 60, y: 30 },
    { x: 75, y: 65 },
    { x: 85, y: 40 }
  ],

  currentIndex: 0,               // which record is displayed in the card
  currentTargetIndex: 0,         // index (0-4) of the next checkpoint to reach
  currentSegmentProgress: 0,     // 0..1 progress along the active segment
  isDragging: false,
  isCheckpointLoading: false,
  activePointerId: null,
  lastPointerX: 0,
  lastPointerY: 0,
  lensX: 50,
  lensY: 50,
  rafId: null,
  needsPaint: false,
  resetToken: 0, // bumped on reset() so stale async checkpoint callbacks bail out

  get points() {
    return [this.START, ...this.coords];
  },

  init() {
    this.radar = $("#recordRadar");
    this.plane = $("#radarPlane");
    this.lens = $("#recordLens");
    this.progressPathEl = $("#recordConstellationProgress");
    this.echoes = $$(".radar__echo");

    if (this.lens) {
      this.lens.addEventListener("pointerdown", (e) => this.onPointerDown(e));
      this.lens.addEventListener("pointermove", (e) => this.onPointerMove(e));
      this.lens.addEventListener("pointerup", (e) => this.onPointerEnd(e));
      this.lens.addEventListener("pointercancel", (e) => this.onPointerEnd(e));
      this.lens.addEventListener("lostpointercapture", (e) => this.onPointerEnd(e));
    }

    this.echoes.forEach((echo) => {
      echo.addEventListener("click", () => {
        const idx = parseInt(echo.dataset.recordIndex, 10);
        this.onEchoClick(idx);
      });
    });

    const continueBtn = $("#recordArchiveContinue");
    if (continueBtn) {
      continueBtn.addEventListener("click", () => {
        sceneManager.advanceTo("timeline");
      });
    }

    this.positionEchoes();
    this.paint();
  },

  positionEchoes() {
    this.echoes.forEach((echo, idx) => {
      const pt = this.coords[idx] || { x: 50, y: 50 };
      echo.style.left = `${pt.x}%`;
      echo.style.top = `${pt.y}%`;
    });
  },

  // Percent coordinates keep the SVG path, checkpoints and lens aligned
  // across viewport sizes; re-run positioning + repaint on resize/rotate.
  recalculateGeometry() {
    this.positionEchoes();
    this.paint();
  },

  toSvg(pt) {
    // recordRadarField viewBox is 300x200 — same normalized plane as the
    // 0-100 percent coordinates used everywhere else.
    return { x: (pt.x / 100) * 300, y: (pt.y / 100) * 200 };
  },

  currentLensPercent() {
    const start = this.points[this.currentTargetIndex];
    const end = this.points[this.currentTargetIndex + 1] || start;
    const t = this.currentSegmentProgress;
    return {
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t
    };
  },

  onPointerDown(e) {
    if (this.isCheckpointLoading || this.currentTargetIndex >= this.coords.length) return;
    this.isDragging = true;
    this.activePointerId = e.pointerId;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    try { this.lens.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    hintController.notifyProgress();
    e.preventDefault();
  },

  onPointerMove(e) {
    if (!this.isDragging || e.pointerId !== this.activePointerId) return;
    if (this.isCheckpointLoading || !this.radar) return;

    const rect = this.radar.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dxPercent = ((e.clientX - this.lastPointerX) / rect.width) * 100;
    const dyPercent = ((e.clientY - this.lastPointerY) / rect.height) * 100;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;

    const start = this.points[this.currentTargetIndex];
    const end = this.points[this.currentTargetIndex + 1];
    if (!start || !end) return;

    const segX = end.x - start.x;
    const segY = end.y - start.y;
    const segLen = Math.hypot(segX, segY) || 1;
    const unitX = segX / segLen;
    const unitY = segY / segLen;

    // Project the pointer delta onto the segment direction so sideways
    // drag is ignored — only along-the-path movement advances progress.
    const projected = dxPercent * unitX + dyPercent * unitY;
    const progressDelta = projected / segLen;

    // Small backward drag is allowed within the active segment, but it
    // can never go below 0 (i.e. back past the already-completed checkpoint).
    this.currentSegmentProgress = clamp(this.currentSegmentProgress + progressDelta, 0, 1);
    this.scheduleFrame();

    if (this.currentSegmentProgress >= 1) {
      this.currentSegmentProgress = 1;
      // Stop right at the checkpoint — remaining pointer motion this drag
      // must never carry over into the next segment.
      this.endDrag();
      this.checkProximity();
    }
  },

  onPointerEnd(e) {
    if (e && e.pointerId !== undefined && e.pointerId !== this.activePointerId) return;
    this.endDrag();
  },

  endDrag() {
    if (this.activePointerId !== null && this.lens) {
      try { this.lens.releasePointerCapture(this.activePointerId); } catch (err) { /* ignore */ }
    }
    this.isDragging = false;
    this.activePointerId = null;
  },

  scheduleFrame() {
    if (this.needsPaint) return;
    this.needsPaint = true;
    this.rafId = window.requestAnimationFrame(() => {
      this.needsPaint = false;
      this.paint();
    });
  },

  // Keeps the lens and the progress route moving together every frame.
  paint() {
    const p = this.currentLensPercent();
    this.lensX = p.x;
    this.lensY = p.y;

    if (this.lens) {
      this.lens.style.left = `${this.lensX}%`;
      this.lens.style.top = `${this.lensY}%`;
    }

    this.paintProgressPath();
  },

  paintProgressPath() {
    if (!this.progressPathEl) return;
    const pts = this.points.slice(0, this.currentTargetIndex + 1).map((pt) => this.toSvg(pt));
    pts.push(this.toSvg(this.currentLensPercent()));
    const d = pts.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x},${pt.y}`).join(" ");
    this.progressPathEl.setAttribute("d", d);
  },

  // Only ever checks the single next checkpoint in the required sequence —
  // future checkpoints can never be reached, skipped to, or recovered here.
  checkProximity() {
    if (this.isCheckpointLoading) return;
    const idx = this.currentTargetIndex;
    if (idx >= this.coords.length) return;
    if (this.currentSegmentProgress >= 1 && !this.recovered.has(idx)) {
      this.arriveAtCheckpoint(idx);
    }
  },

  onEchoClick(idx) {
    // Future/unreached checkpoints can't be selected, recovered, or skipped
    // to by clicking — they only unlock by dragging the lens along the path.
    if (!this.recovered.has(idx)) return;
    // Re-reading an already-completed checkpoint never touches progress,
    // the active target, or the progress route.
    this.viewRecord(idx);
  },

  async arriveAtCheckpoint(idx) {
    const token = this.resetToken;
    this.isCheckpointLoading = true;
    this.isDragging = false;
    this.currentSegmentProgress = 1;
    this.paint();

    if (this.lens) this.lens.classList.add("is-loading");
    const statusEl = $("#recordStatus");
    if (statusEl) statusEl.textContent = `DECRYPTING RECORD 0${idx + 1}...`;
    announce(`Decrypting record ${idx + 1}.`);

    const rec = siteConfig.records[idx];
    this.currentIndex = idx;
    this.echoes.forEach((e, i) => e.classList.toggle("is-current", i === idx));

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

    // Wait for the type-in animation, the webfonts it renders with, and a
    // minimum checkpoint pause — all three must finish before unlocking.
    const minimumCheckpointDelay = new Promise((resolve) => {
      window.setTimeout(resolve, 700 + Math.random() * 200);
    });
    const fontsReadyPromise = waitForFonts([
      '600 12px "Archivo Black"',
      '400 12px "IBM Plex Mono"',
      '400 12px "Manrope"'
    ]);
    const textReady = textEl ? decryptText(textEl, rec.text) : Promise.resolve();

    await Promise.all([textReady, fontsReadyPromise, minimumCheckpointDelay]);

    // A reset() may have happened while we were awaiting — bail out so a
    // stale callback from a previous session can never open a checkpoint late.
    if (token !== this.resetToken) return;

    this.recovered.add(idx);
    const echo = this.echoes[idx];
    if (echo) {
      echo.classList.add("is-decrypted", "is-found");
      echo.setAttribute("aria-disabled", "false");
    }
    soundSystem.playInterface();

    const countEl = $("#recordArchiveCount");
    if (countEl) countEl.textContent = `${this.recovered.size} / 5`;

    if (this.lens) this.lens.classList.remove("is-loading");
    if (statusEl) statusEl.textContent = `RECORD 0${idx + 1} DECRYPTED`;
    announce(`Record ${idx + 1} decrypted.`);

    this.isCheckpointLoading = false;
    this.currentTargetIndex = idx + 1;
    this.currentSegmentProgress = 0;

    const guideText = $("#recordsGuideText");
    if (this.currentTargetIndex < this.coords.length) {
      const nextLabel = String(this.currentTargetIndex + 1).padStart(2, "0");
      if (guideText) guideText.textContent = `DRAG TO CHECKPOINT ${nextLabel}`;
    } else if (guideText) {
      guideText.textContent = "ALL RECORDS RECOVERED";
    }

    if (this.recovered.size === 5) {
      const continueBtn = $("#recordArchiveContinue");
      if (continueBtn) continueBtn.hidden = false;
      announce("All personal records recovered. Ready to proceed to timeline.");
    }

    this.paint();
  },

  // Shows an already-recovered record on the card without moving the lens,
  // changing the active target, or altering the progress route.
  viewRecord(idx) {
    const rec = siteConfig.records[idx];
    if (!rec) return;
    this.currentIndex = idx;
    this.echoes.forEach((e, i) => e.classList.toggle("is-current", i === idx));

    const numEl = $("#recordNumber");
    const codeEl = $("#recordCode");
    const titleEl = $("#recordTitle");
    const textEl = $("#recordText");
    const counterEl = $("#recordCounter");
    const card = $("#recordCard");
    const statusEl = $("#recordStatus");

    if (numEl) numEl.textContent = String(idx + 1).padStart(2, "0");
    if (codeEl) codeEl.textContent = rec.code;
    if (counterEl) counterEl.textContent = `RECORD 0${idx + 1} / 05`;
    if (titleEl) titleEl.textContent = rec.title;
    if (statusEl) statusEl.textContent = `RECORD 0${idx + 1} DECRYPTED`;

    if (card) {
      card.classList.add("is-decrypting");
      window.setTimeout(() => card.classList.remove("is-decrypting"), 500);
    }
    if (textEl) decryptText(textEl, rec.text);
  },

  enter() {
    this.recalculateGeometry();
  },

  exit() {
    this.endDrag();
  },

  reset() {
    // Invalidate any in-flight arriveAtCheckpoint() so its awaited promises
    // can never open a checkpoint after this session has been reset.
    this.resetToken += 1;
    if (this.rafId) window.cancelAnimationFrame(this.rafId);
    this.needsPaint = false;
    this.endDrag();
    this.isCheckpointLoading = false;
    this.recovered.clear();
    this.currentTargetIndex = 0;
    this.currentSegmentProgress = 0;
    this.currentIndex = 0;

    this.echoes.forEach((e) => {
      e.classList.remove("is-found", "is-current", "is-decrypted", "is-loading");
      e.setAttribute("aria-disabled", "true");
    });
    if (this.lens) this.lens.classList.remove("is-loading");

    const continueBtn = $("#recordArchiveContinue");
    if (continueBtn) continueBtn.hidden = true;
    const countEl = $("#recordArchiveCount");
    if (countEl) countEl.textContent = "0 / 5";
    const statusEl = $("#recordStatus");
    if (statusEl) statusEl.textContent = "PERSONAL RECORD READY";
    const guideText = $("#recordsGuideText");
    if (guideText) guideText.textContent = "DRAG THE LENS ALONG THE PATH TO CHECKPOINT 01";
    const titleEl = $("#recordTitle");
    if (titleEl) titleEl.textContent = "Record title";
    const textEl = $("#recordText");
    if (textEl) textEl.textContent = "";
    const numEl = $("#recordNumber");
    if (numEl) numEl.textContent = "01";
    const codeEl = $("#recordCode");
    if (codeEl) codeEl.textContent = siteConfig.records[0] ? siteConfig.records[0].code : "";
    const counterEl = $("#recordCounter");
    if (counterEl) counterEl.textContent = "RECORD 01 / 05";

    this.paint();
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 4: TIMELINE (TRAVEL) â€” REAL CHECKPOINT MEASUREMENTS
   -------------------------------------------------------------------------- */
const timelineScene = {
  scrollRoot: null,
  scrollRegion: null,
  cards: [],
  progressPath: null,
  continueBtn: null,
  currentMilestone: -1,
  observer: null,
  scrollListenerAttached: false,
  finalRevealed: false,
  rafId: null,

  init() {
    this.scrollRoot = $(".scene--timeline");
    this.scrollRegion = $("#timelineScrollRegion");
    this.cards = $$(".timeline-card");
    this.progressPath = $("#timelineProgressPath");
    this.continueBtn = $("#timelineFinalContinue");

    if (this.scrollRoot && !this.scrollListenerAttached) {
      this.scrollRoot.addEventListener("scroll", () => this.queueScroll(), { passive: true });
      this.scrollListenerAttached = true;
    }

    if (this.continueBtn) {
      this.continueBtn.addEventListener("click", () => {
        sceneManager.advanceTo("barrier");
      });
    }

    // Set up IntersectionObserver to detect active cards
    if (this.cards.length > 0) {
      const observerOptions = {
        root: this.scrollRoot,
        rootMargin: "-25% 0px -25% 0px",
        threshold: 0.1
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.timelineIndex, 10);
            if (!isNaN(idx)) {
              this.applyMilestone(idx);
            }
          }
        });
      }, observerOptions);

      this.cards.forEach((card) => {
        this.observer.observe(card);
        // Let clicking on a card scroll it smoothly into view
        card.addEventListener("click", () => {
          card.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "center" });
        });
      });
    }
  },

  recalculateGeometry() {
    this.paintProgress();
  },

  paintProgress() {
    if (!this.scrollRoot) return;
    const maxScroll = this.scrollRoot.scrollHeight - this.scrollRoot.clientHeight;
    const ratio = maxScroll > 0 ? clamp(this.scrollRoot.scrollTop / maxScroll, 0, 1) : 0;

    if (this.progressPath) {
      // Just update the Y2 of the line directly to represent percentage filled
      this.progressPath.setAttribute("y2", `${(ratio * 100).toFixed(1)}%`);
    }
  },

  queueScroll() {
    if (this.rafId) return;
    this.rafId = window.requestAnimationFrame(() => {
      this.rafId = null;
      this.onScroll();
    });
  },

  onScroll() {
    this.paintProgress();
  },

  applyMilestone(idx) {
    if (idx === this.currentMilestone) return;
    this.currentMilestone = idx;

    this.cards.forEach((card, i) => {
      card.classList.toggle("is-active", i === idx);
      card.classList.toggle("is-completed", i < idx);
    });

    const counterEl = $("#timelineCounter");
    if (counterEl) {
      counterEl.textContent = `MILESTONE 0${idx + 1} / 03`;
    }

    soundSystem.playInterface();
    announce(`Timeline milestone ${idx + 1} activated.`);

    if (idx === 2) {
      this.revealContinue();
    }
  },

  revealContinue() {
    if (this.finalRevealed || !this.continueBtn) return;
    this.finalRevealed = true;
    this.continueBtn.hidden = false;
    announce("Final transmission unlocked. Continue to proceed.");
  },

  enter() {
    this.currentMilestone = -1;
    this.finalRevealed = false;
    if (this.continueBtn) this.continueBtn.hidden = true;
    if (this.scrollRoot) this.scrollRoot.scrollTop = 0;
    this.paintProgress();
    
    // Reset all cards
    this.cards.forEach((card) => {
      card.classList.remove("is-active", "is-completed");
    });

    // Make sure elements are observed
    if (this.observer) {
      this.cards.forEach((card) => {
        this.observer.unobserve(card);
        this.observer.observe(card);
      });
    }
  },

  exit() {
    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  },

  reset() {
    this.currentMilestone = -1;
    this.finalRevealed = false;
    if (this.scrollRoot) this.scrollRoot.scrollTop = 0;
    if (this.continueBtn) this.continueBtn.hidden = true;
    this.cards.forEach((card) => {
      card.classList.remove("is-active", "is-completed");
    });
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
  trailDots: [],
  pulsePhase: 0,
  windowTarget: 0.5,
  windowTolerance: 0.12,
  completed: false,
  rafId: null,
  lastTime: 0,
  history: [],
  missTimeout: null,
  breachProgress: 1, // 0 to 1 countdown

  init() {
    this.button = $("#barrierButton");
    this.visual = $("#barrierVisual");
    this.numberEl = $("#barrierNumber");
    this.barEl = $("#barrierBar");
    this.feedbackEl = $("#barrierFeedback");
    this.pulseDot = $("#barrierPulseDot");
    this.windowArc = $("#barrierWindowArc");

    this.trailDots = [
      $("#barrierPulseDotTrail1"),
      $("#barrierPulseDotTrail2"),
      $("#barrierPulseDotTrail3")
    ];

    this.drawWindowArc();

    if (this.button) {
      this.button.addEventListener("click", () => this.releasePulse());
    }

    if (this.visual) {
      // Tap on visual element also releases the pulse
      this.visual.addEventListener("click", () => this.releasePulse());
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
    const cx = 100, cy = 100, r = 70;
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
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame((ts) => this.loop(ts));
  },

  loop(now) {
    if (this.completed) return;
    this.rafId = requestAnimationFrame((ts) => this.loop(ts));

    // Drive phase update
    const delta = reduceMotion.matches ? 0.016 : Math.min(0.1, (now - this.lastTime) / 1000);
    this.lastTime = now;

    // Pulse speeds around the circle (0.32 cycles per second)
    this.pulsePhase = (this.pulsePhase + delta * 0.32) % 1;

    // Record phase history for trail dots
    this.history.unshift(this.pulsePhase);
    if (this.history.length > 20) {
      this.history.pop();
    }

    // Move main pulse
    this.updateDotPosition(this.pulseDot, this.pulsePhase);

    // Move trails
    this.trailDots.forEach((trail, i) => {
      if (trail) {
        const histIndex = (i + 1) * 3;
        const phase = this.history[histIndex] ?? this.pulsePhase;
        this.updateDotPosition(trail, phase);
      }
    });

    // Determine current feedback based on visible alignment
    let diff = Math.abs(this.pulsePhase - this.windowTarget);
    if (diff > 0.5) diff = 1 - diff;

    if (!this.missTimeout) {
      if (diff <= this.windowTolerance) {
        if (this.feedbackEl) {
          this.feedbackEl.textContent = "READY / RELEASE NOW";
          this.feedbackEl.style.color = "var(--green)";
        }
      } else if (diff <= this.windowTolerance * 2.2) {
        if (this.feedbackEl) {
          this.feedbackEl.textContent = "NEAR / RESONANCE DETECTED";
          this.feedbackEl.style.color = "var(--sky-3)";
        }
      } else {
        if (this.feedbackEl) {
          this.feedbackEl.textContent = "SEARCHING / FIELD STABLE";
          this.feedbackEl.style.color = "var(--ink-soft)";
        }
      }
    }
  },

  updateDotPosition(el, phase) {
    if (!el) return;
    const cx = 100, cy = 100, r = 70;
    const rad = (phase * 2 * Math.PI) - Math.PI / 2;
    const x = cx + r * Math.cos(rad);
    const y = cy + r * Math.sin(rad);
    el.setAttribute("cx", x.toFixed(2));
    el.setAttribute("cy", y.toFixed(2));
  },

  releasePulse() {
    if (this.completed) return;
    hintController.notifyProgress();
    soundSystem.playInterface();

    let diff = Math.abs(this.pulsePhase - this.windowTarget);
    if (diff > 0.5) diff = 1 - diff;

    if (diff <= this.windowTolerance) {
      this.complete();
    } else {
      // Missed timing
      if (this.missTimeout) clearTimeout(this.missTimeout);

      if (this.feedbackEl) {
        this.feedbackEl.style.color = "var(--red)";
        if (diff <= this.windowTolerance * 2.2) {
          this.feedbackEl.textContent = "NEAR MISS / ADJUST FOCUS";
        } else {
          this.feedbackEl.textContent = "MISS / TIMING DESYNCHRONIZED";
        }
      }

      // Add a quick temporary red flash to the visual field
      if (this.visual) {
        this.visual.style.boxShadow = "0 0 20px rgba(255, 51, 95, 0.4)";
        setTimeout(() => {
          if (this.visual) this.visual.style.boxShadow = "";
        }, 300);
      }

      this.missTimeout = setTimeout(() => {
        this.missTimeout = null;
      }, 1000);
    }
  },

  complete() {
    if (this.completed) return;
    this.completed = true;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.feedbackEl) {
      this.feedbackEl.textContent = "LOCKED / RESONANCE ALIGNED";
      this.feedbackEl.style.color = "var(--green)";
    }
    if (this.visual) this.visual.classList.add("is-open");

    // Unified transition countdown in RAF
    this.breachProgress = 1;
    this.lastTime = performance.now();
    requestAnimationFrame((ts) => this.breachLoop(ts));
  },

  breachLoop(now) {
    const elapsed = (now - this.lastTime) / 1000;
    this.lastTime = now;

    // Countdown over 1.2 seconds
    this.breachProgress = Math.max(0, this.breachProgress - elapsed / 1.2);
    const val = Math.round(this.breachProgress * 100);

    if (this.numberEl) this.numberEl.textContent = String(val);
    if (this.barEl) this.barEl.style.width = `${val}%`;

    if (this.breachProgress > 0) {
      requestAnimationFrame((ts) => this.breachLoop(ts));
    } else {
      announce("Emotional barrier opened. Sincere message ready.");
      setTimeout(() => {
        sceneManager.advanceTo("letter");
      }, 650);
    }
  },

  enter() {
    this.recalculateGeometry();
    this.startLoop();
  },

  exit() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.missTimeout) {
      clearTimeout(this.missTimeout);
      this.missTimeout = null;
    }
  },

  reset() {
    this.completed = false;
    this.pulsePhase = 0;
    this.history = [];
    this.breachProgress = 1;
    if (this.missTimeout) {
      clearTimeout(this.missTimeout);
      this.missTimeout = null;
    }
    if (this.visual) this.visual.classList.remove("is-open");
    if (this.numberEl) this.numberEl.textContent = "100";
    if (this.barEl) this.barEl.style.width = "100%";
    if (this.feedbackEl) {
      this.feedbackEl.textContent = "PULSE READY / TIMING CRITICAL";
      this.feedbackEl.style.color = "var(--red)";
    }
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 6: LETTER (RECONSTRUCT) â€” REAL COLLISION & PROGRESSIVE UNLOCK
   -------------------------------------------------------------------------- */
const letterScene = {
  envelope: null,
  container: null,
  messageView: null,
  flowerContainer: null,
  copyEl: null,
  continueBtn: null,
  isOpened: false,
  timers: [],
  flowers: [],

  init() {
    this.envelope = $("#mechaEnvelope");
    this.container = $("#envelopeContainer");
    this.messageView = $("#letterMessageView");
    this.flowerContainer = $("#flowerContainer");
    this.copyEl = $("#letterCopy");
    this.continueBtn = $("#letterContinue");

    if (this.envelope) {
      this.envelope.addEventListener("click", () => this.openEnvelope());
      this.envelope.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.openEnvelope();
        }
      });
    }

    if (this.continueBtn) {
      this.continueBtn.addEventListener("click", () => {
        sceneManager.advanceTo("response");
      });
    }
  },

  openEnvelope() {
    if (this.isOpened) return;
    this.isOpened = true;
    
    soundSystem.playInterface();
    if (this.envelope) {
      this.envelope.classList.add("is-open");
      this.envelope.setAttribute("aria-expanded", "true");
    }

    // Sequence: seal activates -> latches retract -> panels shift -> top flap unfolds
    // Wait for envelope animation, then spawn flowers
    this.addTimer(() => {
      this.spawnFlowers();
    }, 800);
  },

  spawnFlowers() {
    soundSystem.playInterface();
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const numSmall = isReduced ? 10 : 40;
    const numLarge = isReduced ? 3 : 8;
    
    const rect = this.envelope.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    
    // Spawn small flowers
    for(let i = 0; i < numSmall; i++) {
      this.createFlower(startX, startY, false, i);
    }
    // Spawn large foreground flowers
    for(let i = 0; i < numLarge; i++) {
      this.createFlower(startX, startY, true, i);
    }

    // After flowers cover the screen, show message
    this.addTimer(() => {
      if (this.container) {
        this.container.style.opacity = "0";
        this.container.style.transform = "scale(0.9)";
        this.container.style.pointerEvents = "none";
      }
      this.showMessage();
      this.fadeFlowers();
    }, 2500);
  },

  createFlower(x, y, isLarge, index) {
    const fl = document.createElement("img");
    fl.src = "assets/forget-me-not.png";
    fl.className = "flower-particle";
    fl.alt = "";
    
    const size = isLarge ? 150 + Math.random() * 150 : 20 + Math.random() * 40;
    fl.style.width = size + "px";
    
    const angle = Math.random() * Math.PI * 2;
    const dist = isLarge ? (Math.random() * window.innerWidth * 0.4) : (Math.random() * window.innerWidth * 0.8);
    
    const destX = (window.innerWidth / 2) + Math.cos(angle) * dist - size/2;
    const destY = (window.innerHeight / 2) + Math.sin(angle) * dist - size/2;
    
    const rot = Math.random() * 360;
    const delay = index * 30;
    
    if (isLarge) {
      fl.style.filter = "blur(" + (Math.random() * 3 + 1) + "px)";
      fl.style.zIndex = 6;
    } else {
      fl.style.zIndex = 4;
    }

    fl.style.left = (x - size/2) + "px";
    fl.style.top = (y - size/2) + "px";
    fl.style.transform = "scale(0) rotate(0deg)";
    fl.style.opacity = "0";
    
    this.flowerContainer.appendChild(fl);
    this.flowers.push(fl);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = isReduced ? 0 : (1000 + Math.random() * 1000);

    this.addTimer(() => {
      fl.style.transition = `transform ${duration}ms cubic-bezier(0.25, 1, 0.5, 1), opacity ${duration}ms linear`;
      fl.style.transform = `translate(${destX - (x - size/2)}px, ${destY - (y - size/2)}px) scale(1) rotate(${rot}deg)`;
      fl.style.opacity = isLarge ? "0.85" : "0.7";
    }, delay);
  },

  fadeFlowers() {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fadeDuration = isReduced ? 0 : 2000;
    
    this.addTimer(() => {
      this.flowers.forEach(fl => {
        fl.style.transition = `opacity ${fadeDuration}ms linear, transform ${fadeDuration}ms linear`;
        fl.style.opacity = "0";
        fl.style.transform += " translateY(50px) rotate(20deg)";
      });
    }, 1000);
  },

  showMessage() {
    this.messageView.hidden = false;
    this.messageView.classList.add("is-visible");
    
    if (this.copyEl) {
      this.copyEl.innerHTML = "";
      siteConfig.letter.forEach((text, idx) => {
        const p = document.createElement("p");
        this.copyEl.appendChild(p);
        this.addTimer(() => {
          p.classList.add("is-visible");
          decryptText(p, text);
        }, idx * 1000);
      });
    }
  },

  addTimer(fn, delay) {
    const id = setTimeout(fn, delay);
    this.timers.push(id);
    return id;
  },

  clearTimers() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  },

  enter() {
    this.reset();
  },

  exit() {
    this.clearTimers();
  },

  reset() {
    this.clearTimers();
    this.isOpened = false;
    if (this.envelope) {
      this.envelope.classList.remove("is-open");
      this.envelope.setAttribute("aria-expanded", "false");
    }
    if (this.container) {
      this.container.style.opacity = "1";
      this.container.style.transform = "none";
      this.container.style.pointerEvents = "auto";
    }
    if (this.messageView) {
      this.messageView.hidden = true;
      this.messageView.classList.remove("is-visible");
    }
    if (this.copyEl) {
      this.copyEl.innerHTML = "";
    }
    if (this.flowerContainer) {
      this.flowerContainer.innerHTML = "";
    }
    this.flowers = [];
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