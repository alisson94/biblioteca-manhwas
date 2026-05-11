const Manhwa = require('../../models/Manhwa');
const slugify = require('../../utils/slugify');

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeTitles(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function parseNumber(value) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

async function listManhwas(req, res, next) {
  try {
    const manhwas = await Manhwa.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: manhwas });
  } catch (error) {
    return next(error);
  }
}

async function getManhwaBySlug(req, res, next) {
  try {
    const manhwa = await Manhwa.findOne({ slug: req.params.slug });

    if (!manhwa) {
      return res.status(404).json({ success: false, message: 'Manhwa nao encontrado' });
    }

    return res.json({ success: true, data: manhwa });
  } catch (error) {
    return next(error);
  }
}

async function createManhwa(req, res, next) {
  try {
    const titulos = normalizeTitles(req.body.titulos);
    const tags = normalizeList(req.body.tags);
    const capitulos = parseNumber(req.body.capitulos);

    if (!titulos.length) {
      return res.status(400).json({ success: false, message: 'Informe pelo menos um titulo' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Imagem de capa e obrigatoria' });
    }

    if (capitulos === null || capitulos < 1) {
      return res.status(400).json({ success: false, message: 'Capitulos invalidos' });
    }

    const slug = slugify(titulos[0]);
    const existing = await Manhwa.findOne({ slug });

    if (existing) {
      return res.status(409).json({ success: false, message: 'Ja existe um manhwa com esse slug' });
    }

    const manhwa = await Manhwa.create({
      titulos,
      slug,
      capa: req.file.path,
      status: req.body.status || '',
      capitulos,
      tags,
      links: [],
    });

    return res.status(201).json({ success: true, data: manhwa });
  } catch (error) {
    return next(error);
  }
}

async function updateManhwa(req, res, next) {
  try {
    const titulos = normalizeTitles(req.body.titulos);
    const tags = normalizeList(req.body.tags);
    const capitulos = parseNumber(req.body.capitulos);

    const update = {
      titulos: titulos.length ? titulos : undefined,
      status: req.body.status,
      capitulos: capitulos === null ? undefined : capitulos,
      tags: tags.length ? tags : undefined,
    };

    if (req.file) {
      update.capa = req.file.path;
    }

    const manhwa = await Manhwa.findOneAndUpdate({ slug: req.params.slug }, update, {
      new: true,
      runValidators: true,
    });

    if (!manhwa) {
      return res.status(404).json({ success: false, message: 'Manhwa nao encontrado' });
    }

    return res.json({ success: true, data: manhwa });
  } catch (error) {
    return next(error);
  }
}

async function deleteManhwa(req, res, next) {
  try {
    const manhwa = await Manhwa.findOneAndDelete({ slug: req.params.slug });

    if (!manhwa) {
      return res.status(404).json({ success: false, message: 'Manhwa nao encontrado' });
    }

    return res.json({ success: true, message: 'Manhwa removido com sucesso' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listManhwas,
  getManhwaBySlug,
  createManhwa,
  updateManhwa,
  deleteManhwa,
  parseNumber,
};