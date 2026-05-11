require('dotenv').config();
const connectDB = require('../config/db');
const Manhwa = require('../models/Manhwa');

function toNumberOrNull(value) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseLegacyStringLink(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const text = value.trim();
  if (!text.startsWith('@{') || !text.endsWith('}')) {
    return null;
  }

  const body = text.slice(2, -1);
  const parts = body.split(';').map((part) => part.trim()).filter(Boolean);
  const link = {};

  for (const part of parts) {
    const separatorIndex = part.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = part.slice(0, separatorIndex).trim();
    const rawValue = part.slice(separatorIndex + 1).trim();
    link[key] = rawValue;
  }

  if (!link.idioma || !link.url) {
    return null;
  }

  const capAtual = toNumberOrNull(link.cap_atual);
  const capTotal = toNumberOrNull(link.cap_total ?? link.captora);

  return {
    idioma: String(link.idioma).trim(),
    url: String(link.url).trim(),
    cap_atual: capAtual && capAtual > 0 ? capAtual : 1,
    cap_total: capTotal && capTotal > 0 ? capTotal : 1,
  };
}

function normalizeLinkValue(link) {
  const parsed = typeof link === 'string' ? parseLegacyStringLink(link) : link;

  if (!parsed || typeof parsed !== 'object') {
    return null;
  }

  const idioma = typeof parsed.idioma === 'string' ? parsed.idioma.trim() : '';
  const url = typeof parsed.url === 'string' ? parsed.url.trim() : '';
  const capAtual = toNumberOrNull(parsed.cap_atual);
  const capTotal = toNumberOrNull(parsed.cap_total ?? parsed.captora);

  if (!idioma || !url) {
    return null;
  }

  const normalizedCapTotal = capTotal && capTotal > 0 ? capTotal : 1;
  const normalizedCapAtual = capAtual && capAtual > 0 ? Math.min(capAtual, normalizedCapTotal) : 1;

  return {
    idioma,
    url,
    cap_atual: normalizedCapAtual,
    cap_total: normalizedCapTotal,
  };
}

async function run() {
  await connectDB();

  const manhwas = await Manhwa.find();
  let updatedDocs = 0;
  let updatedLinks = 0;

  for (const manhwa of manhwas) {
    let docChanged = false;

    if (!Array.isArray(manhwa.links)) {
      continue;
    }

    const normalizedLinks = [];

    for (const link of manhwa.links) {
      const normalized = normalizeLinkValue(link);
      if (normalized) {
        normalizedLinks.push(normalized);
        if (JSON.stringify(normalized) !== JSON.stringify(link)) {
          docChanged = true;
          updatedLinks += 1;
        }
      } else {
        docChanged = true;
      }
    }

    if (normalizedLinks.length !== manhwa.links.length || JSON.stringify(normalizedLinks) !== JSON.stringify(manhwa.links)) {
      manhwa.links = normalizedLinks;
      docChanged = true;
    }

    if (docChanged) {
      await manhwa.save();
      updatedDocs += 1;
    }
  }

  console.log('Migracao finalizada.');
  console.log(`Manhwas atualizados: ${updatedDocs}`);
  console.log(`Links normalizados: ${updatedLinks}`);
  process.exit(0);
}

run().catch((error) => {
  console.error('Erro na migracao:', error);
  process.exit(1);
});