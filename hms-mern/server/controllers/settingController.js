import Setting from '../models/Setting.js';
export const getSettings = async (req, res) => res.json(await Setting.get());
export const updateSettings = async (req, res) => {
  const s = await Setting.get();
  Object.assign(s, req.body);
  await s.save();
  res.json(s);
};
