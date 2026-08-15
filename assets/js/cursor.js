/* ============================================================
   Cosmic Stardust Cursor & Particle Trail Effect (Full Web Page)
   Optimized for buttery-smooth 60-120fps performance
   ============================================================ */

(function () {
  // Disable custom cursor on touch screens / mobile devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  // Add custom cursor active class to html & body
  document.documentElement.classList.add('custom-cursor-active');
  if (document.body) {
    document.body.classList.add('custom-cursor-active');
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.classList.add('custom-cursor-active');
    });
  }

  // Create full-screen overlay canvas for cursor & particles
  const canvas = document.createElement('canvas');
  canvas.id = 'cosmicCursorCanvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999999';
  canvas.style.transform = 'translateZ(0)';
  canvas.style.backfaceVisibility = 'hidden';

  function appendCanvas() {
    if (document.body && !document.getElementById('cosmicCursorCanvas')) {
      document.body.appendChild(canvas);
    }
  }

  if (document.body) {
    appendCanvas();
  } else {
    document.addEventListener('DOMContentLoaded', appendCanvas);
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  resizeCanvas();

  window.addEventListener('resize', resizeCanvas, { passive: true });

  // Cursor state
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: window.innerWidth / 2, targetY: window.innerHeight / 2 };
  let ring = { x: window.innerWidth / 2, y: window.innerHeight / 2, size: 24, targetSize: 24 };
  let particles = [];
  let isHovering = false;
  let isVisible = false;
  const MAX_PARTICLES = 35;

  // Track mouse movement across the full page (all sections)
  let lastSpawn = 0;
  window.addEventListener('mousemove', (e) => {
    isVisible = true;
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;

    const now = performance.now();
    if (now - lastSpawn > 16 && particles.length < MAX_PARTICLES) {
      lastSpawn = now;
      particles.push(createParticle(e.clientX, e.clientY));
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    isVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    isVisible = true;
  });

  // Interactive selectors
  const interactiveSelectors = 'a, button, input, textarea, select, label, [role="button"], .btn, .box, .bar, .tilt, .social-icons li, #menu, #scroll-top, .logo, .card, .timeline .container, .timeline .content, .footer .box a, .share a, .resumebtn .btn, [data-tilt], img, .project-scroll-card';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target && e.target.closest && e.target.closest(interactiveSelectors)) {
      isHovering = true;
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.target && e.target.closest && e.target.closest(interactiveSelectors)) {
      isHovering = false;
    }
  }, { passive: true });

  // Burst on click
  window.addEventListener('click', (e) => {
    const burstCount = 12;
    for (let i = 0; i < burstCount; i++) {
      if (particles.length >= MAX_PARTICLES + 15) break;
      const angle = (Math.PI * 2 / burstCount) * i + Math.random() * 0.3;
      const speed = Math.random() * 3.5 + 1.5;
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1.5,
        color: Math.random() > 0.4 ? '#ff8c00' : (Math.random() > 0.5 ? '#ffd700' : '#ffffff'),
        alpha: 0.9,
        decay: 0.035
      });
    }
  }, { passive: true });

  const palette = ['#ff8c00', '#ffa500', '#ffd700', '#ffffff'];
  function createParticle(x, y) {
    return {
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2 - 0.3,
      size: Math.random() * 2.5 + 1,
      color: palette[Math.floor(Math.random() * palette.length)],
      alpha: 0.85,
      decay: 0.03
    };
  }

  // Ultra-lightweight Animation Loop
  function render() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Smooth lerping
    mouse.x += (mouse.targetX - mouse.x) * 0.45;
    mouse.y += (mouse.targetY - mouse.y) * 0.45;

    ring.x += (mouse.targetX - ring.x) * 0.2;
    ring.y += (mouse.targetY - ring.y) * 0.2;

    // Hover size scaling
    ring.targetSize = isHovering ? 42 : 22;
    ring.size += (ring.targetSize - ring.size) * 0.25;

    // Render particles quickly without per-frame state thrashing
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      p.size = Math.max(0, p.size - 0.03);

      if (p.alpha <= 0 || p.size <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    if (isVisible) {
      // Render outer magnetic ring
      ctx.globalAlpha = isHovering ? 0.9 : 0.75;
      ctx.strokeStyle = isHovering ? '#ffa500' : '#ff8c00';
      ctx.lineWidth = isHovering ? 2.2 : 1.6;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.size / 2, 0, Math.PI * 2);
      ctx.stroke();

      // Render inner glowing dot
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, isHovering ? 5 : 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
