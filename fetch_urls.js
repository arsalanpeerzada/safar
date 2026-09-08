const fs = require('fs');

async function run() {
  const csv = fs.readFileSync('safar_tracklist.csv', 'utf8');
  const lines = csv.split('\n').filter(l => l.trim().length > 0);
  
  // Filter only W-11 tracks
  const w11Songs = lines.slice(1).filter(l => l.startsWith('W-11'));
  
  const stations = {
    'TAPE A': [],
    'TAPE B': [],
    'FM 100': [],
    'FM 89': []
  };

  console.log('Fetching YouTube IDs for 40 W-11 Songs... This might take a few seconds.');

  for (const line of w11Songs) {
    const parts = line.split(',');
    const station = parts[1];
    const songName = parts.slice(3).join(','); 
    
    try {
      // Append "audio" to get better music results and avoid weird remixes
      const res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(songName + " audio")}`);
      const text = await res.text();
      // YouTube's initialData contains the videoId in a predictable JSON format
      const match = text.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
      if (match && match[1]) {
        stations[station].push(`'https://www.youtube.com/watch?v=${match[1]}'`);
        console.log(`Found: ${songName} -> ${match[1]}`);
      } else {
        console.log(`No match for: ${songName}`);
      }
    } catch (e) {
      console.log(`Failed fetching: ${songName}`);
    }
    // Tiny delay to prevent getting flagged by YouTube
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('All IDs fetched! Injecting into MusicPlayer.tsx...');

  let playerCode = fs.readFileSync('src/components/MusicPlayer.tsx', 'utf8');
  
  const newPlaylists = `const PLAYLISTS: Record<number, string[]> = {
  1: [\n    ${stations['TAPE A'].join(',\n    ')}\n  ], // TAPE A
  2: [\n    ${stations['TAPE B'].join(',\n    ')}\n  ], // TAPE B
  3: [\n    ${stations['FM 100'].join(',\n    ')}\n  ], // FM 100
  4: [\n    ${stations['FM 89'].join(',\n    ')}\n  ], // FM 89
};`;

  playerCode = playerCode.replace(/const PLAYLISTS: Record<number, string\[\]> = \{[\s\S]*?\};/, newPlaylists);
  
  fs.writeFileSync('src/components/MusicPlayer.tsx', playerCode);
  console.log('Successfully injected 40 songs into MusicPlayer.tsx!');
}

run();
