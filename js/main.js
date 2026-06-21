/**
 * DREMORA IT — MAIN.JS
 * Animation Engine, Navigation, Interactions
 */

'use strict';

(function () {

  /* ========================================================================
     1. NAV — SCROLL BLUR + MOBILE DRAWER
     ======================================================================== */
  const navbar = document.getElementById('navbar');
  const mobileBtn = document.getElementById('navMobileBtn');
  const navDrawer = document.getElementById('navDrawer');
  let drawerOpen = false;

  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on load
  }

  if (mobileBtn && navDrawer) {
    mobileBtn.addEventListener('click', () => {
      drawerOpen = !drawerOpen;
      navDrawer.classList.toggle('open', drawerOpen);
      mobileBtn.setAttribute('aria-expanded', drawerOpen);
      mobileBtn.innerHTML = drawerOpen
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>';
    });

    // Close drawer on link click
    navDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawerOpen = false;
        navDrawer.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', false);
        mobileBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>';
      });
    });
  }

  /* ========================================================================
     2. REVEAL ANIMATIONS — INTERSECTION OBSERVER
     ======================================================================== */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '-60px 0px',
      threshold: 0.1,
    }
  );

  // Observe all single-element reveals
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });

  // Observe stagger parents and assign --stagger-index to children
  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const parent = entry.target;
          parent.classList.add('revealed');
          const children = parent.querySelectorAll(':scope > *');
          children.forEach((child, i) => {
            child.style.setProperty('--stagger-index', i);
          });
          staggerObserver.unobserve(parent);
        }
      });
    },
    {
      rootMargin: '-40px 0px',
      threshold: 0.05,
    }
  );

  document.querySelectorAll('.stagger-children').forEach(el => {
    staggerObserver.observe(el);
  });

  /* ========================================================================
     3. MAGNETIC BUTTONS
     ======================================================================== */
  function initMagneticButtons() {
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = 0.25;
        btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  initMagneticButtons();

  /* ========================================================================
     4. COUNTER ANIMATION
     ======================================================================== */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1600;
    const start = performance.now();

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(easeOut(progress) * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-counter]').forEach(el => {
    counterObserver.observe(el);
  });

  /* ========================================================================
     5. PROCESS STEPS — ACTIVATE ON SCROLL
     ======================================================================== */
  const processSteps = document.querySelectorAll('.process-step');
  if (processSteps.length) {
    const processObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          processSteps.forEach((step, i) => {
            setTimeout(() => step.classList.add('active'), i * 150);
          });
          processObserver.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    const processSection = document.querySelector('.process-grid');
    if (processSection) processObserver.observe(processSection);
  }

  /* ========================================================================
     6. SMOOTH SCROLL FOR ANCHOR LINKS
     ======================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ========================================================================
     7. SCROLL TO TOP BUTTON
     ======================================================================== */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ========================================================================
     8. NAV ACTIVE LINK — BASED ON CURRENT PAGE
     ======================================================================== */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPath)) {
      link.classList.add('active');
    } else if (currentPath === 'index.html' && href === 'index.html') {
      link.classList.add('active');
    } else if (currentPath === '' && href === 'index.html') {
      link.classList.add('active');
    }
  });

  /* ========================================================================
     9. HERO SUBTLE PARALLAX (desktop only, performance-safe)
     ======================================================================== */
  if (window.innerWidth > 1024) {
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        heroVisual.style.transform = `translateY(${scrolled * 0.12}px)`;
      }, { passive: true });
    }
  }

  /* ========================================================================
     10. CURSOR GLOW EFFECT (subtle, desktop only)
     ======================================================================== */
  if (window.innerWidth > 1024 && window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    glow.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 0;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
      top: 0; left: 0;
    `;
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  /* ========================================================================
     11. CONTACT FORM — SUPABASE BACKEND
     ======================================================================== */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<svg class="spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg> Sending...';

      const formData = new FormData(contactForm);
      const dataObj = Object.fromEntries(formData.entries());

      const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : 'https://dremora.onrender.com';

      try {
        const res = await fetch(`${API_BASE}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataObj),
        });
        const result = await res.json();

        if (res.ok) {
          const successEl = document.getElementById('formSuccessState');
          if (successEl) {
            contactForm.style.display = 'none';
            successEl.style.display = 'flex';
          } else {
            showToast('Message sent! We\'ll be in touch within a few hours.', 'success');
            contactForm.reset();
          }
        } else {
          showToast(result.message || 'Something went wrong. Please try again.', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Connection error. Please email us directly.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    });
  }

  /* ========================================================================
     12. INTERNSHIP FORM
     ======================================================================== */
  const internshipForm = document.getElementById('internshipForm');
  if (internshipForm) {
    internshipForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = internshipForm.querySelector('[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<svg class="spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg> Submitting...';

      const formData = new FormData(internshipForm);
      const dataObj = Object.fromEntries(formData.entries());

      const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : 'https://dremora.onrender.com';

      try {
        const res = await fetch(`${API_BASE}/api/internship/apply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataObj),
        });
        const result = await res.json();

        if (res.ok) {
          showToast('Application submitted! We\'ll review it and reach out.', 'success');
          internshipForm.reset();
        } else {
          showToast(result.message || 'Something went wrong.', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Connection error. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    });
  }

  /* ========================================================================
     13. TOAST NOTIFICATION
     ======================================================================== */
  function showToast(message, type = 'success') {
    const existing = document.getElementById('drm-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'drm-toast';
    const bg = type === 'success' ? 'rgba(22,163,74,0.95)' : 'rgba(220,38,38,0.95)';
    toast.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 24px;
      z-index: 9999;
      background: ${bg};
      color: white;
      padding: 14px 20px;
      border-radius: 12px;
      font-family: var(--font-sans);
      font-size: 14px;
      font-weight: 500;
      max-width: 340px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      line-height: 1.5;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  // Expose for external use
  window.DRMtoast = showToast;

  /* ========================================================================
     14. FAQ ACCORDION
     ======================================================================== */
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.parentElement;
      const isActive = parent.classList.contains('active');
      
      // Close all other FAQs
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      // Toggle current FAQ
      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });

  /* ========================================================================
     15. ACTIVE STATE FOR AI CHAT (legacy compat)
     ======================================================================== */
  // If there's a legacy AI chat widget from previous version, we keep it.
  // The PHP endpoint (backend/api/ai.php) handles the actual AI calls.

})();
