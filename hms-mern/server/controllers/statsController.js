import Bill from '../models/Bill.js';
import { models as m } from '../models/index.js';
const sum = async (M, f) => (await M.aggregate([{ $group: { _id: null, t: { $sum: '$' + f } } }]))[0]?.t || 0;
export const stats = async (req, res) => {
  const [patients, doctors, pending, medicines, lowStock, revenue, expenses, totalBeds, occupied, monthly, gender] = await Promise.all([
    m.patients.countDocuments(), m.doctors.countDocuments(), m.appointments.countDocuments({ status: 'Pending' }),
    m.medicines.countDocuments(), m.medicines.find({ stock: { $lt: 20 } }).select('name stock'),
    sum(Bill, 'total'), sum(m.expenses, 'amount'), sum(m.wards, 'beds'), m.admissions.countDocuments({ status: 'Admitted' }),
    Bill.aggregate([{ $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, revenue: { $sum: '$total' } } }, { $sort: { _id: 1 } }, { $limit: 12 }]),
    m.patients.aggregate([{ $group: { _id: '$gender', value: { $sum: 1 } } }])
  ]);
  res.json({ patients, doctors, pending, medicines, lowStock, revenue, expenses, profit: revenue - expenses, totalBeds, occupied,
    monthly: monthly.map((x) => ({ month: x._id, revenue: x.revenue })),
    gender: gender.map((x) => ({ name: x._id || 'Unknown', value: x.value })) });
};
