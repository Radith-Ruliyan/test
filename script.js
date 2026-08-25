/* ==========================================================================
   AYYASH -> MAUREEN // PRIVATE EMOTIONAL SIGNAL INSTRUMENT
   Interaction Architecture, Mechanics & State Controller (AI #3)
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
    this.activeGuide.dataset.hintLevel = "1";
    this.updateInstruction();

    const replayBtn = this.activeGuide.querySelector("[data-hint-replay]");
    if (replayBtn) {
      replayBtn.onclick = () => {
        this.level = 2;
        this.activeGuide.dataset.hintLevel = "2";
      };
    }

    // Schedule progressive levels on idle
    this.timers.push(window.setTimeout(() => this.setLevel(2), 3200));
    this.timers.push(window.setTimeout(() => this.setLevel(3), 7500));
    this.timers.push(window.setTimeout(() => this.setLevel(4), 12500));
  },

  setLevel(lvl) {
    if (!this.activeGuide) return;
    this.level = Math.max(this.level, lvl);
    this.activeGuide.dataset.hintLevel = String(this.level);
  },

  notifyProgress() {
    if (!this.activeGuide) return;
    this.activeGuide.style.opacity = "0.35";
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
      this.activeGuide.style.opacity = "";
      this.activeGuide = null;
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

  init() {
    this.createPips();
    this.updateChrome("boot");
    setupAppHeight();
  },

  createPips() {
    const container = $("#chapterPips");
    if (!container) return;
    container.innerHTML = "";
    // Chapters 1 to 8 (boot is 0)
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

      transitionOverlay.classList.add("is-active", `is-${nextScene}`);
      if (transitionBar) transitionBar.style.width = "100%";

      window.setTimeout(() => {
        if (currentEl) {
          currentEl.classList.remove("is-active");
          currentEl.setAttribute("aria-hidden", "true");
        }
        if (nextEl) {
          nextEl.classList.add("is-active");
          nextEl.setAttribute("aria-hidden", "false");
        }

        this.currentScene = nextScene;
        this.updateChrome(nextScene);

        const nextModule = sceneModules[nextScene];
        if (nextModule?.enter) nextModule.enter();
        hintController.attach(nextEl);

        window.setTimeout(() => {
          transitionOverlay.classList.remove("is-active", `is-${nextScene}`);
          if (transitionBar) transitionBar.style.width = "0%";
          this.isTransitioning = false;
        }, 350);
      }, 700);
    } else {
      if (currentEl) {
        currentEl.classList.remove("is-active");
        currentEl.setAttribute("aria-hidden", "true");
      }
      if (nextEl) {
        nextEl.classList.add("is-active");
        nextEl.setAttribute("aria-hidden", "false");
      }
      this.currentScene = nextScene;
      this.updateChrome(nextScene);

      const nextModule = sceneModules[nextScene];
      if (nextModule?.enter) nextModule.enter();
      hintController.attach(nextEl);
      this.isTransitioning = false;
    }
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 0: BOOT (CRITICAL FINGERPRINT SCANNER PRESERVED)
   -------------------------------------------------------------------------- */
