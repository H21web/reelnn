import type { NextApiRequest, NextApiResponse } from 'next';
import { generateStreamToken } from '@/utils/tokenUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // In standard Next.js API routes, body is already parsed if content-type is json
    const body = req.body;
    const { id, mediaType, qualityIndex, seasonNumber, episodeNumber } = body;

    if (!id || !mediaType) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const token = await generateStreamToken({
      id,
      mediaType,
      qualityIndex: qualityIndex || 0,
      seasonNumber,
      episodeNumber
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error generating stream token:', error);
    return res.status(500).json({ error: 'Failed to generate token' });
  }
}