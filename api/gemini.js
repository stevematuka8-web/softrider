/**
 * Vercel Serverless Function — POST /api/gemini
 * Proxies SOFTRIDER Assistant IA requests to Google Gemini (gemini-2.5-flash)
 * using the GEMINI_API_KEY environment variable configured in Vercel.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY non configurée dans les variables d’environnement Vercel.',
    });
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const { systemInstruction, contents } = req.body || {};

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const payload = {
    contents: Array.isArray(contents) ? contents : [],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 380,
    },
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}

