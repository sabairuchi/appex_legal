export const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Apex Legal API Gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
};
