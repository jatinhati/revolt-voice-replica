import express from 'express';
import { GeminiService } from '../services/geminiService.js';

const router = express.Router();
const geminiService = new GeminiService();

// Simple voice endpoint
router.post('/voice', async (req, res) => {
  try {
    const { audioData } = req.body;
    
    console.log('📨 Received audio data, length:', audioData ? audioData.length : 0);
    
    if (!audioData) {
      return res.status(400).json({
        success: false,
        error: 'No audio data provided'
      });
    }

    // Process with Gemini
    console.log('🤖 Processing with Gemini...');
    const result = await geminiService.processVoiceInput(audioData);
    
    console.log('✅ Gemini result:', result);
    res.json(result);
  } catch (error) {
    console.error('❌ Voice route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;