export const maxDuration = 60;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { MMC, FMC, startAs, mainTrope } = req.body;

    // Initial quick response to keep connection alive
    return res.status(200).json({ 
      message: 'Story generation started',
      requestId: Date.now().toString(), // Simple ID for demo
      parameters: { MMC, FMC, startAs, mainTrope }
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to start story generation',
      details: error.message 
    });
  }
}
