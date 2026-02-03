
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        // using rest.opensubtitles.org/search/query-{query}/sublanguageid-en
        // Note: This public API might have rate limits or require a specific User-Agent.
        const response = await fetch(`https://rest.opensubtitles.org/search/query-${encodeURIComponent(query as string)}/sublanguageid-en`, {
            headers: {
                'User-Agent': 'VLSub 0.10.2' // Mimic a known player to ensure response
            }
        });

        if (!response.ok) {
            console.error("Subtitle API Error:", response.status, response.statusText);
            return res.status(response.status).json({ error: 'Failed to fetch subtitles' });
        }

        const data = await response.json();

        // Transform data to a simple list
        // The API returns an array of objects. We need SubFileName and SubDownloadLink.
        const subtitles = Array.isArray(data) ? data.map((item: any) => ({
            id: item.IDSubtitle,
            filename: item.SubFileName,
            url: item.SubDownloadLink,
            lang: item.LanguageName,
            rating: item.SubRating
        })).slice(0, 20) : []; // Limit to 20 results

        res.status(200).json(subtitles);
    } catch (error) {
        console.error("Subtitle Fetch Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
