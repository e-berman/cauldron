export interface SpotifyAlbum {
    album: {
      album_group: string,
      album_type: string,
      artists: {
        external_urls: {
          spotify: string,
        };
        href: string,
        id: string,
        name: string,
        type: string,
        uri: string,
      }[],
      external_urls: {
        spotify: string,
      },
      href: string,
      id: string,
      images: {
        height: number,
        url: string,
        width: number,
      }[],
      is_playable: boolean,
      name: string,
      release_date: string,
      release_date_precision: string,
      total_tracks: number,
      type: string,
      uri: string,
    },
    artists: {
      external_urls: {
        spotify: string,
      };
      href: string,
      id: string,
      name: string,
      type: string,
      uri: string,
    }[],
    disc_number: number,
    duration_ms: number,
    explicit: boolean,
    external_ids: {
      isrc: string,
    },
    external_urls: {
      spotify: string,
    },
    href: string,
    id: string,
    is_local: boolean,
    is_playable: boolean,
    linked_from: {
      external_urls: {
        spotify: string,
      },
      href: string,
      id: string,
      type: string,
      uri: string,
    },
    name: string,
    popularity: number,
    preview_url: string,
    track_number: number,
    type: string,
    uri: string,
}