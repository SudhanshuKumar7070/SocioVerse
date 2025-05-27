import io from "socket.io-client";

export const connectServer = () => {
  const socket = io("http://localhost:3000",{
    query:{
      message:"message from skUser"
    }
  });

  socket.on("connect", () => {
    console.log("Frontend connected to backend");
  });

  return socket; // Return the socket instance for further use
};
