document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     SAM — DREMORA GUIDE ASSISTANT  (No API · No Chat Input)
     A cute & techy AI guide that helps users navigate Dremora IT
  ============================================================ */

  // ── Guide topics Sam knows about ──────────────────────────────
  const GUIDES = [
    {
      icon: '🚀',
      label: 'Our Services',
      title: 'What We Build',
      body: `Dremora IT delivers full-spectrum tech solutions:<br><br>
             <strong>• Web & App Development</strong> — Custom portals, dashboards &amp; SaaS products<br>
             <strong>• AI / ML Integration</strong> — Smart automation, chatbots &amp; analytics<br>
             <strong>• Cloud Infrastructure</strong> — Deployment, DevOps &amp; scaling<br>
             <strong>• UI/UX Design</strong> — Premium, conversion-focused interfaces<br><br>
             Explore our full stack on the <a href="services.html" style="color:#00d2ff">Services page →</a>`
    },
    {
      icon: '🌐',
      label: 'NagarSeva',
      title: 'NagarSeva Platform',
      body: `NagarSeva is our flagship civic-tech platform connecting citizens with municipal services.<br><br>
             <strong>Key features:</strong><br>
             • Real-time grievance tracking<br>
             • Geo-tagged complaint submissions<br>
             • Automated status updates via SMS &amp; email<br>
             • Admin dashboard with analytics<br><br>
             <a href="projects.html" style="color:#00d2ff">See the case study →</a>`
    },
    {
      icon: '🎓',
      label: 'Internship',
      title: 'Internship Program',
      body: `Join Dremora's internship program and work on <strong>real-world projects</strong>.<br><br>
             <strong>What you get:</strong><br>
             • Hands-on experience with modern tech stacks<br>
             • Mentorship from experienced developers<br>
             • Letter of recommendation &amp; certificate<br>
             • Potential for full-time offer<br><br>
             <a href="internship.html" style="color:#00d2ff">Apply now →</a>`
    },
    {
      icon: '📞',
      label: 'Contact Us',
      title: 'Get In Touch',
      body: `We'd love to hear from you!<br><br>
             <strong>📧 Email:</strong> hello@dremoraitconsultants.com<br>
             <strong>📍 Location:</strong> Nashik, Maharashtra, India<br>
             <strong>⏰ Hours:</strong> Mon–Sat, 10am–7pm IST<br><br>
             Drop us a message on the <a href="contact.html" style="color:#00d2ff">Contact page →</a> and we'll respond within 24hrs.`
    },
    {
      icon: '🤝',
      label: 'About Us',
      title: 'About Dremora IT',
      body: `Dremora IT Consultants &amp; Services is a next-gen tech company based in India, building digital products that matter.<br><br>
             <strong>Our mission:</strong> Make powerful technology accessible to every business — from startups to enterprises.<br><br>
             We believe in clean code, stunning design, and solutions that actually work.<br><br>
             <a href="about.html" style="color:#00d2ff">Meet the team →</a>`
    },
    {
      icon: '💼',
      label: 'Projects',
      title: 'Our Portfolio',
      body: `We've shipped products across multiple industries:<br><br>
             • <strong>NagarSeva</strong> — Civic tech &amp; e-governance<br>
             • <strong>CRM Pipeline</strong> — Sales automation system<br>
             • <strong>Café Manager</strong> — Restaurant management suite<br>
             • <strong>AgriTrack</strong> — Agro-monitoring platform<br>
             • <strong>EduCoach</strong> — EdTech coaching platform<br>
             • <strong>IT AI Agent</strong> — Productivity automation<br><br>
             <a href="projects.html" style="color:#00d2ff">View all projects →</a>`
    }
  ];

  // ── SVG Avatar for Sam ────────────────────────────────────────
  const SAM_SVG = `
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
      <defs>
        <radialGradient id="sam-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#1a0533"/>
          <stop offset="100%" stop-color="#0a0c1a"/>
        </radialGradient>
        <radialGradient id="sam-face" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stop-color="#ffd4b8"/>
          <stop offset="100%" stop-color="#f4a97a"/>
        </radialGradient>
        <radialGradient id="sam-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(0,210,255,0.3)"/>
          <stop offset="100%" stop-color="rgba(0,210,255,0)"/>
        </radialGradient>
        <linearGradient id="sam-hair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#c084fc"/>
          <stop offset="100%" stop-color="#818cf8"/>
        </linearGradient>
        <linearGradient id="sam-outfit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#1e1b4b"/>
        </linearGradient>
        <filter id="sam-glow-filter">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      <!-- Outer glow ring -->
      <circle cx="60" cy="60" r="55" fill="url(#sam-glow)" opacity="0.6"/>
      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(0,210,255,0.25)" stroke-width="1"/>

      <!-- Background circle -->
      <circle cx="60" cy="60" r="50" fill="url(#sam-bg)"/>

      <!-- Outfit / body -->
      <ellipse cx="60" cy="105" rx="32" ry="20" fill="url(#sam-outfit)"/>
      <path d="M 35 90 Q 60 80 85 90 L 90 120 L 30 120 Z" fill="url(#sam-outfit)"/>
      <!-- Circuit lines on outfit -->
      <path d="M42 92 L42 100 L50 100" stroke="rgba(0,210,255,0.5)" stroke-width="1" fill="none"/>
      <circle cx="42" cy="100" r="1.5" fill="#00d2ff"/>
      <path d="M78 95 L70 95 L70 103" stroke="rgba(192,132,252,0.5)" stroke-width="1" fill="none"/>
      <circle cx="70" cy="103" r="1.5" fill="#c084fc"/>
      <!-- Collar glow -->
      <path d="M50 88 Q60 83 70 88" stroke="rgba(0,210,255,0.6)" stroke-width="1.5" fill="none"/>

      <!-- Neck -->
      <rect x="54" y="75" width="12" height="14" rx="4" fill="#f4a97a"/>

      <!-- Hair back -->
      <ellipse cx="60" cy="55" rx="30" ry="28" fill="url(#sam-hair)" opacity="0.9"/>
      <!-- Side hair flairs -->
      <path d="M30 50 Q22 60 28 75 Q32 68 36 65" fill="url(#sam-hair)"/>
      <path d="M90 50 Q98 60 92 75 Q88 68 84 65" fill="url(#sam-hair)"/>

      <!-- Face -->
      <ellipse cx="60" cy="57" rx="22" ry="24" fill="url(#sam-face)"/>

      <!-- Hair top / fringe -->
      <path d="M38 50 Q40 30 60 28 Q80 30 82 50 Q75 38 60 36 Q45 38 38 50Z" fill="url(#sam-hair)"/>
      <!-- Fringe strands -->
      <path d="M48 35 Q44 45 46 52" stroke="url(#sam-hair)" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M60 32 Q59 42 59 50" stroke="url(#sam-hair)" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M72 35 Q76 45 74 52" stroke="url(#sam-hair)" stroke-width="5" fill="none" stroke-linecap="round"/>

      <!-- Eyes — cyan glowing -->
      <ellipse cx="51" cy="56" rx="5.5" ry="5.5" fill="#0a0f1e"/>
      <ellipse cx="69" cy="56" rx="5.5" ry="5.5" fill="#0a0f1e"/>
      <!-- Eye irises -->
      <ellipse cx="51" cy="56" rx="4" ry="4" fill="#00d2ff" opacity="0.9"/>
      <ellipse cx="69" cy="56" rx="4" ry="4" fill="#00d2ff" opacity="0.9"/>
      <!-- Eye pupils -->
      <ellipse cx="51" cy="56" rx="2" ry="2" fill="#0a0f1e"/>
      <ellipse cx="69" cy="56" rx="2" ry="2" fill="#0a0f1e"/>
      <!-- Eye highlights -->
      <ellipse cx="52.5" cy="54.5" rx="1.2" ry="1.2" fill="white" opacity="0.9"/>
      <ellipse cx="70.5" cy="54.5" rx="1.2" ry="1.2" fill="white" opacity="0.9"/>
      <!-- Eye glow -->
      <ellipse cx="51" cy="56" rx="5.5" ry="5.5" fill="none" stroke="rgba(0,210,255,0.5)" stroke-width="1"/>
      <ellipse cx="69" cy="56" rx="5.5" ry="5.5" fill="none" stroke="rgba(0,210,255,0.5)" stroke-width="1"/>

      <!-- Eyebrows -->
      <path d="M45 49 Q51 46.5 57 49" stroke="#9333ea" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M63 49 Q69 46.5 75 49" stroke="#9333ea" stroke-width="2" fill="none" stroke-linecap="round"/>

      <!-- Nose -->
      <path d="M59 62 Q60 65 61 62" stroke="rgba(180,100,60,0.4)" stroke-width="1.2" fill="none" stroke-linecap="round"/>

      <!-- Smile -->
      <path d="M52 69 Q60 76 68 69" stroke="rgba(180,80,60,0.6)" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Cheek blush -->
      <ellipse cx="44" cy="66" rx="5" ry="3" fill="rgba(255,150,150,0.35)"/>
      <ellipse cx="76" cy="66" rx="5" ry="3" fill="rgba(255,150,150,0.35)"/>

      <!-- Headphone / tech accessory -->
      <path d="M33 52 Q32 45 38 40 Q60 28 82 40 Q88 45 87 52" stroke="rgba(0,210,255,0.7)" stroke-width="3" fill="none" stroke-linecap="round"/>
      <rect x="29" y="50" width="7" height="11" rx="3" fill="#1e1b4b" stroke="rgba(0,210,255,0.5)" stroke-width="1"/>
      <rect x="84" y="50" width="7" height="11" rx="3" fill="#1e1b4b" stroke="rgba(0,210,255,0.5)" stroke-width="1"/>

      <!-- Floating sparkles -->
      <g opacity="0.8">
        <polygon points="18,20 19.5,23.5 23,25 19.5,26.5 18,30 16.5,26.5 13,25 16.5,23.5" fill="#00d2ff" opacity="0.7"/>
        <polygon points="98,15 99,17.5 101.5,18.5 99,19.5 98,22 97,19.5 94.5,18.5 97,17.5" fill="#c084fc" opacity="0.7"/>
        <circle cx="25" cy="90" r="2" fill="rgba(0,210,255,0.6)"/>
        <circle cx="95" cy="85" r="2.5" fill="rgba(192,132,252,0.6)"/>
      </g>
    </svg>`;

  // ── HTML Template ─────────────────────────────────────────────
  const samHTML = `
    <style>
      /* ===== SAM ASSISTANT WIDGET ===== */
      #sam-widget {
        position: fixed;
        bottom: 28px;
        right: 28px;
        z-index: 2500;
        font-family: var(--font-main, 'Outfit', sans-serif);
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 14px;
      }

      /* ---- Panel ---- */
      #sam-panel {
        display: none;
        flex-direction: column;
        width: 360px;
        max-height: 560px;
        border-radius: 24px;
        overflow: hidden;
        background: rgba(8, 10, 22, 0.97);
        border: 1px solid rgba(0,210,255,0.2);
        box-shadow:
          0 32px 80px rgba(0,0,0,0.8),
          0 0 0 1px rgba(255,255,255,0.04),
          inset 0 1px 0 rgba(255,255,255,0.06),
          0 0 60px rgba(0,210,255,0.05);
        backdrop-filter: blur(24px);
        transform-origin: bottom right;
        animation: sam-panel-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
      }
      @keyframes sam-panel-in {
        from { opacity:0; transform: scale(0.82) translateY(24px); }
        to   { opacity:1; transform: scale(1)    translateY(0); }
      }

      /* ---- Header ---- */
      #sam-header {
        padding: 1rem 1.1rem;
        background: linear-gradient(135deg, rgba(0,210,255,0.1), rgba(138,43,226,0.18));
        border-bottom: 1px solid rgba(255,255,255,0.06);
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
        flex-shrink: 0;
      }
      #sam-avatar-header {
        width: 52px;
        height: 52px;
        flex-shrink: 0;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid rgba(0,210,255,0.4);
        box-shadow: 0 0 16px rgba(0,210,255,0.3);
        animation: sam-avatar-float 3s ease-in-out infinite;
      }
      @keyframes sam-avatar-float {
        0%,100% { transform: translateY(0); }
        50%      { transform: translateY(-3px); }
      }
      #sam-header-info { flex: 1; }
      #sam-header-info h4 {
        font-size: 0.98rem;
        font-weight: 700;
        color: #fff;
        margin: 0;
        letter-spacing: 0.3px;
      }
      #sam-header-info p {
        font-size: 0.72rem;
        color: rgba(255,255,255,0.45);
        margin: 2px 0 0;
      }
      #sam-header-info .sam-status {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.7rem;
        color: rgba(34,197,94,0.9);
        font-weight: 600;
      }
      #sam-header-info .sam-status::before {
        content: '';
        width: 7px; height: 7px;
        border-radius: 50%;
        background: #22c55e;
        display: inline-block;
        animation: sam-pulse-dot 2s ease-in-out infinite;
      }
      @keyframes sam-pulse-dot {
        0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
        50%      { opacity:0.8; box-shadow: 0 0 0 4px rgba(34,197,94,0); }
      }

      #sam-close {
        position: absolute;
        top: 10px; right: 12px;
        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.1);
        color: rgba(255,255,255,0.55);
        width: 28px; height: 28px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.8rem;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.2s ease;
      }
      #sam-close:hover {
        background: rgba(255,77,77,0.15);
        border-color: rgba(255,77,77,0.3);
        color: #ff6b6b;
      }

      /* ---- Intro ---- */
      #sam-intro {
        padding: 1rem 1.1rem 0.5rem;
        flex-shrink: 0;
      }
      #sam-intro-bubble {
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(0,210,255,0.12);
        border-radius: 14px;
        padding: 0.85rem 1rem;
        font-size: 0.84rem;
        color: rgba(255,255,255,0.8);
        line-height: 1.6;
        position: relative;
      }
      #sam-intro-bubble strong { color: #00d2ff; }

      /* ---- Guide grid ---- */
      #sam-topics {
        padding: 0.7rem 1rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        flex-shrink: 0;
      }
      .sam-topic-btn {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px;
        padding: 0.65rem 0.75rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        color: rgba(255,255,255,0.75);
        font-size: 0.8rem;
        font-weight: 600;
        font-family: var(--font-main, 'Outfit', sans-serif);
        transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
        text-align: left;
        position: relative;
        overflow: hidden;
      }
      .sam-topic-btn::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(0,210,255,0.08), rgba(138,43,226,0.08));
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      .sam-topic-btn:hover::before { opacity: 1; }
      .sam-topic-btn:hover {
        border-color: rgba(0,210,255,0.3);
        color: #fff;
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
      }
      .sam-topic-btn.active {
        border-color: rgba(0,210,255,0.5);
        background: rgba(0,210,255,0.06);
        color: #00d2ff;
        transform: translateY(-2px);
      }
      .sam-topic-icon { font-size: 1.1rem; flex-shrink: 0; }
      .sam-topic-label { flex: 1; }

      /* ---- Content card ---- */
      #sam-content {
        margin: 0 1rem 1rem;
        flex-shrink: 0;
        display: none;
        flex-direction: column;
        gap: 0;
      }
      #sam-content-card {
        background: rgba(0,210,255,0.04);
        border: 1px solid rgba(0,210,255,0.18);
        border-radius: 16px;
        padding: 1rem 1.1rem;
        position: relative;
        overflow: hidden;
        animation: sam-card-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
      }
      @keyframes sam-card-in {
        from { opacity:0; transform: scale(0.96) translateY(8px); }
        to   { opacity:1; transform: scale(1)    translateY(0); }
      }
      #sam-content-card::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 2px;
        background: linear-gradient(90deg, #00d2ff, #8a2be2);
      }
      #sam-content-title {
        font-size: 0.92rem;
        font-weight: 700;
        color: #00d2ff;
        margin: 0 0 0.6rem;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      #sam-content-body {
        font-size: 0.82rem;
        color: rgba(255,255,255,0.78);
        line-height: 1.65;
        margin: 0;
      }
      #sam-content-body a {
        color: #00d2ff;
        text-decoration: none;
        font-weight: 600;
      }
      #sam-content-body a:hover { text-decoration: underline; }

      /* ---- Footer ---- */
      #sam-footer {
        padding: 0.5rem 1rem;
        font-size: 0.66rem;
        color: rgba(255,255,255,0.18);
        text-align: center;
        border-top: 1px solid rgba(255,255,255,0.04);
        letter-spacing: 0.4px;
        flex-shrink: 0;
      }
      #sam-footer span { color: rgba(192,132,252,0.55); }

      /* ---- Floating Button ---- */
      #sam-btn {
        position: relative;
        width: 66px;
        height: 66px;
        border-radius: 50%;
        border: 2px solid rgba(0,210,255,0.35);
        cursor: pointer;
        background: linear-gradient(135deg, #0f0c29, #1a0533, #0a1628);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow:
          0 8px 32px rgba(0,0,0,0.6),
          0 0 0 0 rgba(0,210,255,0.3),
          0 0 24px rgba(0,210,255,0.15);
        transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
        animation: sam-btn-glow 3s ease-in-out infinite;
        overflow: hidden;
        padding: 0;
      }
      @keyframes sam-btn-glow {
        0%,100% { box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(0,210,255,0.15); border-color: rgba(0,210,255,0.35); }
        50%      { box-shadow: 0 8px 40px rgba(0,0,0,0.7), 0 0 35px rgba(0,210,255,0.3), 0 0 60px rgba(138,43,226,0.15); border-color: rgba(0,210,255,0.6); }
      }
      #sam-btn:hover {
        transform: scale(1.08) translateY(-3px);
        border-color: rgba(0,210,255,0.8);
      }
      #sam-btn:active { transform: scale(0.96); }
      #sam-btn-avatar {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 50%;
      }

      /* Ripple rings on button */
      #sam-btn::before {
        content: '';
        position: absolute;
        inset: -8px;
        border-radius: 50%;
        border: 2px solid rgba(0,210,255,0.25);
        animation: sam-ring 2.8s ease-out infinite;
        pointer-events: none;
      }
      #sam-btn::after {
        content: '';
        position: absolute;
        inset: -14px;
        border-radius: 50%;
        border: 2px solid rgba(192,132,252,0.15);
        animation: sam-ring 2.8s ease-out infinite 1s;
        pointer-events: none;
      }
      @keyframes sam-ring {
        0%   { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(1.4); opacity: 0; }
      }

      /* ---- Tooltip ---- */
      #sam-tooltip {
        background: rgba(8,10,22,0.96);
        border: 1px solid rgba(0,210,255,0.2);
        color: #fff;
        font-size: 0.8rem;
        font-weight: 600;
        padding: 0.4rem 0.9rem;
        border-radius: 8px;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transform: translateX(10px);
        transition: all 0.3s ease;
        backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        gap: 6px;
      }
      #sam-tooltip.visible { opacity:1; transform: translateX(0); }
      #sam-tooltip .tip-avatar {
        width: 20px; height: 20px;
        border-radius: 50%;
        overflow: hidden;
        border: 1px solid rgba(0,210,255,0.4);
        flex-shrink: 0;
      }

      @media (max-width: 480px) {
        #sam-panel { width: calc(100vw - 32px); }
        #sam-widget { bottom: 20px; right: 16px; }
        #sam-topics { grid-template-columns: 1fr; }
      }
    </style>

    <div id="sam-widget">

      <!-- Tooltip -->
      <div id="sam-tooltip">
        <div class="tip-avatar">${SAM_SVG}</div>
        Hi! I'm Sam ✦ Ask me anything
      </div>

      <!-- Panel -->
      <div id="sam-panel">

        <!-- Header -->
        <div id="sam-header">
          <div id="sam-avatar-header">${SAM_SVG}</div>
          <div id="sam-header-info">
            <h4>Sam</h4>
            <p>Dremora Guide Assistant</p>
            <span class="sam-status">Online &amp; ready to help</span>
          </div>
          <button id="sam-close" title="Close" aria-label="Close Sam"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <!-- Intro bubble -->
        <div id="sam-intro">
          <div id="sam-intro-bubble">
            👋 Hey! I'm <strong>Sam</strong>, your guide to everything Dremora. Pick a topic below and I'll walk you through it!
          </div>
        </div>

        <!-- Topic buttons -->
        <div id="sam-topics"></div>

        <!-- Content card (shown on topic click) -->
        <div id="sam-content">
          <div id="sam-content-card">
            <div id="sam-content-title"></div>
            <div id="sam-content-body"></div>
          </div>
        </div>

        <!-- Footer -->
        <div id="sam-footer">Meet <span>Sam</span> — Your Dremora Guide · © 2026</div>
      </div>

      <!-- Floating button -->
      <button id="sam-btn" title="Chat with Sam" aria-label="Open Sam, your Dremora guide">
        <div id="sam-btn-avatar">${SAM_SVG}</div>
      </button>

    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', samHTML);

  // ── Build topic buttons ───────────────────────────────────────
  const topicsContainer = document.getElementById('sam-topics');
  GUIDES.forEach((guide, i) => {
    const btn = document.createElement('button');
    btn.className = 'sam-topic-btn';
    btn.setAttribute('data-index', i);
    btn.setAttribute('aria-label', guide.label);
    btn.innerHTML = `<span class="sam-topic-icon">${guide.icon}</span><span class="sam-topic-label">${guide.label}</span>`;
    topicsContainer.appendChild(btn);
  });

  // ── Elements ──────────────────────────────────────────────────
  const samBtn     = document.getElementById('sam-btn');
  const samPanel   = document.getElementById('sam-panel');
  const samClose   = document.getElementById('sam-close');
  const samTooltip = document.getElementById('sam-tooltip');
  const samContent = document.getElementById('sam-content');
  const contentCard  = document.getElementById('sam-content-card');
  const contentTitle = document.getElementById('sam-content-title');
  const contentBody  = document.getElementById('sam-content-body');
  const topicBtns  = document.querySelectorAll('.sam-topic-btn');

  // ── Open / Close ──────────────────────────────────────────────
  function openPanel() {
    samPanel.style.display = 'flex';
    samPanel.style.flexDirection = 'column';
    samBtn.classList.add('open');
    samTooltip.classList.remove('visible');
  }
  function closePanel() {
    samPanel.style.display = 'none';
    samBtn.classList.remove('open');
    // Reset content
    samContent.style.display = 'none';
    topicBtns.forEach(b => b.classList.remove('active'));
  }

  samBtn.addEventListener('click', () => {
    samPanel.style.display === 'none' ? openPanel() : closePanel();
  });
  samClose.addEventListener('click', closePanel);

  // ── Topic click → show guide card ────────────────────────────
  topicBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      const guide = GUIDES[idx];

      // Toggle: clicking same topic collapses
      if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        samContent.style.display = 'none';
        return;
      }

      // Mark active
      topicBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Fill content card
      contentTitle.innerHTML = `${guide.icon} ${guide.title}`;
      contentBody.innerHTML  = guide.body;

      // Animate in
      contentCard.style.animation = 'none';
      void contentCard.offsetWidth; // reflow trick
      contentCard.style.animation = '';

      samContent.style.display = 'flex';

      // Scroll to bottom of panel with smooth
      requestAnimationFrame(() => {
        samPanel.scrollTop = samPanel.scrollHeight;
      });
    });
  });

  // ── Tooltip ───────────────────────────────────────────────────
  samBtn.addEventListener('mouseenter', () => {
    if (!samBtn.classList.contains('open')) samTooltip.classList.add('visible');
  });
  samBtn.addEventListener('mouseleave', () => samTooltip.classList.remove('visible'));

  // Auto-show tooltip after 4s
  setTimeout(() => {
    if (!samBtn.classList.contains('open')) {
      samTooltip.classList.add('visible');
      setTimeout(() => samTooltip.classList.remove('visible'), 4500);
    }
  }, 4000);

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!document.getElementById('sam-widget').contains(e.target)) {
      if (samPanel.style.display !== 'none') closePanel();
    }
  });
});
