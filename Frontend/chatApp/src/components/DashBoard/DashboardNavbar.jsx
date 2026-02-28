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
    <div className='flex items-center gap-2 sm:gap-4 bg-slate-800/90 border-b backdrop-blur-md border-slate-700 py-3 px-2 sm:px-4 shadow-lg w-full max-w-full h-auto min-h-[3rem] top-0 z-10 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-custom font-poppins sticky rounded-lg'>
      {
        navbarItems.map((item, index) => (
          <div 
            key={index} 
            className='whitespace-nowrap shrink-0 text-slate-200 text-center font-poppins px-3 py-2 text-sm sm:text-base leading-tight hover:bg-slate-700 hover:text-sky-300 rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-105'
          >
            {item.name}
          </div>
        ))
      }
    </div>
  )
}

export default DashboardNavbar