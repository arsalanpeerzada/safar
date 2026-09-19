const fs = require('fs');
const vibeMap = {
  'W-11 (Karachi)': 'w11',
  'GT Road Lari Adda (Punjab)': 'gt-road',
  'Karakoram Truck (KPK / North)': 'karakoram',
  'Makran Coastal Cruiser (Balochistan)': 'makran',
  'Sehwan Wagon (Interior Sindh)': 'sehwan'
};
const result = {
  'w11': [],
  'gt-road': [],
  'karakoram': [],
  'makran': [],
  'sehwan': []
};
const lines = fs.readFileSync('safar_tracklist_updated.csv', 'utf8').split('\n').slice(1);
lines.forEach(l => {
  const p = l.trim().split(',');
  if(p.length < 5) return;
  const v = p[0];
  const s = p[1];
  const u = p.pop();
  const t = p.slice(3).join(',').replace(/"/g, '').trim();
  if(vibeMap[v] && u) {
    result[vibeMap[v]].push({ id: u, title: t, station: s });
  }
});
fs.writeFileSync('src/data/safar_tracks.json', JSON.stringify(result, null, 2));
