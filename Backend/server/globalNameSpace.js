
 
 let globalNamespace;
 const userToSocketMap = new Map();
  const initiliseGlobalNameSpace = (io)=>{
 globalNamespace = io.of("/global");
    
    globalNamespace.on("connection", async (socket) => {
        
        console.log("connected to global namespace", socket.id);
        socket.on("connectionEstablished", (data) => {
          const { userId } = data;
          socket.join(userId);
          console.log("user connected to global namespace and brings userId:", userId);
           if (!userId) {
            console.log("userId not available at the moment");
            return;
          }
          userToSocketMap.set(userId, socket.id); // storing user to socket map
         
      
        });
       
        socket.on("disconnect", () => {
          console.log("user disconnected from global namespace", socket.id);
       
        // if user is disconnected from global namespace then we need to remove the user from userToSocketMap
        for (const [userId, sockId] of userToSocketMap.entries()) {
          if (sockId === socket.id) {
            userToSocketMap.delete(userId);
            break;
          }
        }
      });
      });
      return globalNamespace
  }
 
  const getGlobalNamespace = ()=>{
        return globalNamespace;
  }


  export{
    initiliseGlobalNameSpace,
    getGlobalNamespace,
    userToSocketMap
  }