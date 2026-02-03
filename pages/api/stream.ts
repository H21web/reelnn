import { verifyStreamToken } from "@/utils/tokenUtils";
import { BACKEND_URL } from "@/config";
import type { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: "Missing or invalid token" });
  }

  try {
    const decodedToken = await verifyStreamToken(token);

    if (!decodedToken) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const { id } = decodedToken;

    const apiUrl = `${BACKEND_URL}/api/v1/dl/${id}?token=${token}`;

    const headers: HeadersInit = {};
    if (req.headers.range) {
      headers["range"] = req.headers.range;
    }

    const apiResponse = await fetch(apiUrl, { headers });

    if (!apiResponse.ok && apiResponse.status !== 206) {
      // If the backend errors, we should return that error text or JSON
      const errorText = await apiResponse.text();
      console.error(`Backend stream error: ${apiResponse.status} - ${errorText}`);
      throw new Error(`Backend API responded with status: ${apiResponse.status}`);
    }

    // Set headers from backend response
    apiResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    res.status(apiResponse.status);

    if (apiResponse.body) {
      // @ts-ignore: Readable.fromWeb is available in Node 18+ (which Next 15 requires)
      const readable = Readable.fromWeb(apiResponse.body);
      readable.pipe(res);
    } else {
      res.end();
    }

  } catch (error) {
    console.error("Error fetching video stream:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Failed to fetch video stream data" });
    }
  }
}