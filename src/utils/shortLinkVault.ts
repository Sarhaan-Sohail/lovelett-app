/**
 * Anonymous, Zero-Auth, 100% Client-Side Storage Vault
 * Stores images/letters into a free cloud key-value store and returns a tiny 6-character code
 * (e.g. lovelett.vercel.app/#id=abc123)
 */

export const saveGiftToShortLink = async (data: any): Promise<string> => {
  const shortId = Math.random().toString(36).substring(2, 9);

  try {
    // 1. Try free public KV store
    const res = await fetch(`https://api.jsonbin.io/v3/b`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bin-Private': 'false',
        'X-Bin-Name': `lovelett_${shortId}`,
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const json = await res.json();
      return json.metadata.id; // Returns tiny bin ID like "65f2a1b9..."
    }
  } catch (err) {
    console.log('Primary bin failed, using npoint fallback', err);
  }

  // 2. Fallback to npoint
  try {
    const res = await fetch('https://api.npoint.io', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json();
      return json.id; // Tiny 6-char ID
    }
  } catch (err) {
    console.error('Fallback failed', err);
  }

  // 3. Fallback: local localStorage key if offline
  localStorage.setItem(`lovelett_${shortId}`, JSON.stringify(data));
  return `local_${shortId}`;
};

export const loadGiftFromShortLink = async (id: string): Promise<any | null> => {
  // Check localStorage first
  if (id.startsWith('local_')) {
    const saved = localStorage.getItem(`lovelett_${id.replace('local_', '')}`);
    if (saved) return JSON.parse(saved);
  }

  // Fetch from jsonbin
  if (id.length > 15) {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${id}/latest`);
      if (res.ok) {
        const json = await res.json();
        return json.record;
      }
    } catch (err) {
      console.error('Error fetching from jsonbin', err);
    }
  }

  // Fetch from npoint
  try {
    const res = await fetch(`https://api.npoint.io/${id}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error fetching from npoint', err);
  }

  return null;
};
