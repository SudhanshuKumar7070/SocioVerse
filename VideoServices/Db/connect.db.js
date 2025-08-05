import mongoose from 'mongoose'
const dbUri = process.env.DB_URI|| "mongodb+srv://skChatApp:QX9Y4yWZPMSsO4uC@cluster0.m3kdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
export const connectDb =async()=>{
    const response = await mongoose.connect(dbUri);
    if(response){
        console.log('✅  db connected successFully');
       
        
    }
}