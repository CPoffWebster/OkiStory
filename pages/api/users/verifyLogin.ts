// import { verifyUserLogin } from '@/services/users';
// import { NextApiRequest, NextApiResponse } from 'next'

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     let { email, password } = req.body;
//     const user = await verifyUserLogin(email, password);
//     if (user)
//         return res.status(200).json(true);
//     else
//         return res.status(200).json(false);
// }