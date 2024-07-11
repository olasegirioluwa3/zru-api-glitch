import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { connectDb, default as models } from './models/index.js';
import userRoutes from './routes/user/userAuthRoutes.js';
import userAcademicRoutes from './routes/user/userAcademicRoutes.js';
import userApplicationRoutes from './routes/user/userApplicationRoutes.js';
import userPaymentRoutes from './routes/user/userPaymentRoutes.js';

// import paymentRoutes from './routes/paymentRoutes.js';
import adminApplicationRoutes from './routes/admin/adminApplicationRoutes.js';
import adminAuthRoutes from './routes/admin/adminAuthRoutes.js';
import adminPaymentRoutes from './routes/admin/adminPaymentRoutes.js';
import adminAcademicRoutes from './routes/admin/adminAcademicRoutes.js';
// import adminSchoolLeavingRoutes from './routes/admin/adminSchoolLeavingRoutes.js';
// import adminAdmissionTestRoutes from './routes/admin/adminAdmissionTestRoutes.js';

import regCenterAuthRoutes from './routes/regcenter/regCenterAuthRoutes.js';
// import regCenterAcademicRoutes from './routes/regcenter/regCenterAcademicRoutes.js';
import path from 'path';

config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
const __dirname = path.resolve();
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
userRoutes(app);
userAcademicRoutes(app, null, null);
userApplicationRoutes(app, null, null);
userPaymentRoutes(app, null, null);
// paymentRoutes(app, null, null);

adminAuthRoutes(app, null, null);
adminAcademicRoutes(app, null, null);
adminPaymentRoutes(app, null, null);
adminApplicationRoutes(app, null, null);
// adminAdmissionTestRoutes(app, null, null);
// adminSchoolLeavingRoutes(app, null, null);

regCenterAuthRoutes(app, null, null);
// regCenterAcademicRoutes(app, null, null);
// ... other routes

app.get('/', (req, res) => {
  return res.status(201).json({ message: 'Welcome to Zion Reborn University API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 8000;
connectDb().then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Error connecting to MongoDB:', error);
});
