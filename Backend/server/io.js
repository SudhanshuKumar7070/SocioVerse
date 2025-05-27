 
 import { Server } from "socket.io";
 let io;
  const initiliseIo =(server)=>{
    io = new Server(server,{
        cors: {
            origin: "http://localhost:5173",
          
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