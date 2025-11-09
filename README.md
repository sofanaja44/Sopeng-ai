# 🤖 Sopeng.ai - Modern AI Assistant

Asisten AI cerdas berbahasa Indonesia yang siap membantu berbagai kebutuhan Anda, dari menulis konten, coding, hingga brainstorming ide.

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## ✨ Fitur Utama

- 🧠 **AI Cerdas** - Menggunakan model AI terbaru (Minimax M2)
- ⚡ **Respons Cepat** - Jawaban dalam hitungan detik
- 🔒 **Aman & Privasi** - Data percakapan terjaga
- 🇮🇩 **Bahasa Indonesia** - Support penuh bahasa Indonesia
- 💻 **Code Assistant** - Syntax highlighting & copy code
- 📱 **Responsive** - Berfungsi di semua perangkat
- 🌙 **Dark Mode** - Mode gelap untuk kenyamanan mata
- 📝 **Markdown Support** - Format teks yang kaya

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/sopeng-ai.git
cd sopeng-ai
```

### 2. Konfigurasi API Key

Buka file `config.js` dan masukkan API key Anda:

```javascript
const CONFIG = {
    API_KEY: 'sk-or-v1-your-api-key-here',
    // ... konfigurasi lainnya
};
```

**Cara mendapatkan API Key:**
1. Kunjungi [OpenRouter.ai](https://openrouter.ai/keys)
2. Sign up atau login
3. Buat API key baru
4. Copy dan paste ke `config.js`

### 3. Jalankan Aplikasi

Cukup buka `index.html` di browser Anda, atau gunakan live server:

```bash
# Menggunakan Python
python -m http.server 8000

# Menggunakan Node.js (http-server)
npx http-server

# Atau gunakan Live Server extension di VS Code
```

Akses di: `http://localhost:8000`

## 📁 Struktur File

```
sopeng-ai/
│
├── index.html          # Landing page
├── chat.html          # Halaman chat utama
├── style.css          # Styling untuk chat
├── script.js          # Logic aplikasi chat
├── config.js          # Konfigurasi API & settings
├── api.js             # API handler untuk OpenRouter
└── README.md          # Dokumentasi ini
```

## ⚙️ Konfigurasi

### Model AI

Anda dapat mengubah model AI di `config.js`:

```javascript
MODEL: 'minimax/minimax-m2:free',  // Model yang digunakan
MODEL_DISPLAY_NAME: 'Sopeng v2.1', // Nama yang ditampilkan
```

**Model Gratis yang Tersedia:**
- `minimax/minimax-m2:free` - Sopeng v2.1 (Default)
- `meta-llama/llama-3.2-3b-instruct:free` - Llama 3.2 3B
- `google/gemini-flash-1.5-8b:free` - Gemini Flash 1.5
- `microsoft/phi-3-mini-128k-instruct:free` - Phi-3 Mini

### Parameter Chat

Sesuaikan parameter AI di `config.js`:

```javascript
MAX_TOKENS: 2000,           // Panjang maksimal respons
TEMPERATURE: 0.7,           // Kreativitas (0.0 - 2.0)
TOP_P: 1,                   // Nucleus sampling
FREQUENCY_PENALTY: 0,       // Kurangi repetisi
PRESENCE_PENALTY: 0,        // Dorong topik baru
```

### System Prompt

Customize personality AI di `config.js`:

```javascript
SYSTEM_PROMPT: `Kamu adalah Sopeng, asisten AI yang...`,
```

## 🎯 Cara Penggunaan

### Chat Dasar

1. Ketik pesan di input box
2. Tekan Enter atau klik tombol kirim
3. Tunggu respons dari AI

### Keyboard Shortcuts

- `Enter` - Kirim pesan
- `Shift + Enter` - Baris baru
- `Cmd/Ctrl + K` - Focus ke input
- `Cmd/Ctrl + Shift + N` - Chat baru
- `Cmd/Ctrl + B` - Toggle sidebar
- `Escape` - Clear input

### Fitur Code

AI dapat membantu dengan code:

```
Buatkan contoh code Python untuk web scraping
```

