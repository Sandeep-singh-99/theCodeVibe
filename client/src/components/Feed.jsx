import React from 'react'

export default function Feed() {

    const feedPosts = [
        {id: 1, content: "Post 1"},
    ]
  return (
    <div className='flex-1 flex flex-row w-16 h-16 rounded-full border-2 border-blue-800 mb-8'>
        <div className='flex justify-center items-center w-full h-full bg-base-content rounded-full'>
            Feed
        </div>
    </div>
  )
}
