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
    // Use Wikimedia's supported external-file redirect instead of a direct CDN
    // hotlink. The browser follows the redirect to an appropriately sized asset.
    imageUrl: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Lange-MigrantMother.jpg&width=1200"
  }
];

export async function getDailyPhotograph(): Promise<DailyPhotograph | null> {
  const day = Math.floor(Date.now() / 86400000);
  return CURATED_DAILY[day % CURATED_DAILY.length];
}