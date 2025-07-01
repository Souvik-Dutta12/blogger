import React from 'react'
import { Link } from 'react-router';
const Footer = () => {
    return (
        <div className='w-screen h-auto z-100 px-6 py-10'>
            <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10'>
                <div className='flex flex-col items-start gap-6'>
                    <h2 className="text-6xl font-bold text-white mb-4">blogger</h2>
                    <p className="text-md text-neutral-400">
                        I'm <b className='text-white'>Souvik Dutta</b> — a blogger passionate about web development, AI, and sharing what I learn. Follow along for tutorials, insights, and tech thoughts!
                    </p>
                </div>

                <div className='md:ml-30 sm:ml-0'>
                    <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
                    <ul className="space-y-2 text-md text-neutral-400">
                        <li><Link to={"/"} className="hover:text-[#7fcfec] transition duration-300">Home</Link></li>
                        <li><Link to={"/collection"} className="hover:text-[#7fcfec] transition duration-300">Blogs</Link></li>
                        <li><Link to={"/contact"} className="hover:text-[#7fcfec] transition duration-300">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Follow Me</h2>
                    <div className="flex space-x-4 text-lg text-neutral-400">
                        <Link to={"https://github.com/Souvik-Dutta12"}><i className="ri-github-fill hover:text-[#7fcfec] duration-300"></i></Link>
                        <Link to={"#"}><i className="ri-twitter-x-fill hover:text-[#7fcfec] duration-300"></i></Link>
                        <Link to={"#"}><i className="ri-facebook-fill hover:text-[#7fcfec] duration-300"></i></Link>
                        <Link to={"#"}><i className="ri-instagram-line hover:text-[#7fcfec] duration-300"></i></Link>
                    </div>
                </div>
            </div>

            <div className="border-t border-white mt-10 pt-6 text-center text-md text-neutral-400">
                © 2025 Souvik Dutta. All rights reserved.
            </div>
        </div>


    )
}

export default Footer
