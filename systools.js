const fs = require('fs');

/**
 * Saves an error or other to a file in ../logs/
 * @param {String} type type of error (LOGIN, CREATE_USER, MESSAGE etc)
 * @param {String} err error message to log
 */
function saveLogs(type, err) {
  const log = {
    date: new Date(Date.now()),
    error: err
  }
  const path = process.env.LOG_PATH+type.toUpperCase()+"_"+log.date.toString().replace(/ /g, "-")+".json"
  fs.writeFile(path, JSON.stringify(log), (err) => {
    if (err) throw err;
    console.log('log saved');
  });
}

module.exports = {saveLogs}