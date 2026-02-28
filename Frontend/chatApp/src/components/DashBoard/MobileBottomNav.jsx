import React from 'react'
import { MessageSquare, Bell, Rss, Film, Users, UserCircle } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const NavItems = [
    {
      name: "Feeds",
      icon: <Rss size={24} />,
      link: "/feeds"
    },
    {
      name: "Messages",
      icon: <MessageSquare size={24} />,
      link: "/center_area/start_chat"
    },
    {
      name: "Reels",
      icon: <Film size={24} />,
      link: "/reels"
    },
    {
      name: "Notifications",
      icon: <Bell size={24} />,
      link: "/notifications"
    },
    {
      name: "Account",
      icon: <UserCircle size={24} />,
      link: "/my_account"
    }
  ];

  return (
    <div className='md:hidden fixed bottom-0 left-0 w-full bg-slate-800/95 border-t border-slate-700 backdrop-blur-md z-50 px-4 py-2 pb-safe'>
      <div className='flex justify-between items-center w-full max-w-md mx-auto'>
        {NavItems.map((item, index) => {
          const isActive = location.pathname === item.link;
          return (
            <div
              key={index}
              className={`flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer transition-all duration-300 ${isActive ? 'text-sky-400 bg-sky-900/20' : 'text-slate-400 hover:text-sky-300'}`}
              onClick={() => navigate(item.link)}
            >
              {item.icon}
              <span className='text-[10px] font-medium mt-1 font-montserrat'>{item.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MobileBottomNav
