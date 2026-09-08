# Safar Multi-Vibe Music Site

Welcome to Safar! This is a viral-ready, nostalgia-driven music website tailored to the diverse transport cultures of Pakistan.

## Engineering Highlights
- **Vercel Edge Functions:** The `/api/counter` uses Upstash Redis Ratelimiting to prevent DDoS.
- **CDN Fallback:** If YouTube hits a rate limit, the audio falls back to local CDN mp3s (see `MusicPlayer.tsx`).
- **Geolocation:** Onboarding uses Geolocation API to drop users in the right vibe.

## Next Steps for You (Asset Population)
To bring the app fully to life, you need to populate the assets directory:
1. Place 5 looping video backgrounds in `public/assets/vibes/` named:
   - `w11-bg.mp4`
   - `gt-road-bg.mp4`
   - `karakoram-bg.mp4`
   - `makran-bg.mp4`
   - `sehwan-bg.mp4`
2. Place ambient audio files in `public/assets/audio/`:
   - `wind.mp3`, `engine.mp3`, `crowd.mp3`, `vendor.mp3`, `pressure-horn.mp3`
3. Place fallback audio files in `public/fallback-audio/`:
   - `preset-1.mp3`, `preset-2.mp3`, `preset-3.mp3`, `preset-4.mp3`

## Running Locally
```bash
npm run dev
```
