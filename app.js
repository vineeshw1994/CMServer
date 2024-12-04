import express from 'express';
// import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
      await sequelize.authenticate();
      console.log('Database connection established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  
  });