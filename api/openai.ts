// Vercel serverless function: proxies OpenAI chat completions.
// Keeps the OpenAI API key server-side (OPENAI_API_KEY env var) so it's
// never shipped in the client bundle. hooks/useOpenAI.ts calls this route.

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'OPENAI_API_KEY is not configured on the server' });
    return;
  }

  const { messages, model, temperature, max_tokens } = req.body ?? {};

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages array is required' });
    return;
  }

  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages,
        temperature: temperature ?? 0.7,
        max_tokens,
      }),
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      res.status(openaiResponse.status).json({ error: data.error?.message || 'OpenAI API error' });
      return;
    }

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
