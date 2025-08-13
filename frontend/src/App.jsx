import {react, useState, useEffect} from 'react'
import Nav from './components/Nav'

import { Route, Router, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './components/Signup'
import Login from './components/Login'
import CollectionHero from './pages/CollectionHero'
import WriteBlog from './pages/WriteBlog'
import ReadBlog from './pages/ReadBlog'
import Total from './pages/Total'
import Draft from './pages/Draft'
import { ToastContainer } from 'react-toastify';
import Update from './components/Update'
import Continue from './components/Continue'
import Profile from './pages/Profile'
import Contact from './pages/Contact'

import "react-quill/dist/quill.snow.css"; // ✅ Required for Quill formatting

const App = () => {


  return (
    <div className='w-screen h-auto '>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme='dark'
      />
      <Nav />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/collection' element={<CollectionHero />} />
        <Route path='/writeblog' element={<WriteBlog />} />
        <Route path='/contact' element={<Contact />} />
        <Route path="/blogs/blog/:slug" element={<ReadBlog />} />
        <Route path='/total' element={<Total />} />
        <Route path='/draft' element={<Draft />} />
        <Route path='/blogs/:slug' element={<Update />} />
        <Route path='/blogs/continue/:slug' element={<Continue />} />
        <Route path='/users/user/:userId' element={<Profile />} />
        <Route path="*" element={<div className=' text-7xl ml-[25%] font-bold mt-70 '>404 - Page Not Found</div>} />
      </Routes>



    </div>
  )
}

export default App
