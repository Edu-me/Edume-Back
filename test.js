const Meeting = require('google-meet-api').meet;

Meeting({
clientId : '194634930451-be2650e6ans1fpdckvlqnc4jmhucpmn7.apps.googleusercontent.com',
clientSecret : '0XDUdbY4gfM8F6ywSXpAQr3P',
//refreshToken : 'XXXXXXXXXCNfW2MMGvJUSk4V7LplXAXXXX',
ApiKey:'AIzaSyCawXDpR5Ns5kc6c-v8A9j2nw6vGiOnikQ',
date : "2021-12-01",
time : "10:59",
summary : 'summary',
location : 'location',
description : 'description'
}).then(function(result){
console.log(result);//result it the final link
}).catch((err)=>{
    console.log(err)
})