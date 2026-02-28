
import { useRef } from "react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSocket } from "../SocketConnection.jsx";
import ContactList from "../ContactList";
import PeopleYouMayKnow from "./PeopleYouMayKnow";
import { useDispatch } from "react-redux";
import SearchBar from "../SearchBar/SearchBar.jsx";

// // import { useDispatch } from "react-redux";
// import SearchBar from "../SearchBar/SearchBar.jsx";
import {
  setCurrentRoom,
  updateConversationState,
} from "../../store/conversationSlice";
function ChatingSpace() {
  const searchRef = useRef();
  const navigate = useNavigate();
  const socket = useSocket();
  const [convoId, setConvoId] = useState("");
  const [searchVal,setSearchVal]=useState("")
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
    <div className="flex flex-col md:flex-row gap-1 h-[100dvh] w-full overflow-hidden relative bg-transparent">
      
      {/* Chat List Panel (30% on desktop, full width on mobile if no convo) */}
      <div 
        className={`w-full md:w-[30%] lg:w-[25%] bg-slate-900/50 backdrop-blur-md h-full shadow-lg md:rounded-r-2xl px-2 py-3 overflow-y-scroll scrollbar-custom border-r border-slate-700/50 ${convoId ? 'hidden md:block' : 'block flex-1'}`}
      >
        <div id="searchBar" className="w-full sticky top-0 z-20 bg-slate-900/90 pb-2 backdrop-blur-xl">
          <SearchBar width="w-full" ref={searchRef} onChange={(e)=> setSearchVal(e.target.value)}/>
        </div>
        
        <h1 className="font-montserrat font-semibold text-lg sm:text-xl text-slate-200 px-2 py-3 border-b border-slate-700/50 mb-2">
          Conversations
        </h1>
        <ContactList propClass={"max-h-[60%]"} name={searchVal} />
        
        <h1 className="font-montserrat font-semibold text-lg sm:text-xl text-slate-200 px-2 py-3 border-t border-b border-slate-700/50 my-2 mt-4">
          Suggestions
        </h1> 
        <PeopleYouMayKnow propClass={"h-[30%]"} /> 
      </div>

      {/* Active Conversation Area (70% on desktop, full width on mobile if convo open) */}
      <div 
        className={`w-full md:flex-1 h-full shadow-lg overflow-hidden bg-slate-900/40 backdrop-blur-sm relative ${!convoId ? 'hidden md:block' : 'block flex-1'}`}
      >
        <Outlet/>
      </div>
    </div>
  );
}

export default ChatingSpace;
