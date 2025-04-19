const fs = require("fs");

const entities = {};
const files = fs.readdirSync("./Entities");

// Read all files from the ./Util directory and add their exports to an object that can be accessed globally
for (let fileName of files) {
    if (fileName === "Entity.js") continue;
    const data = require(`./Entities/${fileName}`);
    entities[fileName.substring(0, fileName.length - 3)] = data;
}

module.exports = entities;