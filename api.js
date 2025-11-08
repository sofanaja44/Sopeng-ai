// ==========================================
// API HANDLER FOR OPENROUTER
// ==========================================

class ChatAPI {
    constructor(config) {
        this.config = config;
        this.conversationHistory = [];
        this.requestCount = 0;
        this.lastRequestTime = Date.now();
    }

    /**
     * Check if API key is configured
     */
    isConfigured() {
        return this.config.API_KEY && 
               this.config.API_KEY !== 'YOUR_OPENROUTER_API_KEY_HERE' &&
               this.config.API_KEY.length > 0;
    }

    /**
     * Rate limiting check
     */
    checkRateLimit() {
        const now = Date.now();
        const timeDiff = now - this.lastRequestTime;
        
        // Reset counter every minute
        if (timeDiff > 60000) {
            this.requestCount = 0;
            this.lastRequestTime = now;
        }
        
        if (this.requestCount >= this.config.MAX_MESSAGES_PER_MINUTE) {
            return false;
        }
        
        this.requestCount++;
        return true;
    }

    /**
     * Add message to conversation history
     */
    addToHistory(role, content) {
        this.conversationHistory.push({
            role: role,
            content: content
        });
        
        // Keep only last 10 messages to avoid token limit
        if (this.conversationHistory.length > 10) {
            this.conversationHistory = this.conversationHistory.slice(-10);
        }
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * Send message to OpenRouter API
     */
    async sendMessage(userMessage) {
        // Check if API key is configured
        if (!this.isConfigured()) {
            throw new Error(this.config.ERROR_MESSAGES.API_KEY_MISSING);
        }

        // Check rate limit
        if (!this.checkRateLimit()) {
            throw new Error(this.config.ERROR_MESSAGES.RATE_LIMIT);
        }

        // Add user message to history
        this.addToHistory('user', userMessage);

        // Prepare messages array
        const messages = [
            {
                role: 'system',
                content: this.config.SYSTEM_PROMPT
            },
            ...this.conversationHistory
        ];

        try {
            const response = await fetch(this.config.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.API_KEY}`,
                    'HTTP-Referer': this.config.APP_URL,
                    'X-Title': this.config.APP_NAME
                },
                body: JSON.stringify({
                    model: this.config.MODEL,
                    messages: messages,
                    max_tokens: this.config.MAX_TOKENS,
                    temperature: this.config.TEMPERATURE,
                    top_p: this.config.TOP_P,
                })
            });

            // Check if response is ok
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error:', errorData);
                
                if (response.status === 401) {
                    throw new Error('❌ API Key tidak valid. Silakan periksa kembali API key Anda.');
                } else if (response.status === 429) {
                    throw new Error(this.config.ERROR_MESSAGES.RATE_LIMIT);
                } else if (response.status >= 500) {
                    throw new Error(this.config.ERROR_MESSAGES.API_ERROR);
                } else {
                    throw new Error(`❌ Error ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
                }
            }

            const data = await response.json();
            
            // Extract AI response
            const aiMessage = data.choices?.[0]?.message?.content;
            
            if (!aiMessage) {
                throw new Error(this.config.ERROR_MESSAGES.EMPTY_RESPONSE);
            }

            // Add AI response to history
            this.addToHistory('assistant', aiMessage);

            return {
                success: true,
                message: aiMessage,
                model: data.model,
                usage: data.usage
            };

        } catch (error) {
            console.error('Chat API Error:', error);
            
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                throw new Error(this.config.ERROR_MESSAGES.NETWORK_ERROR);
            }
            
            throw error;
        }
    }

    /**
     * Get conversation history
     */
    getHistory() {
        return this.conversationHistory;
    }

    /**
     * Get usage stats
     */
    getStats() {
        return {
            messageCount: this.conversationHistory.length,
            requestCount: this.requestCount,
            lastRequestTime: this.lastRequestTime
        };
    }
}

// Create global instance
const chatAPI = new ChatAPI(CONFIG);