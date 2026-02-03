import type { NextApiRequest, NextApiResponse } from 'next';
import { NEXT_PUBLIC_TELEGRAM_BOT_NAME, SHORTENER_API_URL, SHORTENER_API_KEY } from '@/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const { streamUrl, title, quality, contentId, mediaType, qualityIndex, seasonNumber, episodeNumber } = body;

    if (!streamUrl || !contentId) {
      return res.status(400).json({ error: 'Required parameters missing' });
    }

    const mediaTypeCode = mediaType === 'show' ? 's' : 'm';
    const compactParams = `${contentId}_${mediaTypeCode}_${qualityIndex}_${seasonNumber || 0}_${episodeNumber || 0}`;

    const telegramLink = `https://t.me/${NEXT_PUBLIC_TELEGRAM_BOT_NAME}?start=file_${compactParams}&text=${encodeURIComponent(`${title} ${quality}`)}`;

    let directLink = streamUrl;

    // Use URL shortener if API URL and key are available
    if (SHORTENER_API_URL && SHORTENER_API_KEY) {
      try {
        const shortenerUrl = `${SHORTENER_API_URL}?api=${SHORTENER_API_KEY}&url=${encodeURIComponent(streamUrl)}`;
        const response = await fetch(shortenerUrl);
        const data = await response.json();

        if (data && data.shortenedUrl) {
          directLink = data.shortenedUrl;
        }
      } catch (shortenerError) {
        console.error('URL shortener error:', shortenerError);
      }
    }

    return res.status(200).json({
      directLink,
      telegramLink,
    });
  } catch (error) {
    console.error('Download API error:', error);
    return res.status(500).json({ error: 'An error occurred processing your request' });
  }
}