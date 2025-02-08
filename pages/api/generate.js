export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { MMC, FMC, startAs, mainTrope } = req.body;

    const requestPayload = {
      model: "claude-3-opus-20240229",
      messages: [{
        role: "user",
        content: `Write a 1,000 word modern romance story. It's an AU (Alternate Universe) fiction about ${MMC}. He falls in love with ${FMC}. 

This is a ${mainTrope} story, where ${MMC} and the FMC start as ${startAs} but then overcome their internal and external obstacles to fall in love.

Please write a complete story with a satisfying resolution. Focus on emotional development, chemistry, natural dialogue, and create a satisfying resolution. Keep content family-friendly.`
      }],
      temperature: 1,
      max_tokens: 4096
    };

    console.log('Request payload:', JSON.stringify(requestPayload, null, 2));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify(requestPayload)
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', errorText);
      throw new Error(`Claude API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Invalid response structure from Claude API');
    }

    return res.status(200).json({ story: data.content[0].text });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate story',
      details: error.message 
    });
  }
}
