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
    // Add new columns column_1 to column_30
    column_1: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_2: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_3: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_4: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_5: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_6: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_7: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_8: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_9: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_10: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_11: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_12: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_13: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_14: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_15: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_16: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_17: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_18: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_19: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_20: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_21: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_22: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_23: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_24: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_25: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_26: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_27: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_28: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_29: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    column_30: {
        type: DataTypes.STRING(50),
        allowNull: true,
    }
});

export const syncMasterConfigurationTable = async () => {
    try {
        await MasterConfiguration.sync({ alter: true });
        console.log('MasterConfiguration table updated successfully');
    } catch (error) {
        console.error('Error updating MasterConfiguration table:', error);
    }
};

syncMasterConfigurationTable();

export default MasterConfiguration;
