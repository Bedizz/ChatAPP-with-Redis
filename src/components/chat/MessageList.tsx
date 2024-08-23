import React, { useEffect, useRef } from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import { cn } from '@/lib/utils'
import { Avatar } from '../ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { useSelectedUser } from '@/store/useSelectedUser'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { useQuery } from '@tanstack/react-query'
import { getMessages } from '@/actions/message.action'
import MessageSkeleton from '../skeletons/MessageSkeleton'


const MessageList = () => {
  
  const {selectedUser}=useSelectedUser()
  const {user:currentUser,isLoading:isUserLoading} = useKindeBrowserClient()
  const {data:messages,isLoading:isMessagesLoading}=useQuery({
    queryKey:["messages", selectedUser?.id],
    queryFn:async ()=>{
      if (selectedUser && currentUser ) {
        return await getMessages(selectedUser?.id!, currentUser?.id)
      }
    },
    //! "!!" is a shorthand for converting a value to a boolean value. It is equivalent to Boolean(value).
    enabled: !!selectedUser && !!currentUser && !isUserLoading
  })
  const messageRef = useRef<HTMLDivElement>(null)

  // how to scroll to the bottom of a div
  useEffect(()=> {
    if(messageRef.current){
      messageRef.current.scrollTop = messageRef.current.scrollHeight
    }
  },[messages])

  return (
    <div ref={messageRef} className='w-full overflow-y-auto overflow-x-hidden h-full flex flex-col'>
      <AnimatePresence>
        {!isMessagesLoading && messages?.map((message, index) => (
          <motion.div
          key={index}
          layout
          initial={{opacity:0, scale:1, y:50, x:0}}
          animate={{ opacity:1, scale:1, y:0, x:0}}
          exit={{opacity:0, scale:1, y:1, x:0}}
          transition={{opacity:{duration:0.1},
          layout: {
            type: 'spring',
            bounce:0.3,
            duration:messages?.indexOf(message) * 0.05+0.2
          }}}
          style={{
            originX:0.5,
            originY:0.5,
          }}
          className={cn("flex flex-col gap-2 p-4 whitespace-pre-wrap", message.senderId === currentUser?.id! ? "items-end" : "items-start")}>
            <div className='flex gap-3 items-center'>
              {message.senderId === selectedUser?.id && (
                <Avatar className='flex justify-center items-center'>
                  <AvatarImage
                  src={selectedUser.image || "/user-placeholder.png"}
                  alt={selectedUser.name}
                  className='border-2 border-white rounded-full'/>
                </Avatar>
                )}
                {message.messageType === "text" ? (<span className='bg-accent p-3 rounded-md max-w-xs'>{message.content}</span>): (<img src={message.content} alt="Message Image" className='border p-2 rounded h-40 md:h-52 object-cover'/>)}

                {message.senderId === currentUser?.id && (
                <Avatar className='flex justify-center items-center'>
                  <AvatarImage
                  src={currentUser?.picture || "/user-placeholder.png"}
                  alt="user image"
                  className='border-2 border-white rounded-full'/>
                </Avatar>
                )}
            </div>

          </motion.div>
      ))}
      {isMessagesLoading && (<MessageSkeleton/>)}
      </AnimatePresence>
    </div>
  )
}

export default MessageList
