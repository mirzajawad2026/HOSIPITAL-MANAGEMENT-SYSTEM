import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, default: 'City Care Hospital' },
  address: { type: String, default: 'Main Road, Samundari' },
  phone: { type: String, default: '041-0000000' },
  currency: { type: String, default: 'Rs.' },
  taxRate: { type: Number, default: 5 },
  prefix: { type: String, default: 'INV' },
  footer: { type: String, default: 'Thank you. Get well soon!' }
});
schema.statics.get = async function () { return (await this.findOne()) || this.create({}); };
export default mongoose.model('Setting', schema);
