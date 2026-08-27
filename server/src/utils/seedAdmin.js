import User from '../models/user.model.js';

export const seedInitialAdmin = async () => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      const initialAdminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@apexlegal.com';
      const initialAdminPass = process.env.ADMIN_INITIAL_PASSWORD || 'ApexAdmin2026!';
      const hash = await User.hashPassword(initialAdminPass);
      await User.create({
        fullName: 'Apex Admin',
        email: initialAdminEmail.toLowerCase().trim(),
        passwordHash: hash,
        role: 'admin',
        isActive: true,
      });
      console.log(`[Admin Seed] Created initial system admin account (${initialAdminEmail}).`);
    }
  } catch (err) {
    console.warn('[Admin Seed Warning]:', err.message);
  }
};
