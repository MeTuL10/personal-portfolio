const artworks = [
  { title: "Zhongli I",            url: "https://www.deviantart.com/metalex10/art/Zhongli-genshin-impact-963795112" },
  { title: "Childe",               url: "https://www.deviantart.com/metalex10/art/Childe-genshin-impact-963799355" },
  { title: "Tanjirou",             url: "https://www.deviantart.com/metalex10/art/Tanjirou-demon-slayer-965400438" },
  { title: "Fire Dragons",         url: "https://www.deviantart.com/metalex10/art/Fairy-tail-fire-dragons-963793798" },
  { title: "Fairy Tail Crest",     url: "https://www.deviantart.com/metalex10/art/fairy-tail-963795456" },
  { title: "Hinata & Kageyama",    url: "https://www.deviantart.com/metalex10/art/haikyuu-hinata-and-kageyama-963794575" },
  { title: "Gojo",                 url: "https://www.deviantart.com/metalex10/art/Gojo-963794936" },
  { title: "Across the Spiderverse", url: "https://www.deviantart.com/metalex10/art/Across-the-spiderverse-965581737" },
  { title: "Johan & Tenma",        url: "https://www.deviantart.com/metalex10/art/johan-and-tenma-963805141" },
  { title: "The Spot",             url: "https://www.deviantart.com/metalex10/art/Spiderverse-spot-971562722" },
  { title: "Zhongli II",           url: "https://www.deviantart.com/metalex10/art/Zhongli-genshin-impact-964710078" },
  { title: "Meliodas",             url: "https://www.deviantart.com/metalex10/art/meliodas-nanatsu-no-taizai-963803335" },
];

for (const art of artworks) {
  const res = await fetch(`https://backend.deviantart.com/oembed?url=${art.url}`);
  const data = await res.json();
  console.log(`${art.title}:\n  ${data.thumbnail_url}\n`);
}
