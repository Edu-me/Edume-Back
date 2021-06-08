const jwt = require('jsonwebtoken');
const axios = require ('axios')
require('dotenv').config()
// const Meeting = require('google-meet-api').meet;

// Meeting({
// clientId : '194634930451-be2650e6ans1fpdckvlqnc4jmhucpmn7.apps.googleusercontent.com',
// clientSecret : '0XDUdbY4gfM8F6ywSXpAQr3P',
// //refreshToken : 'XXXXXXXXXCNfW2MMGvJUSk4V7LplXAXXXX',
// ApiKey:'AIzaSyCawXDpR5Ns5kc6c-v8A9j2nw6vGiOnikQ',
// date : "2021-12-01",
// time : "10:59",
// summary : 'summary',
// location : 'location',
// description : 'description'
// }).then(function(result){
// console.log(result);//result it the final link
// }).catch((err)=>{
//     console.log(err)
// })

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
{headers:{
"authorization":   `Bearer ${token}`,
"Content-Type" : "application/json"
}}
).then((response)=>{
console.log(response.data)
}).catch((error)=>{
console.log(error.message)
})

return token