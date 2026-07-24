const Page = require('../models/Page');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/v1/dashboard/stats — powers the admin dashboard's summary cards.
const getStats = asyncHandler(async (req, res) => {
  const [total, published, draft, recent] = await Promise.all([
    Page.countDocuments(),
    Page.countDocuments({ status: 'published' }),
    Page.countDocuments({ status: 'draft' }),
    Page.find().sort({ updatedAt: -1 }).limit(5).select('title slug status updatedAt'),
  ]);
  new ApiResponse(200, { total, published, draft, recent }).send(res);
});

module.exports = { getStats };
