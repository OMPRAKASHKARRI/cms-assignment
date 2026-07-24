// Idempotent seed script: creates the admin login used for evaluation and a
// sample published page exercising every block type, so the public site has
// something real to render on first run. Safe to re-run.
require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../config/env');
const Admin = require('../models/Admin');
const Page = require('../models/Page');
const Settings = require('../models/Settings');
const logger = require('./logger');

async function seed() {
  await mongoose.connect(env.mongoUri);
  logger.info('Connected for seeding');

  let admin = await Admin.findOne({ email: env.seedAdmin.email });
  if (!admin) {
    admin = await Admin.create({
      username: env.seedAdmin.username,
      email: env.seedAdmin.email,
      passwordHash: await Admin.hashPassword(env.seedAdmin.password),
      role: 'admin',
    });
    logger.info(`Seeded admin: ${admin.email}`);
  } else {
    logger.info(`Admin already exists: ${admin.email}`);
  }

  await Settings.findOneAndUpdate(
    { siteKey: 'global' },
    {
      siteKey: 'global',
      siteName: 'RenewCred',
      navLinks: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
      ],
      footer: {
        text: '© 2026 RenewCred. All rights reserved.',
        links: [{ label: 'Privacy Policy', href: '/privacy' }],
      },
      contactEmail: 'hello@renewcred.com',
      updatedBy: admin._id,
    },
    { upsert: true }
  );

  const existing = await Page.findOne({ slug: 'home' });
  if (!existing) {
    await Page.create({
      title: 'Home',
      slug: 'home',
      status: 'published',
      publishedAt: new Date(),
      createdBy: admin._id,
      updatedBy: admin._id,
      seo: {
        metaTitle: 'RenewCred — Renewable Energy Credits, Simplified',
        metaDescription: 'Track, trade and retire renewable energy credits with RenewCred.',
      },
      blocks: [
        {
          type: 'hero',
          order: 0,
          data: {
            eyebrow: 'RenewCred Platform',
            heading: 'Renewable Energy Credits, Simplified',
            subheading: 'Track, verify, and trade RECs on a single transparent ledger.',
            ctaLabel: 'Get Started',
            ctaHref: '/signup',
            imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200',
          },
        },
        {
          type: 'header',
          order: 1,
          data: { text: 'Why teams choose RenewCred', level: 2 },
        },
        {
          type: 'paragraph',
          order: 2,
          data: {
            text: 'RenewCred gives sustainability teams a single system of record for renewable energy certificates — from issuance through retirement — with full audit trails built in.',
          },
        },
        {
          type: 'list',
          order: 3,
          data: {
            style: 'unordered',
            items: [
              {
                text: 'Automated REC issuance and matching',
                children: [
                  { text: 'Utility meter data ingestion', children: [] },
                  { text: 'Real-time reconciliation', children: [] },
                ],
              },
              { text: 'Audit-ready compliance reporting', children: [] },
              { text: 'Marketplace for buying and retiring credits', children: [] },
            ],
          },
        },
        {
          type: 'table',
          order: 4,
          data: {
            headers: ['Plan', 'Credits / mo', 'Price'],
            rows: [
              ['Starter', '500', '$99'],
              ['Growth', '5,000', '$499'],
              ['Enterprise', 'Unlimited', 'Custom'],
            ],
          },
        },
        {
          type: 'equation',
          order: 5,
          data: {
            equation: 'CO_2\\text{avoided} = E_{mwh} \\times EF_{grid}',
            displayMode: true,
            caption: 'Avoided emissions are computed from energy generated and the local grid emissions factor.',
          },
        },
        {
          type: 'quote',
          order: 6,
          data: { text: 'RenewCred cut our REC reconciliation time from days to minutes.', author: 'Head of Sustainability, Series B climate-tech company' },
        },
        {
          type: 'code',
          order: 7,
          data: {
            language: 'bash',
            code: 'curl https://api.renewcred.com/v1/public/pages/home',
          },
        },
        {
          type: 'cta',
          order: 8,
          data: { heading: 'Ready to simplify REC management?', buttonLabel: 'Talk to sales', buttonHref: '/contact' },
        },
      ],
    });
    logger.info('Seeded sample page: home');
  } else {
    logger.info('Sample page "home" already exists');
  }

  await mongoose.disconnect();
  logger.info('Seeding complete');
}

seed().catch((err) => {
  logger.error('Seeding failed', { message: err.message });
  process.exit(1);
});
