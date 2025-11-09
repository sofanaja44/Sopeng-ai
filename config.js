// ==========================================
// API CONFIGURATION
// ==========================================

const CONFIG = {
    // OpenRouter API Configuration
    API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    API_KEY: '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', // Ganti dengan API key Anda dari https://openrouter.ai/keys
    
    // Model Configuration
    // Backend menggunakan: 'minimax/minimax-m2:free'
    // Ditampilkan sebagai: 'Sopeng v2.1'
    MODEL: 'minimax/minimax-m2:free',
    MODEL_DISPLAY_NAME: 'Sopeng v2.1', // Nama yang ditampilkan ke user
    
    // Chat Settings
    MAX_TOKENS: 2000,           // Maximum tokens per response
    TEMPERATURE: 0.7,           // Creativity (0.0 - 2.0) - Higher = more creative
    TOP_P: 1,                   // Nucleus sampling (0.0 - 1.0)
    FREQUENCY_PENALTY: 0,       // Reduce repetition (-2.0 - 2.0)
    PRESENCE_PENALTY: 0,        // Encourage new topics (-2.0 - 2.0)
    
    // System Prompt
    SYSTEM_PROMPT: `Kamu adalah Sopeng, asisten AI yang cerdas, ramah, dan membantu. 
Kamu memiliki pengetahuan luas dan selalu memberikan jawaban yang:
- Akurat dan informatif
- Mudah dipahami
- Terstruktur dengan baik
- Sopan dan profesional

Kamu berbicara dalam bahasa Indonesia dengan gaya yang natural dan friendly.
Ketika menjawab pertanyaan teknis, berikan penjelasan yang detail namun tetap mudah dimengerti.
Jika tidak yakin tentang sesuatu, kamu akan mengakui keterbatasanmu dengan jujur.`,
    
    // App Settings
    APP_NAME: 'Sopeng.ai',
    APP_URL: window.location.origin, // Auto-detect current URL
    APP_VERSION: '2.1.0',
    
    // Rate Limiting
    MAX_MESSAGES_PER_MINUTE: 10,    // Maximum messages per minute
    MAX_HISTORY_LENGTH: 10,          // Maximum conversation history to keep
    
    // UI Settings
    TYPING_SPEED: 50,                // Typing animation speed (ms per character)
    AUTO_SCROLL: true,               // Auto scroll to bottom on new message
    SHOW_TIMESTAMPS: true,           // Show message timestamps
    
    // Features
    FEATURES: {
        DARK_MODE: true,             // Enable dark mode toggle
        COPY_MESSAGE: true,          // Enable copy message button
        REGENERATE: true,            // Enable regenerate button
        EXPORT_CHAT: false,          // Enable export chat feature
        VOICE_INPUT: false,          // Enable voice input (future feature)
    },
    
    // Error Messages
    ERROR_MESSAGES: {
        API_KEY_MISSING: '⚠️ API Key belum diatur. Silakan tambahkan API key di file config.js',
        NETWORK_ERROR: '❌ Terjadi kesalahan jaringan. Silakan cek koneksi internet Anda.',
        API_ERROR: '❌ Terjadi kesalahan pada server. Silakan coba lagi.',
        RATE_LIMIT: '⏳ Terlalu banyak permintaan. Silakan tunggu sebentar.',
        EMPTY_RESPONSE: '❌ Tidak ada respons dari AI. Silakan coba lagi.',
        INVALID_API_KEY: '🔑 API Key tidak valid. Silakan periksa kembali API key Anda.',
        TIMEOUT: '⏱️ Request timeout. Silakan coba lagi.',
        QUOTA_EXCEEDED: '📊 Kuota API Anda telah habis. Silakan upgrade atau coba lagi nanti.',
    },
    
    // Success Messages
    SUCCESS_MESSAGES: {
        MESSAGE_SENT: '✅ Pesan terkirim',
        CHAT_CLEARED: '🗑️ Chat berhasil dihapus',
        COPIED: '📋 Teks berhasil disalin',
        SETTINGS_SAVED: '💾 Pengaturan tersimpan',
    },
    
    // Debug Mode
    DEBUG: true,                     // Enable console logging for debugging
};

// Validate configuration on load
if (CONFIG.DEBUG) {
    console.log('📋 Configuration loaded:');
    console.log('   - Model (Backend):', CONFIG.MODEL);
    console.log('   - Model (Display):', CONFIG.MODEL_DISPLAY_NAME);
    console.log('   - API URL:', CONFIG.API_URL);
    console.log('   - Max Tokens:', CONFIG.MAX_TOKENS);
    console.log('   - Temperature:', CONFIG.TEMPERATURE);
    console.log('   - App Version:', CONFIG.APP_VERSION);
    console.log('   - App Name:', CONFIG.APP_NAME);
    
    if (!CONFIG.API_KEY || CONFIG.API_KEY === 'YOUR_OPENROUTER_API_KEY_HERE') {
        console.warn('⚠️ WARNING: API Key not configured!');
        console.log('🔗 Get your free API key at: https://openrouter.ai/keys');
    } else {
        console.log('✅ API Key configured');
    }
}

// Export config (for ES6 modules - optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}