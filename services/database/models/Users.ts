import { getServerAuthSession } from '@/pages/api/auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { serializeTableObject } from '../modelSerialize';

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
}

export class Users extends Model<UsersAttributes> {
    static async getUserBySession(req: NextApiRequest, res: NextApiResponse) {
        const session = await getServerAuthSession(req, res);
        const user = await Users.findOne({
            where: {
                Email: session!.user.email!
            }
        });
        const userData: UsersAttributes = user ? serializeTableObject(user) : null;
        if (userData) userData.session = session!
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
