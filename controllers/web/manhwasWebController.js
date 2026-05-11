const Manhwa = require('../../models/Manhwa');
const slugify = require('../../utils/slugify');

async function renderHome(req, res) {
  try {
    const manhwas = await Manhwa.find();
    return res.render('inicio', { manhwas });
  } catch (error) {
    console.error('Erro ao buscar manhwas:', error);
    return res.status(500).send('Erro interno do servidor');
  }
}

async function renderDetails(req, res) {
  try {
    const manhwa = await Manhwa.findOne({ slug: req.params.slug });

    if (!manhwa) {
      return res.status(404).send('Manhwa nao encontrado');
    }

    return res.render('detalhes', { manhwa });
  } catch (error) {
    console.error('Erro ao buscar manhwa:', error);
    return res.status(500).send('Erro interno do servidor');
  }
}

async function createManhwa(req, res) {
  try {
    const capaPath = req.file.path;
    const { titulos, status, capitulos, tags } = req.body;

    const novoManhwa = new Manhwa({
      slug: slugify(req.body.titulos[0]),
      titulos,
      capa: capaPath,
      status,
      capitulos,
      tags: tags.split(',').map((tag) => tag.trim()),
      links: [],
    });

    await novoManhwa.save();
    return res.redirect('/');
  } catch (error) {
    console.error('Erro ao adicionar manhwa:', error);
    return res.status(500).send('Erro interno do servidor');
  }
}

async function updateManhwa(req, res) {
  try {
    const { slug } = req.params;
    const capaPath = req.file ? req.file.path : null;
    const { titulos, status, capitulos, tags } = req.body;

    const novoManhwa = {
      titulos,
      status,
      capitulos,
      tags: tags.split(',').map((tag) => tag.trim()),
    };

    if (capaPath) {
      novoManhwa.capa = capaPath;
    }

    const manhwa = await Manhwa.findOneAndUpdate({ slug }, novoManhwa, { new: true });

    if (!manhwa) {
      return res.status(404).send('Manhwa nao encontrado');
    }

    return res.redirect(`/manhwa/${manhwa.slug}`);
  } catch (error) {
    console.error('Erro ao atualizar manhwa:', error);
    return res.status(500).send('Erro interno do servidor');
  }
}

async function addLink(req, res) {
  try {
    const { manhwaSlug, idioma, url, cap_total } = req.body;
    const manhwa = await Manhwa.findOne({ slug: manhwaSlug });

    if (!manhwa) {
      return res.status(404).send('Manhwa nao encontrado');
    }

    manhwa.links.push({
      idioma,
      url,
      cap_atual: 1,
      cap_total,
    });

    await manhwa.save();
    return res.redirect(`/manhwa/${manhwaSlug}`);
  } catch (error) {
    console.error('Erro ao adicionar link:', error);
    return res.status(500).send('Erro interno do servidor');
  }
}

async function updateLink(req, res) {
  try {
    const { manhwaSlug, linkId, idioma, url, cap_total } = req.body;
    const manhwa = await Manhwa.findOne({ slug: manhwaSlug });

    if (!manhwa) {
      return res.status(404).send('Manhwa nao encontrado');
    }

    const link = manhwa.links.id(linkId);
    if (!link) {
      return res.status(404).send('Link nao encontrado');
    }

    link.idioma = idioma;
    link.url = url;
    link.cap_total = cap_total;

    await manhwa.save();
    return res.redirect(`/manhwa/${manhwaSlug}`);
  } catch (error) {
    console.error('Erro ao atualizar link:', error);
    return res.status(500).send('Erro interno do servidor');
  }
}

async function updateChapter(req, res) {
  try {
    const { manhwaSlug, manhwaLink, novoValor } = req.body;
    const manhwa = await Manhwa.findOne({ slug: manhwaSlug });

    if (!manhwa) {
      return res.status(404).json({ success: false, message: 'Manhwa nao encontrado' });
    }

    const link = manhwa.links.find((item) => item.url === manhwaLink);
    if (!link) {
      return res.status(404).json({ success: false, message: 'Link nao encontrado' });
    }

    link.cap_atual = parseInt(novoValor, 10);
    await manhwa.save();

    return res.json({ success: true, message: 'Sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar capitulo', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
}

module.exports = {
  renderHome,
  renderDetails,
  createManhwa,
  updateManhwa,
  addLink,
  updateLink,
  updateChapter,
};