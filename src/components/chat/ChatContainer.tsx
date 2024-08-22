import React, { useEffect } from 'react'
import ChatTopBar from './ChatTopBar'
import MessageList from './MessageList'
import ChatBottomBar from './ChatBottomBar'
import { useSelectedUser } from '@/store/useSelectedUser'

const ChatContainer = () => {

  const {selectedUser,setSelectedUser} = useSelectedUser();

  // ----how to close the chat window when the user presses the escape key----
  useEffect(() => {
    const handleEscape = (e:KeyboardEvent) => {
      if(e.key==="Escape") setSelectedUser(null);
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  },[setSelectedUser])
  return (
      <div className='flex flex-col justify-between w-full h-full'>
        <ChatTopBar />
        <div className='w-full overflow-y-auto overflow-x-hidden h-full flex flex-col'>
          <MessageList />
          <ChatBottomBar />
        </div>
      </div>
  );
};

export default ChatContainer
