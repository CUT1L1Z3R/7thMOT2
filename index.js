/* ==========================================================================
   EASY SETTINGS — EDIT YOUR TEXT, MUSIC & NOVEMBER CAPTIONS HERE
   ========================================================================== */
const EDIT_ME = {
  musicFile: "./music.mp3",          // Place your .mp3 file in the same folder as index.html
  musicVolume: 0.65,                 // Volume from 0.0 to 1.0

  myFlowerFile: "./photos/Flower.jpeg", // Used if photos/flower.* is not found

  coverTitle: "OUR 7TH\nMONTHSARY",
  coverSubtitle: "SEVEN MONTHS OF US",

  letterSubtitle: "Happy 7th Monthsary, My Love",
  letterGreeting: "My Dearest Asawa Nako,",
  letterBody:
    "It's been 7 months babe since our first date and madami-dami jud atong challenges na na take but despite that we persevere and work through it all hehhehe.\n\nThank you for understanding me asawa nako and also loving me despite my flaws. I really appreciate all of it given my life I have now wlang wala ako huhuhu.\n\nAll I can say is I LOVE YOU from the deepest of my heart and soul, I hope you will love me 7 decades from now babe 😘😘😘😘",
  letterSignature: "Cel Patrick Paul Albios",

  flowerCaption: "Drawn for you with all my heart — Month 7",
  blendFlowerPaper: true,

  albumTitle: "NOVEMBER\nPHOTO ALBUM",
  albumSubtitle:
    "Every candid laugh, random errand, and quiet November moment with you is my favorite memory.",

  // Tailored to your 10 November photos (photos/1.jpg through photos/10.jpg):
  captions: [
    "My favorite November date",
    "Kisses & our usual silly faces",
    "My grumpy face vs. your cuteness",
    "Every snapshot with you is gold",
    "My favorite view this November",
    "Chill November afternoon together",
    "Simple days, best company",
    "Cutest double peace signs",
    "Leaning right where I belong",
    "Store mirror selfie on our errands"
  ]
};

/* ==========================================================================
   AUTOMATIC PHOTO FOLDER LOADER (photos/1.jpg ... photos/10.jpg)
   ========================================================================== */

const MAX_AUTO_PHOTOS = 10;
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG"];
const MOBILE_BREAKPOINT = 860;

function isMobileViewport() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

function probeImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

async function findImageByBaseName(basePath) {
  const results = await Promise.all(
    IMAGE_EXTENSIONS.map((ext) => probeImage(`${basePath}.${ext}`))
  );
  return results.find(Boolean) || null;
}

function createPlaceholderSvg(label, bgStart, bgEnd) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="450" viewBox="0 0 420 450">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bgStart}"/>
        <stop offset="100%" stop-color="${bgEnd}"/>
      </linearGradient>
    </defs>
    <rect width="420" height="450" fill="url(#bg)"/>
    <circle cx="210" cy="195" r="64" fill="rgba(255,253,249,0.2)"/>
    <path d="M210 172 C196 155, 168 162, 168 186 C168 210, 210 234, 210 234 C210 234, 252 210, 252 186 C252 162, 224 155, 210 172 Z" fill="#fffdf9"/>
    <text x="210" y="315" font-family="Georgia, serif" font-size="20" fill="#fffdf9" text-anchor="middle">${label}</text>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

async function detectFolderImages() {
  const slotPromises = [];
  for (let i = 1; i <= MAX_AUTO_PHOTOS; i++) {
    slotPromises.push(findImageByBaseName(`./photos/${i}`));
  }

  const [detectedUrls, customFlowerUrl] = await Promise.all([
    Promise.all(slotPromises),
    findImageByBaseName("./photos/flower")
  ]);

  const validUrls = detectedUrls.filter(Boolean);

  if (validUrls.length > 0) {
    activePhotos = validUrls.map((src, idx) => ({
      src,
      caption: EDIT_ME.captions[idx] || `Memory #${idx + 1}`
    }));
  } else {
    const palette = [
      ["#8f3b4a", "#5b1f2c"],
      ["#b56576", "#6d597a"],
      ["#c97b63", "#8a4f3d"],
      ["#7f5539", "#432818"],
      ["#a44a3f", "#6b2d26"]
    ];
    activePhotos = Array.from({ length: MAX_AUTO_PHOTOS }, (_, idx) => {
      const [c1, c2] = palette[idx % palette.length];
      return {
        src: createPlaceholderSvg(`Add photos/${idx + 1}.jpg`, c1, c2),
        caption: EDIT_ME.captions[idx] || `Memory #${idx + 1}`
      };
    });
  }

  detectedFlowerSrc = customFlowerUrl || EDIT_ME.myFlowerFile || "";
}

