// /api/create-bin.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Cria um novo bin no JSONBin.io e retorna o ID.
 * Usada apenas na primeira vez que o usuário acessa o app.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const MASTER_KEY = process.env.JSONBIN_MASTER_KEY!;
  if (!MASTER_KEY) {
    return res.status(500).json({ error: 'Missing JSONBIN_MASTER_KEY' });
  }

  try {
    const response = await fetch('https://api.jsonbin.io/v3/b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY,
      },
      body: JSON.stringify({ links: [] }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(502).json({ error: 'Failed to create bin', details: err });
    }

    const data = await response.json();
    const binId = data.metadata?.id;

    return res.status(201).json({ binId });
  } catch (err: any) {
    console.error('Error creating bin:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
