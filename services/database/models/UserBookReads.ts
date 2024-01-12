import { DataTypes, Model, Op, Sequelize, Transaction } from 'sequelize';

export interface UserBookReadsAttributes {
    id?: number;
    BookGUID: string;
    UserId: number | null;
    BookCreated: boolean;
    PagesTurnedForward: number;
    PagesTurnedBackward: number;
    ReadEntireBook: boolean;
    LastPageRead: number;
    StartedBookReading: Date;
    FinishedBookReading: Date;
    InitialFinishedLoading: Date;
}

export class UserBookReads extends Model<UserBookReadsAttributes> {
    static async createUserBookRead(bookRead: UserBookReadsAttributes, transaction?: Transaction) {
        await UserBookReads.create(bookRead, { transaction });
    }
}

export function initUserBookReads(sequelize: Sequelize) {
    UserBookReads.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        BookGUID: { type: DataTypes.STRING(255), allowNull: false },
        UserId: { type: DataTypes.INTEGER, allowNull: true },
        BookCreated: { type: DataTypes.BOOLEAN, allowNull: false },
        PagesTurnedForward: { type: DataTypes.INTEGER, allowNull: false },
        PagesTurnedBackward: { type: DataTypes.INTEGER, allowNull: false },
        ReadEntireBook: { type: DataTypes.BOOLEAN, allowNull: false },
        LastPageRead: { type: DataTypes.INTEGER, allowNull: false },
        StartedBookReading: { type: DataTypes.DATE, allowNull: false },
        FinishedBookReading: { type: DataTypes.DATE, allowNull: false },
        InitialFinishedLoading: { type: DataTypes.DATE, allowNull: false }
    }, {
        sequelize, modelName: 'user_book_reads', tableName: `user_book_reads`,
        timestamps: true
    });

    return UserBookReads;
}