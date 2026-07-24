const express = require('express');
const { listPublicPages, getPublicPageBySlug } = require('../controllers/pageController');
const { getSettings } = require('../controllers/settingsController');

const router = express.Router();

// Unauthenticated, read-only surface consumed by the public Next.js site.
router.get('/pages', listPublicPages);
router.get('/pages/:slug', getPublicPageBySlug);
router.get('/settings', getSettings);

module.exports = router;
