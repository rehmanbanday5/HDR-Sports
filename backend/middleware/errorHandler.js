const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Internal server error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 404;
    message = `Resource not found`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for field: ${field}`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  if (
    err.name === "MongoServerSelectionError" ||
    err.name === "MongooseServerSelectionError" ||
    err.name === "MongoNetworkError" ||
    err.name === "MongoError"
  ) {
    statusCode = 503;
    message =
      "Database is currently unavailable. Please check MongoDB Atlas access settings.";
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
