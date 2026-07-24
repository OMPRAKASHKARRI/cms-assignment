const mongoose = require('mongoose');

// Singleton document (siteKey is always "global") for site-wide values the
// public frontend needs but that don't belong to any one page — nav links,
// footer, contact info.
const SettingsSchema = new mongoose.Schema(
  {
    siteKey: { type: String, default: 'global', unique: true },
    siteName: { type: String, default: 'RenewCred' },
    navLinks: {
      type: [{ label: String, href: String }],
      default: [],
    },
    footer: {
      text: { type: String, default: '' },
      links: { type: [{ label: String, href: String }], default: [] },
    },
    contactEmail: { type: String, default: '' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', SettingsSchema);
