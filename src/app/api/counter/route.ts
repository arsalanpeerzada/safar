import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Redis client
// Note: Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://dummy-url.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'dummy-token',
});

// Create a new ratelimiter, that allows 5 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '10 s'),
});

export async function GET(request: Request) {
  // Extract IP for rate limiting
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  
  try {
    let success = true;
    let limit = 5;
    let reset = 0;
    let remaining = 5;

    // Only attempt rate limiting if real credentials exist, otherwise bypass to prevent 5s timeouts
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const rlResult = await ratelimit.limit(`counter_rl_${ip}`);
      success = rlResult.success;
      limit = rlResult.limit;
      reset = rlResult.reset;
      remaining = rlResult.remaining;
    }

    if (!success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      });
    }

    // In a real app, we would use a Redis set/HyperLogLog for unique active viewers 
    // or increment a counter. For the sake of the viral MVP, we mock a large number 
    // that slowly increments.
    const baseListeners = 14320;
    const activeListeners = baseListeners + Math.floor(Math.random() * 100);

    return NextResponse.json({
      listeners: activeListeners,
      status: 'success'
    });
  } catch (error) {
    console.error('Redis error:', error);
    // Fallback if Redis fails
    return NextResponse.json({
      listeners: 14320,
      status: 'fallback'
    });
  }
}
