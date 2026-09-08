const fs = require('fs');

const vibeMapping = {
  'W-11 (Karachi)': 'w11',
  'GT Road Lari Adda (Punjab)': 'gt-road',
  'Karakoram Truck (KPK / North)': 'karakoram',
  'Makran Coastal Cruiser (Balochistan)': 'makran',
  'Sehwan Wagon (Interior Sindh)': 'sehwan'
};

const file = fs.readFileSync('safar_tracklist_updated.csv', 'utf8');
const lines = file.split(/\r?\n/).filter(l => l.trim().length > 0);

const tracklist = {};
Object.values(vibeMapping).forEach(v => tracklist[v] = []);

for (let i = 1; i < lines.length; i++) {
  const matches = lines[i].match(/(?:\"([^\"]*)\"|([^,]+))/g);
  if (!matches) continue;
  
  const values = matches.map(m => m.startsWith('\"') ? m.slice(1, -1) : m);
  
  const vibe = values[0];
  const station = values[1];
  const title = values[3];
  const url = values[4];
  
  const vibeKey = vibeMapping[vibe];
  if (vibeKey) {
    tracklist[vibeKey].push({
      id: url,
      title: title,
      station: station
    });
  }
}

if (!fs.existsSync('src/data')) fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/safar_tracks.json', JSON.stringify(tracklist, null, 2));
console.log('Saved to src/data/safar_tracks.json');
