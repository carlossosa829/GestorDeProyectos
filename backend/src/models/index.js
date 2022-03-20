const path = require("path");
const fs = require("fs");

const filebasename = path.basename(__filename);
const db = {};

//EXTRACTING ALL MODELS
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== filebasename &&
      file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
  });

//ASSOCIATING MODELS
Object.keys(db).forEach((model) => {
  if (db[model].associate) {
    db[model].associate(db);
  }
});

module.exports = db;
