import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { MapPin, Settings } from 'lucide-react';
import { useState } from 'react';
import IconWithTooltip from './SettingIcon';
import ProfileSettingBar from './ProfileSettingBar';
function UserProfile() {

  const currentUser = useSelector((state) => state.auth?.userData);
const refrer = useRef(null);
const  [openSettingModel ,setOpenSettingModel] = useState(false)
  const handleFollowUser = () => console.log('Follow user clicked');
  const handleSendFriendRequest = () => console.log('Friend request clicked');
  const handleOpnenSettingModel =()=>{
     openSettingModel?setOpenSettingModel(false):setOpenSettingModel(true)
  }
  return (
    
    <div className="h-[85vh] w-[65vw] mx-auto rounded-2xl bg-gradient-to-r from-black via-blue-950 to-black shadow-2xl p-4 flex flex-col gap-4 overflow-hidden relative">
      {/* Banner Section */}
      {/* <span className='absolute right-10 top-10 text-slate-500 flex justify-center items-center hover:transition-all hover:duration-300 hover:ease-linear' onMouseEnter={()=>{
        setTextDisplay(true)
      }} onMouseLeave={()=>{
       setTextDisplay(false)
      }}>
      <Settings className='text-blue-500 cursor-pointer ' />
      <p ref={refrer} className={ textDisplay?`block font-poppins bg-slate-950 shadow-lg  rounded-md px-2 py-1`:`hidden`}>Profile Setting</p>
      </span> */}
      
     
     {  currentUser.bio?.bannerImage && <div
        className="h-[40%] w-full rounded-xl bg-center bg-cover relative"
        style={{ backgroundImage: `url(${currentUser?.bio?.bannerImage})` }}
      ></div>
}
      {/* Profile & Details Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
<IconWithTooltip onClick={handleOpnenSettingModel} styling={openSettingModel} />
     <ProfileSettingBar className={openSettingModel?'block top-20  right-10 bg-opacity-32 z-10':"hidden"}/>
        {/* Left: Profile Picture & Bio */}
        <div className="flex flex-col items-center gap-4 w-full md:w-[40%]">
          <div className="relative w-40 h-40">
          
            <img
              src={currentUser?.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-4 border-blue-300 shadow-lg"
            />
          </div>
          <div className="text-center">
            <h2 className="text-blue-300 text-3xl font-semibold font-montserrat">{currentUser?.userName}</h2>
          </div>
        </div>

        {/* Right: Bio Details */}
        <div className="flex flex-col gap-2 w-full md:w-[55%] bg-blue-950 bg-opacity-30 p-4 rounded-lg shadow-md overflow-y-auto max-h-[250px]">
          {currentUser?.bio?.text && <p className="text-blue-300">{currentUser.bio.text}</p>}

          {currentUser?.bio?.socialLinks && (
            <div className="flex flex-col gap-1">
              {currentUser.bio.socialLinks.map((link, index) => (
                <a key={index} href={link.url} className="text-blue-400 underline hover:text-blue-300 text-sm">{link.platform}</a>
              ))}
            </div>
          )}

          {currentUser?.bio?.location && (
            <div className="flex items-center gap-2 text-blue-300">
              <MapPin size={16} />
              <span>{currentUser.bio.location.country}</span>,
              <span>{currentUser.bio.location.city}</span>
            </div>
          )}

          {currentUser?.bio?.dateOfBirth && (
            <div className="text-blue-300 text-sm">
              <span>Date of Birth: {currentUser.bio.dateOfBirth.slice(0, 10)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex justify-around gap-2 p-2">
        {['Followers', 'Following', 'Friends'].map((item, index) => (
          <div key={index} className="flex flex-col items-center p-2 border border-blue-300 rounded-md shadow-lg min-w-[100px]">
            <p className="text-slate-400 text-sm font-montserrat">{item}</p>
            <h2 className="text-blue-300 font-poppins text-xl">
              {item === 'Following' ? currentUser?.Following?.length : 0}
            </h2>
          </div>
        ))}
      </div>

      {/* Action Buttons (Optional) */}
      {/* <div className="flex gap-4 justify-center">
        <button
          onClick={handleFollowUser}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Follow
        </button>
        <button
          onClick={handleSendFriendRequest}
          className="bg-sky-100 hover:bg-white text-slate-900 px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
        >
          Friend <Plus size={18} />
        </button>
      </div> */}
    </div>
  );
}

export default UserProfile;
