// ==========================================
// SOPENG.AI - MAIN SCRIPT
// ==========================================

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Sopeng.ai initialized');
    loadTheme();
    autoResizeTextarea();
    setupKeyboardShortcuts();
    checkAPIConfiguration();
    updateModelName();
    
    // Configure marked.js for markdown parsing
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: false,
            mangle: false
        });
    }
});

// ==========================================
// CHECK API CONFIGURATION
// ==========================================
function checkAPIConfiguration() {
    if (!chatAPI.isConfigured()) {
        console.warn('⚠️ API Key belum dikonfigurasi!');
        console.warn('🔗 Silakan tambahkan API key di file config.js');
        showNotification('⚠️ API Key belum dikonfigurasi. Tambahkan API key di config.js', 'warning');
    } else {
        console.log('✅ API Configuration OK');
        console.log('🤖 Model Backend:', CONFIG.MODEL);
        console.log('🎨 Model Display:', CONFIG.MODEL_DISPLAY_NAME);
    }
}

function updateModelName() {
    const modelName = document.getElementById('modelName');
    if (modelName && CONFIG.MODEL_DISPLAY_NAME) {
        modelName.textContent = CONFIG.MODEL_DISPLAY_NAME;
    }
}

// ==========================================
// PARSE MARKDOWN AND CODE BLOCKS
// ==========================================
function parseMarkdown(text) {
    if (typeof marked === 'undefined') {
        return escapeHtml(text);
    }
    
    // Parse markdown
    let html = marked.parse(text);
    
    // Add copy buttons to code blocks
    html = html.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, function(match, lang, code) {
        const decodedCode = decodeHtmlEntities(code);
        const escapedCode = escapeForAttribute(decodedCode);
        return '<pre><div class="code-header"><span class="code-language">' + lang.toUpperCase() + '</span><button class="code-copy-btn" onclick="copyCode(this, \'' + escapedCode + '\')"><i class="fas fa-copy"></i><span>Salin</span></button></div><code class="language-' + lang + '">' + code + '</code></pre>';
    });
    
    // Handle code blocks without language specification
    html = html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, function(match, code) {
        const decodedCode = decodeHtmlEntities(code);
        const escapedCode = escapeForAttribute(decodedCode);
        return '<pre><div class="code-header"><span class="code-language">CODE</span><button class="code-copy-btn" onclick="copyCode(this, \'' + escapedCode + '\')"><i class="fas fa-copy"></i><span>Salin</span></button></div><code>' + code + '</code></pre>';
    });
    
    return html;
}

function decodeHtmlEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

function escapeForAttribute(text) {
    return text
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');
}

// ==========================================
// COPY CODE FUNCTION
// ==========================================
function copyCode(button, code) {
    // Decode escaped characters
    const decodedCode = code
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\'/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/\\\\/g, '\\');
    
    navigator.clipboard.writeText(decodedCode).then(() => {
        const originalHTML = button.innerHTML;
        const originalClass = button.className;
        
        // Change to success state
        button.innerHTML = '<i class="fas fa-check"></i><span>Tersalin!</span>';
        button.classList.add('copied');
        
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = 'position: absolute; width: 100%; height: 100%; background: rgba(16, 163, 127, 0.3); border-radius: 8px; animation: ripple 0.6s ease-out;';
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
        
        // Reset after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.className = originalClass;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code:', err);
        
        // Show error state
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-times"></i><span>Gagal</span>';
        button.style.background = 'rgba(239, 68, 68, 0.2)';
        button.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        button.style.color = '#ef4444';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = '';
            button.style.borderColor = '';
            button.style.color = '';
        }, 2000);
    });
}

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes ripple { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }';
document.head.appendChild(rippleStyle);

// ==========================================
// HIGHLIGHT CODE BLOCKS
// ==========================================
function highlightCodeBlocks(element) {
    if (typeof hljs !== 'undefined') {
        element.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }
}

// ==========================================
// DARK MODE
// ==========================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('themeIcon').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

function loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeIcon').className = 'fas fa-sun';
    }
}

// ==========================================
// SIDEBAR TOGGLE
// ==========================================
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

// ==========================================
// AUTO-RESIZE TEXTAREA
// ==========================================
function autoResizeTextarea() {
    const textarea = document.getElementById('messageInput');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });
}

