import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import { syncMasterConfigurationTable } from './models/masterModel.js';
import cookieParser from 'cookie-parser';
import technicalAdminRoute from './routes/technicalAdminRoute.js'
import superAdminRoute from './routes/superAdminRoute.js'
import businessAdminRoute from './routes/bussinessAdminRoute.js'
import authRoute from './routes/authRoute.js'

import bodyParser from 'body-parser';
import { syncUserTable } from './models/userModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath from the 'url' module


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




app.use('/api/authentication',authRoute)
app.use('/api/teachnical',technicalAdminRoute)
app.use('/api/superAdmin',superAdminRoute)
app.use('/api/businessAdmin',businessAdminRoute)

const createMetadataFile = () => {
  const metadata = {
    name:'MasterConfiguration',
    createdAt: new Date(),
    version: '1.0',
    description: 'Metadata file for assets folder',
  };

  // Get the current directory path using import.meta.url
  const __filename = fileURLToPath(import.meta.url); // Get the file URL and convert it to a file path
  const __dirname = path.dirname(__filename); // Get the directory name from the file path

  const assetsPath = path.join(__dirname, 'assets');
  const metadataFilePath = path.join(assetsPath, 'metadata.json');

  // Check if the metadata.json file already exists
  if (fs.existsSync(metadataFilePath)) {
    console.log('metadata.json file already exists. Skipping creation.');
    return; // Exit the function if the file exists
  }

  // Check if assets folder exists, if not, create it
  if (!fs.existsSync(assetsPath)) {
    fs.mkdirSync(assetsPath, { recursive: true });
  }

  // Create the metadata.json file
  fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2), 'utf-8');
  console.log('metadata.json file has been created in the assets folder.');
};

const PORT = process.env.PORT;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
      await sequelize.authenticate();
      syncMasterConfigurationTable();
      syncUserTable();
      console.log('Database connection established successfully.');
      createMetadataFile();

    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  
  });