const fs = require("fs");

const functions = {};
const files = fs.readdirSync("./Util");

// Read all files from the ./Util directory and add their exports to an object that can be accessed globally
for (let fileName of files) {
    const data = require(`./Util/${fileName}`);
    functions[fileName.substring(0, fileName.length - 3)] = data;
}

module.exports = functions;