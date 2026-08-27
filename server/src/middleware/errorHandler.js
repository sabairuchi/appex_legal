export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`[Error] ${req.method} ${req.url}:`, err.message);

  let userMessage = err.message || 'Internal Server Error';

  // Sanitize configuration / connection / secret errors
  if (
    userMessage.includes('MONGODB_URI') ||
    userMessage.includes('JWT_SECRET') ||
    userMessage.includes('mongodb://') ||
    userMessage.includes('mongodb+srv://')
  ) {
    userMessage = 'Server configuration error';
  }

  res.status(statusCode).json({
    success: false,
    message: userMessage,
  });
};

