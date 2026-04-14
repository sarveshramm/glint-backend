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

  const { prompt, creators } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `You are GLINT AI Matchmaker. A client needs a specific talent.
        Client Request: "${prompt}"
        Available Talent Pool: ${JSON.stringify(creators || [])}
        
        Based ONLY on the talent pool provided, identify the top 3 matches. Return ONLY a comma-separated list of their IDs. If no matches exist, return "none".`,
    });

    return res.status(200).json({ text: response.text?.trim() || 'none' });
  } catch (error) {
    console.error('Gemini match error:', error);
    return res.status(500).json({ error: 'AI matching failed' });
  }
}
