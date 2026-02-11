import React from 'react'
import { useSelector } from 'react-redux'
import { Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
function LeftSideBarUserProfile({followers=0 , followings= 0}) {
  const navigate = useNavigate();
    const currentUserData = useSelector((state) => state.auth.userData);
      console.log("check user data at leftprofilecomponent",currentUserData)
  return (
    <div className='w-full  flex flex-col justify-start items-start gap-2 p-4 rounded-lg shadow-lg bg-opacity-15 bg-blue-300 font-montserrat'>
     <div className="flex justify-center mx-auto mb-2 ">
          
            <div className="h-[6rem] w-[6rem] rounded-full border-2 border-white overflow-hidden shadow-md bg-gradient-to-b from-blue-900 via-blue-500 to-blue-900 hover:cursor-pointer "
            onClick={()=>{
              navigate(`/userAdmin/${currentUserData?._id}`)
            }}
            >
              <img
                src={currentUserData.profilePicture}
                className="h-full w-full object-cover"
                alt={`${currentUserData.fullName}'s profile`}
                
              />
            </div>
            
          
        </div>
      

       {/* User Identity */}
       <div className="text-center px-4 flex justify-center items-center flex-col w-full">
          <h1 className="text-xl font-bold font-montserrat text-blue-500 ">{currentUserData.fullName}</h1>
          <p className=" text-sm text-blue-300 font-montserrat">@{currentUserData.userName}</p>
        </div>
       
        <div className="flex mb-4 pb-4 ">
          <div className="flex items-center text-sm text-blue-300 mr-4">
            <Users size={16} className="mr-1" />
            <span className="font-semibold text-sky-700 font-poppins text-md">{followers|| 0}</span>
            <span className="ml-1 font-montserrat">followers</span>
          </div>
          <div className="flex items-center text-sm text-blue-300">
            <span className="font-bold px-2 text-sky-800 font-poppins text-md">{followings || 0}</span>
            <span className="ml-1 font-montserrat">following</span>
          </div>
        </div>
        
    </div>
  )
}

export default LeftSideBarUserProfile
