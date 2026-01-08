// /api/redirect/[shortCode].ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Rota pública para redirecionar usuários ao link original.
 * Busca o código em todos os bins existentes (armazenados num índice global).
 */

const MASTER_KEY = process.env.JSONBIN_MASTER_KEY!;
const INDEX_BIN_ID = process.env.JSONBIN_INDEX_BIN_ID!; 
// 👆 bin que guarda um índice com { shortCode, binId } para saber onde buscar

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { shortCode } = req.query;
  if (!shortCode || typeof shortCode !== 'string') {
    return res.status(400).json({ error: 'Missing shortCode' });
  }

  try {
    // 1️⃣ Buscar no bin de índice qual bin contém esse shortCode
    const indexResponse = await fetch(`https://api.jsonbin.io/v3/b/${INDEX_BIN_ID}/latest`, {
      headers: { 'X-Master-Key': MASTER_KEY },
    });
    const indexData = await indexResponse.json();
    const entries = indexData.record.entries || [];

    const match = entries.find((e: any) => e.shortCode === shortCode);
    if (!match) {
      return res.status(404).json({ error: 'Link not found' });
    }

    const userBinId = match.binId;

    // 2️⃣ Buscar o link dentro do bin do dono
    const binResponse = await fetch(`https://api.jsonbin.io/v3/b/${userBinId}/latest`, {
      headers: { 'X-Master-Key': MASTER_KEY },
    });
    const binData = await binResponse.json();
    const link = binData.record.links.find((l: any) => l.shortCode === shortCode);

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // 3️⃣ Incrementar contador de cliques
    link.clicks += 1;
    await fetch(`https://api.jsonbin.io/v3/b/${userBinId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY,
      },
      body: JSON.stringify({ links: binData.record.links }),
    });

    // 4️⃣ Redirecionar o usuário final
    return res.redirect(302, link.originalUrl);
  } catch (err: any) {
    console.error('Redirect error:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
