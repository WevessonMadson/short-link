// /api/links/[id].ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const binId = req.headers['x-bin-id'] as string;
  const userId = req.headers['x-user-id'] as string;

  if (!binId || !userId) {
    return res.status(400).json({ error: 'Missing user or bin ID' });
  }

  const BASE_URL = `https://api.jsonbin.io/v3/b/${binId}`;
  const MASTER_KEY = process.env.JSONBIN_MASTER_KEY!;

  try {
    const r = await fetch(`${BASE_URL}/latest`, { headers: { 'X-Master-Key': MASTER_KEY } });
    const data = await r.json();
    const links = data.record.links || [];
    const index = links.findIndex((l: any) => l.id === id);

    if (index === -1) return res.status(404).json({ error: 'Link not found' });
    if (links[index].ownerId !== userId)
      return res.status(403).json({ error: 'Not authorized' });

    if (req.method === 'PUT') {
      links[index].originalUrl = req.body.originalUrl;
    } else if (req.method === 'DELETE') {
      links.splice(index, 1);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    await fetch(BASE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': MASTER_KEY },
      body: JSON.stringify({ links }),
    });

    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
