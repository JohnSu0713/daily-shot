export type Artwork = {
  id: number;
  title: string;
  artist_title: string | null;
  date_display: string;
  image_id: string;
  medium_display?: string;
};

export async function getDailyPhotograph(): Promise<Artwork | null> {
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
  const items: Artwork[] = json.data ?? [];
  if (!items.length) return null;
  const day = Math.floor(Date.now() / 86400000);
  return items[day % items.length];
}

export function artworkImageUrl(imageId: string) {
  return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
}