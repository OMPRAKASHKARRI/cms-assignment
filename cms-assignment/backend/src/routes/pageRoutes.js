const express = require('express');
const {
  listPages, getPageById, createPage, updatePage, setPageStatus, deletePage,
} = require('../controllers/pageController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createPageSchema, updatePageSchema } = require('../validations/pageValidation');

const router = express.Router();

// Every route below is an authenticated CMS operation on pages.
router.use(protect);

router.get('/', listPages);
router.get('/:id', getPageById);
router.post('/', validate(createPageSchema), createPage);
router.put('/:id', validate(updatePageSchema), updatePage);
router.patch('/:id/status', setPageStatus);
router.delete('/:id', deletePage);

module.exports = router;
