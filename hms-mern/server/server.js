import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import routes from './routes/index.js';
import seedAdmin from './utils/seedAdmin.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));
app.get('/', (_, res) => res.json({ status: 'HMS API running' }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
});
