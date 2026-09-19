export type Artwork = {
  id: number;
  title: string;
  artist_title: string | null;
  date_display: string;
  image_id: string;
  medium_display?: string;
};

export type DailyPhotograph = {
  artwork: Artwork;
  imageUrl: string;
};

// AIC's IIIF host can currently return a Cloudflare challenge to third-party
// image requests. Keep the provider contract, but use a curated public-domain
// image URL that is reliable in browsers until direct IIIF delivery is stable.
const CURATED_DAILY: DailyPhotograph[] = [
  {
    artwork: {
      id: 1,
      title: "Migrant Mother, Nipomo, California",
      artist_title: "Dorothea Lange",
      date_display: "1936",
      image_id: "commons-migrant-mother",
      medium_display: "Photograph"
    },
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lange-MigrantMother02.jpg?width=1200"
  }
];

export async function getDailyPhotograph(): Promise<DailyPhotograph | null> {
  const day = Math.floor(Date.now() / 86400000);
  return CURATED_DAILY[day % CURATED_DAILY.length];
}