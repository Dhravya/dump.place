// CREATE A SCRIPT TO RESTORE THE DATABASE using backup.sql

// Path: scripts/restore.js

import { exec } from 'child_process';

const command = `psql -d postgres -f backup.sql`;

exec(command, (err, stdout, _) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});