// ==========================================
// SEND MESSAGE
// ==========================================
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) {
        shakeInput();
        return;
    }

    // Hide welcome screen
    const welcomeScreen = document.getElementById('welcomeScreen');
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
    }

    // Add user message
    addMessage(message, 'user');
    input.value = '';
    input.style.height = 'auto';

    // Disable input
    const sendButton = document.getElementById('sendButton');
    sendButton.disabled = true;
    input.disabled = true;

    // Show typing indicator
    document.getElementById('typingIndicator').classList.add('active');
    scrollToBottom();
    updateStatus('Sopeng sedang berpikir...');

    try {
        const response = await chatAPI.sendMessage(message);
        
        document.getElementById('typingIndicator').classList.remove('active');
        addMessage(response.message, 'bot');
        
        if (response.usage) {
            console.log('📊 Token usage:', response.usage);
        }
        
        updateStatus('Siap untuk chat');
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('typingIndicator').classList.remove('active');
        addMessage(error.message || 'Terjadi kesalahan. Silakan coba lagi.', 'bot', true);
        updateStatus('Error terjadi');
        showNotification(error.message, 'error');
    } finally {
        sendButton.disabled = false;
        input.disabled = false;
        input.focus();
    }
}

// ==========================================
// SEND SUGGESTION
// ==========================================
function sendSuggestion(text) {
    document.getElementById('messageInput').value = text;
    sendMessage();
}

// ==========================================
// ADD MESSAGE TO CHAT
// ==========================================
function addMessage(text, sender, isError = false) {
    const messagesContainer = document.querySelector('.messages-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + sender;
    
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    const avatarClass = sender === 'bot' ? 'bot-avatar' : 'user-avatar-msg';
    const avatarIcon = sender === 'bot' ? 'fa-robot' : 'fa-user';
    const errorStyle = isError ? 'style="color: #ef4444;"' : '';
    
    // Parse markdown for bot messages
    let messageContent;
    if (sender === 'bot' && !isError) {
        messageContent = parseMarkdown(text);
    } else {
        messageContent = escapeHtml(text);
    }
    
    messageDiv.innerHTML = '<div class="message-avatar ' + avatarClass + '"><i class="fas ' + avatarIcon + '"></i></div><div class="message-content"><div class="message-text" ' + errorStyle + '>' + messageContent + '</div><div class="message-time">' + time + '</div>' + (sender === 'bot' && !isError ? '<div class="message-actions"><button class="action-btn" onclick="copyMessage(this)"><i class="fas fa-copy"></i> Copy</button><button class="action-btn" onclick="regenerateMessage()"><i class="fas fa-redo"></i> Regenerate</button></div>' : '') + '</div>';
    
    messagesContainer.insertBefore(messageDiv, document.getElementById('typingIndicator'));
    
    // Highlight code blocks if it's a bot message
    if (sender === 'bot' && !isError) {
        highlightCodeBlocks(messageDiv);
    }
    
    scrollToBottom();
}

// ==========================================
// COPY MESSAGE
// ==========================================
function copyMessage(btn) {
    const messageText = btn.closest('.message-content').querySelector('.message-text').textContent;
    navigator.clipboard.writeText(messageText).then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 2000);
    });
}

// ==========================================
// REGENERATE MESSAGE
// ==========================================
function regenerateMessage() {
    const messages = document.querySelectorAll('.message');
    if (messages.length >= 2) {
        const lastUserMessage = messages[messages.length - 2].querySelector('.message-text').textContent;
        
        // Remove last bot message
        messages[messages.length - 1].remove();
        
        // Send again
        document.getElementById('messageInput').value = lastUserMessage;
        sendMessage();
    }
}

// ==========================================
// NEW CHAT
// ==========================================
function newChat() {
    if (confirm('Mulai chat baru? Riwayat chat saat ini akan dihapus.')) {
        chatAPI.clearHistory();
        
        const messagesContainer = document.querySelector('.messages-container');
        messagesContainer.innerHTML = '<div class="welcome-screen" id="welcomeScreen"><div class="welcome-icon"><i class="fas fa-robot"></i></div><h1 class="welcome-title">Bagaimana saya bisa membantu Anda hari ini?</h1><p class="welcome-subtitle">Saya adalah Sopeng, asisten AI Anda yang siap membantu apapun yang Anda butuhkan</p><div class="suggestions-grid"><div class="suggestion-card" onclick="sendSuggestion(\'Bantu saya menulis email profesional untuk klien\')"><div class="suggestion-icon"><i class="fas fa-envelope"></i></div><div class="suggestion-title">Tulis Email</div><div class="suggestion-desc">Bantuan menulis email profesional</div></div><div class="suggestion-card" onclick="sendSuggestion(\'Jelaskan tentang quantum computing dengan bahasa sederhana\')"><div class="suggestion-icon"><i class="fas fa-graduation-cap"></i></div><div class="suggestion-title">Belajar Sesuatu</div><div class="suggestion-desc">Dapatkan penjelasan yang jelas</div></div><div class="suggestion-card" onclick="sendSuggestion(\'Berikan ide kreatif untuk project baru saya\')"><div class="suggestion-icon"><i class="fas fa-lightbulb"></i></div><div class="suggestion-title">Brainstorming</div><div class="suggestion-desc">Partner berpikir kreatif</div></div><div class="suggestion-card" onclick="sendSuggestion(\'Buatkan contoh code Python untuk API dengan FastAPI\')"><div class="suggestion-icon"><i class="fas fa-code"></i></div><div class="suggestion-title">Code Review</div><div class="suggestion-desc">Bantuan pemrograman</div></div></div></div><div class="typing-indicator" id="typingIndicator"><div class="message-avatar bot-avatar"><i class="fas fa-robot"></i></div><div class="typing-dots"><span></span><span></span><span></span></div></div>';
        
        showNotification('Chat baru dimulai!', 'success');
    }
}

