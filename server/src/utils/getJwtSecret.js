export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Server configuration error: JWT_SECRET environment variable is required in production.');
    }
    return 'apex_legal_fallback_dev_secret_2026';
  }
  return secret;
};
