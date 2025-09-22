// Interactivity: mobile nav, header shadow, scroll reveal, counters, branding
(function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const header = document.querySelector('.site-header');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('show');
    });
    navMenu.addEventListener('click', e => {
      if (e.target instanceof Element && e.target.tagName === 'A') {
        navMenu.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function onScroll() {
    if (window.scrollY > 10) header?.classList.add('scrolled'); else header?.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scroll reveal
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('reveal-visible'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  // Animated counters
  function animateCount(el, to, duration = 1200) {
    const start = 0;
    const startTime = performance.now();
    function frame(now) {
      const p = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(start + (to - start) * eased);
      el.textContent = val.toLocaleString();
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if (!prefersReduced) {
    document.querySelectorAll('.counter[data-count-to]')
      .forEach(el => {
        const to = Number(el.getAttribute('data-count-to'));
        if (!Number.isNaN(to)) animateCount(el, to);
      });
  } else {
    document.querySelectorAll('.counter[data-count-to]')
      .forEach(el => el.textContent = el.getAttribute('data-count-to') || '');
  }

  // Branding: set project name once
  const BRAND_NAME = 'Ayusin.ph'; // replace to rebrand site
  document.querySelectorAll('[data-project-name]').forEach(el => el.textContent = BRAND_NAME);

  // Parallax for hero blobs
  const hero = document.querySelector('.hero');
  const blobs = Array.from(document.querySelectorAll('.blob'));
  function parallax(e) {
    if (!hero || prefersReduced) return;
    const rect = hero.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;   // -0.5..0.5
    const dy = (e.clientY - cy) / rect.height;  // -0.5..0.5
    blobs.forEach((b, i) => {
      const depth = (i + 1) * 8; // different layers
      b.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
    });
  }
  if (hero && !prefersReduced) {
    window.addEventListener('pointermove', parallax, { passive: true });
  }

  // Tilt effect for cards
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    let rafId = 0;
    function onMove(e) {
      if (prefersReduced) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;  // 0..1
      const y = (e.clientY - rect.top) / rect.height;  // 0..1
      const rx = (0.5 - y) * 8; // rotate X
      const ry = (x - 0.5) * 12; // rotate Y
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      });
    }
    function onLeave() {
      cancelAnimationFrame(rafId);
      card.style.transform = '';
    }
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });

  // Scroll progress bar
  const progressBar = document.querySelector('.scroll-progress .bar');
  if (progressBar) {
    const updateProgress = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop || document.body.scrollTop);
      const height = (h.scrollHeight - h.clientHeight);
      const pct = height > 0 ? (scrolled / height) * 100 : 0;
      progressBar.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // Removed sun motif

  // Marquee duplication for seamless scroll
  const marquee = document.getElementById('marquee-track');
  if (marquee) {
    marquee.innerHTML = marquee.innerHTML + marquee.innerHTML; // duplicate
  }

  // Starfield (subtle, performance-aware)
  const starCanvas = document.getElementById('starfield');
  if (starCanvas && !prefersReduced) {
    const ctx = starCanvas.getContext('2d');
    let stars = [];
    let raf = 0;
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      starCanvas.width = starCanvas.clientWidth * dpr;
      starCanvas.height = starCanvas.clientHeight * dpr;
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const area = starCanvas.clientWidth * starCanvas.clientHeight;
      const count = Math.min(180, Math.max(80, Math.floor(area / 12000)));
      stars = new Array(count).fill(0).map(() => ({
        x: Math.random() * starCanvas.clientWidth,
        y: Math.random() * starCanvas.clientHeight,
        z: 0.5 + Math.random() * 1.5,
        r: 0.6 + Math.random() * 1.2,
        a: 0.25 + Math.random() * 0.55
      }));
    }
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, starCanvas.clientWidth, starCanvas.clientHeight);
      for (const s of stars) {
        ctx.globalAlpha = s.a;
        ctx.fillStyle = '#0b1220';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        s.x += 0.04 * s.z; // slow drift
        if (s.x > starCanvas.clientWidth + 2) s.x = -2;
      }
      raf = requestAnimationFrame(draw);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(starCanvas);
    resize();
    draw();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf); else draw();
    });
  }

  // Jump-to pill toggle
  const jumpToggle = document.querySelector('.jump-toggle');
  const jumpMenu = document.getElementById('jump-menu');
  if (jumpToggle && jumpMenu) {
    const close = () => { if (!jumpMenu.hidden) { jumpMenu.hidden = true; jumpToggle.setAttribute('aria-expanded', 'false'); } };
    const open = () => { if (jumpMenu.hidden) { jumpMenu.hidden = false; jumpToggle.setAttribute('aria-expanded', 'true'); } };
    jumpToggle.addEventListener('click', () => {
      const expanded = jumpToggle.getAttribute('aria-expanded') === 'true';
      expanded ? close() : open();
    });
    jumpToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const expanded = jumpToggle.getAttribute('aria-expanded') === 'true';
        expanded ? close() : open();
      }
      if (e.key === 'Escape') close();
    });
    document.addEventListener('click', (e) => {
      if (!jumpMenu.hidden && !jumpMenu.contains(e.target) && !jumpToggle.contains(e.target)) close();
    });
    window.addEventListener('scroll', () => { if (!jumpMenu.hidden) close(); }, { passive: true });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    jumpMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  // Interactive roadmap timeline
  (function initTimeline(){
    const wrap = document.querySelector('#roadmap .timeline-wrap');
    if (!wrap) return;
    const line = wrap.querySelector('.timeline');
    const progress = wrap.querySelector('.timeline .progress');
    const milestones = Array.from(wrap.querySelectorAll('.milestone'));
    let currentPct = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setProgress(pct){
      currentPct = Math.max(0, Math.min(100, pct));
      if (progress) progress.style.width = currentPct + '%';
    }

    // Animate progress when in view
    if (!prefersReducedMotion && 'IntersectionObserver' in window && line) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const start = performance.now();
            const duration = 1500;
            function step(now){
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setProgress(100 * eased);
              if (t < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            io.disconnect();
          }
        });
      }, { threshold: 0.3 });
      io.observe(line);
    }

    // Hover/focus milestones → snap progress
    milestones.forEach(ms => {
      const pct = Number(ms.getAttribute('data-pct')) || 0;
      ms.addEventListener('mouseenter', () => { setProgress(pct); ms.classList.add('active'); });
      ms.addEventListener('mouseleave', () => { ms.classList.remove('active'); });
      ms.addEventListener('focus', () => { setProgress(pct); ms.classList.add('active'); });
      ms.addEventListener('blur', () => { ms.classList.remove('active'); });
      ms.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setProgress(pct); }
      });
    });

    // Pointer move scrub on the line (desktop only)
    if (!prefersReducedMotion && line) {
      line.addEventListener('pointermove', (e) => {
        const rect = line.getBoundingClientRect();
        const pct = ((e.clientX - rect.left) / rect.width) * 100;
        setProgress(pct);
      });
    }
  })();
})();
