const express = require('express');
const multer = require('multer');
const { storage } = require('../../config/cloudinary');
const {
  listManhwas,
  getManhwaBySlug,
  createManhwa,
  updateManhwa,
  deleteManhwa,
} = require('../../controllers/api/manhwasController');
const {
  addLink,
  updateLink,
  deleteLink,
  updateChapter,
} = require('../../controllers/api/linksController');

const router = express.Router();
const upload = multer({ storage });

router.get('/', listManhwas);
router.get('/:slug', getManhwaBySlug);
router.post('/', upload.single('capa'), createManhwa);
router.put('/:slug', upload.single('capa'), updateManhwa);
router.delete('/:slug', deleteManhwa);

router.post('/:slug/links', addLink);
router.put('/:slug/links/:linkId', updateLink);
router.delete('/:slug/links/:linkId', deleteLink);
router.put('/:slug/links/:linkId/chapter', updateChapter);

module.exports = router;