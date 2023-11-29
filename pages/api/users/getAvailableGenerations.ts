import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDb } from '@/services/database/database';
import { withBaseURL } from '@/utils/withBaseURL';
import { Users } from '@/services/database/models/Users';
import { PaidAccounts } from '@/services/database/models/PaidAccounts';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('users/getAvailableGenerations API Route Triggered');


    try {
        connectToDb();
        const user = await Users.getUserBySession(req, res);
        if (!user) {
            res.status(200);
        } else {
            const paidAccount = await PaidAccounts.getPaidAccountByUserID(user.id!);
            res.status(200).json({ paidAccount });
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }

};

export default withBaseURL(handler);