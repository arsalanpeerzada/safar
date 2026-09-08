const fs = require('fs');

function run() {
  const csv = fs.readFileSync('safar_tracklist_updated.csv', 'utf8');
  const lines = csv.split('\n').filter(l => l.trim().length > 0);
  
  // Filter only W-11 tracks
  const w11Songs = lines.slice(1).filter(l => l.startsWith('W-11'));
  
  const stations = {
    'TAPE A': [],
    'TAPE B': [],
    'FM 100': [],
    'FM 89': []
  };

  for (const line of w11Songs) {
    // Handling possible commas in song names by taking the last part as URL
    const parts = line.split(',');
    const station = parts[1];
    let url = parts[parts.length - 1].trim(); // The last column is the URL
    
    // Ensure URL is quoted properly
    if (url) {
      stations[station].push(`'${url}'`);
    }
  }

  let playerCode = fs.readFileSync('src/components/MusicPlayer.tsx', 'utf8');
  
  const newPlaylists = `const PLAYLISTS: Record<number, string[]> = {
  1: [\n    ${stations['TAPE A'].join(',\n    ')}\n  ], // TAPE A
  2: [\n    ${stations['TAPE B'].join(',\n    ')}\n  ], // TAPE B
  3: [\n    ${stations['FM 100'].join(',\n    ')}\n  ], // FM 100
  4: [\n    ${stations['FM 89'].join(',\n    ')}\n  ], // FM 89
};`;

  playerCode = playerCode.replace(/const PLAYLISTS: Record<number, string\[\]> = \{[\s\S]*?\};/, newPlaylists);
  
  fs.writeFileSync('src/components/MusicPlayer.tsx', playerCode);
  console.log('Successfully injected 40 songs from updated CSV into MusicPlayer.tsx!');
}

run();
