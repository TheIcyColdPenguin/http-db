import Sequelize from 'sequelize';
const { Model, DataTypes, UUIDV4 } = Sequelize;

import sequelize from './db.js';

interface LocalAppProperties {
    id?: string;
    name: string;
    data: string;
}

export class LocalApp extends Model<LocalAppProperties> implements LocalAppProperties {
    public id!: string;
    public name!: string;
    public data!: string;
}

LocalApp.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        data: {
            type: DataTypes.TEXT,
            defaultValue: '{}',
        },
    },
    {
        sequelize,
        modelName: 'local_app',
        timestamps: false,
    }
);

export default LocalApp;
