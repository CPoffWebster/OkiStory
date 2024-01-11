import { DataTypes, Model, Op, Sequelize, Transaction } from 'sequelize';
import { serializeTableObject } from '../modelSerialize';

export interface UserBookReviewsAttributes {
    id?: number;
    BookGUID: string;
    UserId: number;
    Rating: number;
    PreviousRating?: number;
    Review?: string;
}

export class UserBookReviews extends Model<UserBookReviewsAttributes> {
    static async getUserBookReview(guid: string, userId: number, transaction?: Transaction) {
        const review = await UserBookReviews.findOne({ where: { BookGUID: guid, UserId: userId }, transaction });
        return review ? serializeTableObject(review) : null;
    }

    /**
     * Create a new review or update an existing one
     * @param guid 
     * @param userId 
     * @param rating 
     * @param transaction 
     */
    static async createOrUpdateUserBookReview(guid: string, userId: number, rating: number, transaction?: Transaction) {
        // Check if the review already exists
        const review = await UserBookReviews.findOne({
            where: { BookGUID: guid, UserId: userId },
            transaction
        });
        const existingReview = review ? serializeTableObject(review) : null;

        if (existingReview) {
            // If review exists, update the PreviousRating and the current Rating
            await UserBookReviews.update(
                { PreviousRating: existingReview.Rating, Rating: rating },
                { where: { BookGUID: guid, UserId: userId }, transaction }
            );
        } else {
            // If no review exists, create a new one with PreviousRating as null
            await UserBookReviews.create(
                { BookGUID: guid, UserId: userId, Rating: rating },
                { transaction }
            );
        }
    }
}

export function initUserBookReviews(sequelize: Sequelize) {
    UserBookReviews.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        BookGUID: { type: DataTypes.STRING(255), allowNull: false },
        UserId: { type: DataTypes.INTEGER, allowNull: false },
        Rating: { type: DataTypes.INTEGER, allowNull: false },
        PreviousRating: { type: DataTypes.INTEGER, allowNull: true },
        Review: { type: DataTypes.STRING(255), allowNull: true }
    }, {
        sequelize, modelName: 'user_book_reviews', tableName: `user_book_reviews`,
        timestamps: true
    });

    return UserBookReviews;
}