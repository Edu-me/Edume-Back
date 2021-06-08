const jwt = require('jsonwebtoken');
const axios = require ('axios')
require('dotenv').config()
module.exports = ()=>{
    let expDate = parseInt(Date.now()/1000)+100000
    let token = jwt.sign({ aud: null, iss: process.env.ZOOM_API_KEY, exp: expDate }, process.env.ZOOM_API_SECRET);
    console.log(token)
    const decoded = jwt.verify(token, process.env.ZOOM_API_SECRET);
    console.log(decoded)
    axios.post('https://api.zoom.us/v2/users/mohamed.samy99@hotmail.com/meetings',{
        "topic": "Edume Meeting",
        "type": 2,
        "start_time":"2021-06-09T12:02:00",
        "timezone":"EG",
        "duration":120,
        "settings": {
            "join_before_host" : true
        }
  },
  )

    return token
}
