 
 import { Server } from "socket.io";
 let io;
  const initiliseIo =(server)=>{
    io = new Server(server,{
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true,
          },
    })
    return io;
  }

  const getIo = ()=>{
    if (!io) throw new Error("Socket.io not initialized yet!");
  return io;
  }

  export {initiliseIo,getIo}