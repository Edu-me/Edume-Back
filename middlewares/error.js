module.exports= (error,req,res,next)=>{
    console.log(error.message)
    res.status(500).send('Internal server error. Something failed')
}