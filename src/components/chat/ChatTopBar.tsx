
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Info, X } from 'lucide-react';
import React, { useEffect } from 'react'
import  {useSelectedUser}  from "@/store/useSelectedUser";

const ChatTopBar = () => {
    const {selectedUser,setSelectedUser} = useSelectedUser();


  return (
    <div className='w-full h-20 flex p-4 justify-between items-center border-b'>
      <div className='flex items-center gap-2' >
        <Avatar className='flex justify-center items-center' >
            <AvatarImage
            src={selectedUser?.image || "/user-placeholder.png"}
            alt={selectedUser?.name}
            className='w-10 h-10 object-cover rounded-full'  />
        </Avatar>
        <span className='font-medium'>{selectedUser?.name}</span>
      </div>
      <div className='flex justify-center items-center gap-4'>
        <Info className='text-muted-foreground cursor-pointer hover:text-primary' size={24} />
        <X className='text-muted-foreground cursor-pointer hover:text-primary' size={24} onClick={() => setSelectedUser(null)}  />
      </div>
    </div>
  )
}

export default ChatTopBar
