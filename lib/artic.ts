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

const FALLBACK_IIIF_URL = "https://www.artic.edu/iiif/2";

export async function getDailyPhotograph(): Promise<DailyPhotograph | null> {
  const params = encodeURIComponent(JSON.stringify({
    query: { bool: { must: [
      { term: { is_public_domain: true } },
      { exists: { field: "image_id" } }
    ], filter: [{ match: { artwork_type_title: "Photograph" } }] } },
    fields: ["id", "title", "artist_title", "date_display", "image_id", "medium_display"],
    limit: 40
  }));

  const response = await fetch(`https://api.artic.edu/api/v1/artworks/search?params=${params}`);
  if (!response.ok) return null;

  const json = await response.json();
  const items: Artwork[] = (json.data ?? []).filter((item: Artwork) => Boolean(item.image_id));
  if (!items.length) return null;

  const day = Math.floor(Date.now() / 86400000);
  const artwork = items[day % items.length];
  const iiifUrl = json.config?.iiif_url || FALLBACK_IIIF_URL;

  return {
    artwork,
    imageUrl: `${iiifUrl}/${artwork.image_id}/full/843,/0/default.jpg`
  };
}