import type { NextApiRequest, NextApiResponse } from 'next';
import { BACKEND_URL } from "@/config";

interface SimilarContent {
  id: string;
  title: string;
  year: number;
  poster: string;
  vote_average: number;
  genres: string[];
  popularity: number;
  media_type: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { media_type, genres } = req.query;

  if (!media_type) {
    return res.status(400).json({ error: "Media type is required" });
  }

  try {
    let apiUrl = `${BACKEND_URL}/api/v1/similar?media_type=${media_type}`;

    // Handle specific array structure if passed or ensure it's handled correctly
    if (genres) {
      const genreList = Array.isArray(genres) ? genres : [genres];
      genreList.forEach((genre) => {
        apiUrl += `&genres=${encodeURIComponent(genre)}`;
      });
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data: SimilarContent[] = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("Error fetching similar content:", error);
    return res.status(500).json({ error: "Failed to fetch similar content" });
  }
}