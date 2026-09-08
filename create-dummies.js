const fs = require('fs');
const path = require('path');

// Base64 for a valid, 0-second silent MP3
const silentMp3Base64 = "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
const mp3Buffer = Buffer.from(silentMp3Base64, 'base64');

// Base64 for a valid, tiny 1x1 black MP4 (approx 150 bytes)
const blankMp4Base64 = "AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAsltZGF0AAACrQYF//+6hAAADGxlAAAAAARoZWFyAAAAQAAABgAAAABXAAAAAQAAAAAAAAAAAAAAACAAIQAAAAAABIAAAAD0AAAAAAABAAABAAAAQAAAABsXkYQAAAADbW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAABDcAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAhB0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAQAAAAAAAAMwAAAAAAMwAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAkFlZHRzAAAAHGVsc3QAAAAAAAAAAQAAADAAAAAAQAAAAAEAAAAAZW1kaWEAAAAgbWRoZAAAAAAAAAAAAAAAAAAAA+gAAAQ3VXcAAAAAACxoZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAQ1taW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAEHc3RibAAAAHdzdHNkAAAAAAAAAAEAAABndmFjMQAAAAAAAAABAAEAAAAAAAMwAAAAAAMwAAAAAAAAABJWaWRlb0hhbmRsZXIAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACDnBhc3AAAAABAAAAAgAAAAFhdmNDAWQAHv/hABhnZAAepv/j3gEABZgQAAADABAAAAMA8CjIwwABAAlyqXoA8AAAAABzdHRzAAAAAAAAAAEAAAABAAAAQAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAUc3RzejAAAAAAAAAAAAAAAQAAACEAAAAUc3RjbwAAAAAAAAABAAAAOgAAAAx1ZHRhAAAAHHRrcHQAAAAFAAAABG1wNGF4ZHR4AAAAAA==";
const mp4Buffer = Buffer.from(blankMp4Base64, 'base64');

const audioDir = path.join(__dirname, 'public', 'assets', 'audio');
const vibesDir = path.join(__dirname, 'public', 'assets', 'vibes');

fs.mkdirSync(audioDir, { recursive: true });
fs.mkdirSync(vibesDir, { recursive: true });

// Create MP3s
const mp3Files = ['wind.mp3', 'engine.mp3', 'crowd.mp3', 'vendor.mp3', 'pressure-horn.mp3', 'preset-1.mp3', 'preset-2.mp3', 'preset-3.mp3', 'preset-4.mp3'];
mp3Files.forEach(file => {
  const filepath = path.join(audioDir, file);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, mp3Buffer);
    console.log('Created dummy audio:', file);
  }
});

// Create MP4s
const mp4Files = ['w11-bg.mp4', 'gt-road-bg.mp4', 'karakoram-bg.mp4', 'makran-bg.mp4', 'sehwan-bg.mp4'];
mp4Files.forEach(file => {
  const filepath = path.join(vibesDir, file);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, mp4Buffer);
    console.log('Created dummy video:', file);
  }
});

console.log('Done generating dummy media assets!');
