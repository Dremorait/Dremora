/* =============================================================
   DREMORA IT — FEATURED WORK COVERFLOW
   Vanilla-JS 3D coverflow gallery (perspective transform port).
   ============================================================= */
(function () {
  'use strict';

  const PROJECTS = [
    {
      title: 'Dremora House',
      category: 'Luxury Hospitality',
      image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200&auto=format&fit=crop',
      link: 'https://dremora-house.vercel.app/'
    },
    {
      title: 'EDURO',
      category: 'Enterprise Platform',
      image: 'assets/images/eduro.png?v=2',
      link: 'https://eduro-phi.vercel.app/'
    },
    {
      title: 'DRE-CHAIN',
      category: 'AI Automation',
      image: 'assets/images/drechain_preview.png',
      link: 'https://drechain.netlify.app/'
    },
    {
      title: 'Prototype Cafe & Restaurant',
      category: 'Web Design',
      image: 'assets/images/restaurant_prototype.png',
      link: 'https://prototyperestro.netlify.app/'
    },
    {
      title: 'Healthcare Website Prototype',
      category: 'Frontend Development',
      image: 'assets/images/healthcare_prototype.png',
      link: 'https://drmhealth.netlify.app/'
    },
    {
      title: 'E-Commerce Website Prototype',
      category: 'E-Commerce',
      image: 'assets/images/ecommerce_prototype.png',
      link: 'https://drmcommerce.netlify.app/'
    }
  ];

  function domainOf(url) {
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return ''; }
  }

  // Fixed depth/perspective constants — tuned to feel like the reference design.
  const PERSPECTIVE = 1600;
  const SCALE_STEP = 0.16;
  const MAX_VISIBLE = 2;
  const DEPTH = 240;
  const TILT = 9;
  const SIDE_TILT = 6;
  const GAP = 210;
  const INACTIVE_DIM = 0.55;
  const AUTOPLAY_MS = 4500;
  const DUR = 600; // ms, matches --duration-slower-ish feel

  function init() {
    const root = document.getElementById('coverflow');
    const track = document.getElementById('coverflowTrack');
    if (!root || !track) return;

    const n = PROJECTS.length;
    let active = 0;
    let locked = false;
    let autoTimer = null;
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dotsWrap = document.getElementById('coverflowDots');
    const prevBtn = document.getElementById('coverflowPrev');
    const nextBtn = document.getElementById('coverflowNext');

    // Build cards
    const cards = PROJECTS.map((p, i) => {
      const card = document.createElement('a');
      card.className = 'cf-card';
      card.href = p.link;
      card.target = '_blank';
      card.rel = 'noopener';
      card.setAttribute('role', 'group');
      card.setAttribute('aria-roledescription', 'slide');
      card.setAttribute('aria-label', p.title);
      card.innerHTML =
        '<div class="cf-card-bar">' +
          '<span class="cf-card-dots"><span></span><span></span><span></span></span>' +
          '<span class="cf-card-url">' + domainOf(p.link) + '</span>' +
          '<span class="cf-card-live"><span class="cf-card-live-dot"></span>Live</span>' +
        '</div>' +
        '<img class="cf-card-img" src="' + p.image + '" alt="' + p.title + '" draggable="false">' +
        '<div class="cf-card-dim"></div>' +
        '<div class="cf-card-info">' +
          '<span class="cf-card-text">' +
            '<span class="cf-card-category">' + p.category + '</span>' +
            '<span class="cf-card-title">' + p.title + '</span>' +
          '</span>' +
          '<span class="cf-card-cta">View Project' +
            '<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>' +
          '</span>' +
        '</div>';

      card.addEventListener('click', (e) => {
        if (i !== active) {
          e.preventDefault();
          goTo(i);
        }
        // If i === active, let the default link navigation proceed.
        resetAuto();
      });

      track.appendChild(card);
      return card;
    });

    // Build dots
    const dots = PROJECTS.map((p, i) => {
      const dot = document.createElement('button');
      dot.className = 'cf-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Show ' + p.title);
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function render() {
      cards.forEach((card, i) => {
        let rel = i - active;
        if (rel > n / 2) rel -= n;
        if (rel < -n / 2) rel += n;
        const ax = Math.abs(rel);
        const visible = ax <= MAX_VISIBLE;
        const isActive = rel === 0;
        const scale = Math.max(0.4, 1 - ax * SCALE_STEP);
        const tx = rel * GAP;
        const tz = -ax * DEPTH;
        const ry = -rel * TILT;
        const rz = rel * SIDE_TILT;

        card.style.transform =
          'translate(-50%, -50%) translateX(' + tx + 'px) translateZ(' + tz + 'px) ' +
          'rotateY(' + ry + 'deg) rotateZ(' + rz + 'deg) scale(' + scale + ')';
        card.style.opacity = visible ? '1' : '0';
        card.style.pointerEvents = visible ? 'auto' : 'none';
        card.style.zIndex = String(100 - ax);
        card.classList.toggle('cf-card-active', isActive);
        card.setAttribute('aria-hidden', visible ? 'false' : 'true');
        card.querySelector('.cf-card-dim').style.opacity = isActive ? '0' : String(INACTIVE_DIM);
      });

      dots.forEach((d, i) => d.classList.toggle('cf-dot-active', i === active));
    }

    function lock() {
      locked = true;
      window.setTimeout(() => { locked = false; }, Math.max(50, DUR));
    }

    function goTo(i) {
      if (locked) return;
      lock();
      active = ((i % n) + n) % n;
      render();
    }

    function step(dir) { goTo(active + dir); }

    function startAuto() {
      if (reduceMotion || n < 2) return;
      stopAuto();
      autoTimer = window.setInterval(() => step(1), AUTOPLAY_MS);
    }
    function stopAuto() { if (autoTimer) window.clearInterval(autoTimer); }
    function resetAuto() { stopAuto(); startAuto(); }

    prevBtn.addEventListener('click', () => { step(-1); resetAuto(); });
    nextBtn.addEventListener('click', () => { step(1); resetAuto(); });

    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); resetAuto(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); resetAuto(); }
    });

    root.addEventListener('mouseenter', stopAuto);
    root.addEventListener('mouseleave', startAuto);
    root.addEventListener('focusin', stopAuto);
    root.addEventListener('focusout', startAuto);

    // Touch swipe
    let swipeX = 0;
    root.addEventListener('touchstart', (e) => { swipeX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - swipeX;
      if (Math.abs(dx) > 40) { step(dx < 0 ? 1 : -1); resetAuto(); }
    }, { passive: true });

    // Pause offscreen autoplay
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) startAuto(); else stopAuto();
      });
    }, { threshold: 0.2 });
    io.observe(root);

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