const bootScene = {
  enterButton: null,
  bootBar: null,
  bootPercent: null,
  bootLog: null,
  holdTimer: null,
  progress: 0,

  init() {
    this.enterButton = $("#enterButton");
    this.bootBar = $("#bootBar");
    this.bootPercent = $("#bootPercent");
    this.bootLog = $("#bootLog");

    let calib = 0;
    const interval = setInterval(() => {
      calib += 10;
      if (this.bootBar) this.bootBar.style.width = `${calib}%`;
      if (this.bootPercent) this.bootPercent.textContent = String(calib).padStart(2, "0");
      if (calib >= 100) {
        clearInterval(interval);
        if (this.bootLog) this.bootLog.textContent = "AUTHENTICATION REQUIRED / PLACE FINGERPRINT";
        if (this.enterButton) this.enterButton.disabled = false;
      }
    }, 45);

    this.setupHold();
  },

  setupHold() {
    if (!this.enterButton) return;
    const btn = this.enterButton;

    const start = () => {
      if (btn.disabled) return;
      btn.classList.add("is-holding");
      soundSystem.playInterface();
      this.holdTimer = setInterval(() => {
        this.progress += 4;
        if (this.bootBar) this.bootBar.style.width = `${this.progress}%`;
        if (this.bootPercent) this.bootPercent.textContent = String(this.progress).padStart(2, "0");

        if (this.progress >= 100) {
          clearInterval(this.holdTimer);
          btn.classList.remove("is-holding");
          btn.disabled = true;
          if (this.bootLog) this.bootLog.textContent = "SIGNAL VERIFIED / ACCESS GRANTED";
          announce("Authentication complete. Entering private signal.");
          window.setTimeout(() => {
            sceneManager.advanceTo("hero");
          }, 450);
        }
      }, 35);
    };

    const end = () => {
      if (this.progress < 100) {
        clearInterval(this.holdTimer);
        this.progress = 0;
        btn.classList.remove("is-holding");
        if (this.bootBar) this.bootBar.style.width = "100%";
        if (this.bootPercent) this.bootPercent.textContent = "100";
      }
    };

    btn.addEventListener("pointerdown", start);
    btn.addEventListener("pointerup", end);
    btn.addEventListener("pointerleave", end);
    btn.addEventListener("pointercancel", end);
  },

  enter() {},
  exit() {
    clearInterval(this.holdTimer);
  },
  reset() {
    this.progress = 0;
    if (this.enterButton) this.enterButton.disabled = false;
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 1: HERO (ATTRACT)
   -------------------------------------------------------------------------- */
const heroScene = {
  handle: null,
  track: null,
  distanceEl: null,
  beamEl: null,
  curvePath: null,
  fieldEl: null,
  isDragging: false,
  dragX: 0,
  maxDrag: 240,
  completed: false,

  init() {
    this.handle = $("#heroSignalHandle");
    this.track = $("#heroSignalTrack");
    this.distanceEl = $("#heroSignalDistance");
    this.beamEl = $("#heroSignalBeam");
    this.curvePath = $("#heroSignalCurvePath");
    this.fieldEl = $("#heroSignalField");

    if (this.handle) {
      this.handle.addEventListener("pointerdown", (e) => this.onPointerDown(e));
      window.addEventListener("pointermove", (e) => this.onPointerMove(e));
      window.addEventListener("pointerup", () => this.onPointerUp());
      window.addEventListener("pointercancel", () => this.onPointerUp());

      this.handle.addEventListener("keydown", (e) => {
        if (this.completed) return;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          this.setDrag(this.dragX + (e.shiftKey ? 30 : 12));
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          this.setDrag(this.dragX - (e.shiftKey ? 30 : 12));
        } else if (e.key === "Enter" || e.key === " ") {
          if (this.dragX >= this.maxDrag * 0.8) {
            this.complete();
          }
        }
      });
    }
  },

  onPointerDown(e) {
    if (this.completed) return;
    this.isDragging = true;
    this.handle.classList.add("is-dragging");
    this.handle.setPointerCapture?.(e.pointerId);
    hintController.notifyProgress();
  },

  onPointerMove(e) {
    if (!this.isDragging || this.completed || !this.track) return;
    const rect = this.track.getBoundingClientRect();
    const x = e.clientX - rect.left - 28;
    this.setDrag(x);
  },

  setDrag(val) {
    if (!this.track) return;
    const trackWidth = this.track.clientWidth - 64;
    this.maxDrag = Math.max(100, trackWidth);
    this.dragX = clamp(val, 0, this.maxDrag);

    const ratio = (this.maxDrag - this.dragX) / this.maxDrag;
    const distValue = Math.round(ratio * 100);

    this.handle.style.setProperty("--drag-x", `${this.dragX}px`);
    if (this.distanceEl) this.distanceEl.textContent = String(distValue);

    if (this.beamEl) {
      this.beamEl.style.width = `${this.dragX}px`;
    }

    if (this.curvePath) {
      const midX = 31 + this.dragX / 2;
      const heightOffset = 31 - Math.sin((this.dragX / this.maxDrag) * Math.PI) * 18;
      this.curvePath.setAttribute("d", `M 31,31 Q ${midX},${heightOffset} ${31 + this.dragX},31`);
    }

    if (this.fieldEl) {
      if (ratio <= 0.25) {
        this.fieldEl.classList.add("is-captured");
      } else {
        this.fieldEl.classList.remove("is-captured");
      }
    }

    if (this.dragX >= this.maxDrag * 0.94) {
      this.complete();
    }
  },

  onPointerUp() {
    this.isDragging = false;
    if (this.handle) this.handle.classList.remove("is-dragging");
  },

  complete() {
    if (this.completed) return;
    this.completed = true;
    this.isDragging = false;
    this.dragX = this.maxDrag;
    this.setDrag(this.maxDrag);

    const alignRoot = $("#heroSignalAlign");
    if (alignRoot) alignRoot.classList.add("is-complete");

    soundSystem.playInterface();
    announce("Signals connected. Stabilizing channel.");

    window.setTimeout(() => {
      sceneManager.advanceTo("connection");
    }, 850);
  },

  enter() {},
  exit() {
    this.isDragging = false;
  },
  reset() {
    this.completed = false;
    this.isDragging = false;
    this.dragX = 0;
    if (this.handle) {
      this.handle.style.setProperty("--drag-x", "0px");
      this.handle.classList.remove("is-dragging");
    }
    const alignRoot = $("#heroSignalAlign");
    if (alignRoot) alignRoot.classList.remove("is-complete");
    if (this.distanceEl) this.distanceEl.textContent = "100";
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 2: CONNECTION (TUNE)
   -------------------------------------------------------------------------- */
const connectionScene = {
  dial: null,
  needle: null,
  syncValEl: null,
  syncMsgEl: null,
  freqEl: null,
  angle: 0,
  targetAngle: 135,
  isTuning: false,
  lockTimer: null,
  completed: false,

  init() {
    this.dial = $("#connectionDial");
    this.needle = $("#connectionNeedle");
    this.syncValEl = $("#syncValue");
    this.syncMsgEl = $("#syncMessage");
    this.freqEl = $("#connectionFrequency");

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

    if (stability >= 94) {
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

  enter() {},
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
   SCENE MODULE 3: RECORDS (SEARCH)
   -------------------------------------------------------------------------- */
const recordsScene = {
  radar: null,
  lens: null,
  echoes: [],
  recovered: new Set(),
  currentIndex: 0,
  lensX: 50,
  lensY: 50,
  isScanning: false,

  init() {
    this.radar = $("#recordRadar");
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
    const coords = [
      { x: 25, y: 35 },
      { x: 45, y: 70 },
      { x: 60, y: 30 },
      { x: 75, y: 65 },
      { x: 85, y: 40 }
    ];
    this.echoes.forEach((echo, idx) => {
      const pt = coords[idx] || { x: 50, y: 50 };
      echo.style.left = `${pt.x}%`;
      echo.style.top = `${pt.y}%`;
    });
  },

  onPointerDown(e) {
    this.isScanning = true;
    this.onPointerMove(e);
    hintController.notifyProgress();
  },

  onPointerMove(e) {
    if (!this.isScanning || !this.radar) return;
    const rect = this.radar.getBoundingClientRect();
    this.lensX = clamp(((e.clientX - rect.left) / rect.width) * 100, 5, 95);
    this.lensY = clamp(((e.clientY - rect.top) / rect.height) * 100, 5, 95);

    if (this.lens) {
      this.lens.style.left = `${this.lensX}%`;
      this.lens.style.top = `${this.lensY}%`;
    }

    this.checkProximity();
  },

  checkProximity() {
    const coords = [
      { x: 25, y: 35 },
      { x: 45, y: 70 },
      { x: 60, y: 30 },
      { x: 75, y: 65 },
      { x: 85, y: 40 }
    ];

    coords.forEach((pt, idx) => {
      const dist = Math.hypot(this.lensX - pt.x, this.lensY - pt.y);
      const echo = this.echoes[idx];
      if (!echo) return;

      if (dist <= 14) {
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
   SCENE MODULE 4: TIMELINE (TRAVEL)
   -------------------------------------------------------------------------- */
const timelineScene = {
  scrollRegion: null,
  checkpoints: [],
  progressPath: null,
  pulseDot: null,
  continueBtn: null,
  currentMilestone: 0,

  init() {
    this.scrollRegion = $("#timelineScrollRegion");
    this.checkpoints = $$(".timeline-checkpoint");
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
      this.pulseDot.setAttribute("cy", String(20 + ratio * 560));
    }

    if (ratio >= 0.92 && this.continueBtn) {
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
  },
  exit() {},
  reset() {
    this.currentMilestone = 0;
    if (this.scrollRegion) this.scrollRegion.scrollTop = 0;
    if (this.continueBtn) this.continueBtn.hidden = true;
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 5: BARRIER (RESONATE)
   -------------------------------------------------------------------------- */
const barrierScene = {
  button: null,
  visual: null,
  numberEl: null,
  barEl: null,
  feedbackEl: null,
  pulseEl: null,
  pulsePhase: 0,
  loopTimer: null,
  fieldVal: 100,
  windowTolerance: 0.18,
  completed: false,

  init() {
    this.button = $("#barrierButton");
    this.visual = $("#barrierVisual");
    this.numberEl = $("#barrierNumber");
    this.barEl = $("#barrierBar");
    this.feedbackEl = $("#barrierFeedback");
    this.pulseEl = $("#barrierPulse");

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

  startLoop() {
    clearInterval(this.loopTimer);
    this.loopTimer = setInterval(() => {
      this.pulsePhase = (this.pulsePhase + 0.02) % 1;
      if (this.pulseEl) {
        this.pulseEl.classList.add("is-traveling");
      }
    }, 25);
  },

  releasePulse() {
    if (this.completed) return;
    hintController.notifyProgress();
    soundSystem.playInterface();

    const target = 0.5;
    const diff = Math.abs(this.pulsePhase - target);

    if (diff <= this.windowTolerance) {
      this.complete();
    } else {
      if (this.pulsePhase < target) {
        if (this.feedbackEl) this.feedbackEl.textContent = "EARLY PULSE / ADJUST TIMING";
      } else {
        if (this.feedbackEl) this.feedbackEl.textContent = "LATE PULSE / RELEASE WHEN WINDOW GLOWS";
      }
      this.windowTolerance = Math.min(0.35, this.windowTolerance + 0.03);
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
    this.startLoop();
  },
  exit() {
    clearInterval(this.loopTimer);
  },
  reset() {
    this.completed = false;
    this.pulsePhase = 0;
    this.windowTolerance = 0.18;
    if (this.visual) this.visual.classList.remove("is-open");
    if (this.numberEl) this.numberEl.textContent = "100";
    if (this.barEl) this.barEl.style.width = "100%";
    if (this.feedbackEl) this.feedbackEl.textContent = "PULSE READY / TIMING CRITICAL";
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 6: LETTER (RECONSTRUCT)
   -------------------------------------------------------------------------- */
const letterScene = {
  field: null,
  orb: null,
  fragments: [],
  statusEl: null,
  counterEl: null,
  copyEl: null,
  sealBtn: null,
  orbX: 30,
  orbY: 50,
  placedCount: 0,
  isDragging: false,

  init() {
    this.field = $("#letterReconstructField");
    this.orb = $("#letterOrb");
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
    this.orbX = clamp(((e.clientX - rect.left) / rect.width) * 100, 5, 95);
    this.orbY = clamp(((e.clientY - rect.top) / rect.height) * 100, 5, 95);

    if (this.orb) {
      this.orb.style.left = `${this.orbX}%`;
      this.orb.style.top = `${this.orbY}%`;
    }

    this.checkFragments();
  },

  checkFragments() {
    const coords = [
      { x: 15, y: 25 },
      { x: 55, y: 55 },
      { x: 80, y: 20 }
    ];

    coords.forEach((pt, idx) => {
      const frag = this.fragments[idx];
      if (!frag || frag.classList.contains("is-placed")) return;

      const dist = Math.hypot(this.orbX - pt.x, this.orbY - pt.y);
      if (dist <= 18) {
        frag.classList.add("is-attracted");
        if (this.orbX >= 75) {
          this.placeFragment(idx);
        }
      }
    });
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
    if (this.copyEl) this.copyEl.innerHTML = "";
    this.placedCount = 0;
    this.placeFragment(0);
  },
  exit() {
    this.isDragging = false;
  },
  reset() {
    this.placedCount = 0;
    this.fragments.forEach(f => f.classList.remove("is-attracted", "is-placed"));
    if (this.sealBtn) {
      this.sealBtn.disabled = true;
      this.sealBtn.hidden = true;
    }
    if (this.copyEl) this.copyEl.innerHTML = "";
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 7: RESPONSE (CHOOSE)
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
          this.noBtn.style.top = `${this.driftCount * 36}px`;
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
        $$(".response-options button").forEach(b => b.classList.remove("is-selected"));
        if (this.feedbackEl) this.feedbackEl.textContent = "RESPONSE CHANNEL / WAITING";
      });
    }
  },

  selectResponse(choice) {
    const msg = siteConfig.responses[choice];
    if (this.feedbackEl) this.feedbackEl.textContent = msg;
    if (this.changeBtn) this.changeBtn.hidden = false;

    $$(".response-options button").forEach(b => {
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

  enter() {},
  exit() {},
  reset() {
    this.driftCount = 0;
    if (this.noBtn) {
      this.noBtn.style.top = "";
      this.noBtn.classList.remove("is-drifting", "is-catchable");
    }
  }
};

/* --------------------------------------------------------------------------
   SCENE MODULE 8: REPLY (SEND / WHATSAPP)
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
  const update = () => {
    const height = window.visualViewport?.height || window.innerHeight;
    document.documentElement.style.setProperty("--app-height", `${Math.round(height)}px`);
  };
  update();
  window.addEventListener("resize", update, { passive: true });
  window.addEventListener("orientationchange", update, { passive: true });
  window.visualViewport?.addEventListener("resize", update, { passive: true });
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
    particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.4 + 0.1
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
  sceneManager.init();

  Object.values(sceneModules).forEach(mod => {
    if (mod.init) mod.init();
  });

  setupAmbientCanvas();
});