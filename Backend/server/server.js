import { createServer } from "node:http";
import { initiliseGlobalNameSpace } from "./globalNameSpace.js";
import { subscriber,publisher } from "./redis.server.js";
import { Conversation } from "../Models/conversation.model.js";
import { Message } from "../Models/message.model.js";
// import { Server } from "socket.io";
// import { client } from "../DataBase/Redis/Redis.Config.js";
import { initiliseIo } from "./io.js";
import { app } from "./app.js";
import { ApiError } from "../Utils/ApiError.js";
import mongoose from "mongoose";
import { Notification } from "../Models/notification.model.js";
import { User } from "../Models/user.model.js";



const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
  
//     credentials: true,
//   },
// });

const io = initiliseIo(server);
//  const userToSocketMap = new Map();  // here we can store user to socket map to get realtime users
// const SocketToUser = new Map();

// establishing global socket........................ .........................
  let globalNamespace = initiliseGlobalNameSpace(io);

 // this is for handling global events like friend request, notifications etc.
 // here we can store user to socket map to get realtime users

//  export {globalNamespace , io}
// subscriber.on("message",(channel,message)=>{
//   if(channel !== "friend_request_channel") return;
//   const response = JSON.parse(message)
//   console.log('data get of subscriber', response);
  
 
//  const receiverId = response?.data?.receiverId;
 
//  const requiredSocketId = userToSocketMap.get(receiverId);
//    if(!requiredSocketId) {
//     console.log("user not connected to global namespace");
//     return;
//   }
//  globalNamespace.to(requiredSocketId).emit("friendRequest", {
//     senderId:response.data.senderId,
//     message: "You have a new friend request",
//   });
// })
 
// subscriber.on("message",(channel, message)=>{
//   console.log('message::::',message);
  
//  if ( channel === "chat_Notification_channel" ){
//   const channelData = JSON.parse(message);
//    console.log('got channel data for chatting  notification,:',channelData);
//     const notificationReceiverId = channelData?.data?.receiverId;
//      const reqSocketId = userToSocketMap.get(notificationReceiverId);
//      if(!reqSocketId) {
//       console.log("user not connected to global namespace");
//       return;
//     }
    
//     globalNamespace.to(reqSocketId).emit("newChatNotification", {
//       senderId:channelData?.data?.senderId,
//       message: "You have a new notification",
//       textMessage: channelData?.data?.textMessage
//     });
   
//  }
//  else{
//   return;
//  }
// })


// global socket ends..........................................................




//  subscriber.subscribe("friend_request_channel"); // cant use redis pubsub here , we can use it effectively ,
//  when we have multiple instances of node js , or 
// when we more than one server 


 
  const chatNamespace = io.of("/chat") // this if for handlling chatting area or feature of app.
  chatNamespace.on("connection", (socket) => {
  // console.log("io connection setup sucessfully with:", socket.id, query);
    //  globalNamespace.emit("FollowRequest",{data:"dekho yaha kaam karta  hai ya nahi.."})
  socket.on("startChat", async (data) => {
    const { receiverId, senderId } = data;
    console.log(
      " data received frontend ::> receiver:",
      receiverId,
      "sender:",
      senderId
    );
   if([receiverId,senderId].some((element)=>element.trim()==="")) throw new ApiError(404,"required credentials are not available at the moment")

    try {
      
      let conversation = await Conversation.findOne({
        participants: {
          $all: [new mongoose.Types.ObjectId(senderId), 
            new mongoose.Types.ObjectId(receiverId)],
        },
      });
      console.log("conversation created ::", conversation);
   
      if (!conversation) {
         conversation = await Conversation.create({
          participants: [senderId, receiverId],
          isGroup: false,
        });
       if(!conversation) throw new ApiError(404,"conversation not created at the moment");
      }
      const conversationRoom =  `chat_${conversation?._id}`;
      console.log("conversation room created ::", conversationRoom);
      socket.join(conversationRoom);

      socket.emit("conversationStarted", {
        conversationId: conversation?._id,
        room: conversationRoom,
      });
    } catch (err) {
      console.log("error occured at socket server", err);
    }
  });

  socket.on("sendMessage", async (data) => {
    const { conversationID, senderId, textMessage, receiverId } = data;
    if (!conversationID || !senderId || !receiverId || !textMessage) {
      throw new ApiError(400, "Missing required message details");
    }
    
    console.log('data after conversattion started ::>',conversationID, senderId, textMessage, receiverId );
    
    try {
      const message =await Message.create({
        conversationId: conversationID,  
        sender: senderId,
        receiver: receiverId,
        text: textMessage,
        status: "delivered",
      });
      // publish a notification to the client at other side
      //  const publishData = await publisher.connect();
      //  if(!publishData) {
      //   console.log('error in connecting publisher at send message',publishData);
        
      //  }
      publisher.publish("chat_Notification_channel",JSON.stringify({data: message}));

      // checking output of message array.
      console.log("message result :", message);

      
      // Update conversation's last message
      await Conversation.findByIdAndUpdate(conversationID, {
        $set: {
          lastMessage: {
            messageId: message._id,
            message: textMessage,
            timestamp: new Date(),
          }
        }
      }, { new: true });
      // broadcast message to conversation room
      // publisher.publish(receiverId,{message:"message from redis"})
      // creting a notification
        const notification = await Notification.create({
         content:textMessage,
         
         sender: senderId,
         receiver: receiverId,
        service:"chatMessage",
        conversationId:conversationID
       })
       if(!notification) throw new ApiError(500,"unable to generate notification at moment");
       const senderDetail = await User.findById(senderId).select("profilePicture userName ");
       if(!senderDetail) throw new ApiError(500,"something went wrong in fiding details at moment");
       
          // const reqSocketId = userToSocketMap.get(receiverId);
          // console.log('hebflaj',userToSocketMap);
           
          // console.log('reqSocketData:', reqSocketId);
          // search for socketId of online users and send notification to them 
          // if  (reqSocketId) {
          //   globalNamespace.to(reqSocketId).emit("newNotification",{notification: notification})
          // tried new approach 
        globalNamespace.to(receiverId).emit("newChatNotfication",{message:notification, sender:senderDetail})
      chatNamespace.to(`chat_${conversationID}`).emit("newMessage", {
        messageId: message._id,
        conversationID:conversationID,
        senderId:senderId,
        receiverId:receiverId,
        text: textMessage,
        timestamp: message.createdAt,
      });
    } catch (error) {
      console.log("error occured at sendMessage socket", error);
    }
  });
});




export { server };
