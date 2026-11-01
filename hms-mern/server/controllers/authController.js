import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
export const login = async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email: String(email || '').toLowerCase() });
  if (!u || !(await u.matchPassword(String(password || ''))))
    return res.status(401).json({ message: 'Invalid email or password' });
  res.json({ token: sign(u._id), user: { name: u.name, email: u.email, role: u.role } });
};
export const me = (req, res) => res.json(req.user);
