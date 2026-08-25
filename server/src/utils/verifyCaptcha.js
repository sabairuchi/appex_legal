export const verifyCaptcha = async (token, remoteIp) => {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // In local development or if site/secret key is omitted in .env, log and allow gracefully
  if (!secretKey || secretKey === 'your_turnstile_secret_key_here') {
    console.log('[CAPTCHA] TURNSTILE_SECRET_KEY not set. Local development mode bypass enabled.');
    return { success: true };
  }

  // If token is missing when secret key IS set, fail validation
  if (!token) {
    return { success: false, message: 'CAPTCHA token is required' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) formData.append('remoteip', remoteIp);

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const data = await response.json();
    return {
      success: data.success === true,
      message: data.success ? 'CAPTCHA verified' : 'CAPTCHA verification failed',
    };
  } catch (error) {
    console.error('[CAPTCHA Error]:', error.message);
    return { success: false, message: 'CAPTCHA verification request error' };
  }
};
