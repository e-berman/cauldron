import type { NextApiRequest, NextApiResponse } from 'next';
import { type Recommendations } from "~/interfaces/Recommendations";

const getRecommendations = async (bearerToken: string, artistID1: string, artistID2: string) => {
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?seed_artists=${artistID1},${artistID2}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json() as Recommendations;
    return data.tracks;
};

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { artistID1, artistID2 } = req.query;
    const bearerToken = req.headers.authorization?.replace('Bearer ', '');

    const tracks = await getRecommendations(
      bearerToken as string,
      artistID1 as string,
      artistID2 as string
    );

    res.status(200).json({ tracks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
}
