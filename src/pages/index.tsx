import { type NextPage } from "next";
import { useState, useEffect } from "react";
import { type SpotifyAlbum } from "~/interfaces/SpotifyAlbum";
import { type Recommendations } from "~/interfaces/Recommendations";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

interface BearerTokenResponse {
  token: string,
}

interface ArtistIDResponse {
  artistID1: string,
  artistID2: string,
}

const Home: NextPage = () => {

  const [firstArtist, setFirstArtist] = useState<string>('');
  const [secondArtist, setSecondArtist] = useState<string>('');
  const [bearerToken, setBearerToken] = useState<string>('');
  const [playlist, setPlaylist] = useState<string>('');
  const [playlistStatus, setPlaylistStatus] = useState<boolean>(false);

  const initialData: SpotifyAlbum[] = [];
  const [tracks, setTracks] = useState<SpotifyAlbum[]>(initialData);

  const user = useUser();
  const userID = user.user?.id ?? '';
  const provider = user.user?.externalAccounts[0]?.verification?.strategy ?? '';

  useEffect(() => {
    const fetchSpotifyToken = async () => {
      try {
        const bearerTokenResponse = await fetch(`/api/spotify-token?userID=${userID}&provider=${provider}`);
        const { token } = await bearerTokenResponse.json() as BearerTokenResponse;
  
        if (bearerTokenResponse.ok) {
          return token;
        } else {
          console.error('Failed to retrieve Spotify bearer token');
        }
      } catch (error) {
        console.error('Error occurred while fetching Spotify bearer token:', error);
      }
    };

    if (!bearerToken || (!!bearerToken && user.isSignedIn)) {
      fetchSpotifyToken()
      .then((token) => {
        if (!token) {
          console.error("Invalid token");
        } else {
          setBearerToken(token)
        }
      })
      .catch((error) => {
        console.error('Error occurred while fetching Spotify bearer token:', error);
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!!playlistStatus) {
      setPlaylistStatus(false)
    }

    try {
      const idResponse = await fetch(`/api/artist-ids?firstArtist=${firstArtist}&secondArtist=${secondArtist}`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      });

      const { artistID1, artistID2 } = await idResponse.json() as ArtistIDResponse;

      const recResponse = await fetch(`/api/get-recommendations?artistID1=${artistID1}&artistID2=${artistID2}`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      });

      const { tracks } = await recResponse.json() as Recommendations;
      setTracks(tracks);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreatePlaylist = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const username = user.user?.fullName;
    const trackURIs = getTrackURIs(tracks);

    try {
      if (!username || !playlist) {
        console.error("Unable to retrieve spotify username or playlist");
      } else {
        await fetch(`/api/create-playlist?username=${username}&playlist=${playlist}`, {
          method: 'POST',
          headers: { 
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trackURIs),
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getTrackURIs = (tracks: SpotifyAlbum[]) => {
    const idArray: string[] = [];
    
    for (const key of tracks.keys()) {
      idArray.push(tracks[key]?.uri || '')
    }
    
    return idArray
  }

  return (
    <>
      <main className="min-h-screen flex flex-col bg-gradient-to-t from-emerald-900 via-slate-800 to-slate-900 bg-scroll-color">
        <title>Cauldron</title>
        <div className="w-full mt-8">
          <div className="flex justify-end mr-16">
            {!user.isSignedIn && <SignInButton>
              <button type="submit" className="items-center ml-8 px-8 py-4 bg-blue-700 hover:bg-blue-600 text-white font-medium rounded-md shadow-md">
                sign in
              </button>
            </SignInButton>}
            {!!user.isSignedIn && <SignOutButton>
              <button  type="submit" className="items-center ml-8 px-8 py-4 bg-blue-700 hover:bg-blue-600 text-white font-medium rounded-md shadow-md">
                sign out
              </button>
            </SignOutButton>}
          </div>
          <div className="flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 fill-green-600">
              <path fillRule="evenodd" d="M10.5 3.798v5.02a3 3 0 01-.879 2.121l-2.377 2.377a9.845 9.845 0 015.091 1.013 8.315 8.315 0 005.713.636l.285-.071-3.954-3.955a3 3 0 01-.879-2.121v-5.02a23.614 23.614 0 00-3 0zm4.5.138a.75.75 0 00.093-1.495A24.837 24.837 0 0012 2.25a25.048 25.048 0 00-3.093.191A.75.75 0 009 3.936v4.882a1.5 1.5 0 01-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0115 8.818V3.936z" clipRule="evenodd" />
            </svg>
            <h1 className="font-mono text-4xl font-extrabold leading-none text-center tracking-tight text-green-600 md:text-5xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.4)]">cauldron</h1>
          </div>
          <div className="flex justify-center">
            <p className="items-center text-white font-medium mt-4">
              blend two artists to discover new music
            </p>
          </div>
          <form onSubmit={handleSubmit} className="relative justify-center w-full">
            <section className="flex justify-center w-full">
                <div className="mt-24 mx-14 mb-8 w-1/6">
                    <label className="flex block justify-center font-medium text-slate-100">first artist</label>
                    <input type="text" value={firstArtist} onChange={(e) => setFirstArtist(e.target.value)} id="track1" required className="block justify-center mt-2 w-full rounded-lg px-3 py-4 outline-none shadow" placeholder="enter first artist..."/>
                </div>
                <div className="mt-24 mx-14 mb-8 w-1/6">
                    <label className="block flex justify-center font-medium text-slate-100">second artist</label>
                    <input type="text" value={secondArtist} onChange={(e) => setSecondArtist(e.target.value)} id="track2" required className="block flex justify-center mt-2 w-full rounded-lg px-3 py-4 outline-none shadow" placeholder="enter second artist..."/>
                </div>
            </section>
            <div className="flex justify-center mb-8">
              <button type="submit" className="px-8 py-4 bg-green-700 hover:bg-green-600 text-white font-medium rounded-md shadow-md">
                blend
              </button>
            </div>
          </form>
          <div className="flex justify-center">
          {tracks && tracks.length > 0 && (
            <div className="flex-col p-16">
              <h2 className="text-xl font-bold mb-4 flex justify-center text-slate-100">similar tracks</h2>
              <ul className="grid grid-cols-2 gap-4 bg-slate-400 p-4 rounded-lg">
                {tracks.map((track: SpotifyAlbum) => (
                  <li key={track.id} className="border border-slate-500 py-2 px-2 text-slate-100 bg-slate-200 rounded-md">
                    <a href={track.external_urls.spotify} className="text-blue-500 font-bold hover:underline">
                      {track.artists[0]?.name} - {track.name} 
                    </a>
                  </li>
                ))}
              </ul>
              {!user.isSignedIn && (
                <div className="flex justify-center mt-4">
                  <p className="flex justify-center px-8 py-4 bg-slate-400 text-white font-medium rounded-md shadow-md">
                    sign in to create a playlist
                  </p>
                </div>
              )}
              {playlistStatus && (
                <div className="flex justify-center">
                  <p className="text-white mt-4">playlist created</p>
                </div>
              )}
              {!!user.isSignedIn && (
                <form onSubmit={handleCreatePlaylist} className="flex justify-center">
                  <input type="text" value={playlist} onChange={(e) => setPlaylist(e.target.value)} id="playlist" required className="block justify-center mt-4 rounded-md px-1 py-2 outline-none shadow" placeholder="enter playlist name..."/>
                  <button type="submit" onClick={() => setPlaylistStatus(true)} className="justify-center mt-4 ml-1 px-2 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-md">
                    create playlist
                  </button>
                </form>
              )}
            </div>
          )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
