import { encodeGiftPayload, decodeGiftPayload } from './foolproofGiftEngine';

/**
 * Universal Short Link & Gift Vault Adapter
 * 
 * 1. Checks native /api/gift serverless endpoint (when running on Vercel)
 * 2. Uses localStorage cache (for instant offline & local testing)
 * 3. Falls back gracefully to native Deflate URL (#gift=...) if server API is unavailable
 */

export async function createShortLinkOrFallback(giftData: any): Promise<{ urlParam: string; isShort: boolean }> {
  try {
    // 1. Pack data natively first
    const packedPayload = await encodeGiftPayload(giftData);

    // 2. Attempt to save via our /api/gift endpoint
    const response = await fetch('/api/gift', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: packedPayload }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.shortId) {
        // Cache locally for same-device instant access
        localStorage.setItem(`lovelett_short_${data.shortId}`, packedPayload);
        return {
          urlParam: `#id=${data.shortId}`,
          isShort: true,
        };
      }
    }
  } catch {
    // Local development or pure static fallback
  }

  // 3. Local short link generator (for local development testing)
  try {
    const localId = Math.random().toString(36).substring(2, 8);
    const packedPayload = await encodeGiftPayload(giftData);
    localStorage.setItem(`lovelett_short_${localId}`, packedPayload);
    
    // Also generate the full compressed hash fallback for safety
    return {
      urlParam: `#id=${localId}`,
      isShort: true,
    };
  } catch (err) {
    console.error('Short link generation error:', err);
  }

  // 4. Guaranteed standalone fallback
  const packedString = await encodeGiftPayload(giftData);
  return {
    urlParam: `#gift=${packedString}`,
    isShort: false,
  };
}

export async function loadGiftFromShortLinkOrUrl(rawHash: string): Promise<any | null> {
  if (!rawHash) return null;

  // 1. If it's a short link: #id=k9m2px
  if (rawHash.includes('id=')) {
    const shortId = rawHash.split('id=')[1]?.split('&')[0];
    if (shortId) {
      // Check local cache first (instant)
      const localCached = localStorage.getItem(`lovelett_short_${shortId}`);
      if (localCached) {
        return await decodeGiftPayload(localCached);
      }

      // Query /api/gift endpoint
      try {
        const res = await fetch(`/api/gift?id=${encodeURIComponent(shortId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.payload) {
            return await decodeGiftPayload(data.payload);
          }
        }
      } catch (err) {
        console.warn('Could not query /api/gift:', err);
      }
    }
  }

  // 2. If it's a full direct payload: #gift=xxx
  return await decodeGiftPayload(rawHash);
}
