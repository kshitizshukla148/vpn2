export class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   * @param {boolean} isOperational - true for expected errors, false for bugs
   * @param {any} details - optional extra info (e.g. validation errors)
   */
  constructor(message, statusCode = 500, isOperational = true, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Wrap async route handlers to catch errors and pass to next()
 * Usage: router.get('/', asyncHandler(async (req,res) => { ... }));
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * 404 Not Found middleware
 * Mount this after all routes
 */
export const notFound = (req, res, next) => {
  const err = new AppError(`Not Found - ${req.originalUrl}`, 404, true);
  next(err);
};

/**
 * Final error handling middleware
 * - Logs error
 * - Sends detailed info in development
 * - Sends sanitized message in production
 */
export const errorHandler = (err, req, res, next) => {
  // Normalize: if it's not AppError, wrap it (treat as 500 internal)
  if (!(err instanceof AppError)) {
    // Detect some known error types and map them to friendly messages
    // e.g., Firestore / Firebase Admin errors often have 'code' and 'message'
    const details = {};
    if (err.code) details.code = err.code;
    if (err.errors) details.errors = err.errors; // validation arrays/objects
    err = new AppError(err.message || 'Internal Server Error', err.statusCode || 500, false, details);
    err.stack = err.stack || (new Error()).stack;
  }

  const env = (process.env.NODE_ENV || 'development').toLowerCase();
  const status = err.statusCode || 500;

  // log full error server-side
  // (Replace console with winston/pino if you want structured logs)
  console.error(`[${new Date().toISOString()}] Error:`, {
    name: err.name,
    message: err.message,
    status: status,
    isOperational: !!err.isOperational,
    details: err.details,
    stack: err.stack,
  });

  // Build response
  const response = {
    success: false,
    status,
    message: env === 'development' || err.isOperational ? err.message : 'Internal Server Error',
  };

  // In dev show stack and details
  if (env === 'development') {
    response.stack = err.stack;
    if (err.details) response.details = err.details;
  } else {
    // In prod include details only for operational errors
    if (err.isOperational && err.details) response.details = err.details;
  }

  res.status(status).json(response);
};
