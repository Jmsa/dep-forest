// Imports one core Node.js module
const path = require('path');

// Custom modules with nested dependencies
const myLibrary = require('./complexLibrary');
const formatter = require('./formatter');

// Using the imported modules
console.log(path.basename(__filename));
console.log(myLibrary.calculate(5, 3));
console.log(formatter.formatMessage('Hello, World!'));
