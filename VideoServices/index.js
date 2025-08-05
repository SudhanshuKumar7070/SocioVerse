import express from "express";
import { createBucket,uploadContent } from './supabase.setup.js';
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { newFireApp } from "./firebaseDb.setup.js";
import { videoTranscoder, queueEvents } from "./queue.setup.js";
     
import { push, Database, getDatabase, ref,get } from "firebase/database";
dotenv.config();
import videoRoute from "./Router/videoUpload.route.js";
import fetchVideoRoute from "./Router/videoFetch.route.js";
import { fileURLToPath } from "url";
import { connectDb } from "./Db/connect.db.js";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// CORS setup
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., HLS .m3u8 or .ts files)
app.use("/Public", express.static("Public"));

// API routes
app.use("/api/v1", videoRoute);
app.use("/api/v1", fetchVideoRoute);
const fileData={
  name:'sk',
  message:'connection success',
   newMessage:"new connection created"
}
 const fileName="Public/test/data"
// app.get("/test/new",async(req,res)=>{
 
//   const data =await uploadContent(fileData,fileName);
//   if(!data)alert("can't upload data ")
//     console.log('data we get after uploading:',data);
    
//     res.send({data:data})
// })
// Test route
app.get("/hi", (req, res) => {
  return res.json({ data: "app is running successfully" });
});

// pushing some data to firebase database
// const addData = () => {
//   const db = getDatabase();
//   const userRef = ref(db, "checkData");
//   const response = push(userRef, {
//     name: "Sudhanshu",
//     age: 25,
//   });
//   if (response) console.log("data pushed", response);
// };
// fetching that data 
// const fetchFireData = async()=>{
//   const db = getDatabase();
//   const userRef =ref(db,"checkData")
//   try{
//      const response= await get(userRef);
//      if(response) {console.log('response of that db:',response.val()) 
//       return response
//     }
//      return "no data found"
//   }
//   catch(err){
//     console.log('error is :',err);
    
//   }
// }
// app.get("/test", (req, res) => {
//   addData();
//   res.json({ message: "data pushed successfully" });
// });
// app.get("/fetchTest", (req, res) => {
//  const someData = fetchFireData();
//   res.json({ message: "data fetched successfully" ,data:someData});
// });

connectDb().then(() => {
  app.listen(3002, () => {
    console.log("✅ App is listening at port: 3002");
  });
});
// Start server
