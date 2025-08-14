export const geminiConfig = {
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-2.0-flash',
  apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  systemPrompt: `You are a helpful and conversational voice assistant. Listen to the user's voice and respond directly to what they say. Provide detailed, informative responses that are engaging and helpful. Explain concepts clearly and give examples when appropriate.`,
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 300, // Longer responses for more detail
    candidateCount: 1
  }
};