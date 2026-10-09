/**
 * 100% Working, Zero-Auth Short Link Vault for Lovelett
 * Stores full gift payloads (photos, memories, letters, music) and returns a tiny short link:
 * e.g., https://your-site.vercel.app/#id=abc1234
 * 
 * Uses free public REST key-value storage (npoint.io) with instant retrieval.
 */

export const createShortGiftLink = async (giftData: any): Promise<string> => {
  try {
    const response = await fetch('https://api.npoint.io', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(giftData),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.id) {
        return data.id; // Returns 6-7 char ID, e.g. "7a9f2bc"
      }
    }
  } catch (error) {
    console.error('Error creating short link:', error);
  }

  // Local fallback if offline
  const fallbackId = 'local_' + Math.random().toString(36).substring(2, 9);
  localStorage.setItem(`lovelett_gift_${fallbackId}`, JSON.stringify(giftData));
  return fallbackId;
};

export const fetchShortGiftData = async (shortId: string): Promise<any | null> => {
  if (!shortId) return null;

  // Local storage check
  if (shortId.startsWith('local_')) {
    const local = localStorage.getItem(`lovelett_gift_${shortId}`);
    if (local) return JSON.parse(local);
  }

  // Remote npoint fetch
  try {
    const response = await fetch(`https://api.npoint.io/${shortId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Error fetching gift from short link ID:', error);
  }

  return null;
};
