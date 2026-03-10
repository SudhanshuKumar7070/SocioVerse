import { initializeApp } from "firebase/app";
import {getMessaging} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDu620Io-JFN-hbFFu5UPlvUHY-db5LR_Y",
  authDomain: "sociocverse-notifications.firebaseapp.com",
  projectId: "sociocverse-notifications",
  storageBucket: "sociocverse-notifications.firebasestorage.app",
  messagingSenderId: "867650529409",
  appId: "1:867650529409:web:c87884df284531b9368580",
  measurementId: "G-9D9XSBFS6G"
};

const  firebaseApp = initializeApp(firebaseConfig);

const messaging=getMessaging(firebaseApp);

export {messaging,firebaseApp}