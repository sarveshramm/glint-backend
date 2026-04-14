import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        parts: [{ text: `High-end professional portfolio shot, ${prompt}. Clean, modern, tech-focused aesthetic.` }]
      },
      config: { responseModalities: ["TEXT"] }
    });

    const text = response.text?.trim() || '';

    return res.status(200).json({ text, generatedUrl: null });
  } catch (error) {
    console.error('Gemini image error:', error);
    return res.status(500).json({ error: 'AI image generation failed' });
  }
}
