import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import { syncMasterConfigutaionTable } from './models/masterModel.js';
import cookieParser from 'cookie-parser';
import technicalAdminRoute from './routes/technicalAdminRoute.js'
import superAdminRoute from './routes/superAdminRoute.js'
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.json()); // For parsing application/json

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  credentials: true,
  // exposedHeaders: ["set-cookie"],
}));





app.use('/api/teachnical',technicalAdminRoute)
app.use('/api/superAdmin',superAdminRoute)


const PORT = process.env.PORT;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
      await sequelize.authenticate();
      syncMasterConfigutaionTable();
      console.log('Database connection established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  
  });