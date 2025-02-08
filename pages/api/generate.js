export const maxDuration = 60;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const startTime = Date.now();
    console.log('Starting request at:', new Date().toISOString());

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

    console.log('Making Claude API request...');

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      console.log('Request timed out after 50 seconds');
    }, 50000);

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

      clearTimeout(timeout);

      console.log('Response received after', (Date.now() - startTime) / 1000, 'seconds');
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Claude API error:', errorText);
        throw new Error(`Claude API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const endTime = Date.now();
      console.log('Total request time:', (endTime - startTime) / 1000, 'seconds');

      return res.status(200).json({ story: data.content[0].text });

    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Request manually aborted after 50 seconds');
      }
      throw fetchError;
    } finally {
      clearTimeout(timeout);
    }

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate story',
      details: error.message 
    });
  }
}