/* ==========================================================================
   BACKGROUND MUSIC (AUTOPLAY + FIRST-TAP UNLOCK)
   ========================================================================== */

let userMutedMusic = false;

function updateMusicButton(isPlaying) {
  const btn = document.getElementById("musicToggleBtn");
  const label = document.getElementById("musicBtnLabel");
  if (btn) btn.classList.toggle("is-playing", isPlaying);
  if (label) label.textContent = isPlaying ? "❚❚ Music On" : "♪ Play Music";
}

async function startBackgroundMusic() {
  const audio = document.getElementById("bgMusic");
  if (!audio || userMutedMusic) return false;

  try {
    await audio.play();
    updateMusicButton(true);
    return true;
  } catch {
    updateMusicButton(false);
    return false;
  }
}

function setupBackgroundMusic() {
  const audio = document.getElementById("bgMusic");
  const toggleBtn = document.getElementById("musicToggleBtn");
  if (!audio) return;

  if (EDIT_ME.musicFile) {
    audio.src = EDIT_ME.musicFile;
  }
  audio.volume = typeof EDIT_ME.musicVolume === "number" ? EDIT_ME.musicVolume : 0.65;

  startBackgroundMusic();

  const unlockOnFirstTouch = async () => {
    if (userMutedMusic || !audio.paused) return;
    const started = await startBackgroundMusic();
    if (started) {
      document.removeEventListener("pointerdown", unlockOnFirstTouch);
      document.removeEventListener("keydown", unlockOnFirstTouch);
    }
  };

  document.addEventListener("pointerdown", unlockOnFirstTouch);
  document.addEventListener("keydown", unlockOnFirstTouch);

  toggleBtn?.addEventListener("click", async (e) => {
    e.stopPropagation();
    if (audio.paused) {
      userMutedMusic = false;
      await startBackgroundMusic();
    } else {
      userMutedMusic = true;
      audio.pause();
      updateMusicButton(false);
    }
  });
}

/* ==========================================================================
   BOOK STATE & RENDERING
   ========================================================================== */

let activePhotos = [];
let detectedFlowerSrc = "";
let isBookOpen = false;
let currentSpread = 1;
let isFlipping = false;
let zoomFocus = "spread";
let lightboxIndex = 0;

function setZoomFocus(nextZoom) {
  zoomFocus = nextZoom;
  syncZoomButtons();
  updateStageTransform();
  updateSpreadUI();
}

function initDustMotes() {
  const container = document.getElementById("dustMotes");
  if (!container) return;
  container.innerHTML = "";

  for (let i = 0; i < 24; i++) {
    const mote = document.createElement("span");
    mote.className = "mote";
    const size = 2 + Math.random() * 4;
    mote.style.width = `${size}px`;
    mote.style.height = `${size}px`;
    mote.style.left = `${Math.random() * 100}%`;
    mote.style.top = `${20 + Math.random() * 80}%`;
    mote.style.animationDuration = `${7 + Math.random() * 10}s`;
    mote.style.animationDelay = `${-Math.random() * 10}s`;
    container.appendChild(mote);
  }
}

function updateStageTransform() {
  const wrapper = document.getElementById("bookScaleWrapper");
  const scene = document.getElementById("bookScene");
  if (!wrapper || !scene) return;

  const mobile = isMobileViewport();
  const pageW = mobile ? 296 : 396;
  const pageH = mobile ? 404 : 534;

  const targetW = isBookOpen ? pageW * 2 + 28 : pageW + 28;
  const targetH = pageH + 36;

  const availW = window.innerWidth - 24;
  const availH = window.innerHeight - 132;
  const baseFitScale = Math.min(1, availW / targetW, availH / targetH);

  if (!isBookOpen || zoomFocus === "spread") {
    wrapper.style.transform = `scale(${baseFitScale.toFixed(4)}) translateX(0px)`;
    return;
  }

  const focusedScale = Math.min(1.38, (availW / (pageW + 24)) * 0.96, (availH / targetH) * 1.05);
  const shiftX = zoomFocus === "left" ? pageW * 0.5 : -pageW * 0.5;
  wrapper.style.transform = `scale(${focusedScale.toFixed(4)}) translateX(${shiftX}px)`;
}

function formatMultilineHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");
}

function renderBookContent() {
  const coverTitleEl = document.getElementById("displayCoverTitle");
  const coverSubtitleEl = document.getElementById("displayCoverSubtitle");
  if (coverTitleEl) coverTitleEl.innerHTML = formatMultilineHtml(EDIT_ME.coverTitle);
  if (coverSubtitleEl) coverSubtitleEl.textContent = EDIT_ME.coverSubtitle;

  const letterSubEl = document.getElementById("displayLetterSubtitle");
  const letterGreetEl = document.getElementById("displayLetterGreeting");
  const letterBodyEl = document.getElementById("displayLetterBody");
  const letterSigEl = document.getElementById("displayLetterSignature");

  if (letterSubEl) letterSubEl.textContent = EDIT_ME.letterSubtitle;
  if (letterGreetEl) letterGreetEl.textContent = EDIT_ME.letterGreeting;
  if (letterSigEl) letterSigEl.textContent = EDIT_ME.letterSignature;

  if (letterBodyEl) {
    letterBodyEl.innerHTML = "";
    const paragraphs = String(EDIT_ME.letterBody || "")
      .split(/\n\s*\n|\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    paragraphs.forEach((para) => {
      const p = document.createElement("p");
      p.textContent = para;
      letterBodyEl.appendChild(p);
    });
  }

  const customImg = document.getElementById("customFlowerImg");
  const flowerCaptionEl = document.getElementById("displayFlowerCaption");

  if (flowerCaptionEl) flowerCaptionEl.textContent = EDIT_ME.flowerCaption;

  if (customImg) {
    if (detectedFlowerSrc) {
      customImg.src = detectedFlowerSrc;
      customImg.classList.remove("hidden");
      customImg.classList.toggle("blend-paper", Boolean(EDIT_ME.blendFlowerPaper));
    } else {
      customImg.removeAttribute("src");
      customImg.classList.add("hidden");
    }
  }

  const albumTitleEl = document.getElementById("displayAlbumTitle");
  const albumSubEl = document.getElementById("displayAlbumSubtitle");
  const albumCountEl = document.getElementById("albumCountBadge");

  if (albumTitleEl) albumTitleEl.innerHTML = formatMultilineHtml(EDIT_ME.albumTitle);
  if (albumSubEl) albumSubEl.textContent = EDIT_ME.albumSubtitle;
  if (albumCountEl) {
    const count = activePhotos.length;
    albumCountEl.textContent = `${count} Captured ${count === 1 ? "Moment" : "Moments"}`;
  }

  const gridEl = document.getElementById("polaroidGrid");
  if (gridEl) {
    gridEl.innerHTML = "";
    activePhotos.forEach((photo, idx) => {
      const card = document.createElement("figure");
      card.className = "polaroid-card";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", photo.caption || `Memory ${idx + 1}`);

      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.caption || `Memory ${idx + 1}`;
      img.loading = "lazy";

      const cap = document.createElement("figcaption");
      cap.textContent = photo.caption || `Memory #${idx + 1}`;

      card.appendChild(img);
      card.appendChild(cap);

      card.addEventListener("click", (e) => {
        e.stopPropagation();
        openLightbox(idx);
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          openLightbox(idx);
        }
      });

      gridEl.appendChild(card);
    });
  }
}

/* ==========================================================================
   OPEN / CLOSE BOOK & SPREAD FLIPPING
   ========================================================================== */

function setActiveSpreadInstant(spreadNum) {
  currentSpread = spreadNum;
  const p1 = document.getElementById("page1Content");
  const p2 = document.getElementById("page2Content");
  const p3 = document.getElementById("page3Content");
  const p4 = document.getElementById("page4Content");

  if (spreadNum === 1) {
    p1?.classList.add("active");
    p2?.classList.add("active");
    p3?.classList.remove("active");
    p4?.classList.remove("active");
  } else {
    p1?.classList.remove("active");
    p2?.classList.remove("active");
    p3?.classList.add("active");
    p4?.classList.add("active");
  }

  updateSpreadUI();
}

