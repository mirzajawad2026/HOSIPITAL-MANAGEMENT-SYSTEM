import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { login, me } from '../controllers/authController.js';
import { crud } from '../controllers/crudController.js';
import { listBills, createBill, deleteBill } from '../controllers/billController.js';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { stats } from '../controllers/statsController.js';
import { models } from '../models/index.js';

const r = Router();
r.post('/auth/login', login);

// everything below is admin-only
r.use(protect, adminOnly);
r.get('/auth/me', me);
r.get('/stats', stats);
r.route('/settings').get(getSettings).put(updateSettings);
r.route('/bills').get(listBills).post(createBill);
r.delete('/bills/:id', deleteBill);

// auto-generate CRUD routes: /api/patients, /api/doctors, ...
Object.entries(models).forEach(([name, Model]) => {
  const c = crud(Model);
  r.route(`/${name}`).get(c.list).post(c.create);
  r.route(`/${name}/:id`).put(c.update).delete(c.remove);
});
export default r;
