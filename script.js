// ==========================================
// INITIALIZE - NO ICON LIBRARY NEEDED
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Font Awesome loaded');
    checkAPIConfiguration();
});

// ==========================================
// DOM ELEMENTS
// ==========================================
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const welcomeScreen = document.getElementById('welcomeScreen');
const typingIndicator = document.getElementById('typingIndicator');
const attachBtn = document.getElementById('attachBtn');
const emojiBtn = document.getElementById('emojiBtn');

// ==========================================
// CHECK API CONFIGURATION
// ==========================================
function checkAPIConfiguration() {
    if (!chatAPI.isConfigured()) {
        console.warn('⚠️ API Key belum dikonfigurasi!');
        console.warn('📝 Silakan tambahkan API key OpenRouter di file config.js');
        console.warn('🔑 Dapatkan API key gratis di: https://openrouter.ai/keys');
        
        showNotification(
            '⚠️ API Key belum dikonfigurasi. Tambahkan API key di config.js untuk menggunakan AI.',
            'warning',
            5000
        );
    } else {
        console.log('✅ API Configuration OK');
        console.log('🤖 Model:', CONFIG.MODEL);
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

messageInput.addEventListener('focus', function() {
    updateStatus('typing', 'Typing...');
});

messageInput.addEventListener('blur', function() {
    updateStatus('ready', 'Ready to chat');
});

attachBtn.addEventListener('click', function() {
    showTooltip('Feature coming soon! 📎');
});

emojiBtn.addEventListener('click', function() {
    showTooltip('Emoji picker coming soon! 😊');
});

// ==========================================
// MAIN FUNCTIONS
// ==========================================
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) {
        shakeInput();
        return;
    }

    if (welcomeScreen && welcomeScreen.style.display !== 'none') {
        welcomeScreen.style.display = 'none';
    }

    addMessage(message, 'user');
    messageInput.value = '';
    sendBtn.disabled = true;
    messageInput.disabled = true;
    typingIndicator.classList.add('active');
    scrollToBottom();
    updateStatus('thinking', 'AI is thinking...');
    
    try {
        const response = await chatAPI.sendMessage(message);
        typingIndicator.classList.remove('active');
        addMessage(response.message, 'bot');
        
        if (response.usage) {
            console.log('📊 Token usage:', response.usage);
        }
        
        updateStatus('ready', 'Ready to chat');
        
    } catch (error) {
        console.error('Error:', error);
        typingIndicator.classList.remove('active');
        addMessage(error.message || 'Terjadi kesalahan. Silakan coba lagi.', 'bot', true);
        updateStatus('error', 'Error occurred');
        showNotification(error.message, 'error');
    } finally {
        sendBtn.disabled = false;
        messageInput.disabled = false;
        messageInput.focus();
    }
}

function sendSuggestion(text) {
    messageInput.value = text;
    sendMessage();
}

function addMessage(text, sender, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender} animate__animated animate__fadeIn`;
    
    const time = getCurrentTime();
    const avatarIcon = sender === 'bot' ? 'fa-robot' : 'fa-user-circle';
    const errorClass = isError ? 'style="color: #ef4444;"' : '';
    
    if (sender === 'bot') {
        messageDiv.innerHTML = `
            <div class="avatar bot">
                <i class="fas ${avatarIcon}"></i>
            </div>
            <div class="message-content" ${errorClass}>
                ${text}
                <span class="message-time">
                    <i class="fas fa-clock"></i> ${time}
                </span>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                ${text}
                <span class="message-time">
                    <i class="fas fa-clock"></i> ${time}
                </span>
            </div>
            <div class="avatar user">
                <i class="fas ${avatarIcon}"></i>
            </div>
        `;
    }
    
    chatMessages.insertBefore(messageDiv, typingIndicator);
    scrollToBottom();
}

function scrollToBottom() {
    setTimeout(function() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function updateStatus(type, text) {
    const statusEl = document.querySelector('.status span');
    const statusIcon = document.querySelector('.status i');
    
    if (statusEl) {
        statusEl.textContent = text;
    }
    
    if (statusIcon) {
        let iconClass = 'fa-check-circle';
        let color = '#10b981';
        
        if (type === 'thinking') {
            iconClass = 'fa-spinner fa-spin';
            color = '#6366f1';
        } else if (type === 'typing') {
            iconClass = 'fa-keyboard';
            color = '#8b5cf6';
        } else if (type === 'error') {
            iconClass = 'fa-exclamation-circle';
            color = '#ef4444';
        }
        
        statusIcon.className = `fas ${iconClass}`;
        statusIcon.style.color = color;
    }
}

function shakeInput() {
    const inputWrapper = document.querySelector('.input-wrapper');
    inputWrapper.classList.add('animate__animated', 'animate__headShake');
    
    setTimeout(function() {
        inputWrapper.classList.remove('animate__animated', 'animate__headShake');
    }, 1000);
}

function showTooltip(message) {
    const tooltip = document.createElement('div');
    tooltip.textContent = message;
    tooltip.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        font-size: 0.9rem;
        z-index: 10000;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    setTimeout(function() {
        tooltip.style.animation = 'fadeOut 0.3s ease';
        setTimeout(function() {
            if (tooltip.parentNode) {
                document.body.removeChild(tooltip);
            }
        }, 300);
    }, 2000);
}

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    
    let bgColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    let icon = 'fa-info-circle';
    
    if (type === 'error') {
        bgColor = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        icon = 'fa-exclamation-circle';
    } else if (type === 'success') {
        bgColor = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        icon = 'fa-check-circle';
    } else if (type === 'warning') {
        bgColor = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
        icon = 'fa-exclamation-triangle';
    }
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        font-size: 0.9rem;
        z-index: 10000;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(function() {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        messageInput.focus();
    }
    
    if (e.key === 'Escape') {
        messageInput.value = '';
        messageInput.blur();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        if (confirm('Hapus semua riwayat chat?')) {
            clearChat();
        }
    }
});

function clearChat() {
    const messages = chatMessages.querySelectorAll('.message');
    messages.forEach(msg => msg.remove());
    chatAPI.clearHistory();
    
    if (welcomeScreen) {
        welcomeScreen.style.display = 'block';
    }
    
    showNotification('Chat history cleared!', 'success');
}

// ==========================================
// ADD CSS ANIMATIONS
// ==========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// ==========================================
// INITIALIZE
// ==========================================
console.log('🤖 AI Chatbot initialized successfully!');
console.log('💡 Keyboard Shortcuts:');
console.log('   - Ctrl/Cmd + K: Focus input');
console.log('   - Ctrl/Cmd + L: Clear chat');
console.log('   - Escape: Clear input');
console.log('📊 Model:', CONFIG.MODEL);