export interface ArtistSearch {
    artists: {
      href: string;
      items: {
        external_urls: {
          spotify: string;
        };
        followers: {
          href: string | null;
          total: number;
        };
        genres: string[];
        href: string;
        id: string;
        images: {
          height: number;
          url: string;
          width: number;
        }[];
        name: string;
        popularity: number;
        type: string;
        uri: string;
      }[];
      limit: number;
      next: string | null;
      offset: number;
      previous: string | null;
      total: number;
    };
  }