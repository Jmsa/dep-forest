// Custom library with nested dependencies
const mathOperations = require('./mathOperations');
module.exports = {
    calculate(a, b) {
        return mathOperations.add(a, b) - mathOperations.multiply(a, b);
    },
};
