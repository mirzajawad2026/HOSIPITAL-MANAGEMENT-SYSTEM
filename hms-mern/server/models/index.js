import mongoose from 'mongoose';
const S = String, N = Number;
// One schema per module. Every module gets full CRUD automatically (see routes/index.js).
const defs = {
  patients: { name: { type: S, required: true }, age: N, gender: S, phone: S, disease: S },
  doctors: { name: { type: S, required: true }, spec: S, phone: S, fee: N },
  appointments: { patient: { type: S, required: true }, doctor: S, date: S, status: { type: S, default: 'Pending' } },
  medicines: { name: { type: S, required: true }, stock: N, price: N },
  departments: { name: { type: S, required: true }, head: S, phone: S },
  staff: { name: { type: S, required: true }, role: S, dept: S, phone: S, salary: N },
  wards: { name: { type: S, required: true }, type: S, beds: N, charge: N },
  admissions: { patient: { type: S, required: true }, ward: S, date: S, status: { type: S, default: 'Admitted' } },
  labtests: { patient: { type: S, required: true }, test: S, price: N, result: S, status: { type: S, default: 'Pending' } },
  ambulance: { vehicle: { type: S, required: true }, driver: S, phone: S, status: { type: S, default: 'Available' } },
  bloodbank: { group: { type: S, required: true }, units: N, donor: S, date: S },
  expenses: { title: { type: S, required: true }, cat: S, amount: N, date: S }
};
export const models = Object.fromEntries(
  Object.entries(defs).map(([k, d]) => [k, mongoose.model(k, new mongoose.Schema(d, { timestamps: true }))])
);
