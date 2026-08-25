import nodemailer from 'nodemailer';

export const sendResetPasswordEmail = async ({ to, resetUrl }) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || '"Apex Legal Security" <no-reply@apexlegal.com>';

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1B2A4A; color: #ffffff; padding: 40px; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #C9A84C; font-family: 'Playfair Display', Georgia, serif; letter-spacing: 2px; margin: 0;">APEX LEGAL</h1>
        <p style="color: #9CA3AF; font-size: 12px; letter-spacing: 1px; margin-top: 5px;">ADVICE. ADVOCACY. RESULTS.</p>
      </div>
      <div style="background-color: #0D1B2A; padding: 30px; border-radius: 6px; border-top: 3px solid #C9A84C;">
        <h2 style="color: #ffffff; font-size: 20px; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #D1D5DB; font-size: 15px; line-height: 1.6;">
          We received a request to reset your password for your Apex Legal Client Account. Click the button below to establish a new password:
        </p>
        <div style="text-align: center; margin: 35px 0;">
          <a href="${resetUrl}" style="background-color: #C9A84C; color: #0D1B2A; text-decoration: none; padding: 14px 30px; font-weight: bold; border-radius: 4px; display: inline-block; font-size: 15px;">Reset Password</a>
        </div>
        <p style="color: #9CA3AF; font-size: 13px; line-height: 1.5;">
          This reset link will expire in 60 minutes. If you did not request a password reset, please ignore this email or contact support immediately.
        </p>
        <p style="color: #6B7280; font-size: 12px; margin-top: 20px; word-break: break-all;">
          Direct Link: <a href="${resetUrl}" style="color: #C9A84C;">${resetUrl}</a>
        </p>
      </div>
      <div style="text-align: center; margin-top: 30px; color: #6B7280; font-size: 12px;">
        © 2024 Apex LEGAL PARTNER. All Rights Reserved.<br/>123 Justice Ave, Suite 900, New York, NY 10001
      </div>
    </div>
  `;

  if (!host || !user || !pass) {
    console.log('\n======================================================');
    console.log('[EMAIL SERVICE - DEV LOG]');
    console.log(`To: ${to}`);
    console.log(`Subject: Reset Your Apex Legal Password`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('======================================================\n');
    return { success: true, mode: 'console-log' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to,
      subject: 'Reset Your Apex Legal Password',
      html: htmlContent,
    });

    console.log(`[EMAIL SERVICE] Password reset email sent to ${to}`);
    return { success: true, mode: 'smtp' };
  } catch (error) {
    console.error('[EMAIL SERVICE Error]:', error.message);
    throw new Error('Failed to send password reset email');
  }
};
