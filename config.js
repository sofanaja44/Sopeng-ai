// ==========================================
// API CONFIGURATION
// ==========================================

const CONFIG = {
    // OpenRouter API Configuration
    API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    API_KEY: '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', // Ganti dengan API key kamu dari https://openrouter.ai/keys
    
    // Model Configuration
    MODEL: 'minimax/minimax-01', // Model Minimax M2 Free
    
    // Chat Settings
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7,
    TOP_P: 1,
    
    // System Prompt
    SYSTEM_PROMPT: 'Kamu adalah asisten AI yang cerdas, ramah, dan membantu. Kamu selalu memberikan jawaban yang akurat, informatif, dan mudah dipahami. Kamu berbicara dalam bahasa Indonesia dengan sopan dan profesional.',
    
    // App Settings
    APP_NAME: 'AI Assistant',
    APP_URL: 'http://localhost', // Ganti dengan URL website kamu
    
    // Rate Limiting
    MAX_MESSAGES_PER_MINUTE: 10,
    
    // Error Messages
    ERROR_MESSAGES: {
        API_KEY_MISSING: '⚠️ API Key belum diatur. Silakan tambahkan API key di file config.js',
        NETWORK_ERROR: '❌ Terjadi kesalahan jaringan. Silakan cek koneksi internet Anda.',
        API_ERROR: '❌ Terjadi kesalahan pada server. Silakan coba lagi.',
        RATE_LIMIT: '⏳ Terlalu banyak permintaan. Silakan tunggu sebentar.',
        EMPTY_RESPONSE: '❌ Tidak ada respons dari AI. Silakan coba lagi.',
    }
};

// Export config (untuk ES6 modules - optional)
// export default CONFIG;