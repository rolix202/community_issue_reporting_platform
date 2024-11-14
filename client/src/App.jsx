import { useState } from 'react'
import './App.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MapPage from './pages/MapPage.jsx'
import AddIssue from './pages/AddIssue.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <MapPage />
  }, 
  {
    path: "add-issue",
    element: <AddIssue />
  }
])


function App() {

  return (
   <RouterProvider router={router} />
  )
    
}

export default App
