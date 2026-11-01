import Bill from '../models/Bill.js';
import Setting from '../models/Setting.js';
import { models } from '../models/index.js';
export const listBills = async (req, res) => res.json(await Bill.find().sort('-createdAt'));
export const createBill = async (req, res) => {
  const { patient, items = [], discount = 0 } = req.body;
  if (!patient || !items.length) return res.status(400).json({ message: 'Patient and at least one item are required' });
  const s = await Setting.get();
  const subtotal = items.reduce((a, i) => a + i.qty * i.price, 0);
  const tax = ((subtotal - discount) * s.taxRate) / 100;
  const bill = await Bill.create({
    number: `${s.prefix}-${Date.now().toString().slice(-7)}`,
    patient, items, subtotal, discount, taxRate: s.taxRate, tax, total: subtotal - discount + tax
  });
  // reduce pharmacy stock for matching medicines
  for (const i of items) await models.medicines.updateOne({ name: i.desc, stock: { $gte: i.qty } }, { $inc: { stock: -i.qty } });
  res.status(201).json(bill);
};
export const deleteBill = async (req, res) => { await Bill.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); };
