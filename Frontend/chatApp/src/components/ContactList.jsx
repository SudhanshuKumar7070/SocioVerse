import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "./SocketConnection";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateConversationState } from "../store/conversationSlice";
import { setUrl } from "../store/systemsetupSlice";
import SpinnerWithText from "./LoadingSpinner.jsx"
// {
//   w-full lg:w-[25vw] md:w-[35vw]
// }

function ContactList(
   propClass
) {
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket();
  const storeData = useSelector((state) => state.auth?.userData);
  const dispatch=useDispatch();
     const id = storeData?._id;
  const [apiData, setApiData] = useState([]);
  const Url = import.meta.env.VITE_API_URL;
  //  const id = "67db102e0e183baede8eaf04";
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
      setIsLoading(false);
      console.log("data:", data[0].contacts);
      if (!data)  {setIsLoading(false);
        return
      }
      
      setApiData(data[0]?.contacts);
      console.log("useStated Data:", apiData);
      return data
    };

   const data= fetchDataWrapper();
  }, []); // Empty array ensures this runs only once
  // useEffect for genrating chat

 const handleCreateChat = (element)=>{

       dispatch(setUrl({
        userUrl:element?.profilePicture || ""
       }))
   socket.emit("startChat",{receiverId:element._id, senderId:id});
   dispatch(updateConversationState({
    senderId:id,
    receiverId:element._id
   }))
 }
  if (isLoading) return (<SpinnerWithText/>)

  return (
 
    <ul className={`text-sky-200    px-2 py-2   overflow-y-scroll   scrollbar-custom scroll-smooth gap-2 font-montserrat ${propClass}` }>
      {apiData &&
        apiData.map((element, index) => (
          <li
            key={index}
            className=" py-1 px-2 sm:max-h-14 flex justify-start gap-6 items-center  my-2 cursor-pointer bg-slate-900  hover:bg-blue-300 hover:border-blue-500 border-slate-100 rounded-lg hover:shadow-md"
            onClick={()=>{
              handleCreateChat(element);
            }}
          >
            <div className=" px-4 py-2">
              <img
                className="sm:h-12 sm:w-12 rounded-full"
                src={element.profilePicture}
                alt="no pic"
              />
            </div>
            <div className="flex flex-col item-center justify-center">
              <p className="  font-sans  font-semibold text-l text-pretty text-slate-200">{element.fullName}</p>

              <p className="text-gray-700 text-sm font-serif  "> {element.userName}</p>
            </div>
          </li>
        ))}
    </ul>
  );
}

export default ContactList;
