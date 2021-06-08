const jwt = require('jsonwebtoken');
require('dotenv').config()
console.log(parseInt(Date.now()/1000))
let token = jwt.sign({ aud: null, iss: process.env.ZOOM_API_KEY, exp: 1623766812 }, process.env.ZOOM_API_SECRET);
console.log(token)
const decoded = jwt.verify(token, process.env.ZOOM_API_SECRET);
console.log(decoded)