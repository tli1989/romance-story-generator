export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('API Key present:', !!process.env.CLAUDE_API_KEY);
    console.log('Request body:', req.body);
    
    const { MMC, FMC, startAs, mainTrope } = req.body;

    const messages = [
      {
        role: "system",
        content: `You are a creative romance writer who specializes in writing engaging, emotional stories with vivid descriptions and natural dialogue. Create stories that:
        - Focus on emotional development and chemistry between characters
        - Include both internal thoughts/feelings and external actions/dialogue
        - Create natural conflict and resolution
        - Maintain consistent characterization
        - Write approximately 1000 words
        - Format with proper paragraphs
        - Keep content family-friendly`
      },
      {
        role: "user",
        content: `Write a 1,000 word modern romance story. It's an AU (Alternate Universe) fiction about ${MMC}. He falls in love with ${FMC}. 

This is a ${mainTrope} story, where ${MMC} and the FMC start as ${startAs} but then overcome their internal and external obstacles to fall in love.

Please write a complete story with a satisfying resolution.`
      }
    ];

    console.log('Making request to Claude API with messages:', messages);
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'messages-2023-12-15'
        },
        body: JSON.stringify({
          model: 'claude-3-opus-20240229',
          max_tokens: 4096,
          messages: messages
        })
      });

      console.log('Claude API response status:', response.status);
      
      const responseText = await response.text();
      console.log('Claude API response text:', responseText);
      
      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status} - ${responseText}`);
      }

      const data = JSON.parse(responseText);
      return res.status(200).json({ story: data.content[0].text });
      
    } catch (apiError) {
      console.error('API call error:', apiError);
      throw new Error(`API call failed: ${apiError.message}`);
    }
    
  } catch (error) {
    console.error('Full error object:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json({ 
      error: 'Failed to generate story',
      details: error.message,
      stack: error.stack
    });
  }
}
