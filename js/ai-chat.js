document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     DREMORA AI CHAT WIDGET — PREMIUM REDESIGN
  ============================================================ */

  const chatHTML = `
    <style>
      /* ---- Widget Container ---- */
      #ai-chat-widget {
        position: fixed;
        bottom: 28px;
        right: 28px;
        z-index: 2500;
        font-family: var(--font-main, 'Outfit', sans-serif);
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 16px;
      }

      /* ---- Floating Button ---- */
      #ai-chat-btn {
        position: relative;
        width: 62px;
        height: 62px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        background: linear-gradient(135deg, #00d2ff, #8a2be2);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 32px rgba(0,210,255,0.4), 0 0 0 0 rgba(0,210,255,0.4);
        transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
        animation: chat-btn-pulse 3s ease-in-out infinite;
        outline: none;
      }
      #ai-chat-btn:hover {
        transform: scale(1.1) translateY(-3px);
        box-shadow: 0 12px 40px rgba(0,210,255,0.55), 0 0 0 8px rgba(0,210,255,0.08);
      }
      #ai-chat-btn:active { transform: scale(0.97); }

      /* Ripple ring on button */
      #ai-chat-btn::before {
        content: '';
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 2px solid rgba(0,210,255,0.35);
        animation: chat-ring-expand 2.5s ease-out infinite;
      }
      #ai-chat-btn::after {
        content: '';
        position: absolute;
        inset: -12px;
        border-radius: 50%;
        border: 2px solid rgba(138,43,226,0.2);
        animation: chat-ring-expand 2.5s ease-out infinite 0.8s;
      }

      @keyframes chat-btn-pulse {
        0%, 100% { box-shadow: 0 8px 32px rgba(0,210,255,0.4); }
        50%       { box-shadow: 0 8px 40px rgba(0,210,255,0.6), 0 0 60px rgba(138,43,226,0.25); }
      }
      @keyframes chat-ring-expand {
        0%   { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(1.5); opacity: 0; }
      }

      /* The AI logo inside button */
      .chat-btn-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;
      }
      .chat-btn-icon svg {
        width: 28px;
        height: 28px;
        transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease;
      }
      #ai-chat-btn.open .chat-btn-icon svg.icon-bot  { transform: scale(0) rotate(90deg); opacity: 0; position: absolute; }
      #ai-chat-btn.open .chat-btn-icon svg.icon-close { transform: scale(1) rotate(0deg);  opacity: 1; }
      #ai-chat-btn:not(.open) .chat-btn-icon svg.icon-bot   { transform: scale(1); opacity: 1; }
      #ai-chat-btn:not(.open) .chat-btn-icon svg.icon-close { transform: scale(0) rotate(-90deg); opacity: 0; position: absolute; }

      /* ---- Tooltip ---- */
      #ai-chat-tooltip {
        background: rgba(10,14,28,0.95);
        border: 1px solid rgba(0,210,255,0.2);
        color: #fff;
        font-size: 0.82rem;
        font-weight: 600;
        padding: 0.45rem 1rem;
        border-radius: 8px;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transform: translateX(10px);
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }
      #ai-chat-tooltip.visible {
        opacity: 1;
        transform: translateX(0);
      }
      #ai-chat-tooltip::after {
        content: '';
        position: absolute;
        right: -5px;
        top: 50%;
        transform: translateY(-50%);
        border: 5px solid transparent;
        border-left-color: rgba(0,210,255,0.2);
      }

      /* ---- Chat Panel ---- */
      #ai-chat-panel {
        display: none;
        flex-direction: column;
        width: 370px;
        height: 520px;
        border-radius: 24px;
        overflow: hidden;
        border: 1px solid rgba(0,210,255,0.25);
        box-shadow:
          0 30px 80px rgba(0,0,0,0.7),
          0 0 0 1px rgba(255,255,255,0.05),
          inset 0 1px 0 rgba(255,255,255,0.08);
        background: rgba(9,12,25,0.97);
        backdrop-filter: blur(24px);
        transform-origin: bottom right;
        animation: panel-open 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
      }
      @keyframes panel-open {
        from { opacity: 0; transform: scale(0.85) translateY(20px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
      }

      /* ---- Panel Header ---- */
      #ai-chat-header {
        padding: 1.1rem 1.25rem;
        background: linear-gradient(135deg, rgba(0,210,255,0.12), rgba(138,43,226,0.15));
        border-bottom: 1px solid rgba(255,255,255,0.07);
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
      }
      .chat-header-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .chat-avatar {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: linear-gradient(135deg, #00d2ff, #8a2be2);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        box-shadow: 0 4px 12px rgba(0,210,255,0.3);
        position: relative;
      }
      .chat-avatar::after {
        content: '';
        position: absolute;
        bottom: -2px;
        right: -2px;
        width: 11px;
        height: 11px;
        background: #22c55e;
        border-radius: 50%;
        border: 2px solid rgba(9,12,25,0.97);
      }
      .chat-avatar svg { width: 22px; height: 22px; }
      .chat-header-text h4 {
        font-size: 0.95rem;
        font-weight: 700;
        color: #fff;
        margin: 0;
        line-height: 1.2;
      }
      .chat-header-text p {
        font-size: 0.73rem;
        color: rgba(255,255,255,0.5);
        margin: 0;
        margin-top: 2px;
      }
      #ai-chat-close {
        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.1);
        color: rgba(255,255,255,0.6);
        width: 30px;
        height: 30px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }
      #ai-chat-close:hover {
        background: rgba(255,77,77,0.15);
        border-color: rgba(255,77,77,0.3);
        color: #ff6b6b;
      }

      /* ---- Quick Chips ---- */
      #ai-chat-chips {
        padding: 0.8rem 1rem;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        flex-shrink: 0;
        background: rgba(0,0,0,0.15);
      }
      .chat-chip {
        background: rgba(0,210,255,0.07);
        border: 1px solid rgba(0,210,255,0.18);
        color: rgba(0,210,255,0.9);
        font-size: 0.72rem;
        font-weight: 600;
        padding: 0.3rem 0.75rem;
        border-radius: 99px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: var(--font-main, 'Outfit', sans-serif);
        white-space: nowrap;
      }
      .chat-chip:hover {
        background: rgba(0,210,255,0.15);
        border-color: rgba(0,210,255,0.4);
        color: #00d2ff;
        transform: translateY(-1px);
      }

      /* ---- Messages ---- */
      #ai-chat-messages {
        flex: 1;
        padding: 1.2rem 1rem;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        background: transparent;
        scrollbar-width: thin;
        scrollbar-color: rgba(0,210,255,0.2) transparent;
      }
      #ai-chat-messages::-webkit-scrollbar { width: 4px; }
      #ai-chat-messages::-webkit-scrollbar-thumb { background: rgba(0,210,255,0.2); border-radius: 4px; }

      .msg-row {
        display: flex;
        gap: 8px;
        align-items: flex-end;
        animation: msg-appear 0.3s ease forwards;
      }
      @keyframes msg-appear {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .msg-row.user { flex-direction: row-reverse; }

      .msg-avatar-sm {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        background: linear-gradient(135deg, #00d2ff, #8a2be2);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .msg-avatar-sm svg { width: 14px; height: 14px; }

      .msg-bubble {
        max-width: 78%;
        padding: 0.75rem 1rem;
        border-radius: 16px;
        font-size: 0.875rem;
        line-height: 1.55;
        word-break: break-word;
      }
      .msg-bubble.ai {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.08);
        color: rgba(255,255,255,0.9);
        border-bottom-left-radius: 4px;
      }
      .msg-bubble.user {
        background: linear-gradient(135deg, rgba(0,210,255,0.9), rgba(58,123,213,0.9));
        color: #fff;
        border-bottom-right-radius: 4px;
        border: none;
      }
      .msg-bubble.error {
        background: rgba(255,50,50,0.08);
        border: 1px solid rgba(255,80,80,0.25);
        color: #ff8080;
        border-bottom-left-radius: 4px;
      }

      /* Typing dots */
      .typing-dots {
        display: flex;
        gap: 4px;
        align-items: center;
        padding: 0.75rem 1rem;
      }
      .typing-dots span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgba(0,210,255,0.6);
        animation: dot-bounce 1.2s ease-in-out infinite;
      }
      .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
      .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes dot-bounce {
        0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
        40%           { transform: translateY(-6px); opacity: 1; }
      }

      /* ---- Input Area ---- */
      #ai-chat-input-area {
        padding: 1rem;
        background: rgba(0,0,0,0.25);
        border-top: 1px solid rgba(255,255,255,0.06);
        display: flex;
        gap: 10px;
        align-items: center;
        flex-shrink: 0;
      }
      #ai-chat-input {
        flex: 1;
        padding: 0.75rem 1.1rem;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.05);
        color: #fff;
        font-family: var(--font-main,'Outfit',sans-serif);
        font-size: 0.875rem;
        outline: none;
        transition: border-color 0.25s ease, background 0.25s ease;
      }
      #ai-chat-input::placeholder { color: rgba(255,255,255,0.3); }
      #ai-chat-input:focus {
        border-color: rgba(0,210,255,0.4);
        background: rgba(0,210,255,0.04);
      }
      #ai-chat-send {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        border: none;
        background: linear-gradient(135deg, #00d2ff, #8a2be2);
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
        transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
        flex-shrink: 0;
        box-shadow: 0 4px 15px rgba(0,210,255,0.3);
      }
      #ai-chat-send:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0,210,255,0.45);
      }
      #ai-chat-send:active { transform: scale(0.95); }

      /* ---- Powered by footer ---- */
      #ai-chat-powered {
        text-align: center;
        padding: 0.5rem;
        font-size: 0.68rem;
        color: rgba(255,255,255,0.2);
        border-top: 1px solid rgba(255,255,255,0.04);
        letter-spacing: 0.5px;
        flex-shrink: 0;
      }
      #ai-chat-powered span { color: rgba(0,210,255,0.5); }

      @media (max-width: 480px) {
        #ai-chat-panel { width: calc(100vw - 32px); height: 480px; }
        #ai-chat-widget { bottom: 20px; right: 16px; }
      }
    </style>

    <div id="ai-chat-widget">

      <!-- Tooltip -->
      <div id="ai-chat-tooltip">Ask Dremora AI ✦</div>

      <!-- Chat Panel -->
      <div id="ai-chat-panel">

        <!-- Header -->
        <div id="ai-chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="rgba(255,255,255,0.2)"/>
                <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" fill="none"/>
                <path d="M8 10h2v4H8zM14 10h2v4h-2z" fill="rgba(255,255,255,0.9)"/>
                <path d="M10 8h4v2h-4zM10 14h4v2h-4z" fill="rgba(0,210,255,0.9)"/>
              </svg>
            </div>
            <div class="chat-header-text">
              <h4>Dremora AI</h4>
              <p>● Online · Powered by Gemini</p>
            </div>
          </div>
          <button id="ai-chat-close"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <!-- Quick chips -->
        <div id="ai-chat-chips">
          <button class="chat-chip" data-msg="What services does Dremora offer?">Our Services</button>
          <button class="chat-chip" data-msg="Tell me about NagarSeva">NagarSeva</button>
          <button class="chat-chip" data-msg="How can I apply for internship?">Internship</button>
          <button class="chat-chip" data-msg="How do I contact Dremora?">Contact</button>
        </div>

        <!-- Messages -->
        <div id="ai-chat-messages">
          <div class="msg-row">
            <div class="msg-avatar-sm">
              <svg viewBox="0 0 24 24" fill="none"><path d="M8 10h2v4H8zM14 10h2v4h-2zM10 8h4v2h-4zM10 14h4v2h-4z" fill="white"/></svg>
            </div>
            <div class="msg-bubble ai">
              👋 Hi! I'm <strong>Dremora AI</strong> — your smart assistant.<br><br>
              Ask me about our services, <strong>NagarSeva</strong>, internship programs, or anything about Dremora IT!
            </div>
          </div>
        </div>

        <!-- Input -->
        <div id="ai-chat-input-area">
          <input type="text" id="ai-chat-input" placeholder="Ask anything about Dremora…" autocomplete="off">
          <button id="ai-chat-send">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>

        <!-- Powered by -->
        <div id="ai-chat-powered">Powered by <span>Google Gemini</span> · Dremora IT © 2026</div>

      </div>

      <!-- Floating Button -->
      <button id="ai-chat-btn" title="Chat with Dremora AI" aria-label="Open AI Chat">
        <div class="chat-btn-icon">
          <!-- Bot icon (shown when closed) -->
          <svg class="icon-bot" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="10" width="20" height="16" rx="4" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
            <rect x="10" y="15" width="4" height="4" rx="1" fill="#00d2ff"/>
            <rect x="18" y="15" width="4" height="4" rx="1" fill="#00d2ff"/>
            <path d="M12 22 Q16 25 20 22" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
            <path d="M16 10 V7" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="16" cy="5.5" r="2" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.8)" stroke-width="1"/>
            <path d="M6 18 H3M26 18 H29" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <!-- Close icon (shown when open) -->
          <svg class="icon-close" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </div>
      </button>

    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', chatHTML);

  // ---- Elements ----
  const chatBtn      = document.getElementById('ai-chat-btn');
  const chatPanel    = document.getElementById('ai-chat-panel');
  const chatClose    = document.getElementById('ai-chat-close');
  const chatInput    = document.getElementById('ai-chat-input');
  const chatSend     = document.getElementById('ai-chat-send');
  const chatMessages = document.getElementById('ai-chat-messages');
  const tooltip      = document.getElementById('ai-chat-tooltip');
  const chips        = document.querySelectorAll('.chat-chip');

  // ---- Tooltip hover ----
  chatBtn.addEventListener('mouseenter', () => { if (!chatBtn.classList.contains('open')) tooltip.classList.add('visible'); });
  chatBtn.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));

  // ---- Toggle Panel ----
  function openPanel() {
    chatPanel.style.display = 'flex';
    chatBtn.classList.add('open');
    tooltip.classList.remove('visible');
    chatInput.focus();
  }
  function closePanel() {
    chatPanel.style.display = 'none';
    chatBtn.classList.remove('open');
  }

  chatBtn.addEventListener('click', () => {
    chatPanel.style.display === 'none' ? openPanel() : closePanel();
  });
  chatClose.addEventListener('click', closePanel);

  // ---- Quick Chips ----
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chatInput.value = chip.dataset.msg;
      appendMessage();
    });
  });

  // ---- Append a message bubble ----
  function createMsgRow(html, type) {
    const row = document.createElement('div');
    row.className = `msg-row${type === 'user' ? ' user' : ''}`;

    if (type !== 'user') {
      const avatar = document.createElement('div');
      avatar.className = 'msg-avatar-sm';
      avatar.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><path d="M8 10h2v4H8zM14 10h2v4h-2zM10 8h4v2h-4zM10 14h4v2h-4z" fill="white"/></svg>`;
      row.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = `msg-bubble ${type}`;
    bubble.innerHTML = html;
    row.appendChild(bubble);

    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return row;
  }

  // ---- Typing indicator ----
  function showTyping() {
    const row = document.createElement('div');
    row.className = 'msg-row';
    row.id = 'typing-indicator';

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar-sm';
    avatar.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><path d="M8 10h2v4H8zM14 10h2v4h-2zM10 8h4v2h-4zM10 14h4v2h-4z" fill="white"/></svg>`;
    row.appendChild(avatar);

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble ai';
    bubble.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    row.appendChild(bubble);

    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function hideTyping() {
    const ti = document.getElementById('typing-indicator');
    if (ti) ti.remove();
  }

  // ---- API Call ----
  async function processAIResponse(msg) {
    showTyping();

    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5000'
      : 'https://dremora.onrender.com';

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await response.json();
      hideTyping();
      const text = (data.response || 'No response received.').replace(/\n/g, '<br>');
      createMsgRow(text, 'ai');
    } catch (err) {
      hideTyping();
      createMsgRow('⚠️ Unable to connect to Dremora AI backend. Please try again later.', 'error');
    }
  }

  // ---- Send Message ----
  function appendMessage() {
    const txt = chatInput.value.trim();
    if (!txt) return;
    createMsgRow(txt, 'user');
    chatInput.value = '';
    processAIResponse(txt);
  }

  chatSend.addEventListener('click', appendMessage);
  chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') appendMessage(); });

  // Show tooltip after 3s on first load to attract attention
  setTimeout(() => {
    if (!chatBtn.classList.contains('open')) {
      tooltip.classList.add('visible');
      setTimeout(() => tooltip.classList.remove('visible'), 4000);
    }
  }, 3000);
});
