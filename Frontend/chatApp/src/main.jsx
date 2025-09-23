import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import RouteAuhtentication from "./components/RouteAuhtentication.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { store, persistor } from "./store/store.js";
import ValidateCode from "./components/ForgotPassword/ValidateCode.jsx";
// import  from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import LandingPage from "./components/LandingPage/landingPage.jsx";
import App from "./App.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import ContactList from "./components/ContactList.jsx";
import "./index.css";
import MainTextingArea from "./components/MainTextingArea/MainTextingArea.jsx";
import SpinnerWithText from "./components/LoadingSpinner.jsx";
import AppContact from "./components/AppContacts.jsx";
import { SocketProvider } from "./components/SocketConnection.jsx";
import ChatingSpace from "./components/ChatSpacing/ChatingSpace.jsx";
import ChatArea from "./components/ChatSpacing/ChatArea.jsx";
import CurrentUserProfile from "./components/DashBoard/CurrentUserProfile.jsx";
import BioComponent from "./components/BioComponent.jsx";
import Form from "./components/BioComponent.jsx";
import AddBio from "./components/AddBio.jsx";
import Dashboard from "./components/DashBoard/Dashboard.jsx";
import Reels from "./components/Reels/Reels.jsx";
import Feeds from "./components/Feeds/Feeds.jsx";
import Friends from "./components/Friends/Friends.jsx";
import Notifications from "./components/Notifications/Notifications.jsx";
import AppUser from "./components/Users/AppUser.jsx";
import { MapProvider } from "./store/NotificationMap.jsx";
// import AdminUser from "./components/Users/UserProfile.jsx";
import UserProfile from "./components/Users/UserProfile.jsx";
import SendEmail from "./components/ForgotPassword/SendEmail.jsx";
import MessageInterface from "./components/messageComponents/MessageInterface.jsx";
import PostInterFace from "./components/DashBoard/PostCreate/PostInterFace.jsx";
import ResetPassword from "./components/ForgotPassword/ResetPassword.jsx";
import Start_Chat_Page from "./components/ChatSpacing/Start_Chat_Page.jsx";
import UserTweets from "./components/Users/UserTweets.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/", // Nested route under "/"
        element: <LandingPage/>,
      },
      {
        path: "/register", // Route for "/register"
        element: <Register />,
      },
      {
        path: "/add_register_contacts",
        element: <AppContact />,
      },
      {
        path: "/login", // Route for "/login"
        element: <Login/>,
      },
      {
        path: "/sendEmail", // Route for "/login"
        element: <SendEmail/>,
      },
      {
        path: "/validatePassCode/:email", // Route for "checking pacccode" 
        element: <ValidateCode/>,
      },
      {
        path: "/resetPassword/:email/:code", // Route for "reset password"
        element: <ResetPassword/>,
      },
      {
        path: "/user_contacts",
        element: <ContactList/>,
      },
      {
        path: "/mainTextingArea",
        element: <MainTextingArea/>,
      },
      {
        path: "/dashboard",
        element: <Dashboard/>,
      },
      {
        path: "/center_area",
        element: <ChatingSpace/>,
        children: [
          {
            path:"start_chat",
            element: <Start_Chat_Page/>
          },

          {
            
            path: ":conversationId",
            element: <ChatArea />,
           
          },
        ],
      },
      {
        path: "/add_Bio",
        element: <Form/>,
      },
      {
        path: "/reels",
        element: <Reels />,
      },
      {
        path: "/tweet/:tweet_id",
        element: <UserTweets/>,
      },
      {
        path: "/feeds",
        element: <Feeds />,
      },
      {
        path: "/friends",
        element: <Friends />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/userAdmin/:userId",
        element: <AppUser />,
      },
      {
        path:"/my_account",
        element:<UserProfile/>
      },
      {
        path:"/post_interface",
        element:<PostInterFace/>
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <MapProvider>
      <SocketProvider>
        <PersistGate
          loading={<SpinnerWithText text="Loading..." />}
          persistor={persistor}
        >
          <RouterProvider router={router} />
        </PersistGate>
        {/* <RouterProvider router={router} /> */}
      </SocketProvider>
    </MapProvider>
  </Provider>
);
