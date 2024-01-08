import { DataTypes, Model, Op, Sequelize, Transaction } from 'sequelize';

export interface UserBookReadsAttributes {
    id?: number;
    bookId: number;
    userId: number;
    pagesTurnedForward: number;
    pagesTurnedBackward: number;
    readEntireBook: boolean;
    lastPageRead: number;
    ratingChanged: boolean;
    timeSpentReading: number;
}

export class UserBookReads extends Model<UserBookReadsAttributes> { }

export function initUserBookReads(sequelize: Sequelize) {
    UserBookReads.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        bookId: { type: DataTypes.INTEGER, allowNull: false },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        pagesTurnedForward: { type: DataTypes.INTEGER, allowNull: false },
        pagesTurnedBackward: { type: DataTypes.INTEGER, allowNull: false },
        readEntireBook: { type: DataTypes.BOOLEAN, allowNull: false },
        lastPageRead: { type: DataTypes.INTEGER, allowNull: false },
        ratingChanged: { type: DataTypes.BOOLEAN, allowNull: false },
        timeSpentReading: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        sequelize, modelName: 'books', tableName: `books`,
        timestamps: true
    });

    return UserBookReads;
}