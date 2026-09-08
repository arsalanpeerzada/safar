const https = require('https');
const d = require('../src/data/safar_tracks.json');
const extractVideoId = (url) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
  return match ? match[1] : null;
};

const checkVideo = (id) => {
  return new Promise(resolve => {
    https.get('https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=' + id, (res) => {
      resolve(res.statusCode);
    }).on('error', () => resolve(0));
  });
};

(async () => {
  for (let i = 0; i < 5; i++) {
    const id = extractVideoId(d['makran'][i].id);
    const status = await checkVideo(id);
    console.log('Makran ' + i + ' (' + id + '): ' + status);
  }
})();
