import React from 'react'
import { MessageSquare, Bell, Rss, Film, Users ,UserCircle} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function LeftSideBar() {
  const navigate = useNavigate();
  const LeftSideBarItems = [
    {
      name: "Messages",
      icon: <MessageSquare className='text-sky-400' size={20} />,
      link: "/center_area"
    },
    {
      name: "Notifications",
      icon: <Bell className='text-sky-400' size={20} />,
      link: "/notifications"
    },
    {
      name: "Feeds",
      icon: <Rss className='text-sky-400' size={20} />,
      link: "/feeds"
    },
    {
      name: "Reels",
      icon: <Film className='text-sky-400' size={20} />,
      link: "/reels"
    },
    {
      name: "Friends",
      icon: <Users className='text-sky-400' size={20} />,
      link: "/friends"
    },
    {
      name: "Account",
      icon: <UserCircle className='text-sky-400' size={20} />,
      link: "/my_account"
    }
  ];

  return (
    <div className='w-full flex flex-col justify-start items-start gap-2 p-4 rounded-2xl shadow-md bg-slate-800/75 border border-slate-700'>
      {
        LeftSideBarItems.map((item, index) => (
          <div
            key={index}
            className='flex items-center gap-3 w-full p-2 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-all duration-300 text-slate-300 hover:text-sky-300'
            onClick={() => navigate(item.link)}
          >
            {item.icon}
            <span className='font-semibold text-sky-200'>{item.name}</span>
          </div>
        ))
      }
    </div>
  )
}

export default LeftSideBar
