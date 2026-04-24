/* ===== DREMORA PREMIUM ANIMATIONS v2 ===== */
'use strict';

(function () {

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const isTouch  = window.matchMedia('(hover: none)').matches;

  /* ============================================================
     UTILITY: Intersection Observer factory
  ============================================================ */
  function onVisible(selector, callback, options) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { callback(e.target); obs.unobserve(e.target); }
      });
    }, Object.assign({ threshold: 0.15, rootMargin: '0px 0px -60px 0px' }, options || {}));
    els.forEach(el => obs.observe(el));
  }

  /* ============================================================
     1. PAGE LOADER + CINEMATIC ZOOM-IN
  ============================================================ */
  function initLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    const hero = document.getElementById('home');

    function reveal() {
      loader.classList.add('loaded');
      if (hero) {
        hero.classList.add('cinematic-zoom-in');
        // Tag hero children for staggered rise
        const container = hero.querySelector('.hero-zoom-target');
        if (container) {
          Array.from(container.children).forEach((child, i) => {
            child.classList.add('hero-rise', `hero-rise-${Math.min(i + 1, 5)}`);
          });
        }
      }
    }

    if (document.readyState === 'complete') {
      setTimeout(reveal, 1400);
    } else {
      window.addEventListener('load', () => setTimeout(reveal, 1400));
    }
  }

  /* ============================================================
     2. ENHANCED 3D HOVER WITH GLARE
  ============================================================ */
  function init3DHover() {
    if (isTouch) return;

    document.querySelectorAll('.card-3d').forEach(card => {
      // Inject glare layer
      if (!card.querySelector('.card-3d-glare')) {
        const glare = document.createElement('div');
        glare.className = 'card-3d-glare';
        card.appendChild(glare);
      }
      const glare = card.querySelector('.card-3d-glare');

      card.addEventListener('mousemove', e => {
        const r    = card.getBoundingClientRect();
        const x    = e.clientX - r.left;
        const y    = e.clientY - r.top;
        const cx   = r.width  / 2;
        const cy   = r.height / 2;
        const rotX = ((y - cy) / cy) * -13;
        const rotY = ((x - cx) / cx) *  13;

        card.style.transform  = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(12px)`;
        card.style.transition = 'transform 0.05s linear';

        const gx = (x / r.width)  * 100;
        const gy = (y / r.height) * 100;
        glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.14) 0%, transparent 62%)`;
        glare.style.opacity    = '1';
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        card.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
        card.style.transition = 'transform 0.55s cubic-bezier(0.22,1,0.36,1)';
        glare.style.opacity   = '0';
      });
    });
  }

  /* ============================================================
     3. PARALLAX STORYTELLING
  ============================================================ */
  function initParallax() {
    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length || isMobile) return;

    let ticking = false;
    function update() {
      const sy = window.scrollY;
      els.forEach(el => {
        const speed  = parseFloat(el.dataset.parallax) || 0.3;
        const rect   = el.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2);
        el.style.transform = `translateY(${offset * speed * -1}px)`;
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });

    update();

    // Story items reveal
    onVisible('.story-item', el => el.classList.add('active'), { threshold: 0.2 });
  }

  /* ============================================================
     4. IMMERSIVE REVEAL ANIMATIONS
  ============================================================ */
  function initReveal() {
    // Standard clip/scale reveals
    onVisible('.imm-reveal',    el => el.classList.add('active'));
    onVisible('.curtain-reveal',el => el.classList.add('active'));
    onVisible('.scale-reveal',  el => el.classList.add('active'));
    onVisible('.reveal-stagger',el => el.classList.add('active'));

    // Wipe reveal
    onVisible('.wipe-wrap', el => el.classList.add('active'));

    // Word-by-word reveal
    document.querySelectorAll('.word-reveal').forEach(el => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map((w, i) =>
        `<span class="word" style="transition-delay:${i * 0.06}s">${w}&nbsp;</span>`
      ).join('');
    });
    onVisible('.word-reveal', el => el.classList.add('active'));
  }

  /* ============================================================
     5. 3D SLIDER
  ============================================================ */
  function initSlider3D() {
    const stage = document.querySelector('.slider3d-stage');
    if (!stage) return;

    const slides   = Array.from(stage.querySelectorAll('.slider3d-slide'));
    const dotsWrap = document.querySelector('.s3d-dots');
    const total    = slides.length;
    let   current  = 0;
    let   autoplay;

    // Build dots
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 's3d-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', `Slide ${i + 1}`);
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
      });
    }

    function getPos(slideIdx, active) {
      let diff = slideIdx - active;
      // Wrap around
      if (diff >  Math.floor(total / 2)) diff -= total;
      if (diff < -Math.floor(total / 2)) diff += total;
      if (Math.abs(diff) > 2) return 'hidden';
      return String(diff);
    }

    function render() {
      slides.forEach((slide, i) => {
        const pos = getPos(i, current);
        slide.dataset.pos = pos;
      });
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.s3d-dot').forEach((d, i) => {
          d.classList.toggle('active', i === current);
        });
      }
    }

    function goTo(idx) {
      current = ((idx % total) + total) % total;
      render();
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    // Nav buttons
    const btnPrev = document.getElementById('s3d-prev');
    const btnNext = document.getElementById('s3d-next');
    if (btnPrev) btnPrev.addEventListener('click', () => { prev(); resetAuto(); });
    if (btnNext) btnNext.addEventListener('click', () => { next(); resetAuto(); });

    // Click any non-active slide to go there
    slides.forEach((slide, i) => {
      slide.addEventListener('click', () => {
        if (i !== current) { goTo(i); resetAuto(); }
      });
    });

    // Touch swipe
    let touchStartX = 0;
    stage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend',   e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); resetAuto(); }
    });

    // Keyboard
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { next(); resetAuto(); }
      if (e.key === 'ArrowLeft')  { prev(); resetAuto(); }
    });

    function startAuto() { autoplay = setInterval(next, 4500); }
    function resetAuto() { clearInterval(autoplay); startAuto(); }

    render();
    startAuto();

    // Pause on hover
    stage.addEventListener('mouseenter', () => clearInterval(autoplay));
    stage.addEventListener('mouseleave', startAuto);
  }

  /* ============================================================
     6. EXPLODING ORBIT OBJECTS
  ============================================================ */
  function initOrbit() {
    const canvas = document.querySelector('.orbit-canvas');
    if (!canvas) return;

    const nodes     = canvas.querySelectorAll('.orbit-node');
    const popups    = canvas.querySelectorAll('.orbit-popup');
    let   openPopup = null;

    function closeAll() {
      popups.forEach(p => p.classList.remove('show'));
      openPopup = null;
    }

    // Burst particle effect
    function burst(x, y) {
      const wrap = document.createElement('div');
      wrap.className = 'burst-wrap';
      wrap.style.left = x + 'px';
      wrap.style.top  = y + 'px';
      canvas.appendChild(wrap);

      const colors = ['#00d2ff', '#8a2be2', '#3a7bd5', '#ffd700'];
      const count  = 14;
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'burst-p';
        const angle = (i / count) * 360;
        const dist  = 40 + Math.random() * 40;
        const rad   = angle * Math.PI / 180;
        p.style.setProperty('--bx', Math.cos(rad) * dist + 'px');
        p.style.setProperty('--by', Math.sin(rad) * dist + 'px');
        p.style.background = colors[i % colors.length];
        p.style.animationDuration = (0.5 + Math.random() * 0.3) + 's';
        wrap.appendChild(p);
      }
      setTimeout(() => wrap.remove(), 900);
    }

    nodes.forEach(node => {
      const popupId = node.dataset.popup;
      const popup   = popupId ? canvas.querySelector(`#${popupId}`) : null;

      node.addEventListener('click', e => {
        e.stopPropagation();

        // Burst effect at click position
        const r  = canvas.getBoundingClientRect();
        const nr = node.getBoundingClientRect();
        burst(nr.left - r.left + nr.width / 2, nr.top - r.top + nr.height / 2);

        // Explode animation
        node.classList.remove('exploded');
        void node.offsetWidth; // reflow
        node.classList.add('exploded');

        if (popup) {
          const isOpen = popup.classList.contains('show');
          closeAll();
          if (!isOpen) {
            popup.classList.add('show');
            openPopup = popup;
          }
        } else {
          closeAll();
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!canvas.contains(e.target)) closeAll();
    });

    // Animate orbit nodes on their ring angles
    // Nodes are pre-positioned via CSS absolute; we animate them rotating with JS
    // for smooth circular paths that respect the CSS rings.
    const orbitDefs = [
      // [node selector, radius-x, radius-y, initial-angle-deg, speed-deg/frame]
      ['[data-orbit="1a"]',  90,  90,   0,  0.4],
      ['[data-orbit="1b"]',  90,  90, 180,  0.4],
      ['[data-orbit="2a"]', 150, 150,  60,  0.25],
      ['[data-orbit="2b"]', 150, 150, 240,  0.25],
      ['[data-orbit="2c"]', 150, 150, 120, -0.25],
      ['[data-orbit="3a"]', 210, 210,  30,  0.15],
      ['[data-orbit="3b"]', 210, 210, 150,  0.15],
      ['[data-orbit="3c"]', 210, 210, 270, -0.15],
    ];

    const state = orbitDefs.map(def => ({
      el: canvas.querySelector(def[0]),
      rx: def[1], ry: def[2],
      angle: def[3], speed: def[4]
    })).filter(s => s.el);

    const cx = canvas.offsetWidth  / 2;
    const cy = canvas.offsetHeight / 2;

    function animOrbit() {
      state.forEach(s => {
        s.angle += s.speed;
        const rad = s.angle * Math.PI / 180;
        const nx  = cx + Math.cos(rad) * s.rx - 27; // -half node size
        const ny  = cy + Math.sin(rad) * s.ry - 27;
        s.el.style.left = nx + 'px';
        s.el.style.top  = ny + 'px';

        // Keep popup attached to node
        const popupId = s.el.dataset.popup;
        if (popupId) {
          const popup = canvas.querySelector(`#${popupId}`);
          if (popup && popup.classList.contains('show')) {
            const quadrant = (s.angle % 360 + 360) % 360;
            popup.style.left = (quadrant < 180 ? nx + 60 : nx - 210) + 'px';
            popup.style.top  = (ny - 10) + 'px';
          }
        }
      });
      requestAnimationFrame(animOrbit);
    }
    animOrbit();

    // Core click — burst all
    const core = canvas.querySelector('.orbit-core');
    if (core) {
      core.addEventListener('click', () => {
        burst(canvas.offsetWidth / 2, canvas.offsetHeight / 2);
        state.forEach(s => {
          s.el.classList.remove('exploded');
          void s.el.offsetWidth;
          s.el.classList.add('exploded');
        });
      });
    }
  }

  /* ============================================================
     INIT ALL
  ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    init3DHover();
    initParallax();
    initReveal();
    initSlider3D();
    initOrbit();
  });

})();
