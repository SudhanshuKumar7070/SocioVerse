import React from 'react'
import { useParams } from 'react-router-dom'
import ChatNavBar from './ChatNavBar.jsx'
import MessageInterface from '../messageComponents/MessageInterface.jsx'

function ChatArea({propClass}) {
  const {conversationId} = useParams();
  
  return (
    <div className={`font-poppins w-full h-full flex flex-col bg-slate-900/40 relative ${propClass}`}>
      {/* Top Navigation Bar pinned to top of flex container */}
      <ChatNavBar 
        navClass={'w-full h-16 sm:h-20 shrink-0 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 flex justify-between items-center px-4 z-20'} 
      />
      
      {/* Messages Area taking up remaining vertical space */}
      <div className="flex-1 overflow-hidden relative w-full flex flex-col pt-2">
        <MessageInterface propClass="w-full h-full" convoId={conversationId} /> 
      </div>
    </div>
  )
}

export default ChatArea
