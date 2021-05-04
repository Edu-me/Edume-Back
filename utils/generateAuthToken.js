const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports  = function (tokenData) {
    return jwt.sign(tokenData, process.env.JWT_PRIVATE_KEY);
}