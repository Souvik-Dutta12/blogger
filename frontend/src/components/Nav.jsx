
import React, { useEffect, useState } from 'react'
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "../lib/utils";
import { Link } from 'react-router-dom';
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { Menu as MenuIcon, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';


const Nav = ({ className }) => {
    const [active, setActive] = useState(null);
    const [sidebarOpen, setSidebarOen] = useState(false);

    const { axios, navigate, token, setToken, setUser, user } = useAppContext();


    const toggleSidebar = () => setSidebarOen(!sidebarOpen);

    const handleLogout = async () => {
        try {
            const res = await axios.post("/users/user/logout"); // or wherever your logout endpoint is

            if (res.data.success) {
                toast.success("Logged out successfully");
                setUser(null);
                // Clear auth state from context
                setToken(null);   // if you're storing token in context
                localStorage.clear();
                sessionStorage.clear();
                delete axios.defaults.headers.common["Authorization"];
                // Redirect to login or home
                navigate("/login");
            } else {
                toast.error(res.data.message || "Logout failed");
            }
        } catch (error) {
            toast.error("Something went wrong while logging out");

        }
    };

    return (
        <>



            <div
                className={cn("fixed hidden sm:hidden md:block top-10 inset-x-0 max-w-4xl mx-auto z-100 ", className)}
            >
                {user && (
                    <button className="absolute lg:-left-70 lg:top-7 max-w-72 flex items-center cursor-pointer justify-center text-lg gap-3">
                        <Link to={`/users/user/${user._id}`} className="flex items-center justify-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-500 overflow-hidden">
                                <img
                                    key={user.profileImage || user.username} // 🔁 triggers update on image change
                                    className="w-full h-full object-cover"
                                    src={
                                        user.profileImage?.startsWith("http")
                                            ? user.profileImage
                                            : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.username)}&backgroundColor=3f3f46,b0f0cb&fontWeight=400`
                                    }
                                    alt="user avatar"
                                />
                            </div>
                            <p>{user.username}</p>
                        </Link>
                    </button>
                )}


                <Menu setActive={setActive} >

                    <div className='flex  items-center justify-between space-x-20'>
                        <Link to={"/"} >
                            <h1 className='text-2xl font-black '>blogger</h1>
                        </Link>
                        <div className=' flex items-center justify-between space-x-15'>
                            <div className='flex items-center justify-center space-x-4'>
                                <Link to={"/"}>
                                    <MenuItem setActive={setActive} active={active} item={"Home"}></MenuItem>

                                </Link>
                                <MenuItem setActive={setActive} active={active} item="Services">
                                    <div className="flex flex-col space-y-4 text-sm">
                                        <HoveredLink href="/">Web Development</HoveredLink>
                                        <HoveredLink href="/">Interface Design</HoveredLink>
                                        <HoveredLink href="/">Search Engine Optimization</HoveredLink>
                                        <HoveredLink href="/">Branding</HoveredLink>
                                    </div>
                                </MenuItem>
                                <MenuItem setActive={setActive} active={active} item="Products">
                                    <div className="  text-sm grid grid-cols-2 gap-10 p-4">
                                        <ProductItem
                                            title="Algochurn"
                                            href="https://algochurn.com"
                                            src="https://assets.aceternity.com/demos/algochurn.webp"
                                            description="Prepare for tech interviews like never before."
                                        />
                                        <ProductItem
                                            title="Tailwind Master Kit"
                                            href="https://tailwindmasterkit.com"
                                            src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
                                            description="Production ready Tailwind css components for your next project"
                                        />
                                        <ProductItem
                                            title="Moonbeam"
                                            href="https://gomoonbeam.com"
                                            src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
                                            description="Never write from scratch again. Go from idea to blog in minutes."
                                        />
                                        <ProductItem
                                            title="Rogue"
                                            href="https://userogue.com"
                                            src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
                                            description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
                                        />
                                    </div>
                                </MenuItem>

                                <Link to={"/contact"}>
                                    <MenuItem setActive={setActive} active={active} item={"Contact Us"} />
                                </Link>

                                <Link to={"/collection"}>
                                    <MenuItem setActive={setActive} active={active} item={"Collection"} />

                                </Link>

                            </div>

                            {
                                user ? (
                                    // When token exists → Show Logout
                                    <div className='flex items-center justify-center space-x-4'>

                                        <div className="flex justify-center text-center">
                                            <HoverBorderGradient
                                                containerClassName="rounded-full"
                                                as="button"
                                                onClick={() => handleLogout()}
                                                className="dark:bg-black cursor-pointer bg-white text-black dark:text-white flex items-center space-x-2"
                                            >
                                                <span className='hover:text-[#7fcfec] duration-300'>Log out</span>
                                            </HoverBorderGradient>
                                        </div>

                                    </div>
                                ) : (
                                    // When token doesn't exist → Show Login and Signup
                                    <div className='flex items-center justify-center space-x-4'>
                                        <Link to="/signup">
                                            <div className="flex justify-center text-center">
                                                <HoverBorderGradient
                                                    containerClassName="rounded-full"
                                                    as="button"
                                                    className="dark:bg-black cursor-pointer bg-white text-black dark:text-white flex items-center space-x-2"
                                                >
                                                    <span className='hover:text-[#7fcfec] duration-300'>Sign up</span>
                                                </HoverBorderGradient>
                                            </div>
                                        </Link>
                                        <Link to="/login">
                                            <div className="flex justify-center text-center">
                                                <HoverBorderGradient
                                                    containerClassName="rounded-full"
                                                    as="button"
                                                    className="dark:bg-black cursor-pointer bg-white text-black dark:text-white flex items-center space-x-2"
                                                >
                                                    <span className='hover:text-[#7fcfec] duration-300'>Log in</span>
                                                </HoverBorderGradient>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                </Menu>






            </div>
            <div className=" md:hidden sm:block sm:w-[85vw]  px-5 py-10 flex items-center justify-between">
                <Link to={"/"}>
                    <h1 className="text-2xl font-black">blogger</h1>
                </Link>
                <button onClick={toggleSidebar}>
                    {sidebarOpen ? <X className="w-6 h-6 cursor-pointer" /> : <MenuIcon className="w-6 h-6 cursor-pointer" />}
                </button>
            </div>
            {sidebarOpen && (
                <div className="lg:hidden absolute top-20 left-0 z-100 right-0 bg-white dark:bg-black shadow-xl p-6 space-y-4 duration-500 rounded-xl">
                    <Link to="/" onClick={toggleSidebar} className="block hover:text-[#7fcfec]">Home</Link>
                    <Link to="/" onClick={toggleSidebar} className="block hover:text-[#7fcfec]">Services</Link>
                    <Link to="/" onClick={toggleSidebar} className="block hover:text-[#7fcfec]">Products</Link>
                    <Link to="/contact" onClick={toggleSidebar} className="block hover:text-[#7fcfec]">Contact Us</Link>
                    <Link to="/collection" onClick={toggleSidebar} className="block hover:text-[#7fcfec]">Collection</Link>

                    {user ? (
                        <>
                            <Link to={`/users/user/${user._id}`} onClick={toggleSidebar} className="block hover:text-[#7fcfec]">Profile</Link>
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                                <button onClick={handleLogout} className="block cursor-pointer border w-1/3 px-2 py-2 text-center rounded-full hover:text-[#7fcfec]">Log out</button>
                            </div>
                        </>
                    ) : (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                            <Link to="/signup" onClick={toggleSidebar} className="block cursor-pointer border w-1/3 px-2 py-2 text-center rounded-full hover:text-[#7fcfec]">Sign up</Link>
                            <Link to="/login" onClick={toggleSidebar} className="block cursor-pointer border w-1/3 px-2 py-2 text-center rounded-full hover:text-[#7fcfec]">Log in</Link>
                        </div>
                    )}
                </div>
            )}


        </>
    )
}

export default Nav
