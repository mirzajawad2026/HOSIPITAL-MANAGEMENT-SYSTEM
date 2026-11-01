import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  number: { type: String, unique: true },
  patient: { type: String, required: true },
  items: [{ desc: String, qty: Number, price: Number }],
  subtotal: Number, discount: { type: Number, default: 0 },
  taxRate: Number, tax: Number, total: Number
}, { timestamps: true });
export default mongoose.model('Bill', schema);
