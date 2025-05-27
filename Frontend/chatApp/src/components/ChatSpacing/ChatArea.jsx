import React from 'react'
import { useParams } from 'react-router-dom'

import ChatNavBar from './ChatNavBar.jsx'
import MessageInterface from '../messageComponents/MessageInterface.jsx'
function ChatArea({propClass}) {
  const {conversationId} = useParams();
  console.log(conversationId,"convo id hai")
  return (
    <div  className={`font-poppins  w-full h-full overflow-y-scroll scrollbar-custom scroll-smooth ${propClass} relative`}>
                  <ChatNavBar navClass={' sm:min-full sm:h-20 absolute top-0 left-0 right-0 bg-black bg-opacity-40 flex justify-between items-center' } optionsClass={``}/>
      {/* <ReceivedMessage receivedMessage={"new mwssage comes from my side"}/>
      <SendMessage/> */}
      

      <MessageInterface propClass={propClass} convoId={conversationId} /> 
      
      
    
    </div>
  )
}

export default ChatArea
