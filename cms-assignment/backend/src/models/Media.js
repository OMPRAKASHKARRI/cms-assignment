const mongoose = require('mongoose');

// Media metadata only for this assignment's scope — actual binary storage
// is left pluggable (local disk / S3 / Cloudinary) behind `url`, documented
// as an assumption in the README.
const MediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    altText: { type: String, default: '' },
    mimeType: { type: String, default: '' },
    sizeBytes: { type: Number, default: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Media', MediaSchema);
