import type { NextApiRequest, NextApiResponse } from 'next';
import { BACKEND_URL } from "@/config";

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
}

interface ContentItem {
  id: string;
  title: string;
  year: number;
  poster: string;
  vote_average: number;
  vote_count: number;
  media_type: string;
}

interface ApiResponse {
  items: ContentItem[];
  pagination: PaginationData;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { media_type, page: pageQuery, sort_by: sortByQuery } = req.query;

  const page = Array.isArray(pageQuery) ? pageQuery[0] : pageQuery || '1';
  const sort_by = Array.isArray(sortByQuery) ? sortByQuery[0] : sortByQuery || 'new';


  if (!media_type || (media_type !== "movie" && media_type !== "show")) {
    return res.status(400).json({ error: 'Invalid media type. Must be "movie" or "show".' });
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/paginated/${media_type}?page=${page}&sort_by=${sort_by}`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching paginated data:", error);
    return res.status(500).json({ error: "Failed to fetch data from API" });
  }
}