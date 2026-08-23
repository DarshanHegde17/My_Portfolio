/**
 * 3D Scroll-Driven Canvas Animation Engine
 * Preloads 240 ultra-HD frames and synchronizes canvas rendering with page scroll.
 * Drives 4 dynamic hero stages with responsive HUD and telemetry feedback.
 */
(function () {
  'use strict';

  const TOTAL_FRAMES = 240;
  const FRAME_DIR = './assets/images/all_video_frames';
  const heroSection = document.getElementById('home');
  const canvas = document.getElementById('hero3dCanvas');
  const loader = document.getElementById('hero3dLoader');
  const loaderBar = document.getElementById('hero3dLoaderBar');
  const loaderPct = document.getElementById('hero3dLoaderPct');
  const telemetryFill = document.querySelector('.telemetry-fill');
  const telemetryStatus = document.querySelector('.telemetry-status');
  const stages = document.querySelectorAll('.hero-stage');

  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  const frames = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  let currentFrame = 0;
  let targetFrame = 0;
  let lastDrawnFrame = -1;
  let isLoaderDismissed = false;

  // Format frame number: 0 -> '000001', 239 -> '000240'
  function getFramePath(index) {
    const frameNum = String(index + 1).padStart(6, '0');
    return `${FRAME_DIR}/frame_${frameNum}.jpg`;
  }

  // Handle high-DPI displays and viewport changes
  function resizeCanvas() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    lastDrawnFrame = -1;
    drawFrame(Math.round(currentFrame));
  }

  // Draw image to fill canvas (cover mode) with no distortion
  function drawCoverImage(img) {
    if (!ctx || !img || !img.complete || !img.naturalWidth) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const canvasRatio = cw / ch;
    const imgRatio = iw / ih;

    let dw, dh, dx, dy;
    if (canvasRatio > imgRatio) {
      dw = cw;
      dh = Math.round(cw / imgRatio);
      dx = 0;
      dy = Math.round((ch - dh) / 2);
    } else {
      dh = ch;
      dw = Math.round(ch * imgRatio);
      dx = Math.round((cw - dw) / 2);
      dy = 0;
    }

    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // Draw specific frame or closest loaded frame
  function drawFrame(frameIdx) {
    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIdx));
    let img = frames[clamped];

    // Fallback to closest available loaded frame if current not loaded yet
    if (!img || !img.complete) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = clamped - offset;
        const next = clamped + offset;
        if (prev >= 0 && frames[prev] && frames[prev].complete) {
          img = frames[prev];
          break;
        }
        if (next < TOTAL_FRAMES && frames[next] && frames[next].complete) {
          img = frames[next];
          break;
        }
      }
    }

    if (img && img.complete && img.naturalWidth) {
      drawCoverImage(img);
      lastDrawnFrame = clamped;
    }
  }

  // Update hero stage overlay opacities and pointer events
  function updateStages(progress) {
    // Stage 1: 0% -> 22%
    let s1 = 0;
    if (progress <= 0.15) s1 = 1;
    else if (progress <= 0.23) s1 = 1 - (progress - 0.15) / 0.08;

    // Stage 2: 24% -> 48%
    let s2 = 0;
    if (progress >= 0.24 && progress < 0.30) s2 = (progress - 0.24) / 0.06;
    else if (progress >= 0.30 && progress <= 0.44) s2 = 1;
    else if (progress > 0.44 && progress <= 0.50) s2 = 1 - (progress - 0.44) / 0.06;

    // Stage 3: 52% -> 76%
    let s3 = 0;
    if (progress >= 0.52 && progress < 0.58) s3 = (progress - 0.52) / 0.06;
    else if (progress >= 0.58 && progress <= 0.72) s3 = 1;
    else if (progress > 0.72 && progress <= 0.78) s3 = 1 - (progress - 0.72) / 0.06;

    // Stage 4: 80% -> 100%
    let s4 = 0;
    if (progress >= 0.80 && progress < 0.88) s4 = (progress - 0.80) / 0.08;
    else if (progress >= 0.88) s4 = 1;

    const opacities = [s1, s2, s3, s4];
    stages.forEach((stage, idx) => {
      const op = Math.max(0, Math.min(1, opacities[idx]));
      stage.style.opacity = op.toFixed(3);
      stage.style.transform = `translateY(${(1 - op) * 24}px) scale(${0.96 + op * 0.04})`;
      if (op > 0.15) {
        stage.classList.add('active');
        stage.style.pointerEvents = 'auto';
      } else {
        stage.classList.remove('active');
        stage.style.pointerEvents = 'none';
      }
    });

    // Telemetry Progress & Status text
    if (telemetryFill) {
      telemetryFill.style.width = (progress * 100).toFixed(1) + '%';
    }
    if (telemetryStatus) {
      if (progress < 0.24) telemetryStatus.textContent = 'SYS.PHASE 0: IDENTITY ORBIT';
      else if (progress < 0.50) telemetryStatus.textContent = 'SYS.PHASE 1: DEEP COSMOS TRANSIT';
      else if (progress < 0.78) telemetryStatus.textContent = 'SYS.PHASE 2: APPROACHING ATMOSPHERE';
      else telemetryStatus.textContent = 'SYS.PHASE 3: PORTFOLIO ENTRY READY';
    }
  }

  // Calculate scroll progress through the 3D hero section
  function calculateProgress() {
    const rect = heroSection.getBoundingClientRect();
    const scrollableDistance = rect.height - window.innerHeight;
    if (scrollableDistance <= 0) return 0;
    const progress = -rect.top / scrollableDistance;
    return Math.max(0, Math.min(1, progress));
  }

  // Render loop with lerp smoothing
  function renderLoop() {
    const progress = calculateProgress();
    targetFrame = progress * (TOTAL_FRAMES - 1);

    // Smooth lerp interpolation towards target frame
    const delta = targetFrame - currentFrame;
    if (Math.abs(delta) > 0.01) {
      currentFrame += delta * 0.18;
    } else {
      currentFrame = targetFrame;
    }

    const roundedFrame = Math.round(currentFrame);
    if (roundedFrame !== lastDrawnFrame) {
      drawFrame(roundedFrame);
    }

    updateStages(progress);

    // Continue loop
    requestAnimationFrame(renderLoop);
  }

  // Progressive frame preloader
  function startPreloading() {
    // 1. Immediately load frame 1 for instant display
    const firstImg = new Image();
    firstImg.src = getFramePath(0);
    firstImg.onload = () => {
      frames[0] = firstImg;
      loadedCount++;
      resizeCanvas();
      drawFrame(0);
      updateLoaderProgress();
    };

    // 2. Preload all remaining frames in parallel batches
    const batchSize = 12;
    let nextIndex = 1;

    function loadNextBatch() {
      const end = Math.min(TOTAL_FRAMES, nextIndex + batchSize);
      for (let i = nextIndex; i < end; i++) {
        const idx = i;
        const img = new Image();
        img.src = getFramePath(idx);
        img.onload = () => {
          frames[idx] = img;
          loadedCount++;
          updateLoaderProgress();
        };
        img.onerror = () => {
          loadedCount++;
          updateLoaderProgress();
        };
      }
      nextIndex = end;
      if (nextIndex < TOTAL_FRAMES) {
        setTimeout(loadNextBatch, 30);
      }
    }

    loadNextBatch();
  }

  function updateLoaderProgress() {
    const pct = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));
    if (loaderBar) loaderBar.style.width = pct + '%';
    if (loaderPct) loaderPct.textContent = pct + '%';

    // Dismiss preloader when frames are ready
    if (pct >= 40 && !isLoaderDismissed) {
      dismissLoader();
    }
  }

  function dismissLoader() {
    if (isLoaderDismissed) return;
    isLoaderDismissed = true;
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 600);
    }
  }

  // Fallback timer to ensure loader is dismissed even on slow network
  setTimeout(dismissLoader, 2500);

  // Initialize
  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('orientationchange', resizeCanvas, { passive: true });

  // Start engine
  startPreloading();
  resizeCanvas();
  renderLoop();

})();
