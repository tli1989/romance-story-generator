export default async function handler(req, res) {
  // Increase the response timeout
  res.setTimeout(30000);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { MMC, FMC, startAs, mainTrope } = req.body;

    const requestPayload = {
      model: "claude-3-opus-20240229",
      messages: [{
        role: "user",
        content: `Write a brief modern romance story (around 500 words) about ${MMC} falling in love with ${FMC}. 

This is a ${mainTrope} story, where they start as ${startAs} but then overcome their obstacles to fall in love.

Keep it concise but emotionally resonant, with natural dialogue and a satisfying resolution.`
      }],
      temperature: 1,
      max_tokens: 2048 // Reduced from 4096
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Set 8-second timeout

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Claude API error:', errorText);
        throw new Error(`Claude API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return res.status(200).json({ story: data.content[0].text });

    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate story',
      details: error.message 
    });
  }
}
