
import { server} from "./server.js";
import { ConnectDb } from "../DataBase/dbConnect.js";
import dotenv from "dotenv";

const port = process.env.PORT || 3000
  dotenv.config({
     path:"../.env"
  })
 
ConnectDb().then(()=>{
    server.listen(port,()=>{
        console.log('app is listening at port',port);
        
    })
})
.catch((err)=>{
  console.log(' database connection error :', err);
  
})