function updateSpreadUI() {
  const indicator = document.getElementById("spreadIndicator");
  const prevBtn = document.getElementById("prevPageBtn");
  const nextBtn = document.getElementById("nextPageBtn");
  const mobile = isMobileViewport();

  if (indicator) {
    indicator.textContent = currentSpread === 1 ? "Pages 1 – 2 of 4" : "Pages 3 – 4 of 4";
  }
  if (prevBtn) {
    prevBtn.disabled = mobile && zoomFocus !== "spread"
      ? currentSpread <= 1 && zoomFocus === "left"
      : currentSpread <= 1;
  }
  if (nextBtn) {
    nextBtn.disabled = mobile && zoomFocus !== "spread"
      ? currentSpread >= 2 && zoomFocus === "right"
      : currentSpread >= 2;
  }
}

function openBook() {
  if (isBookOpen) return;
  isBookOpen = true;
  zoomFocus = isMobileViewport() ? "left" : "spread";
  syncZoomButtons();

  startBackgroundMusic();
  setActiveSpreadInstant(1);

  document.getElementById("bookScene")?.classList.add("is-open");
  document.getElementById("tapPrompt")?.classList.add("is-hidden");
  document.getElementById("closeBookBtn")?.classList.remove("hidden");
  document.getElementById("spreadIndicator")?.classList.remove("hidden");
  document.getElementById("bottomDock")?.classList.remove("hidden");

  updateStageTransform();
}

function closeBook() {
  if (!isBookOpen) return;
  isBookOpen = false;
  zoomFocus = "spread";
  syncZoomButtons();

  document.getElementById("bookScene")?.classList.remove("is-open");
  document.getElementById("tapPrompt")?.classList.remove("is-hidden");
  document.getElementById("closeBookBtn")?.classList.add("hidden");
  document.getElementById("spreadIndicator")?.classList.add("hidden");
  document.getElementById("bottomDock")?.classList.add("hidden");

  updateStageTransform();
}

function goToSpread(targetSpread) {
  if (!isBookOpen || isFlipping || targetSpread === currentSpread) return;
  if (targetSpread < 1 || targetSpread > 2) return;

  const leaf = document.getElementById("turningLeaf");
  const p1 = document.getElementById("page1Content");
  const p2 = document.getElementById("page2Content");
  const p3 = document.getElementById("page3Content");
  const p4 = document.getElementById("page4Content");

  if (!leaf) {
    setActiveSpreadInstant(targetSpread);
    return;
  }

  isFlipping = true;
  leaf.classList.remove("flip-forward", "flip-backward");
  void leaf.offsetWidth;

  if (targetSpread === 2) {
    p2?.classList.remove("active");
    p4?.classList.add("active");
    leaf.classList.add("flip-forward");

    setTimeout(() => {
      p1?.classList.remove("active");
      p3?.classList.add("active");
    }, 360);

    setTimeout(() => {
      leaf.classList.remove("flip-forward");
      currentSpread = 2;
      isFlipping = false;
      updateSpreadUI();
    }, 730);
  } else {
    p3?.classList.remove("active");
    p1?.classList.add("active");
    leaf.classList.add("flip-backward");

    setTimeout(() => {
      p4?.classList.remove("active");
      p2?.classList.add("active");
    }, 360);

    setTimeout(() => {
      leaf.classList.remove("flip-backward");
      currentSpread = 1;
      isFlipping = false;
      updateSpreadUI();
    }, 730);
  }
}

function syncZoomButtons() {
  document.querySelectorAll(".zoom-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.zoom === zoomFocus);
  });
}

/* ==========================================================================
   FULL-SCREEN PHOTO LIGHTBOX
   ========================================================================== */

function openLightbox(index) {
  if (!activePhotos.length) return;
  lightboxIndex = (index + activePhotos.length) % activePhotos.length;
  updateLightboxView();
  document.getElementById("photoLightbox")?.classList.remove("hidden");
}

function closeLightbox() {
  document.getElementById("photoLightbox")?.classList.add("hidden");
}

function updateLightboxView() {
  const photo = activePhotos[lightboxIndex];
  if (!photo) return;

  const imgEl = document.getElementById("lightboxImg");
  const capEl = document.getElementById("lightboxCaption");
  const countEl = document.getElementById("lightboxCounter");

  if (imgEl) imgEl.src = photo.src;
  if (capEl) capEl.textContent = photo.caption || "";
  if (countEl) countEl.textContent = `${lightboxIndex + 1} / ${activePhotos.length}`;
}

