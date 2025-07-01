import React from 'react'
import { BackgroundBeams } from "./ui/background-beams";
import { Button } from "./ui/moving-border";
import { Link } from 'react-router';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Hero = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const { navigate } = useAppContext();
    const handleGetStarted = () => {
        if (token && user) {
            navigate("/collection");
        }
        else {
            navigate("/login");
            toast.error("please login to access our collection");
        }
    }
    return (
        <div className="md:h-screen h-1/2 md:w-full sm:w-[90vw] rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
            <div className="max-w-4xl mx-auto lg:p-4 md:p-6 text-center ">
                <h1 className="relative z-10 text-5xl sm:text-5xl md:text-6xl lg:text-8xl mt-5 md:mt-0  bg-clip-text h-35 text-transparent bg-gradient-to-b from-white to-neutral-500  text-center font-sans font-bold leading-tight">
                    Join the blogger
                </h1>
                <p></p>
                <p className="text-neutral-400 max-w-xl mx-auto my-2 text-lg text-center relative z-10">
                    Welcome to Blogger — your personal space to share stories, ideas, and expertise with the world. Whether you're a writer, developer, designer, or hobbyist, our platform gives you the tools to craft beautiful, engaging blog posts that connect with your audience.
                </p>
                <div className='mx-auto max-w-xl  flex items-center justify-center mt-5'>

                    <Button
                        onClick={handleGetStarted}
                        borderRadius="1.75rem"
                        className="bg-white dark:bg-black/90 z-40 cursor-pointer text-black dark:text-white border-neutral-200 dark:border-slate-800 flex gap-3"
                    >
                        Get Started <i className="ri-arrow-right-line"></i>
                    </Button>

                </div>

            </div>
            <BackgroundBeams />
        </div>
    )
}

export default Hero
