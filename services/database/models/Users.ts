import { DataTypes, Model, Sequelize } from 'sequelize';

export interface UsersAttributes {
    id?: number;
    Email: string;
    Password: string;
    LastLogin?: Date;
}

export class Users extends Model<UsersAttributes> { }

export function initUsers(sequelize: Sequelize) {
    Users.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
        Password: { type: DataTypes.STRING(255), allowNull: false },
        LastLogin: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    }, {
        sequelize, modelName: 'users', tableName: `users`,
        timestamps: true,
        paranoid: true,
        indexes: [
            { type: 'UNIQUE', fields: ['Email'] }
        ]
    });

    return Users;
}
