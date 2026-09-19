export type Artwork = {
  id: string;
  title: string;
  artist: string;
  date: string;
  location: string;
  imageUrls: string[];
  sourceUrl: string;
  credit: string;
  lessonId: string;
};

export type DailyPhotograph = {
  artwork: Artwork;
  index: number;
  dateKey: string;
};

export const CURATED_PHOTOGRAPHS: Artwork[] = [
  {
    id: "migrant-mother",
    title: "Migrant Mother, Nipomo, California",
    artist: "Dorothea Lange",
    date: "1936",
    location: "Nipomo, California",
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Lange-MigrantMother02.jpg/960px-Lange-MigrantMother02.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/54/Lange-MigrantMother02.jpg"
    ],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lange-MigrantMother02.jpg",
    credit: "Library of Congress · FSA/OWI · Public domain",
    lessonId: "gesture"
  },
  {
    id: "white-angel-breadline",
    title: "White Angel Breadline, San Francisco",
    artist: "Dorothea Lange",
    date: "1932",
    location: "San Francisco, California",
    imageUrls: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/White_Angel_Breadline%2C_San_Francisco%2C_1932%2C_by_Dorothea_Lange.jpg/960px-White_Angel_Breadline%2C_San_Francisco%2C_1932%2C_by_Dorothea_Lange.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/cc/White_Angel_Breadline%2C_San_Francisco%2C_1932%2C_by_Dorothea_Lange.jpg"
    ],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:White_Angel_Breadline,_San_Francisco,_1932,_by_Dorothea_Lange.jpg",
    credit: "FSA/OWI · Public domain",
    lessonId: "layers"
  },
  {
    id: "allie-mae-burroughs",
    title: "Allie Mae Burroughs",
    artist: "Walker Evans",
    date: "1936",
    location: "Hale County, Alabama",
    imageUrls: [
      "https://tile.loc.gov/storage-services/service/pnp/fsa/8c52000/8c52200/8c52248v.jpg",
      "https://tile.loc.gov/storage-services/service/pnp/fsa/8c52000/8c52200/8c52248r.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c5/Allie_Mae_Burroughs.jpg"
    ],
    sourceUrl: "https://www.loc.gov/item/2017762301/",
    credit: "Library of Congress · FSA/OWI · Public domain",
    lessonId: "framing"
  },
  {
    id: "american-gothic",
    title: "American Gothic",
    artist: "Gordon Parks",
    date: "1942",
    location: "Washington, D.C.",
    imageUrls: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/Gordon_Parks_-_American_Gothic_full.jpg/960px-Gordon_Parks_-_American_Gothic_full.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/fa/Gordon_Parks_-_American_Gothic_full.jpg"
    ],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Gordon_Parks_-_American_Gothic_full.jpg",
    credit: "Library of Congress · FSA/OWI · Public domain",
    lessonId: "symbols"
  },
  {
    id: "pie-town-general-store",
    title: "General Merchandise Store, Main Street, Pie Town",
    artist: "Russell Lee",
    date: "1940",
    location: "Pie Town, New Mexico",
    imageUrls: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a0/PieTownGeneralStore.jpg/960px-PieTownGeneralStore.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a0/PieTownGeneralStore.jpg"
    ],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:PieTownGeneralStore.jpg",
    credit: "Library of Congress · FSA/OWI · Public domain",
    lessonId: "color"
  },
  {
    id: "dust-storm",
    title: "Farmer and Sons Walking in a Dust Storm",
    artist: "Arthur Rothstein",
    date: "1936",
    location: "Cimarron County, Oklahoma",
    imageUrls: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1d/Farmer_walking_in_dust_storm_Cimarron_County_Oklahoma3.jpg/960px-Farmer_walking_in_dust_storm_Cimarron_County_Oklahoma3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1d/Farmer_walking_in_dust_storm_Cimarron_County_Oklahoma3.jpg"
    ],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Farmer_walking_in_dust_storm_Cimarron_County_Oklahoma3.jpg",
    credit: "Library of Congress · FSA/OWI · Public domain",
    lessonId: "atmosphere"
  },
  {
    id: "freight-train",
    title: "Freight Train Operations, Chicago & North Western",
    artist: "Jack Delano",
    date: "1943",
    location: "Chicago–Clinton, Iowa",
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/2/2d/Jack_Delano_-_Freight_train_operations_on_the_Chicago_and_Northwestern_Railroad_between_Chicago_and_Northwestern_Railroad_between_Chicago_and_Clinton%2C_Iowa.jpg"
    ],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Jack_Delano_-_Freight_train_operations_on_the_Chicago_and_Northwestern_Railroad_between_Chicago_and_Northwestern_Railroad_between_Chicago_and_Clinton,_Iowa.jpg",
    credit: "Library of Congress · FSA/OWI · Public domain",
    lessonId: "depth"
  }
];

export function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getDailyPhotograph(date = new Date()): DailyPhotograph {
  const key = localDateKey(date);
  const [y, m, d] = key.split("-").map(Number);
  const dayNumber = Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  const index = ((dayNumber % CURATED_PHOTOGRAPHS.length) + CURATED_PHOTOGRAPHS.length) % CURATED_PHOTOGRAPHS.length;
  return { artwork: CURATED_PHOTOGRAPHS[index], index, dateKey: key };
}
