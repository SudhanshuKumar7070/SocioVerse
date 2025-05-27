import React from 'react'

function DashboardNavbar() {
    const navbarItems = [
        { name: "For you" },
        { name: "Followings" },
        { name: "SaaS Growth" },
        { name: "AI startups" },
        { name: "Fintech Startups" },
        { name: "Web3 Startups" },
        { name: "Crypto Startups" },   
        { name: "AI Tools" },
        { name: "AI Art" },
        { name: "AI Chatbots" },
        { name: "AI Content" },
        { name: "AI Marketing" },
        { name: "AI Music" },
        { name: "AI Productivity" },
        { name: "AI Research" },
        { name: "AI Writing" },
        { name: "AI Design" },
        { name: "AI Development" },
    ]
  return (
    <div className='flex justify-between items-center bg-slate-800/90 border-b border-slate-700 py-6 shadow-lg min-w-full sm:h-[8vh] h-5  top-0 left-0 right-0 z-10 overflow-x-scroll overflow-y-hidden scroll-smooth scrollbar-custom font-poppins sticky rounded-lg'>
      {
        navbarItems.map((item, index) => (
          <div 
            key={index} 
            className='text-slate-200 text-center font-poppins px-2 py-3 text-md sm:text-[.75rem] leading-tight hover:bg-slate-700 hover:text-sky-300 rounded-lg p-4 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105'
          >
            {item.name}
          </div>
        ))
      }
    </div>
  )
}

export default DashboardNavbar