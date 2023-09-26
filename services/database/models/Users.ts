import { DataTypes, Model, Sequelize } from 'sequelize';

export interface UsersAttributes {
    id?: number;
    Email: string;
    LastLogin?: Date;
    Password: string;
    Provider: string;
    UserName: string;
    ProviderAccountId: string;
    VerifiedEmail: boolean;
}

export class Users extends Model<UsersAttributes> { }

export function initUsers(sequelize: Sequelize) {
    Users.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
        LastLogin: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        Password: { type: DataTypes.STRING(255), allowNull: true },
        Provider: { type: DataTypes.STRING(255), allowNull: true },
        UserName: { type: DataTypes.STRING(255), allowNull: true },
        ProviderAccountId: { type: DataTypes.STRING(255), allowNull: true },
        VerifiedEmail: { type: DataTypes.BOOLEAN, defaultValue: false },
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
