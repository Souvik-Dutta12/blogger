import React from 'react'
import Hero from '../components/Hero'
import Gemini from '../components/Gemini'
import About from '../components/About'
import Collection from '../components/Collection'
import Moving from '../components/Moving'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className='w-screen h-screen '>


      <Hero />

      <Gemini />

      <About />

      <Collection />

      <Moving />

      <Footer />
    </div>
  )
}

export default Home
