import { createSlice } from "@reduxjs/toolkit";

import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
const initialState ={
 conversationId:null,
 senderId:null,
 receiverId:null,
 text:null,
 status:null,
 currentRoom:null,
}
 export const conversationSlice= createSlice({
  name:"conversation",
  initialState,
  reducers:{
    updateConversationState:(state,action)=>{
 if (action.payload.conversationId)  state.conversationId=action.payload.conversationId;
 if(action.payload.senderId)  state.senderId=action.payload.senderId;
   if(action.payload.receiverId) state.receiverId=action.payload.receiverId;
 if(action.payload.text) state.text=action.payload.text;
    if(action.payload.status) state.status=action.payload.status;
    },
    setCurrentRoom:(state,action)=>{
      state.currentRoom=action.payload.currentRoom;
    },
  }

 })
 export const convoPersistConfig = {
  key:"conversation",
storage,
 whitelist:["conversationId","senderId","receiverId"],
 version:1,
  };
  
 export const {updateConversationState,setCurrentRoom} = conversationSlice.actions;
 export default conversationSlice.reducer;
 

//  reducer - wo object ko value dega.. 
// actions -> object used to change stages
