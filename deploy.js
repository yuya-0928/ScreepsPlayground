require('dotenv').config();
const fs = require('fs');
const { SCREEPS_LOCAL_PATH } = process.env;

const path = './src/';
const screepLocalPath = SCREEPS_LOCAL_PATH;

fs.readdir(path, (err, files) => {
  if (err) {
    console.error("Could not list the directory.", err);
    return;
  }

  for (let index = 0; index < files.length - 1; index++) {
    const element = files[index];
    fs.copyFileSync(path + element, screepLocalPath + '/' + element);
  }
});