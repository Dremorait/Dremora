/**
 * DREMORA IT — SPARKLES v3.0 KILLER EDITION
 * Full-page body sparkles + ultra-dense hero + gradient beams
 * Identical visual to SparklesCore but pure Vanilla JS
 */

(function () {
  'use strict';

  /* ====================================================
     HELPERS
     ==================================================== */
  function randomId() {
    return 'drm-' + Math.random().toString(36).slice(2, 9);
  }

  /* ====================================================
     PARTICLE CONFIGS
     ==================================================== */
  function makeConfig(o) {
    return {
      fpsLimit: 60,
      background: { color: { value: 'transparent' } },
      fullScreen: { enable: false },
      particles: {
        color: {
          value: o.colors || ['#ffffff'],
          animation: { enable: false },
        },
        number: {
          density: { enable: true, area: o.area || 800 },
          value: o.density || 80,
        },
        opacity: {
          value: { min: o.opMin ?? 0.05, max: o.opMax ?? 0.9 },
          animation: {
            enable: true,
            speed: o.opSpeed || 1.5,
            minimumValue: 0.02,
            sync: false,
            startValue: 'random',
            destroy: 'none',
          },
        },
        size: {
          value: { min: o.sizeMin || 0.3, max: o.sizeMax || 2.5 },
          animation: {
            enable: o.sizeAnim || false,
            speed: 2,
            sync: false,
            startValue: 'random',
          },
        },
        move: {
          enable: true,
          speed: o.speed || { min: 0.04, max: 0.3 },
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'out' },
          attract: { enable: false },
          warp: false,
        },
        shape: { type: 'circle' },
        links: { enable: false },
        twinkle: {
          particles: {
            enable: o.twinkle || false,
            frequency: 0.08,
            opacity: 1,
          },
        },
        shadow: {
          enable: o.glow || false,
          blur: 6,
          color: { value: '#4f83f5' },
        },
        reduceDuplicates: false,
      },
      detectRetina: true,
      interactivity: {
        events: {
          onClick: { enable: false },
          onHover: { enable: false },
          resize: true,
        },
      },
    };
  }

  /* ====================================================
     PRESET LIBRARY
     ==================================================== */
  const P = {
    // Subtle full-page background — barely-there ambient stars
    body: makeConfig({
      density: 4,
      area: 2500,
      sizeMin: 0.2,
      sizeMax: 0.7,
      opMin: 0.02,
      opMax: 0.25,
      opSpeed: 0.5,
      speed: { min: 0.01, max: 0.08 },
      colors: ['#ffffff', '#ffffff', '#7eb3ff'],
    }),

    // Homepage hero — moderate sparkles
    hero: makeConfig({
      density: 70,
      area: 900,
      sizeMin: 0.2,
      sizeMax: 1.6,
      opMin: 0.06,
      opMax: 0.85,
      opSpeed: 1.8,
      speed: { min: 0.03, max: 0.25 },
      colors: [
        '#ffffff', '#ffffff', '#ffffff',
        '#c7dcff', '#b4b8ff',
      ],
      twinkle: true,
      glow: false,
    }),

    // Inner-page heroes
    section: makeConfig({
      density: 45,
      area: 1000,
      sizeMin: 0.2,
      sizeMax: 1.4,
      opMin: 0.05,
      opMax: 0.7,
      opSpeed: 1.4,
      speed: { min: 0.03, max: 0.18 },
      colors: ['#ffffff', '#ffffff', '#c7dcff'],
      twinkle: true,
    }),

    // CTA sections
    cta: makeConfig({
      density: 60,
      area: 900,
      sizeMin: 0.2,
      sizeMax: 1.6,
      opMin: 0.05,
      opMax: 0.8,
      opSpeed: 1.6,
      speed: { min: 0.03, max: 0.22 },
      colors: [
        '#ffffff', '#ffffff', '#ffffff',
        '#93c5fd', '#c4b5fd',
      ],
      twinkle: true,
    }),
  };

  /* ====================================================
     FULL-PAGE BODY SPARKLES
     ==================================================== */
  function initBodySparkles() {
    if (document.getElementById('drm-global-sparkles')) return;

    const wrap = document.createElement('div');
    wrap.id = 'drm-global-sparkles';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.style.cssText = [
      'position:fixed',
      'inset:0',
      'width:100vw',
      'height:100vh',
      'pointer-events:none',
      'z-index:0',
      'opacity:0',
      'transition:opacity 2.5s ease',
    ].join(';');

    document.body.insertBefore(wrap, document.body.firstChild);

    tsParticles.load('drm-global-sparkles', P.body)
      .then(() => {
        requestAnimationFrame(() => {
          setTimeout(() => { wrap.style.opacity = '1'; }, 300);
        });
      })
      .catch(() => {});
  }

  /* ====================================================
     PER-SECTION SPARKLES
     ==================================================== */
  function initSection(el) {
    if (!el.id) el.id = randomId();
    const preset = P[el.dataset.sparkles] || P.section;

    el.style.opacity = '0';
    el.style.transition = 'opacity 1.8s ease';

    tsParticles.load(el.id, preset)
      .then((container) => {
        if (container) {
          requestAnimationFrame(() => {
            setTimeout(() => { el.style.opacity = '1'; }, 100);
          });
        }
      })
      .catch(() => {});
  }



  /* ====================================================
     MAIN INIT
     ==================================================== */
  function boot() {
    if (typeof tsParticles === 'undefined') {
      setTimeout(boot, 600);
      return;
    }

    injectGlowCSS();
    initBodySparkles();

    document.querySelectorAll('[data-sparkles]').forEach(initSection);

    // Gradient beam + enhanced visual removed as it is now baked into the HTML
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.DRMsparkles = { boot, initSection };
})();
