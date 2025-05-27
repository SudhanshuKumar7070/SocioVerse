// import { Client, Account, ID } from "appwrite";

// export class appwriteUsers {
//     client = new Client();
//     account;

//   constructor() {
//     this.account = new Account(this.client);
//     this.client
//       .setEndpoint("https://cloud.appwrite.io/v1")
//       .setProject("677037500024a5135fda");
//       // .setProject(process.env.PROJECT_ID);
//   }
//   createAccount = async () => {
//     try {
//       return await this.client.create({
//         ID,
//         userName,
//         email,
//         password,
//         profilePicture
//       });
//     } catch (error) {
//       console.log("error in creating account:", error);
//     }
//   };

//   loginUser = async () => {
//     try {
//       return await this.client.createEmailPasswordSession({
//         email,
//         password,
//       });
//     } catch (err) {
//       console.log("gettting error while login account", err);
//     }
//   };
//   getCurrentUser =async()=>{
//     try{
//         return await this.account.get();
//     }
//     catch(error){
//         console.log('error occuring at getting current user:',error);
        
//     }
//   };
//   logoutUser= async()=>{
//       try{
//       return await  this.account.deleteSession({
//         sessionId
//       })
//       }
//       catch(error){
//         console.log('getting error in deleting:',error);
        
//       }
//   }
 

// }
// const appwriteAuth = new appwriteUsers();
// export default appwriteAuth ;

function ContactList() {
  const socket = useSocket();
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleCreateChat = (contact) => {
    socket.emit("startChat", {
      receiverId: contact._id, 
      senderId: currentUserId
    });
  };

  useEffect(() => {
    if (!socket) return;

    // Listen for conversation start
    socket.on('conversationStarted', (data) => {
      setCurrentConversation(data.conversationId);
    });

    // Listen for new messages
    socket.on('newMessage', (messageData) => {
      setMessages(prevMessages => [...prevMessages, messageData]);
    });

    return () => {
      socket.off('conversationStarted');
      socket.off('newMessage');
    };
  }, [socket]);

  const sendMessage = (message) => {
    if (!currentConversation) return;

    socket.emit('sendMessage', {
      conversationId: currentConversation,
      senderId: currentUserId,
      receiverId: selectedContactId,
      textMessage: message
    });
  };
}