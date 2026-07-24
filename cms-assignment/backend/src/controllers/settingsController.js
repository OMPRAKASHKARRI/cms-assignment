const Settings = require('../models/Settings');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.findOneAndUpdate(
    { siteKey: 'global' },
    { $setOnInsert: { siteKey: 'global' } },
    { upsert: true, new: true }
  );
  new ApiResponse(200, settings).send(res);
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.findOneAndUpdate(
    { siteKey: 'global' },
    { ...req.body, updatedBy: req.admin.id },
    { upsert: true, new: true }
  );
  new ApiResponse(200, settings, 'Settings updated').send(res);
});

module.exports = { getSettings, updateSettings };
