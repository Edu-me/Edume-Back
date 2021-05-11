const {Tutor} = require('../../models/tutor')

exports.getTutors = async(req,res)=>{
    let tutors  = await Tutor.find();
    return res.send(tutors);
}

exports.deleteTutor = async(req,res)=>{
    const tutor= await Tutor.findOneAndDelete({id:req.body.id})
    if (tutor)
    return res.status(200).send("this tutor is deleted");
    else
    return res.status(404).send("this tutor doesn't exist");

}