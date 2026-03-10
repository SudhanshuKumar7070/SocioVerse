import dotenv from "dotenv";
dotenv.config({
     path:"../.env"
  })
import { server} from "./server.js"
import { ConnectDb } from "../DataBase/dbConnect.js";
import { inAppNotificationWorker } from "../Config/Notification/inAppNotification.config.js";
import { PushNotificationWorker } from "../Config/Notification/PushNotification.config.js"

const port = process.env.PORT || 3000
  
 
ConnectDb().then(()=>{
    server.listen(port,()=>{
        console.log('app is listening at port',port);
        
    })
})
.catch((err)=>{
  console.log(' database connection error :', err);
  
})

