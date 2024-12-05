// server/models/leaveModel.js
import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const MasterConfiguration = db.define('MasterConfiguration', {
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subCategory: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    columnMapping: {
        type: DataTypes.JSON,
        allowNull: false,
    },
  
});



export  const syncMasterConfigutaionTable = async () => {
    try {
        await MasterConfiguration.sync({  alter: true });
        console.log('MasterConfiguration table created or exists already');
    } catch (error) {
        console.error('Error creating MasterConfiguration table:', error);
    }
};

syncMasterConfigutaionTable();

export default MasterConfiguration;
