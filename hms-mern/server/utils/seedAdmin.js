import User from '../models/User.js';
export default async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@admin.com').toLowerCase();
  if (!(await User.findOne({ email }))) {
    await User.create({ email, password: process.env.ADMIN_PASSWORD || 'admin@123', name: 'Admin' });
    console.log('Admin user created:', email);
  }
}
