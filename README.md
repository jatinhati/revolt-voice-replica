# Revolt Voice Assistant

A voice-powered AI assistant built with Node.js, Express, and the Gemini Live API. Record your voice, get intelligent responses, and interact naturally with AI.

## Features

- 🎤 Voice recording with Web Audio API
- 🤖 AI responses powered by Gemini Live API
- 🔊 Audio playback of AI responses
- 📱 Responsive web interface
- ⚡ Real-time voice processing

## Prerequisites

- Node.js (v18 or higher)
- A Gemini API key from Google AI Studio

## Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env` file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=3000
   ```

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and paste it in your `.env` file

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

### Live Voice Chat (Recommended)
1. Open your browser and navigate to `http://localhost:8080/live-voice.html`
2. Wait for "AI Ready" status with green indicator
3. Click "Start Talking" and speak naturally
4. The AI responds in real-time with low latency (1-2 seconds)
5. Click "Stop AI" anytime to interrupt and speak again
6. Enjoy natural, conversational flow with interruption support

### Basic Voice Test
1. Navigate to `http://localhost:8080`
2. Click "Start Recording" → speak → "Stop Recording"
3. Wait for AI response

## Key Features

✅ **Real-time conversation** with 1-2 second response latency
✅ **Smooth interruptions** - interrupt AI while speaking
✅ **WebSocket streaming** for instant communication
✅ **Gemini Live API** integration with native audio processing
✅ **Server-to-server architecture** for optimal performance
✅ **Auto-reconnection** if connection drops
✅ **Voice activity detection** for natural flow

## Project Structure

```
revolt-voice-assistant/
├── server/
│   ├── index.js                # Main Express server
│   ├── routes/
│   │   └── voice.js             # API routes for voice processing
│   ├── services/
│   │   └── geminiService.js     # Gemini Live API integration
│   ├── config/
│   │   └── geminiConfig.js      # API configuration and settings
│   └── utils/
│       └── audioUtils.js        # Audio processing utilities
├── public/
│   ├── index.html               # Frontend interface
│   ├── styles.css               # Styling
│   └── script.js                # Client-side JavaScript
├── .env                         # Environment variables
├── package.json                 # Project dependencies
└── README.md                    # This file
```

## API Endpoints

### POST /api/voice
Processes voice input and returns AI response.

**Request:**
- Content-Type: `application/json`
- Body: `{ "audioData": "base64_encoded_audio" }`

**Response:**
```json
{
  "success": true,
  "audioData": "base64_encoded_response_audio",
  "mimeType": "audio/wav",
  "text": "Text version of response"
}
```

## Configuration

### Gemini Model Settings
Edit `server/config/geminiConfig.js` to customize:
- Model parameters
- System prompt
- Temperature and response length
- API endpoints

### Audio Settings
The application supports:
- WAV, MP3, and WebM audio formats
- 16kHz sample rate for optimal quality
- Automatic format conversion

## Troubleshooting

### Common Issues

1. **Microphone not working**
   - Check browser permissions
   - Ensure HTTPS in production
   - Try a different browser

2. **API errors**
   - Verify your Gemini API key is correct
   - Check your API quota and billing
   - Ensure stable internet connection

3. **Audio playback issues**
   - Check browser audio permissions
   - Try different audio formats
   - Verify speakers/headphones

### Error Messages

- `GEMINI_API_KEY not configured`: Add your API key to `.env`
- `Failed to access microphone`: Grant microphone permissions
- `Invalid audio format`: Check audio encoding settings

## Development

### Adding New Features

1. **Backend changes**: Modify files in `server/` directory
2. **Frontend changes**: Edit files in `public/` directory
3. **API integration**: Update `geminiService.js`

### Testing

Test the voice recording:
```bash
# Start the server
npm run dev

# Open browser and test microphone access
# Check browser console for errors
```

## Security Notes

- Never commit your `.env` file with real API keys
- Use HTTPS in production for microphone access
- Implement rate limiting for production use
- Validate all audio inputs server-side

## License

MIT License - feel free to use this project for learning and development.

## Support

For issues with:
- **Gemini API**: Check [Google AI documentation](https://ai.google.dev/)
- **Web Audio API**: See [MDN Web Audio docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- **This project**: Create an issue in the repository