function stepLightbox(delta) {
  if (!activePhotos.length) return;
  lightboxIndex = (lightboxIndex + delta + activePhotos.length) % activePhotos.length;
  updateLightboxView();
}

/* ==========================================================================
   DIRECT PAGE TAP & GESTURE NAVIGATION (MOBILE-FRIENDLY)
   ========================================================================== */

function setupDirectPageTap() {
  const leftHalf = document.getElementById("leftHalf");
  const rightHalf = document.getElementById("rightHalf");

  let downX = 0;
  let downY = 0;
  let downTime = 0;

  function attachTapListener(el, onTap) {
    if (!el) return;
    el.style.cursor = "pointer";

    el.addEventListener("pointerdown", (e) => {
      downX = e.clientX;
      downY = e.clientY;
      downTime = Date.now();
    });

    el.addEventListener("pointerup", (e) => {
      if (!isBookOpen || isFlipping) return;
      if (e.target.closest(".polaroid-card")) return;

      const movedX = Math.abs(e.clientX - downX);
      const movedY = Math.abs(e.clientY - downY);
      const elapsed = Date.now() - downTime;

      if (movedX < 10 && movedY < 10 && elapsed < 350) {
        onTap();
      }
    });
  }

  attachTapListener(leftHalf, () => {
    if (isMobileViewport() && zoomFocus === "right") {
      setZoomFocus("left");
      return;
    }
    if (currentSpread === 2) {
      if (isMobileViewport() && zoomFocus !== "spread") {
        zoomFocus = "right";
        syncZoomButtons();
        updateStageTransform();
      }
      goToSpread(1);
    } else {
      closeBook();
    }
  });

  attachTapListener(rightHalf, () => {
    if (isMobileViewport() && zoomFocus === "left") {
      setZoomFocus("right");
      return;
    }
    if (currentSpread === 1) {
      if (isMobileViewport() && zoomFocus !== "spread") {
        zoomFocus = "left";
        syncZoomButtons();
        updateStageTransform();
      }
      goToSpread(2);
    }
  });
}

/* ==========================================================================
   INITIALIZATION & CONTROLS
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  initDustMotes();
  updateStageTransform();
  setupBackgroundMusic();

  await detectFolderImages();
  renderBookContent();
  setupDirectPageTap();

  const frontCover = document.getElementById("frontCoverAssembly");
  frontCover?.addEventListener("click", openBook);
  frontCover?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openBook();
    }
  });

  document.getElementById("closeBookBtn")?.addEventListener("click", closeBook);

  document.getElementById("prevPageBtn")?.addEventListener("click", () => {
    if (isMobileViewport() && zoomFocus === "right") {
      setZoomFocus("left");
      return;
    }
    if (currentSpread > 1) {
      if (isMobileViewport() && zoomFocus !== "spread") {
        zoomFocus = "right";
        syncZoomButtons();
        updateStageTransform();
      }
      goToSpread(1);
    }
  });

  document.getElementById("nextPageBtn")?.addEventListener("click", () => {
    if (isMobileViewport() && zoomFocus === "left") {
      setZoomFocus("right");
      return;
    }
    if (currentSpread < 2) {
      if (isMobileViewport() && zoomFocus !== "spread") {
        zoomFocus = "left";
        syncZoomButtons();
        updateStageTransform();
      }
      goToSpread(2);
    }
  });

  document.querySelectorAll(".zoom-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      setZoomFocus(btn.dataset.zoom || "spread");
    });
  });

  const lightbox = document.getElementById("photoLightbox");
  document.getElementById("lightboxCloseBtn")?.addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrevBtn")?.addEventListener("click", () => stepLightbox(-1));
  document.getElementById("lightboxNextBtn")?.addEventListener("click", () => stepLightbox(1));
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    const isLightboxOpen = lightbox && !lightbox.classList.contains("hidden");
    if (isLightboxOpen) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
      return;
    }

    if (isBookOpen) {
      if (e.key === "ArrowRight") goToSpread(2);
      if (e.key === "ArrowLeft") goToSpread(1);
      if (e.key === "Escape") closeBook();
    }
  });

  let touchStartX = 0;
  const stage = document.getElementById("bookStage");
  stage?.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );
  stage?.addEventListener(
    "touchend",
    (e) => {
      if (!isBookOpen) return;
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToSpread(2);
        else goToSpread(1);
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    updateStageTransform();
    updateSpreadUI();
  });
});
