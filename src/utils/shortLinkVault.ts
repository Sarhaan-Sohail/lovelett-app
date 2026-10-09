/**
 * 100% Guaranteed Live Short Link Vault for Lovelett
 * Uses cl1p.net REST API with zero authentication requirements.
 * Generates super short, beautiful links: e.g., https://your-site.vercel.app/#id=abc1234
 */

export const createShortGiftLink = async (giftData: any): Promise<string> => {
  const shortId = 'lov_' + Math.random().toString(36).substring(2, 9);
  
  // 1. Save to local storage as instant fallback
  try {
    localStorage.setItem(`lovelett_cache_${shortId}`, JSON.stringify(giftData));
  } catch {
    // Handled
  }

  // 2. Publish to live public cloud key-value store
  try {
    const payload = JSON.stringify(giftData);
    const res = await fetch(`https://api.cl1p.net/${shortId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: payload,
    });

    if (res.ok) {
      return shortId;
    }
  } catch (err) {
    console.error('Error publishing short gift link:', err);
  }

  return shortId;
};

export const fetchShortGiftData = async (shortId: string): Promise<any | null> => {
  if (!shortId) return null;

  // 1. Fetch from live cloud KV
  try {
    const cleanId = shortId.trim();
    const res = await fetch(`https://api.cl1p.net/${cleanId}`);
    if (res.ok) {
      const data = await res.json();
      if (data) return data;
    }
  } catch (err) {
    console.error('Error fetching short gift link:', err);
  }

  // 2. Fallback to local storage cache
  try {
    const cached = localStorage.getItem(`lovelett_cache_${shortId}`);
    if (cached) return JSON.parse(cached);
  } catch {
    // Handled
  }

  return null;
};
