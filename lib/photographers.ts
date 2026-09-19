export type PhotographerProfile = {
  name: string;
  zhBio: string; enBio: string;
  zhStyle: string; enStyle: string;
  works: string[];
};

export const PHOTOGRAPHERS: Record<string, PhotographerProfile> = {
  "Dorothea Lange": {
    name:"Dorothea Lange",
    zhBio:"美國紀實攝影師，以大蕭條時期的人道紀實影像聞名。她長期關注遷徙、勞動、貧困與家庭，讓社會議題透過具體的人與表情被看見。",
    enBio:"American documentary photographer known for humane images of the Great Depression, migration, labor, poverty, and family life.",
    zhStyle:"靠近人物但不過度戲劇化；利用手勢、表情、環境線索與簡潔構圖，把個人處境連結到更大的社會故事。",
    enStyle:"Close, restrained observation; expressive gesture, environmental clues, and economical framing connect individual lives to larger social stories.",
    works:["White Angel Breadline (1932)","Migrant Mother (1936)","Toward Los Angeles, California (1937)"]
  },
  "Walker Evans": {
    name:"Walker Evans",
    zhBio:"美國攝影師，以冷靜、正面、精確的紀錄方式影響後世紀實與街頭攝影。他特別關注美國日常建築、招牌、室內與普通人的生活。",
    enBio:"American photographer whose cool, frontal precision shaped documentary and street photography. He focused on vernacular America, architecture, signs, interiors, and ordinary life.",
    zhStyle:"正面視角、克制情緒、清楚細節與結構感；讓被攝物自己累積意義，而不是依靠戲劇化效果。",
    enStyle:"Frontal viewpoints, emotional restraint, precise detail, and strong structure let subjects accumulate meaning without theatrical effects.",
    works:["Allie Mae Burroughs (1936)","Bud Fields and His Family at Home (1935–36)","Bethlehem Graveyard and Steel Mill (1935)"]
  },
  "Gordon Parks": {
    name:"Gordon Parks",
    zhBio:"美國攝影師、作家與電影導演，以攝影探討種族、階級與社會正義，同時也是重要的時尚與雜誌攝影師。",
    enBio:"American photographer, writer, and filmmaker who used photography to examine race, class, and social justice while also working in fashion and magazines.",
    zhStyle:"善用象徵、人物與環境的關係、強烈明暗與敘事序列，讓單張影像同時具有直接性與社會脈絡。",
    enStyle:"Symbolism, environmental portraiture, strong tonal structure, and narrative sequencing give individual images both immediacy and social context.",
    works:["American Gothic, Washington, D.C. (1942)","Ella Watson series (1942)","Harlem Gang Leader (1948)"]
  },
  "Russell Lee": {
    name:"Russell Lee",
    zhBio:"美國 FSA 紀實攝影師，以大量而細緻的系列影像記錄社區、工作、住房與日常生活，也留下重要的早期彩色紀錄。",
    enBio:"American FSA documentary photographer known for extensive visual surveys of communities, work, housing, and everyday life, including important early color work.",
    zhStyle:"資訊豐富的環境構圖、自然互動與系列式觀察；常讓色彩、標誌與空間本身成為社會生活的線索。",
    enStyle:"Information-rich environmental framing, natural interaction, and serial observation; color, signs, and space often become clues to social life.",
    works:["Pie Town, New Mexico series (1940)","School children, San Augustine County (1939)","Chicago railroad photographs (1940s)"]
  },
  "Arthur Rothstein": {
    name:"Arthur Rothstein",
    zhBio:"美國紀實攝影師，也是 FSA 最早期的攝影成員之一。他以農村、環境災害與美國社會生活的影像聞名。",
    enBio:"American documentary photographer and one of the FSA's earliest photographers, known for images of rural life, environmental disaster, and American society.",
    zhStyle:"利用天候、尺度、人物排列與清楚輪廓建立敘事；環境不只是背景，而是決定照片情緒與意義的主體。",
    enStyle:"Weather, scale, figure placement, and clear silhouettes drive the story; environment becomes a subject rather than a backdrop.",
    works:["Farmer and Sons Walking in a Dust Storm (1936)","Gee's Bend, Alabama photographs (1937)","Dust Bowl series (1930s)"]
  },
  "Jack Delano": {
    name:"Jack Delano",
    zhBio:"FSA/OWI 攝影師與作曲家，以鐵路工人、工業、農村與波多黎各生活的紀錄著稱，並留下大量彩色作品。",
    enBio:"FSA/OWI photographer and composer known for documenting railroad workers, industry, rural communities, and Puerto Rican life, including extensive color work.",
    zhStyle:"擅長利用透視、引導線、重複結構與人工光線，把複雜工作環境整理成具有深度與節奏的畫面。",
    enStyle:"Perspective, leading lines, repeated structures, and available light organize complex working environments into images with depth and rhythm.",
    works:["Chicago & North Western Railroad series (1942–43)","At the roundhouse, Proviso yard (1942)","Puerto Rico series (1940s)"]
  },
  "Marion Post Wolcott": {
    name:"Marion Post Wolcott",
    zhBio:"美國 FSA 攝影師，以敏銳的社會觀察記錄美國南方、農村社區、種族隔離與日常生活。",
    enBio:"American FSA photographer whose socially observant work documented the American South, rural communities, segregation, and everyday life.",
    zhStyle:"善於把人物放入完整環境中，利用光線、天氣、空間層次與生活細節建立具有情境感的敘事。",
    enStyle:"Environmental context, light, weather, spatial layers, and everyday details create socially grounded visual narratives.",
    works:["Jitterbugging in a Juke Joint (1939)","Woodstock, Vermont series (1939)","Florida and Mississippi photographs (1930s–40s)"]
  }
};

export function getPhotographer(name:string){ return PHOTOGRAPHERS[name] ?? null; }
