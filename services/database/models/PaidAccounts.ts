import { DataTypes, Model, Sequelize } from 'sequelize';
import { serializeTableObject } from '../modelSerialize';

export interface PaidAccountsAttributes {
    id?: number;
    UserID: number;
    SubscriptionType: string;
    AmountOfGenerations?: number;
    SubscriptionStartDate?: Date;
    ExpiryDate?: Date;
}

export class PaidAccounts extends Model<PaidAccountsAttributes> {
    static async createPaidAccount(create: PaidAccountsAttributes) {
        const paidAccountInstance = await PaidAccounts.create(create);
        const paidAccount: PaidAccountsAttributes = paidAccountInstance ? serializeTableObject(paidAccountInstance) : null;
        return paidAccount;
    }

    static async updatePaidAccount(paidAccount: PaidAccountsAttributes) {
        await PaidAccounts.update(
            paidAccount,
            {
                where: {
                    id: paidAccount.id
                }
            }
        );
    }

    static async getPaidAccountByUserID(userID: number) {
        const paidAccountInstance = await PaidAccounts.findOne({
            where: {
                UserID: userID
            }
        });
        const paidAccount: PaidAccountsAttributes = paidAccountInstance ? serializeTableObject(paidAccountInstance) : null;
        return paidAccount;
    }
}

export function initPaidAccounts(sequelize: Sequelize) {
    PaidAccounts.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        UserID: { type: DataTypes.INTEGER, unique: true, allowNull: false },
        SubscriptionType: { type: DataTypes.STRING(128), defaultValue: 'Free' },
        AmountOfGenerations: { type: DataTypes.INTEGER, allowNull: true },
        SubscriptionStartDate: { type: DataTypes.DATE, allowNull: true },
        ExpiryDate: { type: DataTypes.DATE, allowNull: true }
    }, {
        sequelize, modelName: 'paid_accounts', tableName: `paid_accounts`,
        timestamps: true,
        paranoid: true,
    });

    return PaidAccounts;
}
