export default async function handler(req, res) {
  // Set response timeout
  res.setTimeout(55000);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { MMC, FMC, startAs, mainTrope } = req.body;

    const requestPayload = {
      model: "claude-3-opus-20240229",
      messages: [{
        role: "user",
        content: `Write a romantic story (around 500 words) about ${MMC} falling in love with ${FMC}. 
        
This is a ${mainTrope} story, where they start as ${startAs}. Keep the story concise but emotionally resonant.`
      }],
      temperature: 1,
      max_tokens: 2048
    };

    console.log('Starting Claude API request...');

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      });

      console.log('Received response from Claude API:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Claude API error:', errorText);
        throw new Error(`Claude API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Successfully parsed response');
      return res.status(200).json({ story: data.content[0].text });

    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
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
