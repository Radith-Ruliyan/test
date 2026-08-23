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

function applyConfig() {
  $$('[data-recipient]').forEach((node) => { node.textContent = siteConfig.recipientName; });
  $$('[data-sender]').forEach((node) => { node.textContent = siteConfig.senderName; });
  const opening = $('[data-opening]');
  if (opening) opening.textContent = siteConfig.opening;
  renderRecords();
  renderTimeline();
  renderLetter();
}

function renderRecords() {
  const grid = $("#recordGrid");
  if (!grid) return;
  const fragment = document.createDocumentFragment();
  siteConfig.records.forEach((record, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "record-card reveal";
    button.dataset.code = record.code;
    button.setAttribute("aria-expanded", "false");

    const number = document.createElement("span");
    number.className = "record-card__number";
    number.textContent = String(index + 1).padStart(2, "0");
    const title = document.createElement("h3");
    title.textContent = record.title;
    const reveal = document.createElement("span");
    reveal.className = "record-card__reveal";
    reveal.textContent = record.text;
    const status = document.createElement("span");
    status.className = "record-card__status";
    status.textContent = "CLICK TO DECRYPT";

    button.append(number, title, reveal, status);
    button.addEventListener("click", () => {
      const open = button.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
      status.textContent = open ? "RECORD DECRYPTED" : "CLICK TO DECRYPT";
      if (open) decryptText(reveal, record.text);
    });
    fragment.append(button);
  });
  grid.append(fragment);
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

function renderTimeline() {
  const list = $("#timelineList");
  if (!list) return;
  const fragment = document.createDocumentFragment();
  siteConfig.timeline.forEach((item) => {
    const article = document.createElement("article");
    article.className = "timeline-item";
    const phase = document.createElement("small");
    phase.textContent = item.phase;
    const title = document.createElement("h3");
    title.textContent = item.title;
    const text = document.createElement("p");
    text.textContent = item.text;
    article.append(phase, title, text);
    fragment.append(article);
  });
  list.append(fragment);
}

function renderLetter() {
  const copy = $("#letterCopy");
  if (!copy) return;
  siteConfig.letter.forEach((text) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    copy.append(paragraph);
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

function setupBoot() {
  const screen = $("#bootScreen");
  const bar = $("#bootBar");
  const percent = $("#bootPercent");
  const log = $("#bootLog");
  const enter = $("#enterButton");
  const skip = $("#skipButton");
  if (!screen || !bar || !percent || !log || !enter || !skip) return;
  document.body.classList.add("boot-open");
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
  const close = () => {
    clearInterval(timer);
    screen.classList.add("is-closed");
    document.body.classList.remove("boot-open");
    sessionStorage.setItem("reiSignalIntro", "seen");
    window.setTimeout(() => $(".hero__copy")?.focus?.(), 500);
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
  enter.addEventListener("click", () => {
    startAmbientAudio();
    close();
  });
  skip.addEventListener("click", () => {
    finish();
    startAmbientAudio();
    close();
  });
}

function setupRevealObservers() {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });
  $$(".reveal").forEach((node) => revealObserver.observe(node));

  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-active");
    });
  }, { threshold: 0.52 });
  $$(".timeline-item").forEach((item) => timelineObserver.observe(item));
}

function setupScrollUI() {
  const progress = $("#scrollProgress");
  const sections = $$(".story-section");
  const links = $$(".rail-nav a");
  const update = () => {
    const range = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = `${range > 0 ? (scrollY / range) * 100 : 0}%`;
  };
  document.addEventListener("scroll", update, { passive: true });
  update();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-40% 0px -50%" });
  sections.forEach((section) => observer.observe(section));
}

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
    announce("Signal connection complete.");
    playInterfaceSound();
  });
}

function setupBarrier() {
  const section = $("#barrier");
  const button = $("#barrierButton");
  const number = $("#barrierNumber");
  const bar = $("#barrierBar");
  const letter = $("#letter");
  if (!section || !button || !number || !bar || !letter) return;
  createHoldInteraction(button, (progress) => {
    number.textContent = String(Math.max(0, 100 - Math.round(progress * 100))).padStart(2, "0");
    bar.style.width = `${progress * 100}%`;
  }, () => {
    section.classList.add("is-open");
    letter.classList.remove("is-locked");
    button.textContent = "MESSAGE RELEASED";
    button.disabled = true;
    revealLetter();
    announce("Barrier opened. The message can now be read.");
    playInterfaceSound();
    window.setTimeout(() => letter.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" }), 500);
  }, 2700);
}

function revealLetter() {
  $$("#letterCopy p").forEach((paragraph, index) => {
    window.setTimeout(() => paragraph.classList.add("is-visible"), reduceMotion.matches ? 0 : index * 520);
  });
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

function setupReplay() {
  $("#replayButton")?.addEventListener("click", () => {
    sessionStorage.removeItem("reiSignalIntro");
    window.scrollTo({ top: 0, behavior: "auto" });
    window.location.reload();
  });
}

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
    const count = coarsePointer.matches ? 22 : 46;
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

function init() {
  applyConfig();
  setupAssetFallbacks();
  setupBoot();
  setupRevealObservers();
  setupScrollUI();
  setupConnection();
  setupBarrier();
  setupResponses();
  setupAudio();
  setupReplay();
  setupPointerLight();
  setupAmbientCanvas();
}

document.addEventListener("DOMContentLoaded", init);
