import type { NextApiRequest, NextApiResponse } from 'next';
import { BACKEND_URL } from "@/config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const requestQuery = req.query.query;

    // Ensure requestQuery is a string
    const query = Array.isArray(requestQuery) ? requestQuery[0] : requestQuery;

    if (!query || query.length < 3) {
      return res.status(400).json({ error: "Query should be at least 3 characters" });
    }

    const response = await fetch(
      `${BACKEND_URL}/api/v1/search?query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Search API error:", error);
    return res.status(500).json({ error: "Failed to fetch search results" });
  }
}