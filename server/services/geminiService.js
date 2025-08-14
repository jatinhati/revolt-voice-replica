import fetch from 'node-fetch';
import { geminiConfig } from '../config/geminiConfig.js';

export class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCi2gmp55eVFsjivCuCfHLIocJ3fMEx6yg';
    this.apiUrl = geminiConfig.apiUrl;
  }

  async processVoiceInput(audioBase64) {
    try {
      if (!this.apiKey) {
        throw new Error('GEMINI_API_KEY not configured');
      }

      console.log('🎤 Processing audio, length:', audioBase64 ? audioBase64.length : 0);

      // Process actual audio with Gemini
      const requestBody = {
        contents: [{
          parts: [
            {
              text: geminiConfig.systemPrompt
            },
            {
              inline_data: {
                mime_type: "audio/webm",
                data: audioBase64
              }
            }
          ]
        }],
        generationConfig: geminiConfig.generationConfig
      };

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      // Extract text response
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const parts = data.candidates[0].content.parts;
        const textPart = parts.find(part => part.text);
        
        if (textPart) {
          return {
            success: true,
            text: textPart.text,
            audioData: null
          };
        }
      }

      throw new Error('No valid response from Gemini API');
    } catch (error) {
      console.error('GeminiService error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}