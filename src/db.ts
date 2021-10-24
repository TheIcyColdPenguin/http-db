import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
    host: './db',
    dialect: 'sqlite',
    logging: false,
});

export default sequelize;
