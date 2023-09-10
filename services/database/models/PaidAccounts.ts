import { DataTypes, Model, Sequelize } from 'sequelize';

export class PaidAccounts extends Model { }

export function initPaidAccounts(sequelize: Sequelize) {
    PaidAccounts.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        UserID: { type: DataTypes.INTEGER, allowNull: false },
        SubscriptionType: { type: DataTypes.STRING(128), defaultValue: 'Free' },
        SubscriptionStartDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        ExpiryDate: { type: DataTypes.DATE }
    }, {
        sequelize, modelName: 'paid_accounts', tableName: `paid_accounts`,
        timestamps: true,
        paranoid: true,
    });

    return PaidAccounts;
}
