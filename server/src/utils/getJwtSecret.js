export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return 'apex_legal_demo_secret_2026_key';
  }
  return secret;
};
