export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
};

export const errorHandler = (err, _, res) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
