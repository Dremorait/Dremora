document.addEventListener('DOMContentLoaded', () => {
    // Basic AI Chat Widget Logic for Phase 4 Demo
    
    // 1. Inject Chat HTML into the body dynamically
    const chatHTML = `
        <div id="ai-chat-widget" style="position: fixed; bottom: 30px; right: 30px; z-index: var(--z-modal); font-family: var(--font-main);">
            <!-- Chat Button -->
            <button id="ai-chat-btn" class="glass-pill pulse-dot" style="cursor: pointer; width: 60px; height: 60px; border-radius: 50%; padding: 0; display: flex; justify-content: center; align-items: center; border: 1px solid var(--primary-cyan); background: rgba(7,9,19,0.8); box-shadow: 0 4px 15px rgba(0, 210, 255, 0.4);">
                <img src="assets/images/ai_avatar.png" style="width: 35px; height: 35px; object-fit: contain; border-radius: 50%; background: transparent; padding: 0; box-shadow: 0 0 10px rgba(0, 210, 255, 0.4);" alt="AI">
            </button>

            <!-- Chat Panel -->
            <div id="ai-chat-panel" class="glass-panel" style="display: none; position: absolute; bottom: 80px; right: 0; width: 350px; height: 450px; flex-direction: column; overflow: hidden; border: 1px solid var(--primary-cyan); box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
                <!-- Header -->
                <div style="padding: 1rem; background: var(--gradient-glow); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="assets/images/ai_avatar.png" style="width: 24px; height: 24px; object-fit: contain; border-radius: 50%; background: transparent; padding: 0;" alt="AI">
                        <span style="color: #fff; font-weight: bold;">Dremora AI Assistant</span>
                    </div>
                    <button id="ai-chat-close" style="background: none; border: none; color: #fff; cursor: pointer;"><i class="fa-solid fa-xmark"></i></button>
                </div>
                
                <!-- Chat Window -->
                <div id="ai-chat-messages" style="flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background: rgba(0,0,0,0.4);">
                    <div style="background: var(--bg-panel); border: 1px solid var(--border-glass); padding: 0.8rem; border-radius: 12px; border-bottom-left-radius: 2px; align-self: flex-start; max-width: 85%; font-size: 0.9rem;">
                        Hello! I'm Dremora's smart assistant. How can I help you today? Ask me about our services, NagarSeva, or internships!
                    </div>
                </div>

                <!-- Input Area -->
                <div style="padding: 1rem; background: var(--bg-card); display: flex; gap: 10px; border-top: 1px solid var(--border-glass);">
                    <input type="text" id="ai-chat-input" placeholder="Type your message..." style="flex: 1; padding: 0.6rem 1rem; border-radius: 20px; border: 1px solid var(--border-glass); background: rgba(0,0,0,0.3); color: #fff; font-family: inherit; font-size: 0.9rem; outline: none;">
                    <button id="ai-chat-send" style="background: var(--primary-cyan); border: none; color: #fff; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);

    const chatBtn = document.getElementById('ai-chat-btn');
    const chatPanel = document.getElementById('ai-chat-panel');
    const chatClose = document.getElementById('ai-chat-close');
    const chatInput = document.getElementById('ai-chat-input');
    const chatSend = document.getElementById('ai-chat-send');
    const chatMessages = document.getElementById('ai-chat-messages');

    // Toggle Chat Panel
    chatBtn.addEventListener('click', () => {
        chatPanel.style.display = chatPanel.style.display === 'none' ? 'flex' : 'none';
        chatBtn.style.animation = 'none'; // Stop pulsing after first click
    });

    chatClose.addEventListener('click', () => {
        chatPanel.style.display = 'none';
    });

    async function processAIResponse(msg) {
        // Show loading indicator
        const loadingId = 'ai-loading-' + Date.now();
        const aiLoadingDiv = document.createElement('div');
        aiLoadingDiv.id = loadingId;
        aiLoadingDiv.style.cssText = 'background: var(--bg-panel); border: 1px solid var(--border-glass); padding: 0.8rem; border-radius: 12px; border-bottom-left-radius: 2px; align-self: flex-start; max-width: 85%; font-size: 0.9rem; font-style: italic; color: var(--text-muted);';
        aiLoadingDiv.textContent = 'Thinking...';
        chatMessages.appendChild(aiLoadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch('http://localhost:5000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg })
            });
            const data = await response.json();
            
            // Remove loading
            document.getElementById(loadingId).remove();
            
            // Add real response
            const aiDiv = document.createElement('div');
            aiDiv.style.cssText = 'background: var(--bg-panel); border: 1px solid var(--border-glass); padding: 0.8rem; border-radius: 12px; border-bottom-left-radius: 2px; align-self: flex-start; max-width: 85%; font-size: 0.9rem; line-height: 1.5; white-space: pre-wrap;';
            aiDiv.textContent = data.response || "No response received.";
            chatMessages.appendChild(aiDiv);
        } catch (error) {
            document.getElementById(loadingId).remove();
            const aiDiv = document.createElement('div');
            aiDiv.style.cssText = 'background: rgba(255, 50, 50, 0.1); border: 1px solid rgba(255, 50, 50, 0.4); padding: 0.8rem; border-radius: 12px; border-bottom-left-radius: 2px; align-self: flex-start; max-width: 85%; font-size: 0.9rem; color: #ff6b6b;';
            aiDiv.textContent = "SYSTEM_ERR: Failed to connect to local AI Backend at port 5000.";
            chatMessages.appendChild(aiDiv);
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function appendMessage() {
        const txt = chatInput.value.trim();
        if(!txt) return;

        // User message
        const userDiv = document.createElement('div');
        userDiv.style.cssText = 'background: var(--primary-cyan); color: #fff; padding: 0.8rem; border-radius: 12px; border-bottom-right-radius: 2px; align-self: flex-end; max-width: 85%; font-size: 0.9rem;';
        userDiv.textContent = txt;
        chatMessages.appendChild(userDiv);
        
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // processing state
        processAIResponse(txt);
    }

    chatSend.addEventListener('click', appendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') appendMessage();
    });
});
