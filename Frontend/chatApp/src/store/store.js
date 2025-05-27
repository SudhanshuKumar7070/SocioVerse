import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./authSlice.js"
import  userUrlReducer from "./systemsetupSlice.js"
import convoReducer from "./conversationSlice.js"
import {persistStore,persistReducer} from 'redux-persist'
import tweetTextContentReducer from "./tweetContentSlice.js"
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
  import { convoPersistConfig } from './conversationSlice.js';

const persistConfig ={
  key:"auth",
  storage,
  version:1,
}
const persistedReducer = persistReducer(persistConfig,authReducer);
const persistedConvoReducer =  persistReducer(convoPersistConfig,convoReducer)
 

const store = configureStore({
  reducer: {
     auth: persistedReducer,
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


