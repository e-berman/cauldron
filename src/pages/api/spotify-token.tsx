import type { NextApiRequest, NextApiResponse } from 'next';

interface TokenResponseObject {
  access_token: string,
  token_type: string,
  expires_in: number,
}

const getBearerToken = async () => {
  const SPOTIFY_CLIENT_ID: string | undefined = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET: string | undefined = process.env.SPOTIFY_CLIENT_SECRET;

  if (SPOTIFY_CLIENT_ID === undefined || SPOTIFY_CLIENT_SECRET === undefined) {
    console.error("Spotify credentials are undefined");
  } else {
    const b64Auth: string = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${b64Auth}`,
      },
      body: 'grant_type=client_credentials',
    });

    const data = await tokenResponse.json() as TokenResponseObject;
    return data.access_token;
  }
};

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  try {
    const token: string | undefined = await getBearerToken();
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bearer token' });
  }
}