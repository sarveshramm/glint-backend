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

  const { title, tags } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Write a punchy, professional social media description for: ${title}. Skills: ${(tags || []).join(', ')}. Max 150 chars.`,
    });

    return res.status(200).json({ text: response.text?.trim() || '' });
  } catch (error) {
    console.error('Gemini assist error:', error);
    return res.status(500).json({ error: 'AI generation failed' });
  }
}
