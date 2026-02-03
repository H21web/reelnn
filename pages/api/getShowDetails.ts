import type { NextApiRequest, NextApiResponse } from 'next';
import { BACKEND_URL } from "@/config";

interface Episode {
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
  air_date: string;
  quality: ShowQuality[];
}

interface Season {
  season_number: number;
  episodes: Episode[];
}

interface ShowQuality {
  type: string;
  fileID: string;
  size: string;
  audio: string;
  video_codec: string;
  file_type: string;
  subtitle: string;
  runtime: number | null;
}

interface CastMember {
  name: string;
  character: string;
  imageUrl: string;
}

interface ShowData {
  sid: number;
  title: string;
  original_title: string;
  release_date?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  popularity?: number;
  vote_average?: number;
  vote_count?: number;
  logo?: string;
  genres?: string[];
  season: Season[];
  cast: CastMember[];
  creators: string[];
  links: string[];
  studios: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sid } = req.query;

  if (!sid) {
    return res.status(400).json({ error: "Show ID is required" });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `${BACKEND_URL}/api/v1/getShowDetails/${sid}`,
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data: ShowData = await response.json();
    console.log("Fetched show details:", data);

    res.setHeader('Cache-Control', 's-maxage=43200');
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching show details:", error);

    if (error instanceof TypeError && error.message.includes("abort")) {
      return res.status(504).json({ error: "Request timed out" });
    }

    return res.status(500).json({ error: "Failed to fetch show details" });
  }
}