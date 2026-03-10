import mongoose from 'mongoose'
const dbUri = process.env.DB_URI|| "mongodb://skChatApp:QX9Y4yWZPMSsO4uC@cluster0-shard-00-00.m3kdj.mongodb.net:27017,cluster0-shard-00-01.m3kdj.mongodb.net:27017,cluster0-shard-00-02.m3kdj.mongodb.net:27017/?ssl=true&replicaSet=atlas-ofdmhm-shard-0&authSource=admin&retryWrites=true&w=majority";
export const connectDb =async()=>{
    const response = await mongoose.connect(dbUri);
    if(response){
        console.log('✅  db connected successFully');
       
        
    }
}