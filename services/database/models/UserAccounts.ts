import { DataTypes, Model, Sequelize } from 'sequelize';

export class UserAccounts extends Model { }

export function initUserAccounts(sequelize: Sequelize) {
    UserAccounts.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        UserID: { type: DataTypes.INTEGER },
        AccountID: { type: DataTypes.INTEGER },
        Role: { type: DataTypes.STRING(128), defaultValue: 'User' },
        AccountName: { type: DataTypes.STRING(255) },
        DefaultAccount: { type: DataTypes.BOOLEAN },
    }, {
        sequelize, modelName: 'user_accounts', tableName: `user_accounts`,
        timestamps: true,
    });

    return UserAccounts;
}
