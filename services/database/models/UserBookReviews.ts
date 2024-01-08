import { DataTypes, Model, Op, Sequelize, Transaction } from 'sequelize';

export interface UserBookReviewsAttributes {
    id?: number;
    bookId: number;
    userId: number;
    rating: number;
    previousRating?: number;
    review?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class UserBookReviews extends Model<UserBookReviewsAttributes> { }

export function initUserBookReviews(sequelize: Sequelize) {
    UserBookReviews.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        bookId: { type: DataTypes.INTEGER, allowNull: false },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        rating: { type: DataTypes.INTEGER, allowNull: false },
        previousRating: { type: DataTypes.INTEGER, allowNull: false },
        review: { type: DataTypes.STRING(255), allowNull: false }
    }, {
        sequelize, modelName: 'books', tableName: `books`,
        timestamps: true
    });

    return UserBookReviews;
}