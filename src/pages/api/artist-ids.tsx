import type { NextApiRequest, NextApiResponse } from 'next';
import { type ArtistSearch } from "~/interfaces/ArtistSeach";


const getArtistID = async (bearerToken: string, artistName: string) => {
  
  if (typeof artistName === "string") {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&market=US&limit=1`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json() as ArtistSearch;

    return data?.artists?.items?.[0]?.id;
  }
};

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { firstArtist, secondArtist } = req.query;
    const bearerToken = req.headers.authorization?.replace('Bearer ', '');

    const artistID1 = await getArtistID(bearerToken as string, firstArtist as string);
    const artistID2 = await getArtistID(bearerToken as string, secondArtist as string);

    res.status(200).json({ artistID1, artistID2 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch artist IDs' });
  }
}
