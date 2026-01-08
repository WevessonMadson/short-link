// /api/links.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const binId = req.headers['x-bin-id'] as string;
  const userId = req.headers['x-user-id'] as string;

  if (!binId || !userId) {
    return res.status(400).json({ error: 'Missing user or bin ID' });
  }

  const BASE_URL = `https://api.jsonbin.io/v3/b/${binId}`;
  const MASTER_KEY = process.env.JSONBIN_MASTER_KEY!;
  const INDEX_BIN_ID = process.env.JSONBIN_INDEX_BIN_ID!; // 👈 novo bin global

  try {
    // Busca os links existentes do usuário
    const r = await fetch(`${BASE_URL}/latest`, { headers: { 'X-Master-Key': MASTER_KEY } });
    const data = await r.json();
    const allLinks = data.record.links || [];

    // 🟢 GET - lista os links do usuário
    if (req.method === 'GET') {
      const userLinks = allLinks.filter((l: any) => l.ownerId === userId);
      return res.status(200).json({ links: userLinks });
    }

    // 🟢 POST - cria um novo link
    if (req.method === 'POST') {
      const newLink = {
        id: crypto.randomUUID(),
        ownerId: userId,
        originalUrl: req.body.originalUrl,
        shortCode: req.body.shortCode || Math.random().toString(36).substring(2, 8),
        createdAt: new Date().toISOString(),
        clicks: 0,
      };

      const updatedLinks = [...allLinks, newLink];

      // Salva o novo link no bin do usuário
      await fetch(BASE_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': MASTER_KEY,
        },
        body: JSON.stringify({ links: updatedLinks }),
      });

      // 🔹 ADIÇÃO: registra o shortCode no índice global
      try {
        const indexRes = await fetch(`https://api.jsonbin.io/v3/b/${INDEX_BIN_ID}/latest`, {
          headers: { 'X-Master-Key': MASTER_KEY },
        });

        const indexData = await indexRes.json();
        const entries = indexData.record.entries || [];

        // Evita duplicar o mesmo shortCode
        if (!entries.some((e: any) => e.shortCode === newLink.shortCode)) {
          entries.push({ shortCode: newLink.shortCode, binId });
          await fetch(`https://api.jsonbin.io/v3/b/${INDEX_BIN_ID}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Master-Key': MASTER_KEY,
            },
            body: JSON.stringify({ entries }),
          });
        }
      } catch (indexErr) {
        console.error('Failed to update global index:', indexErr);
      }

      return res.status(201).json({ link: newLink });
    }

    // Métodos não permitidos
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
