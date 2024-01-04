import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const command = `pg_dumpall -d '${process.env.DIRECT_URL}' -f backup.sql`;

exec(command, (err, stdout, _) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(stdout);
});
