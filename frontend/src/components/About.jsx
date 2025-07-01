import React from 'react'
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "./ui/draggable-card";

const About = () => {
  const items = [
    {
      title: "Tyler Durden",
      image:
        "https://images.unsplash.com/photo-1732310216648-603c0255c000?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-10 left-[20%] rotate-[-5deg]",
    },
    {
      title: "The Narrator",
      image:
        "https://images.unsplash.com/photo-1697909623564-3dae17f6c20b?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-40 left-[25%] rotate-[-7deg]",
    },
    {
      title: "Iceland",
      image:
        "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-5 left-[40%] rotate-[8deg]",
    },
    {
      title: "Japan",
      image:
        "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=3648&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-32 left-[55%] rotate-[10deg]",
    },
    {
      title: "Norway",
      image:
        "https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-20 right-[35%] rotate-[2deg]",
    },
    {
      title: "New Zealand",
      image:
        "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=3070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-24 left-[45%] rotate-[-7deg]",
    },
    {
      title: "Canada",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-8 left-[30%] rotate-[4deg]",
    },
  ];
  return (
    <div className='w-screen md:w-screen sm:w-[85vw] min-h-screen md:min-h-screen sm:min-h-10 mt-90 md:mt-90 sm:mt-0' >
      <DraggableCardContainer className="relative flex md:flex sm:hidden md:min-h-screen   w-full items-center justify-center overflow-clip">

        {items.map((item, index) => (
          <DraggableCardBody key={index} className={item.className}>
            <img
              src={item.image}
              alt={item.title}
              className="pointer-events-none relative z-10 h-52 w-52 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80 object-cover"
            />
            <h3 className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
              {item.title}
            </h3>
          </DraggableCardBody>
        ))}
      </DraggableCardContainer>
      <div className='max-w-3xl mx-auto h-auto -mt-20 md:-mt-20 sm:mt-0 z-0'>
        <h1 className=' text-5xl sm:text-5xl md:text-7xl lg:text-7xl bg-clip-text h-30 text-transparent bg-gradient-to-b from-white to-neutral-700  text-center font-sans font-bold'>About Us</h1>
        <p className='text-neutral-400 max-w-4xl mx-auto -mt-3 text-lg text-center '>
          Welcome to Blogger, your go-to platform for sharing ideas, stories, and expertise with the world. Whether you're a passionate writer, a curious reader, or someone eager to build a personal brand, Blogger empowers you with the tools to create, publish, and grow your own blog with ease. Our mission is to make blogging simple, accessible, and enjoyable for everyone — from beginners to seasoned content creators. With a clean interface, powerful editor, and seamless customization options, Blogger helps you focus on what truly matters: your voice and your content. Join our community and start your blogging journey today!
        </p>
      </div>

    </div>
  )
}

export default About
