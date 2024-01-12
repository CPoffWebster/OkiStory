import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from "@/utils/withAuth";
import { Users } from '@/services/database/models/Users';
import { connectToDb } from '@/services/database/database';
import { UserBookReads, UserBookReadsAttributes } from '@/services/database/models/UserBookReads';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const userBookRead: UserBookReadsAttributes = JSON.parse(req.body);
    console.info(`api/read/readingSession API Route Triggered; userBookRead: ${JSON.stringify(userBookRead)}`);

    const db = connectToDb();
    const transaction = await db.transaction();
    const user = await Users.getUserBySession(req, res);
    const userID = user ? user.id : null;

    try {
        userBookRead.UserId = userID!;
        let updatedRating = await UserBookReads.createUserBookRead(userBookRead, transaction);
        await transaction.commit();
        res.status(200).json({ rating: updatedRating });
    } catch (error) {
        await transaction.rollback();
        console.error(`Error in api/read/readingSession API Route Triggered; bookGuid: ${JSON.stringify(userBookRead)}, err: ${JSON.stringify(error)}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default withAuth(handler);