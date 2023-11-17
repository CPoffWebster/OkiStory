import { getServerAuthSession } from '@/pages/api/auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { serializeTableObject } from '../modelSerialize';
import { PaidAccounts, PaidAccountsAttributes } from './PaidAccounts';

export interface UsersAttributes {
    id?: number;
    Email: string;
    LastLogin?: Date;
    Password?: string;
    Provider?: string;
    UserName?: string;
    ProviderAccountId?: string;
    VerifiedEmail?: boolean;
    Language?: string;

    // Not in database
    session?: Session;
    paidAccount?: PaidAccountsAttributes;
}

export class Users extends Model<UsersAttributes> {

    // create user
    static async createUser(create: UsersAttributes) {
        const userInstance = await Users.create(create);
        const user: UsersAttributes = userInstance ? serializeTableObject(userInstance) : null;
        return user;
    }

    // update user
    static async updateUser(user: UsersAttributes) {
        await Users.update(
            user,
            {
                where: {
                    id: user.id
                }
            }
        );
    }

    // get user by email
    static async getUserByEmail(email: string) {
        const userInstance = await Users.findOne({
            where: {
                Email: email
            }
        });
        const user: UsersAttributes = userInstance ? serializeTableObject(userInstance) : null;
        return user;
    }

    static async getUserBySession(req: NextApiRequest, res: NextApiResponse) {
        const session = await getServerAuthSession(req, res);
        if (!session) return null;
        const user = await Users.findOne({
            where: {
                Email: session!.user.email!
            }
        });
        const userData: UsersAttributes = user ? serializeTableObject(user) : null;
        const paidAccount = await PaidAccounts.getPaidAccountByUserID(userData.id!);
        userData.session = session!
        userData.paidAccount = paidAccount;
        return userData;
    }
}

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
        Language: { type: DataTypes.STRING(255), allowNull: true },
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
