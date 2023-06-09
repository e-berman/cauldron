import type { NextApiRequest, NextApiResponse } from 'next';
import { type Recommendations } from "~/interfaces/Recommendations";

interface RequestBody {
  danceabilityValueRange: number[];
  energyValueRange: number[];
}

const getRecommendations = async (bearerToken: string, artistID1: string, artistID2: string, min_danceability: number, max_danceability: number, min_energy: number, max_energy: number ) => {
  const response = await fetch(
    `https://api.spotify.com/v1/recommendations?seed_artists=${encodeURIComponent(artistID1)},${encodeURIComponent(artistID2)}&limit=10&min_danceability=${encodeURIComponent(min_danceability)}&max_danceability=${encodeURIComponent(max_danceability)}&min_energy=${encodeURIComponent(min_energy)}&max_energy=${encodeURIComponent(max_energy)}`,
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
    const { danceabilityValueRange, energyValueRange } = req.body as RequestBody;
    const min_danceability = danceabilityValueRange[0];
    const max_danceability = danceabilityValueRange[1];
    const min_energy = energyValueRange[0];
    const max_energy = energyValueRange[1];

    const tracks = await getRecommendations(
      bearerToken as string,
      artistID1 as string,
      artistID2 as string,
      min_danceability as number,
      max_danceability as number,
      min_energy as number,
      max_energy as number,
    );

    res.status(200).json({ tracks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
}
