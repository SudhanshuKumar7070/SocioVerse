import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./authSlice.js"
import  userUrlReducer from "./systemsetupSlice.js"
import convoReducer from "./conversationSlice.js"
import {persistStore,persistReducer} from 'redux-persist'
import tweetTextContentReducer from "./tweetContentSlice.js"
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
  import { convoPersistConfig } from './conversationSlice.js';
import tokenReducer from "./tokenSlice.js"
 const persistConfig ={
   key:"authToken",
   storage,
   version:1,
 }
const persistedTokenReducer = persistReducer(persistConfig,tokenReducer);
const persistedConvoReducer =  persistReducer(convoPersistConfig,convoReducer)
 

const store = configureStore({
  reducer: {
    authToken:persistedTokenReducer,
    auth:authReducer,
    conversation: persistedConvoReducer,
    userUrl:userUrlReducer,
    tweetTextContent:tweetTextContentReducer
  },
  middleware:(getDefaultMiddleware)=> getDefaultMiddleware({
    serializableCheck: false,
  })
});
const persistor = persistStore(store);
export  {
  store, persistor
}


