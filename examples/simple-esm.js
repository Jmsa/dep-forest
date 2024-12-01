// Imports two core Node.js modules that have no dependencies
import fs from "fs";
import path from "path";

// Custom module with no dependencies
import myUtility from "./simpleUtility";

// Using the imported modules
console.log(fs.readdirSync("."));
console.log(path.resolve("."));
myUtility();
