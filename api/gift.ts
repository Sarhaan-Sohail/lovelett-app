import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory global store for active serverless instance
// (or seamlessly connected with Vercel KV / Upstash Redis / Supabase if env vars are present)
const memoryVault = new Map<string, { payload: string; createdAt: number }>();

// Upstash / Vercel KV REST integration (zero configuration required if connected via Vercel dashboard)
const UPSTASH_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function setKey(key: string, value: string) {
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      await fetch(`${UPSTASH_URL}/set/${key}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
        body: value,
      });
      return;
    } catch (e) {
      console.error('KV write error:', e);
    }
  }
  memoryVault.set(key, { payload: value, createdAt: Date.now() });
}

async function getKey(key: string): Promise<string | null> {
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const res = await fetch(`${UPSTASH_URL}/get/${key}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      if (res.ok) {
        const json = await res.json();
        return json.result || null;
      }
    } catch (e) {
      console.error('KV read error:', e);
    }
  }
  const item = memoryVault.get(key);
  return item ? item.payload : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 1. POST: Save gift & return short 6-char ID
    if (req.method === 'POST') {
      const { payload } = req.body || {};
      if (!payload) {
        return res.status(400).json({ error: 'Missing payload' });
      }

      // Generate a clean 6-character short code (e.g., 'k9m2px')
      const shortId = Math.random().toString(36).substring(2, 8);
      await setKey(`gift_${shortId}`, typeof payload === 'string' ? payload : JSON.stringify(payload));

      return res.status(200).json({
        success: true,
        shortId,
        urlParam: `#id=${shortId}`,
      });
    }

    // 2. GET: Retrieve gift by short ID
    if (req.method === 'GET') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Missing ID parameter' });
      }

      const cleanId = id.trim();
      const payload = await getKey(`gift_${cleanId}`);

      if (!payload) {
        return res.status(404).json({ error: 'Gift not found or expired' });
      }

      return res.status(200).json({
        success: true,
        payload,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API Handler Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
