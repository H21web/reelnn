import type { NextApiRequest, NextApiResponse } from 'next';
import { BACKEND_URL } from "@/config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/trending`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching data:`, error);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
}