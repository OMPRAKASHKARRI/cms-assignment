const { z } = require('zod');

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10, 'refreshToken is required'),
  }),
});

module.exports = { loginSchema, refreshSchema };
