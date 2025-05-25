const fs = require("fs");

const functions = {};
const files = fs.readdirSync("./Network/Rpcs");

// Read all files from the ./Rpcs directory and add their exports to an object that can be accessed globally
for (let fileName of files) {
    const data = require(`./Rpcs/${fileName}`);
    functions[fileName.substring(0, fileName.length - 3)] = data;
}

module.exports = functions;