import { useRef, useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSocket } from "../SocketConnection.jsx";
import ContactList from "../ContactList";
import PeopleYouMayKnow from "./PeopleYouMayKnow";
import { useDispatch } from "react-redux";
import SearchBar from "../SearchBar/SearchBar.jsx";
import MobileBottomNav from "../DashBoard/MobileBottomNav.jsx";
import {
  setCurrentRoom,
  updateConversationState,
} from "../../store/conversationSlice";

function ChatingSpace() {
  const searchRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket();
  const [convoId, setConvoId] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const dispatch = useDispatch();

  // Check if user is currently inside an active chat conversation (e.g. /center_area/64abcd...)
  const isInsideChat = location.pathname.includes("/center_area/") && !location.pathname.endsWith("/start_chat");

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
      console.error(error);
    }
  };

  useEffect(() => {
    socket.on("conversationStarted", handleConversationStart);
    return () => {
      socket.off("conversationStarted", handleConversationStart);
    };
  }, [socket]);

  useEffect(() => {
    if (convoId) {
      navigate(`/center_area/${convoId}`);
    }
  }, [convoId]);

  return (
    <div className={`flex h-screen w-full overflow-hidden relative bg-transparent ${!isInsideChat ? 'pb-16 md:pb-0' : ''}`}>
      {/* 1. Chat List & Contacts Sidebar:
          - Desktop: Compact fixed width (w-72 lg:w-80)
          - Mobile: Full width when on contacts list (/center_area/start_chat), hidden when an active chat conversation is open
      */}
      <aside
        className={`flex-col h-full bg-slate-900/60 backdrop-blur-md border-r border-slate-800/80 shadow-xl overflow-hidden shrink-0 transition-all duration-200 z-10 ${
          isInsideChat
            ? "hidden md:flex md:w-72 lg:w-80"
            : "flex w-full md:w-72 lg:w-80"
        }`}
      >
        {/* Sticky Search Header */}
        <div className="p-3 border-b border-slate-800/70 bg-slate-900/80 shrink-0">
          <SearchBar
            width="w-full"
            ref={searchRef}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div>

        {/* Scrollable Contacts and Suggestions */}
        <div className="flex-1 overflow-y-auto scrollbar-custom p-2.5 flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <h2 className="font-poppins font-semibold text-xs tracking-wider uppercase text-sky-400">
                Conversations
              </h2>
            </div>
            <ContactList name={searchVal} />
          </div>

          <div>
            <div className="flex items-center justify-between px-2 mb-2 pt-2 border-t border-slate-800/60">
              <h2 className="font-poppins font-semibold text-xs tracking-wider uppercase text-slate-400">
                Suggestions
              </h2>
            </div>
            <PeopleYouMayKnow />
          </div>
        </div>
      </aside>

      {/* 2. Active Chat Conversation / Placeholder Area:
          - Desktop: Fills remaining space (flex-1)
          - Mobile: Full screen when inside an active conversation
      */}
      <main
        className={`flex-1 min-w-0 h-full overflow-hidden bg-slate-950/40 backdrop-blur-sm relative ${
          !isInsideChat ? "hidden md:flex flex-col" : "flex flex-col w-full"
        }`}
      >
        <Outlet />
      </main>

      {/* 3. Mobile Bottom Navigation:
          - Displays when viewing the conversations list on mobile
          - Hidden inside active messaging area to maximize keyboard and chat typing space
      */}
      {!isInsideChat && <MobileBottomNav />}
    </div>
  );
}

export default ChatingSpace;
