import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function testAPI() {
  try {
    console.log('🧪 Testing Gemini API...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Say hello in 5 words or less'
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 20
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.log('❌ API Error:', error);
      return;
    }

    const data = await response.json();
    console.log('✅ API Response:', JSON.stringify(data, null, 2));
    
    if (data.candidates && data.candidates[0]) {
      const text = data.candidates[0].content.parts[0].text;
      console.log('🤖 AI said:', text);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAPI();