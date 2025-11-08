// ==========================================
// API HANDLER FOR OPENROUTER
// ==========================================

class ChatAPI {
    constructor(config) {
        this.config = config;
        this.conversationHistory = [];
        this.requestCount = 0;
        this.lastRequestTime = Date.now();
        this.isProcessing = false;
        
        if (this.config.DEBUG) {
            console.log('🔌 ChatAPI initialized');
        }
    }

    /**
     * Check if API key is configured
     * @returns {boolean}
     */
    isConfigured() {
        return this.config.API_KEY && 
               this.config.API_KEY !== 'YOUR_OPENROUTER_API_KEY_HERE' &&
               this.config.API_KEY.length > 20; // OpenRouter keys are longer than 20 chars
    }

    /**
     * Rate limiting check
     * @returns {boolean}
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
     * @param {string} role - 'user' or 'assistant'
     * @param {string} content - Message content
     */
    addToHistory(role, content) {
        this.conversationHistory.push({
            role: role,
            content: content,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last N messages to avoid token limit
        const maxLength = this.config.MAX_HISTORY_LENGTH || 10;
        if (this.conversationHistory.length > maxLength) {
            this.conversationHistory = this.conversationHistory.slice(-maxLength);
        }
        
        if (this.config.DEBUG) {
            console.log(`📝 Added to history (${role}):`, content.substring(0, 50) + '...');
            console.log(`📚 History length: ${this.conversationHistory.length}/${maxLength}`);
        }
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
        if (this.config.DEBUG) {
            console.log('🗑️ Conversation history cleared');
        }
    }

    /**
     * Get conversation history
     * @returns {Array}
     */
    getHistory() {
        return this.conversationHistory;
    }

    /**
     * Export conversation history as JSON
     * @returns {string}
     */
    exportHistory() {
        return JSON.stringify(this.conversationHistory, null, 2);
    }

    /**
     * Get usage statistics
     * @returns {Object}
     */
    getStats() {
        return {
            messageCount: this.conversationHistory.length,
            requestCount: this.requestCount,
            lastRequestTime: this.lastRequestTime,
            isProcessing: this.isProcessing
        };
    }

    /**
     * Send message to OpenRouter API
     * @param {string} userMessage - User's message
     * @returns {Promise<Object>}
     */
    async sendMessage(userMessage) {
        // Check if already processing
        if (this.isProcessing) {
            throw new Error('⏳ Tunggu pesan sebelumnya selesai diproses');
        }

        // Check if API key is configured
        if (!this.isConfigured()) {
            throw new Error(this.config.ERROR_MESSAGES.API_KEY_MISSING);
        }

        // Check rate limit
        if (!this.checkRateLimit()) {
            throw new Error(this.config.ERROR_MESSAGES.RATE_LIMIT);
        }

        this.isProcessing = true;
        const startTime = Date.now();

        try {
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

            if (this.config.DEBUG) {
                console.log('🚀 Sending request to OpenRouter...');
                console.log('📊 Request details:', {
                    model: this.config.MODEL,
                    messageCount: messages.length,
                    userMessage: userMessage.substring(0, 50) + '...'
                });
            }

            // Make API request
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
                    frequency_penalty: this.config.FREQUENCY_PENALTY || 0,
                    presence_penalty: this.config.PRESENCE_PENALTY || 0,
                })
            });

            const responseTime = Date.now() - startTime;

            // Check if response is ok
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                if (this.config.DEBUG) {
                    console.error('❌ API Error:', errorData);
                    console.error('📊 Status:', response.status);
                }
                
                // Handle specific error codes
                if (response.status === 401) {
                    throw new Error(this.config.ERROR_MESSAGES.INVALID_API_KEY);
                } else if (response.status === 429) {
                    throw new Error(this.config.ERROR_MESSAGES.RATE_LIMIT);
                } else if (response.status === 402) {
                    throw new Error(this.config.ERROR_MESSAGES.QUOTA_EXCEEDED);
                } else if (response.status >= 500) {
                    throw new Error(this.config.ERROR_MESSAGES.API_ERROR);
                } else {
                    throw new Error(`❌ Error ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
                }
            }

            const data = await response.json();
            
            if (this.config.DEBUG) {
                console.log('✅ Response received');
                console.log('⏱️ Response time:', responseTime + 'ms');
                console.log('📊 Usage:', data.usage);
            }

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
                usage: data.usage,
                responseTime: responseTime
            };

        } catch (error) {
            if (this.config.DEBUG) {
                console.error('❌ Chat API Error:', error);
            }
            
            // Handle network errors
            if (error.message.includes('Failed to fetch') || 
                error.message.includes('NetworkError') ||
                error.name === 'TypeError') {
                throw new Error(this.config.ERROR_MESSAGES.NETWORK_ERROR);
            }
            
            // Re-throw the error with proper message
            throw error;

        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Test API connection
     * @returns {Promise<boolean>}
     */
    async testConnection() {
        try {
            const response = await this.sendMessage('Hello');
            return response.success;
        } catch (error) {
            if (this.config.DEBUG) {
                console.error('❌ Connection test failed:', error);
            }
            return false;
        }
    }

    /**
     * Get available models (placeholder - could be expanded)
     * @returns {Array}
     */
    getAvailableModels() {
        return [
            { id: 'minimax/minimax-m2:free', name: 'Sopeng v2.1', free: true },
            { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'Llama 3.2 3B', free: true },
            { id: 'google/gemini-flash-1.5-8b:free', name: 'Gemini Flash 1.5', free: true },
            { id: 'microsoft/phi-3-mini-128k-instruct:free', name: 'Phi-3 Mini', free: true },
            { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', free: false },
            { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', free: false },
        ];
    }

    /**
     * Change model
     * @param {string} modelId
     */
    changeModel(modelId) {
        this.config.MODEL = modelId;
        if (this.config.DEBUG) {
            console.log('🔄 Model changed to:', modelId);
        }
    }

    /**
     * Reset rate limit counter
     */
    resetRateLimit() {
        this.requestCount = 0;
        this.lastRequestTime = Date.now();
        if (this.config.DEBUG) {
            console.log('🔄 Rate limit counter reset');
        }
    }
}

// Create global instance
const chatAPI = new ChatAPI(CONFIG);

// Export for ES6 modules (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatAPI;
}

// Log initialization
if (CONFIG.DEBUG) {
    console.log('✅ ChatAPI instance created and ready');
    console.log('🔗 Global variable "chatAPI" is available');
}