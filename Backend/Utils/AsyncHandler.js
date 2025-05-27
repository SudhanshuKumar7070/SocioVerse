const AsyncHandler= (fn)=>async(req,res,next)=>{
   try{
     return await fn(req,res,next);
   }
   catch(err){
    return res.status(500).json({
        sucess:false,
        message:err.message
    })
   }
}
export {AsyncHandler}