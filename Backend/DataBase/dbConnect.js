import mongoose from 'mongoose'
  export  const ConnectDb = async()=>{
    try{
          await mongoose.connect(process.env.DB_URI)
     console.log('data base connected sucessfully !');
     
    }
    catch(err){
console.log('error in connecting data base:',err);

    }
    
  }