const mongoose = require('mongoose');

// Recursive list-item schema so we can support arbitrarily nested lists
// (a requirement called out explicitly in the assignment) without a
// separate collection or a fixed nesting depth.
const ListItemSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    children: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { _id: false }
);
ListItemSchema.add({ children: [ListItemSchema] });

// One schema per block "type" gives us real validation instead of an
// unchecked Mixed blob, while still letting `data` vary by type. Mongoose
// discriminators would be the alternative; we use a single Mixed field with
// per-type Zod validation at the API boundary (see validations/pageValidation.js)
// because it keeps the document shape simple for the block-reordering UI and
// avoids discriminator-array quirks in Mongoose subdocuments.
const BlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'hero',
        'header',
        'paragraph',
        'richtext',
        'list',
        'table',
        'equation',
        'image',
        'quote',
        'code',
        'cta',
      ],
    },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    order: { type: Number, required: true, default: 0 },
    metadata: {
      anchorId: { type: String, default: null },
      className: { type: String, default: null },
    },
  },
  { timestamps: true }
);

const PageSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'A page title is required'], trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens'],
    },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    blocks: { type: [BlockSchema], default: [] },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      ogImage: { type: String, default: '' },
    },
    publishedAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

PageSchema.index({ status: 1, slug: 1 });
PageSchema.index({ title: 'text' });

module.exports = mongoose.model('Page', PageSchema);
