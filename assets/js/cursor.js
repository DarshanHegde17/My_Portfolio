/* ============================================================
   Cosmic Stardust Cursor & Particle Trail Effect (Full Web Page)
   Matches Darshan Hegde Portfolio's Space Theme (#ff8c00)
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

  const ctx = canvas.getContext('2d');
  let dpr = window.devicePixelRatio || 1;

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
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

  // Track mouse movement across the full page (all sections)
  window.addEventListener('mousemove', (e) => {
    isVisible = true;
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;

    // Spawn stardust particles on movement
    for (let i = 0; i < 2; i++) {
      particles.push(createParticle(e.clientX, e.clientY));
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    isVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    isVisible = true;
  });

  // Comprehensive interactive selectors across all portfolio sections
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

  // Cosmic burst on click anywhere across the full page
  window.addEventListener('click', (e) => {
    const burstCount = 20;
    for (let i = 0; i < burstCount; i++) {
      const angle = (Math.PI * 2 / burstCount) * i + Math.random() * 0.3;
      const speed = Math.random() * 5 + 2;
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: Math.random() > 0.3 ? '#ff8c00' : (Math.random() > 0.5 ? '#ffd700' : '#ffffff'),
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015
      });
    }
  }, { passive: true });

  // Helper to generate stardust particle
  function createParticle(x, y) {
    const palette = ['#ff8c00', '#ffa500', '#ffd700', '#ffffff', '#ff6b00'];
    return {
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 - 0.4,
      size: Math.random() * 3.2 + 1,
      color: palette[Math.floor(Math.random() * palette.length)],
      alpha: 1,
      decay: Math.random() * 0.025 + 0.018
    };
  }

  // Animation Loop
  function render() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Smooth position interpolation (lerp)
    mouse.x += (mouse.targetX - mouse.x) * 0.4;
    mouse.y += (mouse.targetY - mouse.y) * 0.4;

    ring.x += (mouse.targetX - ring.x) * 0.16;
    ring.y += (mouse.targetY - ring.y) * 0.16;

    // Hover size scaling
    ring.targetSize = isHovering ? 44 : 24;
    ring.size += (ring.targetSize - ring.size) * 0.2;

    // Render particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      p.size = Math.max(0, p.size - 0.035);

      if (p.alpha <= 0 || p.size <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (isVisible) {
      // Render outer magnetic ring
      ctx.save();
      ctx.strokeStyle = isHovering ? '#ffa500' : 'rgba(255, 140, 0, 0.75)';
      ctx.lineWidth = isHovering ? 2.5 : 1.8;
      ctx.shadowBlur = isHovering ? 20 : 12;
      ctx.shadowColor = '#ff8c00';
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.size / 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Render inner glowing dot
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#ff8c00';
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, isHovering ? 5.5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
