# Safar 🚌

Welcome to **Safar**! This is a viral-ready, nostalgia-driven ambient music website tailored to the diverse transport cultures of Pakistan. 

From the bustling W-11 minibuses in Karachi to the serene Makran Coastal Cruisers, the mighty Karakoram Trucks in the North, and the spiritual Sehwan wagons—Safar captures the true essence, unique flavors, and distinct vibes of every province.

## Features & Engineering Highlights
- **Immersive Vibes:** 5 distinct transport experiences across Pakistan with custom video/image backgrounds and curated regional music.
- **Smart Fallbacks:** If a YouTube track is blocked by copyright, the player seamlessly falls back to local radio presets so the journey never stops.
- **Vercel Edge Functions:** The live listener counter (`/api/counter`) uses Upstash Redis Ratelimiting to securely track active "safaris" and prevent DDoS attacks.
- **Geolocation:** An intelligent onboarding system uses the browser's Geolocation API to automatically drop users into the vibe that matches their real-world region.
- **Buttery Smooth Transitions:** Powered by Framer Motion, instantly swap between regions and tracks without reloading.

## Tech Stack
- Next.js (App Router)
- React & Framer Motion
- Tailwind CSS 
- Zustand (Global State Management)
- YouTube IFrame API
- Upstash Redis

## Running Locally

First, ensure you have your dependencies installed:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```

Open https://safar-nu-wine.vercel.app/ in your browser to start your journey.
