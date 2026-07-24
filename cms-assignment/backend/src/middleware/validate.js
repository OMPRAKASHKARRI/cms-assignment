const ApiError = require('../utils/ApiError');

// Generic Zod-driven validator: pass it a schema shaped like
// { body?, params?, query? } and it validates+replaces those parts of the
// request in one place, keeping controllers free of parsing logic.
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      path: i.path.slice(1).join('.'),
      message: i.message,
    }));
    return next(ApiError.badRequest('Validation failed', details));
  }
  if (result.data.body) req.body = result.data.body;
  if (result.data.params) req.params = result.data.params;
  next();
};

module.exports = validate;