Response akan memiliki syntax highlighting dan tombol copy.

### Suggestion Cards

Klik salah satu suggestion card untuk quick start:
- 📧 Tulis Email
- 🎓 Belajar Sesuatu
- 💡 Brainstorming
- 💻 Code Review

## 🎨 Customization

### Mengubah Tema Warna

Edit variabel CSS di `style.css`:

```css
:root {
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --bg-main: #0f172a;
    /* ... */
}
```

### Mengubah Font

Ganti font di bagian head `chat.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap">
```

## 🐛 Troubleshooting

### API Key Error

**Problem:** `API Key tidak valid`

**Solution:**
- Pastikan API key sudah benar
- Cek apakah ada spasi atau karakter tambahan
- Regenerate API key di OpenRouter

### Network Error

**Problem:** `Terjadi kesalahan jaringan`

**Solution:**
- Cek koneksi internet
- Pastikan tidak ada firewall yang memblokir
- Cek status OpenRouter API

### Rate Limit

**Problem:** `Terlalu banyak permintaan`

**Solution:**
- Tunggu beberapa saat
- Kurangi `MAX_MESSAGES_PER_MINUTE` di config
- Upgrade plan di OpenRouter

### Quota Exceeded

**Problem:** `Kuota API telah habis`

**Solution:**
- Cek dashboard OpenRouter
- Upgrade ke paid plan
- Atau tunggu reset quota

## 📊 API Usage

### Rate Limiting

- Default: 10 pesan per menit
- Dapat diubah di `MAX_MESSAGES_PER_MINUTE`
- History limit: 10 pesan terakhir

### Token Management

- Max tokens per response: 2000
- History dipangkas otomatis
- Optimasi untuk efisiensi

## 🔐 Security & Privacy

- ✅ API key tidak disimpan di server
- ✅ Chat history hanya di browser
- ✅ Tidak ada tracking atau analytics
- ✅ Data tidak dibagikan ke pihak ketiga

**Rekomendasi:**
- Jangan commit API key ke repository
- Gunakan environment variables untuk production
- Regenerate API key secara berkala

## 🚀 Deployment

### GitHub Pages

```bash
# Push ke GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Enable GitHub Pages di repository settings
```

### Netlify

1. Drag & drop folder ke Netlify
2. Atau connect dengan GitHub repository
3. Deploy otomatis setiap push

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**⚠️ Important:** Jangan lupa set API key di environment variables!

## 🛠️ Development

### Debug Mode

Enable debug mode di `config.js`:

```javascript
DEBUG: true,  // Enable console logging
```

Console akan menampilkan:
- API requests & responses
- Token usage
- Error details
- Performance metrics

### Testing

Test API connection:

```javascript
// Di browser console
chatAPI.testConnection()
```

## 📝 Changelog

### Version 2.1.0 (Current)
- ✨ Markdown support dengan highlight.js
- ✨ Code syntax highlighting
- ✨ Copy code button
- ✨ Responsive mobile design
- ✨ Dark mode
- ✨ Typing indicator
- ✨ Keyboard shortcuts
- 🐛 Fixed mobile scroll issues
- 🐛 Fixed horizontal scroll bug

### Version 2.0.0
- 🎉 Initial release
- ✨ Basic chat functionality
- ✨ OpenRouter API integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Credits

- **UI Design**: Inspired by modern AI chat interfaces
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Inter)
- **AI Model**: OpenRouter API (Minimax M2)
- **Markdown**: Marked.js
- **Syntax Highlighting**: Highlight.js

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

- 📧 Email: support@sopeng.ai
- 💬 GitHub Issues: [Create an issue](https://github.com/yourusername/sopeng-ai/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/sopeng-ai/wiki)

## 🌟 Features Roadmap

- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Image analysis
- [ ] Chat export (PDF, TXT)
- [ ] Custom system prompts per chat
- [ ] Chat history sync
- [ ] Mobile app (PWA)
- [ ] Plugin system

## ⭐ Star History

Jika project ini membantu Anda, jangan lupa beri star! ⭐

---

**Made with ❤️ by Sopeng.ai Team**

*Happy Chatting! 🚀*