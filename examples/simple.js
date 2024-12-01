// Imports two core Node.js modules that have no dependencies
const fs = require("fs");
const path = require("path");

// Custom module with no dependencies
const myUtility = require("./simpleUtility");

// Using the imported modules
console.log(fs.readdirSync("."));
console.log(path.resolve("."));
myUtility();
