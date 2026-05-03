/* ============================================================
   DummyData.in — script.js
   Handles: Canvas Grid Animation | Countdown Timer | Email Form
   ============================================================ */

/* ===== 1. CANVAS BACKGROUND — Animated Data Grid ===== */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [], cols, rows;
  const CELL   = 80;
  const COLORS  = ['#00d4ff', '#ffb347', '#6ee7ff'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols = Math.ceil(W / CELL) + 1;
    rows = Math.ceil(H / CELL) + 1;
  }

  // Floating data particles
  function spawnParticle() {
    return {
      x:      Math.random() * W,
      y:      H + 10,
      speed:  0.3 + Math.random() * 0.6,
      opacity: 0.3 + Math.random() * 0.5,
      size:   1 + Math.random() * 2,
      color:  COLORS[Math.floor(Math.random() * COLORS.length)],
      value:  Math.random() > 0.5
        ? Math.floor(Math.random() * 999).toString()
        : (Math.random() > 0.5 ? 'true' : 'null')
    };
  }

  for (let i = 0; i < 35; i++) {
    particles.push({ ...spawnParticle(), y: Math.random() * H });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.04)';
    ctx.lineWidth   = 1;
    for (let x = 0; x < cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, H);
      ctx.stroke();
    }
    for (let y = 0; y < rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(W, y * CELL);
      ctx.stroke();
    }

    // Dot at grid intersections (random dim)
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        if (Math.random() > 0.97) {
          ctx.fillStyle = 'rgba(0, 212, 255, 0.25)';
          ctx.beginPath();
          ctx.arc(x * CELL, y * CELL, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Particles (floating data values)
    particles.forEach((p, i) => {
      p.y -= p.speed;
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle   = p.color;
      ctx.font        = `${10 + p.size}px "JetBrains Mono", monospace`;
      ctx.fillText(p.value, p.x, p.y);
      ctx.globalAlpha = 1;

      // Reset if off-screen
      if (p.y < -20) {
        particles[i] = spawnParticle();
      }
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();


/* ===== 2. COUNTDOWN TIMER ===== */
(function initCountdown() {
  // Set your launch date here: YYYY, MM-1, DD (months are 0-indexed)
  const LAUNCH_DATE = new Date(2025, 8, 1, 0, 0, 0); // → Sept 1, 2025

  const $days    = document.getElementById('days');
  const $hours   = document.getElementById('hours');
  const $minutes = document.getElementById('minutes');
  const $seconds = document.getElementById('seconds');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now  = new Date();
    const diff = LAUNCH_DATE - now;

    if (diff <= 0) {
      $days.textContent    = '00';
      $hours.textContent   = '00';
      $minutes.textContent = '00';
      $seconds.textContent = '00';
      return;
    }

    const totalSec  = Math.floor(diff / 1000);
    const secs      = totalSec % 60;
    const totalMin  = Math.floor(totalSec / 60);
    const mins      = totalMin % 60;
    const totalHr   = Math.floor(totalMin / 60);
    const hrs       = totalHr % 24;
    const days      = Math.floor(totalHr / 24);

    $days.textContent    = pad(days);
    $hours.textContent   = pad(hrs);
    $minutes.textContent = pad(mins);
    $seconds.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();


/* ===== 3. EMAIL NOTIFICATION FORMS ===== */
(function initForms() {
  // Simple in-memory store for demo (replace with your backend/Mailchimp/etc.)
  const waitlist = [];

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function handleSignup(inputId, messageId) {
    const input   = document.getElementById(inputId);
    const message = document.getElementById(messageId);
    if (!input || !message) return;

    const email = input.value.trim();

    if (!email) {
      showMessage(message, '⚠️ Please enter your email.', 'warn');
      return;
    }
    if (!isValidEmail(email)) {
      showMessage(message, '⚠️ That doesn\'t look like a valid email.', 'warn');
      return;
    }
    if (waitlist.includes(email)) {
      showMessage(message, '✅ You\'re already on the list!', 'success');
      return;
    }

    // Add to local list (replace this with your API call)
    waitlist.push(email);
    input.value = '';

    showMessage(message, `🎉 You're on the list! We'll ping you at ${email} on launch day.`, 'success');

    // Update waitlist count on 2nd form
    const msg2 = document.getElementById('signup-message-2');
    if (msg2 && !msg2.classList.contains('success')) {
      msg2.textContent = `Join ${waitlist.length} developer${waitlist.length !== 1 ? 's' : ''} on the waitlist.`;
    }
  }

  function showMessage(el, text, type) {
    el.textContent = text;
    el.style.color = type === 'success' ? '#00d4ff' : '#ffb347';
    el.classList.add(type);
    setTimeout(() => {
      el.style.color = '';
      el.classList.remove(type);
    }, 5000);
  }

  // Bind Hero form
  const btn1 = document.getElementById('notify-btn');
  if (btn1) {
    btn1.addEventListener('click', () => handleSignup('email-input', 'signup-message'));
    document.getElementById('email-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSignup('email-input', 'signup-message');
    });
  }

  // Bind CTA form
  const btn2 = document.getElementById('notify-btn-2');
  if (btn2) {
    btn2.addEventListener('click', () => handleSignup('email-input-2', 'signup-message-2'));
    document.getElementById('email-input-2')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSignup('email-input-2', 'signup-message-2');
    });
  }
})();


/* ===== 4. SCROLL REVEAL — Fade in elements as they enter viewport ===== */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.problem-card, .feature-item, .audience-chip, .section-header');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity  = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    observer.observe(el);
  });
})();
