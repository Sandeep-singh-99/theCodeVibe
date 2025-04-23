import React from 'react'
import SuggestedUsers from '../components/SuggestedUsers'
import PostCardComponents from '../components/PostCardComponents'

export default function Home() {
  return (
    <div className='min-h-screen p-6 bg-black'>
      <div className='max-w-4xl mx-auto flex flex-col lg:flex-row gap-8'>

        <div className='flex-1 max-w-2xl'>
          <div className='space-y-6'>
            <PostCardComponents/>
          </div>
        </div>

        <div className='hidden lg:block w-80 sticky top-6 h-fit'>
          <div className='rounded-2xl shadow-lg'>
            <SuggestedUsers/>
          </div>
        </div>
      </div>
    </div>
  )
}
