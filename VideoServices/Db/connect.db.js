import mongoose from 'mongoose'
const dbUri = process.env.DB_URI;
export const connectDb =async()=>{
    const response = await mongoose.connect(dbUri);
    if(response){
        console.log('✅  db connected successFully');
       
        
    }
}