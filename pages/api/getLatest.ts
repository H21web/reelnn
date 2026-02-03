import type { NextApiRequest, NextApiResponse } from 'next';
import { BACKEND_URL } from "@/config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { media_type } = req.query;

  if (!media_type || (media_type !== "movie" && media_type !== "show")) {
    return res.status(400).json({ error: 'Invalid media type. Use "movie" or "show".' });
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/getlatest/${media_type}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching ${media_type} data:`, error);
    return res.status(500).json({ error: `Failed to fetch ${media_type} data` });
  }
}