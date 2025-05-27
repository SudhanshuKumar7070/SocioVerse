import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../SocketConnection.jsx";
import ContactList from "../ContactList";
import { Outlet } from "react-router-dom";
// import ChatArea from "./ChatArea";
import PeopleYouMayKnow from "./PeopleYouMayKnow";

import { useDispatch } from "react-redux";
import SearchBar from "../SearchBar/SearchBar.jsx";
import {
  setCurrentRoom,
  updateConversationState,
} from "../../store/conversationSlice";
function ChatingSpace() {
  const navigate = useNavigate();
  const socket = useSocket();
  const [convoId, setConvoId] = useState("");
  const dispatch = useDispatch();
  const handleConversationStart = (data) => {
    try {
      const { conversationId, room } = data;
      if (!conversationId || !room)
        throw new Error("conversationId or room not found!");
      setConvoId(conversationId);
      dispatch(setCurrentRoom({ currentRoom: room }));
      dispatch(
        updateConversationState({
          conversationId: conversationId,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    socket.on("conversationStarted", handleConversationStart);
    
    return ()=>{
      socket.off("conversationStarted", handleConversationStart);
    }
  }, []);
  useEffect(() => {
    if (convoId) {
      navigate(`/center_area/${convoId}`);
    }
  }, [convoId]);
  return (
    // className={`${styles.container} h-[100%]  w-[100%] flex justify-center items-start
    <div className="  w-full h-full px-1 py-1 flex justify-center items-start">
      <div className="left_Container md:min-w-[31%]  bg-slate-900 h-full bg-opacity-50 shadow-lg rounded-lg px-2 py-3 overflow-y-scroll scrollbar-custom  scroll-smooth relative ">
        <div id="searchBar " className="w-full sticky top-[0%] z-10 ">
          <SearchBar width="min-w-full" />
        </div>
        <h1 className="font-poppins text-2xl text-sky-100 px-1 py-1 my-1 ">
          Chats
        </h1>
        <ContactList propClass={"h-[50%]"} />
        <h1 className="font-poppins text-2xl text-sky-100 px-2 py-1 my-1 ">
          People You may know
        </h1>
        <PeopleYouMayKnow propClass={"h-[30%]"} />
      </div>
      <div className="right_Container md:min-w-[67%]  h-full">
        <Outlet/>
        {/* <ChatArea propClass={"w-[100%] h-full "} /> */}
      </div>
    </div>
  );
}

export default ChatingSpace;
