import { Client, Databases, Storage, ID } from "appwrite";
// import dotenv from "dotenv";

// dotenv.config();

export class AppwriteServices {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject("677037500024a5135fda");
      // .setProject(process.env.PROJECT_ID);
    this.databases = new Databases(this.client);
  }

  // Method to create a chat message
  createChat = async ({
    chatId,
    senderId,
    receiverId,
    content,
  }) => {
    const messageId = ID.unique(); // Generate unique messageId
    const status = "sent"; // Hardcoded status for now
    const timestamps = new Date().toISOString(); // Current timestamp
    const id = ID.unique(); // Generate unique ID for the document

    return await this.databases.createDocument(
      process.env.DATABASE_ID,
      process.env.MESSAGES_COLLECTION_ID,
      id,
      {
        messageId,
        chatId,
        senderId,
        receiverId,
        content,
        status,
        timestamps,
      }
    );
  };

  createUserDocument = async({
    userName,
    email,
    password,
    profilePicture,
    
   })=>{
    try{
      return await this.databases.createDocument(
        process.env.DATABASE_ID,
        process.env.USER_COLLECTION_ID,
        
        {
        userName,
        email,
        password,
        profilePicture,
        ID
      })
    }
    catch(error){
      console.log('error occured at creauing user document', error);
      
    }
   }
}

// method to create user



// Method to delete Chat

// Method to update Chat

// Method to  create chatRooms or Groups 

// Method to DeleteChat Room


const userServices = new AppwriteServices();
export default userServices;
