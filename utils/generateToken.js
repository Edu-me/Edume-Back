const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports  = function (tokenData,privateKey) {
    return  function () {
       return jwt.sign(tokenData,privateKey);
    }
}