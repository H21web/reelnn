import type { NextApiRequest, NextApiResponse } from 'next';
import { BACKEND_URL } from "@/config";

interface MovieQuality {
  resolution: string;
  format: string;
}

interface MovieData {
  mid: number;
  title: string;
  original_title: string;
  release_date?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  popularity?: number;
  vote_average?: number;
  vote_count?: number;
  cast: string[];
  logo?: string;
  genres?: string[];
  quality: MovieQuality[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { mid } = req.query;

  if (!mid) {
    return res.status(400).json({ error: "Movie ID is required" });
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/getMovieDetails/${mid}`
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data: MovieData = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return res.status(500).json({ error: "Failed to fetch movie details" });
  }
}