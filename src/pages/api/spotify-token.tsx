import type { NextApiRequest, NextApiResponse } from 'next';

interface TokenResponseObject {
  object: string,
  token: string,
  provider: string,
}

const getBearerToken = async (userID: string, provider: string) => {
  const BACKEND_API_KEY: string | undefined = process.env.BACKEND_API_KEY;

  if (!BACKEND_API_KEY) {
    console.warn("Missing API Key")
  } else {
    const accessTokenResponse = await fetch(`https://api.clerk.com/v1/users/${encodeURIComponent(userID)}/oauth_access_tokens/${encodeURIComponent(provider)}`, {
      headers: {
        Authorization: `Bearer ${BACKEND_API_KEY}`
      }
    });

    const data = await accessTokenResponse.json() as TokenResponseObject[];

    return data[0]?.token;
  }
};

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userID, provider } = req.query;
    const token: string | undefined = await getBearerToken(userID as string, provider as string);
    //console.log(token)
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bearer token' });
  }
}