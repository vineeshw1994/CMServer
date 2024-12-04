
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
 
dotenv.config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, 
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
      
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

testConnection();

export default sequelize;
