const mongoose = require('mongoose');
const {Admin}=require ('../models/admin')
errorDebugger = require('debug')('error')
const passwordHashing = require('./passwordHashing')

module.exports = async function (email,password,name){
 let admin= await Admin.findOne({email:email})
 if(admin){
  console.log("This email is registered before as an admin")
  return;
 }
 else{
     admin= new Admin()
     admin.password = await passwordHashing(password)
     admin.name=name
     admin.email= email
     await admin.save()
 }
}