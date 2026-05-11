const Manhwa = require('../../models/Manhwa');
const { parseNumber } = require('./manhwasController');

async function addLink(req, res, next) {
  try {
    const { idioma, url, cap_atual, cap_total } = req.body;
    const manhwa = await Manhwa.findOne({ slug: req.params.slug });

    if (!manhwa) {
      return res.status(404).json({ success: false, message: 'Manhwa nao encontrado' });
    }

    if (!idioma || !url) {
      return res.status(400).json({ success: false, message: 'Idioma e URL sao obrigatorios' });
    }

    manhwa.links.push({
      idioma: String(idioma).trim(),
      url: String(url).trim(),
      cap_atual: parseNumber(cap_atual) ?? 1,
      cap_total: parseNumber(cap_total) ?? 1,
    });

    await manhwa.save();

    return res.status(201).json({ success: true, data: manhwa });
  } catch (error) {
    return next(error);
  }
}

async function updateLink(req, res, next) {
  try {
    const { idioma, url, cap_total } = req.body;
    const manhwa = await Manhwa.findOne({ slug: req.params.slug });

    if (!manhwa) {
      return res.status(404).json({ success: false, message: 'Manhwa nao encontrado' });
    }

    const link = manhwa.links.id(req.params.linkId);

    if (!link) {
      return res.status(404).json({ success: false, message: 'Link nao encontrado' });
    }

    if (typeof idioma !== 'undefined') {
      link.idioma = String(idioma).trim();
    }

    if (typeof url !== 'undefined') {
      link.url = String(url).trim();
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
}

async function deleteLink(req, res, next) {
  try {
    const manhwa = await Manhwa.findOne({ slug: req.params.slug });

    if (!manhwa) {
      return res.status(404).json({ success: false, message: 'Manhwa nao encontrado' });
    }

    const link = manhwa.links.id(req.params.linkId);

    if (!link) {
      return res.status(404).json({ success: false, message: 'Link nao encontrado' });
    }

    link.deleteOne();
    await manhwa.save();

    return res.json({ success: true, message: 'Link removido com sucesso' });
  } catch (error) {
    return next(error);
  }
}

async function updateChapter(req, res, next) {
  try {
    const { cap_atual } = req.body;
    const manhwa = await Manhwa.findOne({ slug: req.params.slug });

    if (!manhwa) {
      return res.status(404).json({ success: false, message: 'Manhwa nao encontrado' });
    }

    const link = manhwa.links.id(req.params.linkId);

    if (!link) {
      return res.status(404).json({ success: false, message: 'Link nao encontrado' });
    }

    const parsedCapAtual = parseNumber(cap_atual);
    if (parsedCapAtual === null || parsedCapAtual < 1) {
      return res.status(400).json({ success: false, message: 'Capitulo invalido' });
    }

    link.cap_atual = parsedCapAtual;
    await manhwa.save();

    return res.json({ success: true, data: manhwa });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  addLink,
  updateLink,
  deleteLink,
  updateChapter,
};