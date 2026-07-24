const Page = require('../models/Page');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/v1/pages  (admin: all pages, paginated/filterable)
const listPages = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
  const { status, search } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (search) filter.$text = { $search: search };

  const [items, total] = await Promise.all([
    Page.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-blocks'),
    Page.countDocuments(filter),
  ]);

  new ApiResponse(200, {
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  }).send(res);
});

// GET /api/v1/pages/:id  (admin: full page incl. blocks, any status)
const getPageById = asyncHandler(async (req, res) => {
  const page = await Page.findById(req.params.id);
  if (!page) throw ApiError.notFound('Page not found');
  new ApiResponse(200, page).send(res);
});

// GET /api/v1/public/pages/:slug  (public: published only)
const getPublicPageBySlug = asyncHandler(async (req, res) => {
  const page = await Page.findOne({ slug: req.params.slug, status: 'published' });
  if (!page) throw ApiError.notFound('Page not found or not published');
  new ApiResponse(200, page).send(res);
});

// GET /api/v1/public/pages  (public: list published pages, for nav/sitemaps)
const listPublicPages = asyncHandler(async (req, res) => {
  const pages = await Page.find({ status: 'published' }).select('title slug seo publishedAt updatedAt');
  new ApiResponse(200, pages).send(res);
});

// POST /api/v1/pages
const createPage = asyncHandler(async (req, res) => {
  const exists = await Page.findOne({ slug: req.body.slug });
  if (exists) throw ApiError.conflict(`A page with slug "${req.body.slug}" already exists.`);

  const payload = { ...req.body, createdBy: req.admin.id, updatedBy: req.admin.id };
  if (payload.status === 'published') payload.publishedAt = new Date();

  const page = await Page.create(payload);
  new ApiResponse(201, page, 'Page created').send(res, 201);
});

// PUT /api/v1/pages/:id
const updatePage = asyncHandler(async (req, res) => {
  const page = await Page.findById(req.params.id);
  if (!page) throw ApiError.notFound('Page not found');

  if (req.body.slug && req.body.slug !== page.slug) {
    const clash = await Page.findOne({ slug: req.body.slug, _id: { $ne: page._id } });
    if (clash) throw ApiError.conflict(`A page with slug "${req.body.slug}" already exists.`);
  }

  const wasPublished = page.status === 'published';
  Object.assign(page, req.body, { updatedBy: req.admin.id });
  if (page.status === 'published' && !wasPublished) page.publishedAt = new Date();

  await page.save();
  new ApiResponse(200, page, 'Page updated').send(res);
});

// PATCH /api/v1/pages/:id/status  { status: 'draft' | 'published' }
const setPageStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['draft', 'published'].includes(status)) {
    throw ApiError.badRequest('status must be "draft" or "published"');
  }
  const page = await Page.findById(req.params.id);
  if (!page) throw ApiError.notFound('Page not found');

  page.status = status;
  page.updatedBy = req.admin.id;
  if (status === 'published' && !page.publishedAt) page.publishedAt = new Date();
  await page.save();

  new ApiResponse(200, page, `Page ${status === 'published' ? 'published' : 'unpublished'}`).send(res);
});

// DELETE /api/v1/pages/:id
const deletePage = asyncHandler(async (req, res) => {
  const page = await Page.findByIdAndDelete(req.params.id);
  if (!page) throw ApiError.notFound('Page not found');
  new ApiResponse(200, null, 'Page deleted').send(res);
});

module.exports = {
  listPages,
  getPageById,
  getPublicPageBySlug,
  listPublicPages,
  createPage,
  updatePage,
  setPageStatus,
  deletePage,
};
