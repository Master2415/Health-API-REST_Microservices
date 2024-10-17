const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.HS_DATABASE_URL || 'localhost',
    port: parseInt(process.env.HS_PORT, 10) || 5432,
    username: process.env.HS_USER || 'admin',
    password: process.env.HS_PASSWORD || '12345',
    database: process.env.HS_DBNAME || 'health_db',
    logging: false
});

async function databaseConnection() {
    try {
        await sequelize.authenticate();
        await database.sync();
    } catch (error) {
    }
}

const database = sequelize.define('health', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    endpoint: {
        type: DataTypes.STRING,
        allowNull: false
    },
    frequency: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = {
    databaseConnection,
    sequelize,
    database
};
