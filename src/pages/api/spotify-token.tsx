import type { NextApiRequest, NextApiResponse } from 'next';

interface PermissionTokenResponseObject {
  object: string,
  token: string,
  provider: string,
}

interface GenericTokenResponseObject {
  access_token: string,
}

const getBearerTokenPermissions = async (userID: string, provider: string) => {
  const BACKEND_API_KEY: string | undefined = process.env.BACKEND_API_KEY;

  if (!BACKEND_API_KEY) {
    console.warn("Missing API Key")
  } else {
    const bearerPermissionsResponse = await fetch(`https://api.clerk.com/v1/users/${encodeURIComponent(userID)}/oauth_access_tokens/${encodeURIComponent(provider)}`, {
      headers: {
        Authorization: `Bearer ${BACKEND_API_KEY}`
      }
    });

    const data = await bearerPermissionsResponse.json() as PermissionTokenResponseObject[];

    return data[0]?.token;
  }
};

const getBearerTokenGeneric = async () => {
  const SPOTIFY_CLIENT_ID: string = process.env.SPOTIFY_CLIENT_ID ?? '';
  const SPOTIFY_CLIENT_SECRET: string = process.env.SPOTIFY_CLIENT_SECRET ?? '';
  

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    console.error("Missing ENV variables")
  } else {
    const basicAuth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

    const bearerResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const authData = await bearerResponse.json() as GenericTokenResponseObject;
    const bearerToken = authData.access_token;

    return bearerToken;
  }
};

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userID, provider } = req.query;

    if (!userID || !provider) {
      const token: string = await getBearerTokenGeneric() ?? '';
      res.status(200).json({ token });
    } else {
      const token: string = await getBearerTokenPermissions(userID as string, provider as string) ?? '';
      res.status(200).json({ token });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bearer token' });
  }
}