import React from 'react'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'

export default function ChatContainer() {
  return (
    <div className='flex-1 flex flex-col overflow-hidden'>
      <ChatHeader/>
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>

      </div>
      <MessageInput/>
    </div>
  )
}
