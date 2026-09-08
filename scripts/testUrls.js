const d = require('../src/data/safar_tracks.json');
const extractVideoId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
  return match ? match[1] : null;
};
console.log('Karakoram:');
d['karakoram'].slice(0, 5).forEach(t => console.log(extractVideoId(t.id), t.id));
console.log('Makran:');
d['makran'].slice(0, 5).forEach(t => console.log(extractVideoId(t.id), t.id));
console.log('Sehwan:');
d['sehwan'].slice(0, 5).forEach(t => console.log(extractVideoId(t.id), t.id));
