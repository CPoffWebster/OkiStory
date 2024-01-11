import { DataTypes, Model, Op, Sequelize, Transaction } from 'sequelize';

export interface UserBookReadsAttributes {
    id?: number;
    BookGUID: string;
    UserId: number;
    PagesTurnedForward: number;
    PagesTurnedBackward: number;
    ReadEntireBook: boolean;
    LastPageRead: number;
    RatingChanged: boolean;
    TimeSpentReading: number;
}

export class UserBookReads extends Model<UserBookReadsAttributes> { }

export function initUserBookReads(sequelize: Sequelize) {
    UserBookReads.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        BookGUID: { type: DataTypes.STRING(255), allowNull: false },
        UserId: { type: DataTypes.INTEGER, allowNull: false },
        PagesTurnedForward: { type: DataTypes.INTEGER, allowNull: false },
        PagesTurnedBackward: { type: DataTypes.INTEGER, allowNull: false },
        ReadEntireBook: { type: DataTypes.BOOLEAN, allowNull: false },
        LastPageRead: { type: DataTypes.INTEGER, allowNull: false },
        RatingChanged: { type: DataTypes.BOOLEAN, allowNull: false },
        TimeSpentReading: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        sequelize, modelName: 'user_book_reads', tableName: `user_book_reads`,
        timestamps: true
    });

    return UserBookReads;
}