// ==========================================
// CLEAR ALL CHATS
// ==========================================
function clearAllChats() {
    if (confirm('Hapus semua riwayat chat?')) {
        newChat();
    }
}

// ==========================================
// SCROLL TO BOTTOM
// ==========================================
function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// ==========================================
// UPDATE STATUS
// ==========================================
function updateStatus(text) {
    const statusText = document.getElementById('statusText');
    if (statusText) {
        statusText.textContent = text;
    }
}

// ==========================================
// SHAKE INPUT
// ==========================================
function shakeInput() {
    const inputBox = document.querySelector('.input-box');
    inputBox.style.animation = 'shake 0.5s';
    setTimeout(() => {
        inputBox.style.animation = '';
    }, 500);
}

// Add shake animation
const style = document.createElement('style');
style.textContent = '@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }';
document.head.appendChild(style);

// ==========================================
// SHOW NOTIFICATION
// ==========================================
function showNotification(message, type, duration) {
    type = type || 'info';
    duration = duration || 3000;
    
    const notification = document.createElement('div');
    
    let bgColor = 'linear-gradient(135deg, #10a37f 0%, #0d8f6f 100%)';
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
    
    notification.innerHTML = '<i class="fas ' + icon + '"></i><span>' + message + '</span>';
    
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: ' + bgColor + '; color: white; padding: 15px 20px; border-radius: 12px; font-size: 0.9rem; z-index: 10000; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); display: flex; align-items: center; gap: 10px; animation: slideInRight 0.3s ease; max-width: 400px;';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Add notification animations
const notifStyle = document.createElement('style');
notifStyle.textContent = '@keyframes slideInRight { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }';
document.head.appendChild(notifStyle);

// ==========================================
// ESCAPE HTML
// ==========================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================
function setupKeyboardShortcuts() {
    const input = document.getElementById('messageInput');
    
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    document.addEventListener('keydown', function(e) {
        // Cmd/Ctrl + K to focus input
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            input.focus();
        }
        
        // Cmd/Ctrl + Shift + N for new chat
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'N') {
            e.preventDefault();
            newChat();
        }
        
        // Cmd/Ctrl + B to toggle sidebar
        if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
            e.preventDefault();
            toggleSidebar();
        }

        // Escape to clear input
        if (e.key === 'Escape') {
            input.value = '';
            input.style.height = 'auto';
        }
    });
}

// ==========================================
// RESPONSIVE - AUTO COLLAPSE SIDEBAR ON MOBILE
// ==========================================
function isMobile() {
    return window.innerWidth <= 768;
}

if (isMobile()) {
    document.getElementById('sidebar').classList.add('collapsed');
}

window.addEventListener('resize', function() {
    if (isMobile()) {
        document.getElementById('sidebar').classList.add('collapsed');
    }
});

// ==========================================
// CONSOLE INFO
// ==========================================
console.log('🤖 Sopeng.ai initialized successfully!');
console.log('💡 Keyboard Shortcuts:');
console.log('   - Enter: Send message');
console.log('   - Shift + Enter: New line');
console.log('   - Cmd/Ctrl + K: Focus input');
console.log('   - Cmd/Ctrl + Shift + N: New chat');
console.log('   - Cmd/Ctrl + B: Toggle sidebar');
console.log('   - Escape: Clear input');
console.log('📊 Model Display:', CONFIG.MODEL_DISPLAY_NAME);
console.log('🔧 Model Backend:', CONFIG.MODEL);