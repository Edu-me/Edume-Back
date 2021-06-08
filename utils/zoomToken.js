const jwt = require('jsonwebtoken');
const axios = require ('axios')
require('dotenv').config()
module.exports = ()=>{
    let expDate = parseInt(Date.now()/1000)+100000
    let token = jwt.sign({ aud: null, iss: process.env.ZOOM_API_KEY, exp: expDate }, process.env.ZOOM_API_SECRET);
    // console.log(token)
    // const decoded = jwt.verify(token, process.env.ZOOM_API_SECRET);
    // console.log(decoded)
    return token
}
