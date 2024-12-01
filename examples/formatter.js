// Formatter with nested dependencies
const colors = require('chalk');
module.exports = {
    formatMessage(message) {
        return colors.green(`[Formatted]: ${message}`);
    },
};
