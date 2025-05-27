import React from "react";
import {useParams} from "react-router-dom"
import { Plus } from 'lucide-react'
import axios from 'axios'
import { MapPin } from "lucide-react";

import { useState,useEffect,useCallback } from "react";
export default function UserDetails() {
  const {userId }= useParams();
  console.log(userId)
  const [followers,setFollowers] = useState('');
  const [following,setFollowings] = useState('');
  const [friends,setFriends] = useState('');
  const [data, setData] = useState({})
  const Url = import.meta.env.VITE_API_URL;
//  handling friendRequest..
    const handleSendFriendRequest = async ()=>{
         
         try{
          const friendRequestResponse = await axios.post(`${Url}/friend_request/send_friend_request/${userId}`, {message:"you have requested for friend request"},{withCredentials:true})
          if(!friendRequestResponse) throw new Error("something went wrong in sending friendrequest.")
            console.log(friendRequestResponse);
         }
         catch(error){
           console.log("error in sending friendrequest",error)
         }
    }
       // handling follwing user..
  const handleFollowUser = async ()=>{
   try{
const followResponse = await axios.post(`${Url}/follow/followUser/${userId}`,{message:" sent message followed user"},{
  withCredentials:true
})
if(followResponse) console.log("follow request sent  successfully",followResponse.data);
   }
   catch(err){
    console.log("error occured in following user  in user")
   }
  }
const fetchData =   useCallback(async()=>{
  const response = await axios.get(`${Url}/user/user_data/${userId}`,{
    withCredentials:true
  })
  if(!response) console.log("response not found")
    console.log( "response",response.data)
   setData( response.data.response[0]);
  console.log(data)
},[userId]) 

useEffect(()=>{
  const fetchNewdata = async()=>{
      await  fetchData();
  }
fetchNewdata();
 
},[])
  

 

  
   
  return (
    <div className="h-[50vh]  mx-auto border-yellow-500 rounded-xl  w-[90vw]  bg-opacity-0 flex justify-center items-center   gap-2  bg-gradient-to-r from-black via-blue-950 to-black  flex-col relative shadow-lg overflow-hidden bg-cover bg-center  "   >
        <div className="min-w-full min-h-[45%] bg-gradient-to-r from-black via-blue-500 to-black relative top-1 right-0 left-0 " style={{
    background: `url(${data?.bio?.bannerImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center"
  }}>
        
        </div>
       <div id="user_details" className="flex   justify-around  min-w-full  items-center h-[55%]">
         <div id="bio_image_details" className=" flex relative justify-center gap-12 items-center min-w-[40%]  rounded-lg    h-full ">
         <div id="image_container" className=" p-2 bg-blue-500 h-60 w-64 rounded-full bg-opacity-20  relative  -top-14 left-10 shadow-lg z-10 ">
        <img
          src={data?.profilePicture}
          alt="img"
            className="w-full h-full rounded-full  border-none"
        />
      </div>
           <div className="name_details   h-full  flex flex-col justify-around items-start text-center  ">
            <h2 id="userName"  className="text-blue-300 font-semibold text-[2rem] font-montserrat   p-1 "> {data?.userName}</h2>
               <ul className="text-blue-300 text-start  bg-blue-950 rounded-lg min-w-full bg-opacity-20  px-2 py-1  overflow-x-hidden scrollbar-custom ">
                {data?.bio?.text &&  <li>{data?.bio?.text}</li> }  
                {data?.bio?.socialLinks &&  <li>
                  <ul>
                    {data?.bio?.socialLinks.map((element,index)=>
                    
                     <li key={index}>
                      <span>{element.platform
                      }</span>
                       <span><a href={element.url}>{element.url}</a></span>
                     </li>
                    )}
                  </ul>
                </li> }  
                {data?.bio?.text &&  <div className="flex gap-2 items-center">
                   <MapPin/> <span>{data?.bio.location.country }</span> <span>{data?.bio.location.city }</span>
                </div> }  
                {data?.bio &&  <li><span>Date of Birth</span> 
                <span>{data?.bio?.dateOfBirth.slice(0,10)}</span></li> }  
                
               </ul>
                <div className="flex  justify-center gap-2 items-center w-fit p-2">
                    <button className="bg-blue-600 hover:bg-blue-500 hover:text-slate-950 text-white px-2 py-2 shadow-lg font-poppins rounded-lg w-[50%] " onClick={handleFollowUser} >Follow</button>
                    <button  className="bg-sky-100 px-2 py-2 hover:bg-gradient  hover:bg-white text-slate-900 font-poppins shadow-lg rounded-lg flex justify-center items-center gap-1 w-1/2 " onClick={handleSendFriendRequest} >Friend <Plus/> </button>
                </div>
               
           </div>
         </div>
       
           <div className="flex items-center gap-2 font-poppins  rounded-md bg-blue-950 bg-opacity-30 shadow-sm  ">
            <span className="border border-blue-300  p-2 flex flex-col justify-center items-center shadow-lg  rounded-md">
               <p className="text-md text-slate-400 font-montserrat ">Followers</p> 
                <h2 className=" text-blue-300   font-poppins text-[1.5rem] px-2 py-1 ">
                   {data?.Followers?.length}
                </h2>
                </span>
                <span className="p-2 border border-blue-300 flex flex-col justify-center items-center shadow-lg rounded-md">
               <p className="text-md text-slate-400 font-montserrat ">Following</p> 
                <h2 className=" text-blue-300   font-poppins text-[1.5rem] px-2 py-1">
                {data?.Following?.length}
                </h2>
                </span>
                
                <span className="p-2 border border-blue-300 flex flex-col justify-center items-center shadow-lg rounded-md">
               <p className="text-md text-slate-400 font-montserrat ">Friends</p> 
                <h2 className=" text-blue-300   font-poppins text-[1.5rem] px-2 py-1 ">
                  { data?.Followers?.length }
                </h2>
                </span>
           </div>
       </div>

    </div>
  );
}
