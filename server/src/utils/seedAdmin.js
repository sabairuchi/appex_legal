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

    const demoClient = await User.findOne({ email: 'john@example.com' });
    if (!demoClient) {
      const initialClientEmail = process.env.CLIENT_INITIAL_EMAIL || 'john@example.com';
      const initialClientPass = process.env.CLIENT_INITIAL_PASSWORD || 'ClientPass2026!';
      const hash = await User.hashPassword(initialClientPass);
      await User.create({
        fullName: 'John',
        email: initialClientEmail.toLowerCase().trim(),
        passwordHash: hash,
        role: 'client',
        isActive: true,
      });
      console.log(`[Client Seed] Created initial demo client account (${initialClientEmail}).`);
    }
  } catch (err) {
    console.warn('[Seed Warning]:', err.message);
  }
};

