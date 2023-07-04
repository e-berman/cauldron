export interface Playlist {
    collaborative: boolean;
    description: string | null;
    external_urls: {
      spotify: string;
    };
    followers: {
      href: string | null;
      total: number;
    };
    href: string;
    id: string;
    images: string[];
    name: string;
    owner: {
      display_name: string;
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      type: string;
      uri: string;
    };
    primary_color: string | null;
    public: boolean;
    snapshot_id: string;
    tracks: {
      href: string;
      items: never[]; // You can replace 'any' with a more specific type for the 'items' array if you have information about its structure.
      limit: number;
      next: string | null;
      offset: number;
      previous: string | null;
      total: number;
    };
    type: string;
    uri: string;
  }