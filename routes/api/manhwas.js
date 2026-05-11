const express = require('express');
const multer = require('multer');
const Manhwa = require('../../models/Manhwa');
const { storage } = require('../../config/cloudinary');
const slugify = require('../../utils/slugify');

const router = express.Router();
const upload = multer({ storage });

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

router.get('/', async (req, res, next) => {
  try {
    const manhwas = await Manhwa.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: manhwas });
  } catch (error) {
    return next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const manhwa = await Manhwa.findOne({ slug: req.params.slug });

    if (!manhwa) {
      return res.status(404).json({ success: false, message: 'Manhwa não encontrado' });
    }

    return res.json({ success: true, data: manhwa });
  } catch (error) {
    return next(error);
  }
});

router.post('/', upload.single('capa'), async (req, res, next) => {
  try {
    const titulos = normalizeTitles(req.body.titulos);
    const tags = normalizeList(req.body.tags);
    const capitulos = parseNumber(req.body.capitulos);

    if (!titulos.length) {
      return res.status(400).json({ success: false, message: 'Informe pelo menos um título' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Imagem de capa é obrigatória' });
    }

    if (capitulos === null) {
      return res.status(400).json({ success: false, message: 'Capítulos inválidos' });
    }

    const slug = slugify(titulos[0]);
    const existing = await Manhwa.findOne({ slug });

    if (existing) {
      return res.status(409).json({ success: false, message: 'Já existe um manhwa com esse slug' });
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
});

router.put('/:slug', upload.single('capa'), async (req, res, next) => {
  try {
    const titulos = normalizeTitles(req.body.titulos);
    const tags = normalizeList(req.body.tags);
    const capitulos = parseNumber(req.body.capitulos);

    const update = {
      titulos: titulos.length ? titulos : undefined,
      status: req.body.status,
      capitulos: capitulos === null ? undefined : capitulos,
      tags,
    };

    if (req.file) {
      update.capa = req.file.path;
    }

    const manhwa = await Manhwa.findOneAndUpdate({ slug: req.params.slug }, update, {
      new: true,
      runValidators: true,
    });

    if (!manhwa) {
      return res.status(404).json({ success: false, message: 'Manhwa não encontrado' });
    }

    return res.json({ success: true, data: manhwa });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:slug', async (req, res, next) => {
  try {
    const manhwa = await Manhwa.findOneAndDelete({ slug: req.params.slug });

    if (!manhwa) {
      return res.status(404).json({ success: false, message: 'Manhwa não encontrado' });
    }

    return res.json({ success: true, message: 'Manhwa removido com sucesso' });
  } catch (error) {
    return next(error);
  }
});

router.post('/:slug/links', async (req, res, next) => {
  try {
    const { idioma, url, cap_atual, cap_total } = req.body;
    const manhwa = await Manhwa.findOne({ slug: req.params.slug });

    if (!manhwa) {
      return res.status(404).json({ success: false, message: 'Manhwa não encontrado' });
    }

    manhwa.links.push({
      idioma,
      url,
      cap_atual: parseNumber(cap_atual) ?? 1,
      cap_total: parseNumber(cap_total) ?? 1,
    });

    await manhwa.save();

    return res.status(201).json({ success: true, data: manhwa });
  } catch (error) {
    return next(error);
  }
});

router.put('/:slug/links/:linkId', async (req, res, next) => {
  try {
    const { idioma, url, cap_total } = req.body;
    const manhwa = await Manhwa.findOne({ slug: req.params.slug });

    if (!manhwa) {
      return res.status(404).json({ success: false, message: 'Manhwa não encontrado' });
    }

    const link = manhwa.links.id(req.params.linkId);

    if (!link) {
      return res.status(404).json({ success: false, message: 'Link não encontrado' });
    }

    if (typeof idioma !== 'undefined') {
      link.idioma = idioma;
    }

    if (typeof url !== 'undefined') {
      link.url = url;
    }

    const parsedCapTotal = parseNumber(cap_total);
    if (parsedCapTotal !== null) {
      link.cap_total = parsedCapTotal;
    }

    await manhwa.save();

    return res.json({ success: true, data: manhwa });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:slug/links/:linkId', async (req, res, next) => {
  try {
    const manhwa = await Manhwa.findOne({ slug: req.params.slug });

    if (!manhwa) {
      return res.status(404).json({ success: false, message: 'Manhwa não encontrado' });
    }

    const link = manhwa.links.id(req.params.linkId);

    if (!link) {
      return res.status(404).json({ success: false, message: 'Link não encontrado' });
    }

    link.deleteOne();
    await manhwa.save();

    return res.json({ success: true, message: 'Link removido com sucesso' });
  } catch (error) {
    return next(error);
  }
});

router.put('/:slug/links/:linkId/chapter', async (req, res, next) => {
  try {
    const { cap_atual } = req.body;
    const manhwa = await Manhwa.findOne({ slug: req.params.slug });

    if (!manhwa) {
      return res.status(404).json({ success: false, message: 'Manhwa não encontrado' });
    }

    const link = manhwa.links.id(req.params.linkId);

    if (!link) {
      return res.status(404).json({ success: false, message: 'Link não encontrado' });
    }

    const parsedCapAtual = parseNumber(cap_atual);
    if (parsedCapAtual === null) {
      return res.status(400).json({ success: false, message: 'Capítulo inválido' });
    }

    link.cap_atual = parsedCapAtual;
    await manhwa.save();

    return res.json({ success: true, data: manhwa });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;