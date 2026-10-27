import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "./SocketConnection";
import { useSelector, useDispatch } from "react-redux";
import { updateConversationState } from "../store/conversationSlice";
import { setUrl } from "../store/systemsetupSlice";
import SpinnerWithText from "./LoadingSpinner.jsx";

function ContactList({ propClass = "", name = "" }) {
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket();
  const storeData = useSelector((state) => state.auth?.userData);
  const dispatch = useDispatch();
  const id = storeData?._id;
  const [apiData, setApiData] = useState([]);
  const Url = import.meta.env.VITE_API_URL;

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Url}/user/user_contacts/${id}`);
      return response?.data?.response || [];
    } catch (err) {
      console.error("Error fetching data:", err);
      return [];
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchDataWrapper = async () => {
      const data = await fetchData();
      if (!data || !data[0]?.contacts) {
        setIsLoading(false);
        setApiData([]);
        return;
      }

      const rawContacts = data[0].contacts;
      const filteredData = rawContacts.filter(
        (el) =>
          el?.fullName?.toLowerCase().includes(name.toLowerCase()) ||
          el?.userName?.toLowerCase().includes(name.toLowerCase())
      );

      setIsLoading(false);
      setApiData(filteredData);
    };

    fetchDataWrapper();
  }, [name, id]);

  const handleCreateChat = (element) => {
    dispatch(
      setUrl({
        userUrl: element?.profilePicture || "",
      })
    );
    socket.emit("startChat", { receiverId: element._id, senderId: id });
    dispatch(
      updateConversationState({
        senderId: id,
        receiverId: element._id,
        userName: element.fullName || element.userName,
      })
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <SpinnerWithText />
      </div>
    );
  }

  return (
    <ul className={`w-full flex flex-col gap-1.5 overflow-y-auto scrollbar-custom scroll-smooth font-montserrat ${propClass}`}>
      {apiData && apiData.length > 0 ? (
        apiData.map((element, index) => (
          <li
            key={element._id || index}
            className="w-full py-2 px-2.5 flex items-center gap-3 cursor-pointer bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 hover:border-sky-500/40 rounded-xl transition-all duration-200 shadow-sm hover:shadow"
            onClick={() => handleCreateChat(element)}
          >
            {/* Avatar */}
            <div className="shrink-0 relative">
              <img
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover border border-slate-700/60"
                src={element.profilePicture || "https://picsum.photos/seed/user/100/100"}
                alt={element.fullName || "User"}
              />
            </div>

            {/* User Meta */}
            <div className="flex flex-col min-w-0 flex-1 justify-center">
              <p className="font-semibold text-sm text-slate-100 truncate leading-snug">
                {element.fullName || "Unknown"}
              </p>
              <p className="text-xs text-sky-400/80 truncate">
                @{element.userName || "user"}
              </p>
            </div>
          </li>
        ))
      ) : (
        <li className="text-center py-6 text-xs text-slate-500">
          No contacts found
        </li>
      )}
    </ul>
  );
}

export default ContactList;
