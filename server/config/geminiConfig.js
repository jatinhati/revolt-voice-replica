export const geminiConfig = {
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-1.5-flash',
  apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  systemPrompt: `You are a helpful voice assistant. Listen to the user's voice and respond directly to what they say. Keep responses under 20 words.`,
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: 50, // Very short for speed
    candidateCount: 1
  }
};