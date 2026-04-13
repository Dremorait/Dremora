document.addEventListener('DOMContentLoaded', () => {

  // ---- Device detection ----
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  const isMobile      = window.matchMedia('(max-width: 768px)').matches;

  // ---- Navbar Scroll Effect ----
  const navbar = document.getElementById('navbar');
  const handleNavScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ---- Mobile Menu Toggle ----
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileMenuBtn && navLinks) {
    const mobileMenuIcon = mobileMenuBtn.querySelector('i');
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('nav-active');
      mobileMenuIcon.classList.toggle('fa-bars');
      mobileMenuIcon.classList.toggle('fa-xmark');
    });
    navLinks.querySelectorAll('a').forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('nav-active');
        mobileMenuIcon.classList.remove('fa-xmark');
        mobileMenuIcon.classList.add('fa-bars');
      });
    });
  }

  // ---- Scroll Reveal (supports reveal, reveal-left, reveal-right, stagger-children) ----
  const revealSelectors = '.reveal, .reveal-left, .reveal-right, .stagger-children';
  const revealElements = document.querySelectorAll(revealSelectors);
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ---- Animated Counter ----
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = eased * target;
      el.textContent = prefix + (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  }

  // ---- Typewriter Effect ----
  const typewriterEls = document.querySelectorAll('[data-typewriter]');
  typewriterEls.forEach(el => {
    const phrases = el.dataset.typewriter.split('|');
    let phraseIdx = 0, charIdx = 0, deleting = false;
    const cursorEl = document.createElement('span');
    cursorEl.className = 'typewriter-cursor';
    el.parentNode.insertBefore(cursorEl, el.nextSibling);

    function type() {
      const current = phrases[phraseIdx];
      if (!deleting) {
        el.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          setTimeout(() => { deleting = true; type(); }, 2200);
          return;
        }
        setTimeout(type, 75);
      } else {
        el.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 40);
      }
    }
    type();
  });

  // ---- Cursor Glow Effect (desktop only) ----
  if (!isTouchDevice) {
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);
    let cx = 0, cy = 0, tx = 0, ty = 0;

    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });

    function animateCursor() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      cursorGlow.style.left = cx + 'px';
      cursorGlow.style.top = cy + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('.btn, a, button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorGlow.style.width = '50px';
        cursorGlow.style.height = '50px';
      });
      el.addEventListener('mouseleave', () => {
        cursorGlow.style.width = '20px';
        cursorGlow.style.height = '20px';
      });
    });
  }

  // ---- Tilt Effect on Cards (desktop only) ----
  if (!isTouchDevice) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -6;
        const rotateY = (x - centerX) / centerX * 6;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      }, { passive: true });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ---- Progress Bar Animation ----
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  if (progressBars.length > 0) {
    const pbObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          pbObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    progressBars.forEach(pb => pbObserver.observe(pb));
  }

  // ---- Canvas Particle Background (desktop only — too heavy for mobile) ----
  const canvas = document.getElementById('hero-particles');
  if (canvas && !isMobile) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;

    window.addEventListener('resize', () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }, { passive: true });

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 210, 255, ${p.alpha})`;
        ctx.fill();
      });
      // Draw connections (fewer on smaller screens)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 210, 255, ${0.05 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  } else if (canvas) {
    // Hide canvas on mobile to avoid blank space
    canvas.style.display = 'none';
  }

});
