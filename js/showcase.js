/* =============================================================
   DREMORA IT — SHOWCASE SECTION JS
   Project slider, parallax, animations, counters
   ============================================================= */

(function () {
  'use strict';

  /* ── Project Data ────────────────────────────────────────────────────── */
  const PROJECTS = [
    {
      id: 'prototypecafe',
      category: 'Featured Project',
      badge: 'Web Design',
      title: 'Prototype Cafe & Restaurant',
      desc: 'A premium restaurant and cafe website prototype featuring modern UI, elegant food presentation, responsive layouts, immersive animations, and an optimized customer experience.',
      metrics: [
        { val: '4.9', key: 'Google Rating'   },
        { val: '150+',  key: 'Menu Items'   },
        { val: '250',  key: 'Seating Capacity' }
      ],
      outcomes: [
        'Immersive digital dining experience',
        'High-conversion reservation flows',
        'Optimized for mobile viewing',
        'Bespoke micro-interactions'
      ],
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Glassmorphism', 'CSS Animations'],
      accentRgb: '212,175,55',
      dbName: 'PrototypeCafe'
    },
    {
      id: 'crm',
      category: 'Full Product',
      badge: 'Sales Tech',
      title: 'AI CRM System',
      desc: 'An intelligent CRM with AI-powered lead scoring, automated follow-ups, and predictive sales analytics — built to close more deals with less manual effort.',
      metrics: [
        { val: '500+', key: 'Leads Managed'     },
        { val: '67%',  key: 'Conversion Boost'  },
        { val: '3×',   key: 'Faster Follow-up'  }
      ],
      outcomes: [
        'AI lead scoring with 94% accuracy',
        'Automated email sequences & follow-ups',
        'Revenue prediction & pipeline dashboard',
        'Multi-pipeline management'
      ],
      tech: ['React', 'Node.js', 'MongoDB', 'OpenAI', 'Stripe'],
      accentRgb: '139,92,246',
      dbName: 'SalesIQ CRM'
    },
    {
      id: 'erp',
      category: 'ERP Solution',
      badge: 'Enterprise',
      title: 'Dremora ERP',
      desc: 'A modular enterprise resource planning system covering inventory, HR, finance, and operations — built for SMEs scaling rapidly without the complexity of SAP.',
      metrics: [
        { val: '5',    key: 'Modules Integrated'    },
        { val: '80%',  key: 'Manual Work Reduced'   },
        { val: '100%', key: 'Uptime SLA'            }
      ],
      outcomes: [
        'Unified inventory & procurement module',
        'HR module with payroll automation',
        'Financial reporting & forecasting',
        'Role-based access control'
      ],
      tech: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'],
      accentRgb: '5,150,105',
      dbName: 'Dremora ERP'
    },
    {
      id: 'ecommerce',
      category: 'Analytics Platform',
      badge: 'Retail Tech',
      title: 'E-Commerce Analytics',
      desc: 'Real-time analytics dashboard for e-commerce operators — tracking sales, user behavior, funnel conversion, and inventory in one unified intelligence view.',
      metrics: [
        { val: '₹50L+', key: 'Revenue Tracked'    },
        { val: '35%',   key: 'ROAS Improvement'   },
        { val: '<1s',   key: 'Data Latency'       }
      ],
      outcomes: [
        'Real-time sales & inventory tracking',
        'Customer behavior heatmaps',
        'Automated reorder alerts',
        'Multi-channel attribution model'
      ],
      tech: ['React', 'Python', 'BigQuery', 'Firebase', 'Looker Studio'],
      accentRgb: '245,158,11',
      dbName: 'Commerce Analytics'
    },
    {
      id: 'college',
      category: 'Management System',
      badge: 'EdTech',
      title: 'College Management Portal',
      desc: 'Comprehensive college management system streamlining admissions, attendance, exams, fee collection, and faculty coordination — all in one platform.',
      metrics: [
        { val: '2K+', key: 'Students'         },
        { val: '90%', key: 'Admin Time Saved'  },
        { val: '15',  key: 'Departments'      }
      ],
      outcomes: [
        'Online admissions & enrollment system',
        'Automated attendance tracking',
        'Exam scheduling & results management',
        'Integrated fee payment via Razorpay'
      ],
      tech: ['PHP', 'Laravel', 'MySQL', 'Vue.js', 'Razorpay'],
      accentRgb: '14,165,233',
      dbName: 'EduPortal'
    }
  ];

  /* ── DOM ─────────────────────────────────────────────────────────────── */
  const section      = document.getElementById('sc-section');
  if (!section) return;

  const scCard       = document.getElementById('scCard');
  const mockupFrame  = document.getElementById('scMockupFrame');
  const detailsPane  = document.getElementById('scDetails');
  const btnPrev      = document.getElementById('scPrev');
  const btnNext      = document.getElementById('scNext');
  const dotsWrap     = document.getElementById('scDots');
  const projLabel    = document.getElementById('scProjLabel');
  const cursorGlow   = document.getElementById('scCursorGlow');
  const dbAppname    = document.getElementById('scDbAppname');

  /* ── State ───────────────────────────────────────────────────────────── */
  let current     = 0;
  let animating   = false;
  let autoTimer   = null;
  let chartInited = false;

  /* ── Build detail slide HTML ─────────────────────────────────────────── */
  function slideHTML(p) {
    const outcomes = p.outcomes.map(o => `
      <div class="sc-outcome">
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
        <span>${o}</span>
      </div>`).join('');

    const metrics = p.metrics.map(m => `
      <div class="sc-proj-metric">
        <div class="sc-proj-metric-val">${m.val}</div>
        <div class="sc-proj-metric-key">${m.key}</div>
      </div>`).join('');

    const tech = p.tech.map((t, i) => `
      <span class="sc-tech-pill" data-delay="${i * 60}">${t}</span>`).join('');

    return `
      <div class="sc-slide active">
        <div class="sc-badges">
          <span class="sc-badge-cat">${p.category}</span>
          <span class="sc-badge-typ">${p.badge}</span>
        </div>
        <h3 class="sc-proj-title">${p.title}</h3>
        <p class="sc-proj-desc">${p.desc}</p>
        <div class="sc-proj-metrics">${metrics}</div>
        <div class="sc-outcomes">${outcomes}</div>
        <div class="sc-tech-pills">${tech}</div>
        <div class="sc-trust">
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
          </svg>
          Built Using Production-Ready Architecture
        </div>
        <div class="sc-cta-row">
          <a href="projects.html" class="btn btn-primary">
            View Case Study
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <a href="contact.html" class="btn btn-secondary">Book A Call</a>
        </div>
      </div>`;
  }

  /* ── Render + animate pills ──────────────────────────────────────────── */
  function renderSlide(idx) {
    detailsPane.innerHTML = slideHTML(PROJECTS[idx]);

    // Stagger tech pills in
    const pills = detailsPane.querySelectorAll('.sc-tech-pill');
    pills.forEach(pill => {
      const delay = parseInt(pill.dataset.delay, 10) || 0;
      setTimeout(() => {
        pill.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        pill.classList.add('visible');
      }, 350 + delay);
    });
  }

  /* ── Update accent color ─────────────────────────────────────────────── */
  function applyAccent(idx) {
    const [r, g, b] = PROJECTS[idx].accentRgb.split(',').map(Number);
    section.style.setProperty('--sc-accent-r', r);
    section.style.setProperty('--sc-accent-g', g);
    section.style.setProperty('--sc-accent-b', b);
    if (dbAppname) dbAppname.textContent = PROJECTS[idx].dbName;
  }

  /* ── Update dots ─────────────────────────────────────────────────────── */
  function updateDots(idx) {
    dotsWrap.querySelectorAll('.sc-dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
    if (projLabel) projLabel.textContent = PROJECTS[idx].title;
  }

  /* ── Go to slide ─────────────────────────────────────────────────────── */
  function goTo(idx, dir = 'next') {
    if (animating) return;
    animating = true;

    // Fade out old slide
    const old = detailsPane.querySelector('.sc-slide');
    if (old) {
      old.classList.add('exit');
      old.style.opacity = '0';
      old.style.transform = dir === 'next' ? 'translateX(-16px)' : 'translateX(16px)';
    }

    current = ((idx % PROJECTS.length) + PROJECTS.length) % PROJECTS.length;

    setTimeout(() => {
      renderSlide(current);
      applyAccent(current);
      updateDots(current);
      triggerChartAnim();
      animating = false;
    }, 320);
  }

  /* ── AutoPlay ────────────────────────────────────────────────────────── */
  function startAuto()  { autoTimer = setInterval(() => goTo(current + 1), 6000); }
  function stopAuto()   { clearInterval(autoTimer); }
  function resetAuto()  { stopAuto(); startAuto(); }

  if (scCard) {
    scCard.addEventListener('mouseenter', stopAuto);
    scCard.addEventListener('mouseleave', startAuto);
  }

  /* ── Button / dot events ─────────────────────────────────────────────── */
  btnPrev.addEventListener('click', () => { goTo(current - 1, 'prev'); resetAuto(); });
  btnNext.addEventListener('click', () => { goTo(current + 1, 'next'); resetAuto(); });

  dotsWrap.querySelectorAll('.sc-dot').forEach((d, i) => {
    d.addEventListener('click', () => { goTo(i); resetAuto(); });
  });

  /* ── Touch / swipe ───────────────────────────────────────────────────── */
  let swipeX = 0;
  section.addEventListener('touchstart', e => { swipeX = e.touches[0].clientX; }, { passive: true });
  section.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - swipeX;
    if (Math.abs(dx) > 50) { goTo(dx < 0 ? current + 1 : current - 1, dx < 0 ? 'next' : 'prev'); resetAuto(); }
  }, { passive: true });

  /* ── Keyboard ────────────────────────────────────────────────────────── */
  document.addEventListener('keydown', e => {
    const r = section.getBoundingClientRect();
    if (r.top > window.innerHeight || r.bottom < 0) return;
    if (e.key === 'ArrowLeft')  { goTo(current - 1, 'prev'); resetAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1, 'next'); resetAuto(); }
  });

  /* ── Mouse parallax ──────────────────────────────────────────────────── */
  section.addEventListener('mousemove', e => {
    const r  = section.getBoundingClientRect();
    const mx = (e.clientX - r.left - r.width  / 2) / r.width;
    const my = (e.clientY - r.top  - r.height / 2) / r.height;

    if (mockupFrame) {
      mockupFrame.style.transform = `translate(${mx * 10}px, ${my * 7}px)`;
    }

    if (cursorGlow) {
      cursorGlow.style.left = (e.clientX - r.left) + 'px';
      cursorGlow.style.top  = (e.clientY - r.top)  + 'px';
    }
  });

  section.addEventListener('mouseleave', () => {
    if (mockupFrame) mockupFrame.style.transform = '';
  });

  /* ── Device toggle ───────────────────────────────────────────────────── */
  section.querySelectorAll('.sc-device-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      section.querySelectorAll('.sc-device-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (mockupFrame) {
        mockupFrame.classList.remove('device-tablet', 'device-mobile');
        if (btn.dataset.device !== 'desktop') {
          mockupFrame.classList.add('device-' + btn.dataset.device);
        }
      }
    });
  });

  /* ── Chart draw animation ────────────────────────────────────────────── */
  function triggerChartAnim() {
    const lines = document.querySelectorAll('.sc-chart-line');
    const areas = document.querySelectorAll('.sc-chart-area');
    lines.forEach(el => { el.classList.remove('animated'); });
    areas.forEach(el => { el.classList.remove('animated'); });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lines.forEach(el => el.classList.add('animated'));
        areas.forEach(el => el.classList.add('animated'));
      });
    });
  }

  /* ── Counter animation ───────────────────────────────────────────────── */
  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target) || 0;
    const duration = 1800;
    const start    = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = target * eased;

      el.textContent = Number.isInteger(target)
        ? Math.round(value).toLocaleString()
        : value.toFixed(1);

      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = Number.isInteger(target) ? target.toLocaleString() : target.toFixed(1);
    }

    requestAnimationFrame(tick);
  }

  /* ── Scroll-triggered entry ──────────────────────────────────────────── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !chartInited) {
        chartInited = true;
        triggerChartAnim();
        startAuto();

        // Count up big counters in metrics bar
        document.querySelectorAll('.sc-counter').forEach(animateCounter);

        // Animate dashboard stat numbers
        document.querySelectorAll('.sc-db-stat-num[data-target]').forEach(animateCounter);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(section);

  /* ── Init ────────────────────────────────────────────────────────────── */
  renderSlide(0);
  applyAccent(0);
  updateDots(0);

})();
