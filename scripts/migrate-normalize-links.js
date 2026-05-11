require('dotenv').config();
const connectDB = require('../config/db');
const Manhwa = require('../models/Manhwa');

function toNumberOrNull(value) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function normalizeLink(link) {
  let changed = false;

  if (typeof link.idioma === 'string') {
    const idioma = link.idioma.trim();
    if (idioma !== link.idioma) {
      link.idioma = idioma;
      changed = true;
    }
  }

  if (typeof link.url === 'string') {
    const url = link.url.trim();
    if (url !== link.url) {
      link.url = url;
      changed = true;
    }
  }

  if (typeof link.captora !== 'undefined' && typeof link.cap_total === 'undefined') {
    link.cap_total = link.captora;
    changed = true;
  }

  const capTotal = toNumberOrNull(link.cap_total);
  const capAtual = toNumberOrNull(link.cap_atual);

  if (capTotal === null || capTotal < 1) {
    link.cap_total = capAtual && capAtual > 0 ? capAtual : 1;
    changed = true;
  } else if (capTotal !== link.cap_total) {
    link.cap_total = capTotal;
    changed = true;
  }

  if (capAtual === null || capAtual < 1) {
    link.cap_atual = 1;
    changed = true;
  } else if (capAtual !== link.cap_atual) {
    link.cap_atual = capAtual;
    changed = true;
  }

  if (link.cap_atual > link.cap_total) {
    link.cap_atual = link.cap_total;
    changed = true;
  }

  return changed;
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

    manhwa.links.forEach((link) => {
      const changed = normalizeLink(link);
      if (changed) {
        docChanged = true;
        updatedLinks += 1;
      }
    });

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