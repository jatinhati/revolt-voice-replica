# Revolt Motors Voice Interface (Gemini Live API)

This project is a **server-to-server Node.js/Express** application that connects a browser microphone to the **Gemini 2.5 Flash Live API** for real-time speech interaction.

The goal is to allow a user to **speak into their mic**, send the audio stream to the backend, forward it to the Gemini Live API, and receive the AI’s spoken or text response instantly.

## ✨ Features

- 🎯 **Real-time Voice Interaction** - Hold to talk, release to get response
- 🛑 **Smart Interruption** - Interrupt AI while speaking to ask new questions
- 🔄 **Auto-listening** - Automatically starts listening after each response
- 🌙 **Dark/Light Mode** - Toggle between themes
- 📱 **Mobile Responsive** - Works on all devices
- ⚡ **Low Latency** - Fast responses (1-2 seconds)
- 🎨 **Futuristic UI** - Glassmorphism design with smooth animations

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd voice-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=8080
   ```

4. **Get your Gemini API key**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

5. **Start the server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:8080
   ```

## 🎮 How to Use

### Basic Interaction
- **Hold the button** → Speak your question
- **Release the button** → Get AI response
- **AI speaks back** → Automatically starts listening for next question

### Advanced Features
- **Interrupt AI**: Hold button while AI is speaking to interrupt and ask new question
- **Auto-listening**: After AI responds, it automatically listens for 10 seconds
- **Theme Toggle**: Click the toggle in top-right corner to switch themes
- **Mobile Support**: Touch and hold works on mobile devices

## 🏗️ Project Structure

```
voice-assistant/
├── server/
│   ├── index.js              # Express server
│   ├── config/
│   │   └── geminiConfig.js   # API configuration
│   ├── services/
│   │   └── geminiService.js  # Gemini API integration
│   └── routes/
│       └── voice.js          # Voice API endpoints
├── public/
│   └── index.html            # Complete frontend (HTML + CSS + JS)
├── .env                      # Environment variables
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🔧 Configuration

### Environment Variables
```env
GEMINI_API_KEY=your_api_key_here  # Required: Your Gemini API key
PORT=8080                         # Optional: Server port (default: 8080)
```

### Gemini Settings
Edit `server/config/geminiConfig.js` to customize:
- Response length (currently 50 tokens for speed)
- Temperature (creativity level)
- System prompt (AI personality)

## 🎯 Technical Details

- **Backend**: Node.js + Express
- **AI**: Google Gemini 1.5 Flash API
- **Audio**: Web Audio API + MediaRecorder
- **Speech**: Browser Text-to-Speech
- **Styling**: Pure CSS with glassmorphism effects
- **No external dependencies** for frontend

## 🚀 Deployment

### Local Development
```bash
npm run dev  # Auto-restart on changes
```

### Production
```bash
npm start    # Standard production start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

## 🔒 Security Notes

- Never commit your `.env` file with real API keys
- Use HTTPS in production for microphone access
- Implement rate limiting for production use
- Validate all inputs server-side

## 🐛 Troubleshooting

### Common Issues

1. **Microphone not working**
   - Check browser permissions (click lock icon in address bar)
   - Ensure HTTPS in production
   - Try different browser

2. **API errors**
   - Verify Gemini API key is correct
   - Check API quota limits
   - Ensure stable internet connection

3. **No audio playback**
   - Check browser audio permissions
   - Verify speakers/headphones work
   - Try different browser

### Error Messages
- `GEMINI_API_KEY not configured`: Add API key to `.env`
- `Failed to access microphone`: Grant microphone permissions
- `API quota exceeded`: Wait or upgrade API plan

## 📝 License

MIT License - feel free to use for personal and commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Web Audio API for voice recording
- Modern CSS features for beautiful UI

---

**Made with ❤️ for seamless voice interactions**
