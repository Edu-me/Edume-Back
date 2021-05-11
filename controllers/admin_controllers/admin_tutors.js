const {Tutor} = require('../../models/tutor')
const _ = require('lodash');


exports.getTutors = async(req,res)=>{
    let tutors  = await Tutor.find().select({password:0,__v:0});
    return res.send(tutors);
}

exports.deleteTutor = async(req,res)=>{
    const tutor= await Tutor.findOneAndDelete({_id:req.params.id})
    if (tutor)
    return res.status(200).send("this tutor is deleted");
    else
    return res.status(404).send("this tutor doesn't exist");

}