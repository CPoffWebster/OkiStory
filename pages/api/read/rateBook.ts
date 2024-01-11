import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from "@/utils/withAuth";
import { Users } from '@/services/database/models/Users';
import { UserBookReviews } from '@/services/database/models/UserBookReviews';
import { connectToDb } from '@/services/database/database';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const { bookGuid, rating } = req.body;
    console.info(`api/read/rateBook API Route Triggered; bookGuid: ${bookGuid}, rating: ${rating}`);

    const db = connectToDb();
    const transaction = await db.transaction();
    const user = await Users.getUserBySession(req, res);

    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    // Assuming `rating` is already defined and is a number
    try {
        let updatedRating = await UserBookReviews.createOrUpdateUserBookReview(bookGuid, user.id!, rating, transaction);
        await transaction.commit();
        res.status(200).json({ rating: updatedRating });
    } catch (error) {
        await transaction.rollback();
        console.error(`Error in api/read/rateBook API Route Triggered; bookGuid: ${bookGuid}, rating: ${rating}, err: ${JSON.stringify(error)}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }

};

export default withAuth(handler);