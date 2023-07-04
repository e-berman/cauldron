import type { NextApiRequest, NextApiResponse } from 'next';
import { type Playlist } from '~/interfaces/Playlist';

interface TrackAdd {
    sanpshot_id: string,
}

const createPlaylist = async (bearerToken: string, username: string, playlist: string) => {
    if (typeof username === "string") {
      const response = await fetch(`https://api.spotify.com/v1/users/${encodeURIComponent(username)}/playlists`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: playlist,
        }),
      });
   
      const data = await response.json() as Playlist;

      return data?.id;
    }
};

const addTracksToPlaylist = async (bearerToken: string, playlistID: string, trackURIs: string[]) => {
    if (typeof playlistID === "string") {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistID)}/tracks`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uris: trackURIs,
                position: 0,
            }),
        });

        const data = await response.json() as TrackAdd;

        return data;
    }
};

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    try {
        const { username, playlist } = req.query;
        const bearerToken = req.headers.authorization?.replace('Bearer ', '');
        const trackURIs: string[] = req.body as string[];

        const playlistID = await createPlaylist(bearerToken as string, username as string, playlist as string);
        const data = await addTracksToPlaylist(bearerToken as string, playlistID as string, trackURIs);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create playlist' });
}
}