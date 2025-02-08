export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { MMC, FMC, startAs, mainTrope } = req.body;

    const requestBody = {
      model: 'claude-3-opus-20240229',
      max_tokens: 4096,
      // System parameter is at the top level, not in messages array
      system: "You are a creative romance writer who specializes in writing engaging, emotional stories with vivid descriptions and natural dialogue. Focus on emotional development, chemistry, natural dialogue, and satisfying resolutions. Keep content family-friendly.",
      messages: [
        {
          role: "user",
          content: `Write a 1,000 word modern romance story. It's an AU (Alternate Universe) fiction about ${MMC}. He falls in love with ${FMC}. 

This is a ${mainTrope} story, where ${MMC} and the FMC start as ${startAs} but then overcome their internal and external obstacles to fall in love.

Please write a complete story with a satisfying resolution.`
        }
      ]
    };

    console.log('Making request with body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error response:', errorText);
      throw new Error(`Claude API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return res.status(200).json({ story: data.content[0].text });
    
  } catch (error) {
    console.error('Full error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate story',
      details: error.message 
    });
  }
}
