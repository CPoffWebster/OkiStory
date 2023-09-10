// import * as bcrypt from 'bcrypt';
import { connectToDb } from './database/database';


export async function saveUser(user: string, pwd: string, admin: boolean = false) {
    const db = connectToDb();
    const saltRounds = 10;
    // const hash = bcrypt.hashSync(pwd, saltRounds);
    const hash = pwd;

    // let exists = await db.tables.Users.findOne({ where: { email: user } });

    // console.log('a', exists);

    // if (exists === null) {
    //     exists = await db.tables.Users.create({ email: user, hash: hash, isAdmin: admin });
    //     console.log("inserted " + user);
    // } else {
    //     db.tables.Users.update(
    //         { isAdmin: admin },
    //         {
    //             returning: true,
    //             where: { email: user }
    //         })
    //     console.log(`${user} updated.`);
    // }

    // return exists;

}