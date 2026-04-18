/* ============================================================
   DREMORA — LAUNCH EXTRAS JS
   Handles: Launch Popup · Announcement Bar · Scroll-to-Top
            Live Visitor Counter · Engagement Hooks
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. LAUNCH POPUP ── */
  (function initLaunchPopup() {
    const overlay   = document.getElementById('launch-popup-overlay');
    const closeBtn  = document.getElementById('popup-close-btn');
    if (!overlay) return;

    // Only show once per session (not every page visit)
    const POPUP_KEY = 'dremora_launch_popup_seen';
    if (sessionStorage.getItem(POPUP_KEY)) {
      overlay.classList.add('hidden');
      return;
    }

    // Show after 1.8 seconds
    const showTimer = setTimeout(() => {
      overlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // prevent scroll while open
    }, 1800);

    function closePopup() {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.35s ease';
      setTimeout(() => {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
      }, 350);
      sessionStorage.setItem(POPUP_KEY, '1');
    }

    closeBtn && closeBtn.addEventListener('click', closePopup);

    // Click outside popup box closes it
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePopup();
    });

    // ESC key closes it
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') {
        closePopup();
        document.removeEventListener('keydown', esc);
      }
    });
  })();


  /* ── 2. ANNOUNCEMENT BAR DISMISS ── */
  (function initAnnouncementBar() {
    const bar      = document.getElementById('announcement-bar');
    const closeBtn = document.getElementById('annCloseBtn');
    if (!bar || !closeBtn) return;

    const BAR_KEY = 'dremora_ann_bar_closed';
    if (localStorage.getItem(BAR_KEY)) {
      bar.remove();
      document.body.classList.remove('has-ann-bar');
      // also reset navbar top
      const navbar = document.getElementById('navbar');
      if (navbar) navbar.style.top = '';
      return;
    }

    closeBtn.addEventListener('click', () => {
      bar.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      bar.style.opacity    = '0';
      bar.style.transform  = 'translateY(-100%)';
      setTimeout(() => {
        bar.remove();
        document.body.classList.remove('has-ann-bar');
        const navbar = document.getElementById('navbar');
        if (navbar) { navbar.style.top = '0'; navbar.style.transition = 'top 0.3s ease'; }
      }, 300);
      localStorage.setItem(BAR_KEY, '1');
    });
  })();


  /* ── 3. SCROLL-TO-TOP BUTTON ── */
  (function initScrollTop() {
    const btn = document.getElementById('scroll-top-btn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();


  /* ── 5. WHATSAPP FAB — hide/show on scroll direction ── */
  (function initWhatsAppFab() {
    const fab = document.getElementById('whatsapp-fab');
    if (!fab) return;

    let lastScroll = 0;
    let hideTimer;

    window.addEventListener('scroll', () => {
      const curr = window.scrollY;

      clearTimeout(hideTimer);

      if (curr > lastScroll && curr > 200) {
        // scrolling down → shrink slightly
        fab.style.transform = 'scale(0.88)';
        fab.style.opacity   = '0.75';
      } else {
        // scrolling up → full size
        fab.style.transform = '';
        fab.style.opacity   = '1';
      }

      lastScroll = curr;
    }, { passive: true });
  })();


  /* ── 6. MICRO-INTERACTION: Highlight CTA on long idle ── */
  (function initIdleNudge() {
    let idleTimer;
    const ctaBtn = document.querySelector('.btn.btn-primary.btn-lg');
    if (!ctaBtn) return;

    function resetIdle() {
      clearTimeout(idleTimer);
      ctaBtn.style.animation = '';

      idleTimer = setTimeout(() => {
        // After 45s idle, gently pulse the CTA button
        ctaBtn.style.animation = 'glow-pulse-btn 1.6s ease-in-out 3';
        ctaBtn.addEventListener('animationend', () => {
          ctaBtn.style.animation = '';
        }, { once: true });
      }, 45000);
    }

    ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(ev =>
      window.addEventListener(ev, resetIdle, { passive: true })
    );
    resetIdle();
  })();


  /* ── 8. CONFETTI BURST on popup open (CSS-only fallback safe) ── */
  (function initConfetti() {
    const confettiEl = document.querySelector('.popup-confetti');
    if (!confettiEl) return;

    // Extra pop animation when popup opens
    setTimeout(() => {
      confettiEl.style.transform  = 'scale(1.4) rotate(15deg)';
      confettiEl.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => {
        confettiEl.style.transform = '';
      }, 300);
    }, 2200);
  })();

})();
