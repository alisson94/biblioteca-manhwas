const express = require('express');
const multer = require('multer');
const { storage } = require('../../config/cloudinary');
const {
  renderHome,
  renderDetails,
  createManhwa,
  updateManhwa,
  addLink,
  updateLink,
  updateChapter,
} = require('../../controllers/web/manhwasWebController');

const router = express.Router();
const upload = multer({ storage });

router.get('/', renderHome);
router.get('/manhwa/:slug', renderDetails);

router.post('/adicionar', upload.single('capa'), createManhwa);
router.post('/manhwa/atualizar/:slug', upload.single('capa'), updateManhwa);

router.post('/manhwa/adicionar-link', addLink);
router.post('/manhwa/atualizar-link', updateLink);
router.post('/manhwa/atualizar-capitulo', updateChapter);

module.exports = router;