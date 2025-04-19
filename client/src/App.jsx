import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSideBar from './components/LeftSideBar'

export default function App() {
  return (
    <div>
      <LeftSideBar/>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}
