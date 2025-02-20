export const maxDuration = 60;

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
        content: `Write the first 350 words of a modern day AU romance fic about ${MMC} falling in love with ${FMC}. 

This is a ${mainTrope} story, where they start as ${startAs}. Before you start, think of a reason ${MMC} and ${FMC} are stuck spending time together. Then think of a reason why ${MMC} and ${FMC} are not ready for a happily ever after. Make sure the first 350 words highlight this tension. Also make sure to preserve the unique appearance, appeal and personality of ${MMC} from his original fiction.`
      }],
      temperature: 1,
      max_tokens: 4096
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return res.status(200).json({ story: data.content[0].text });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate story',
      details: error.message 
    });
  }
}
