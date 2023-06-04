import { NextApiRequest, NextApiResponse } from 'next';

const getBearerToken = async () => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      'Access-Control-Allow-Origin': '*',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await tokenResponse.json();
  return data.access_token;
  // tokenExpiration = Date.now() + data.expires_in * 1000;
};

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = await getBearerToken();
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bearer token' });
  }
}