import React from 'react'
import { useState } from 'react';
import { BackgroundBeams } from "./ui/background-beams";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { Button } from "./ui/moving-border";
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';


const Signup = () => {

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { axios, navigate, setUser } = useAppContext();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (form.password.length < 6 && form.confirmPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const signRes = await axios.post("/users/signup", form);

      if (signRes.data.success) {
        toast.success("Signup successful!");

        const logRes = await axios.post("/users/login", {
          email: form.email,
          password: form.password,
        });


        if (logRes.data.success) {
          toast.success("Logged in successfully");

          const token = logRes.data.data.accessToken;
          const { user } = logRes.data.data

          setUser(user);
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user))
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          navigate("/");
        }


      } else {
        toast.error(res.data.message || "Signup failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup error");
    }
  };


  return (
    <div className="md:min-h-screen z-20 md:w-screen sm:w-[85vw] flex items-center justify-center px-4">
      <div className="w-full z-40 max-w-md bg-transparent rounded-xl shadow-md md:p-10 sm:p-5 md:mt-29 space-y-5">
        <h2 className=" font-bold  text-center relative z-10 text-2xl sm:text-5xl md:text-6xl lg:text-4xl  bg-clip-text  text-transparent bg-gradient-to-b from-white to-neutral-500 font-sans leading-tight ">Create Your Account</h2>

        <form onSubmit={handleSubmit} className="-mt-6 w-full flex flex-col gap-3 p-6">
          <div className='flex flex-col gap-1'>
            <label className="block text-md font-bold text-white">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
              className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500"
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className="block text-md font-bold text-white">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
              className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500"
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className="block text-md font-bold text-white">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500"
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className="block text-md font-bold text-white">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              required
              className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500"
            />
          </div>


          <HoverBorderGradient
            containerClassName="rounded-full w-full mt-2"
            as="button"
            className=" dark:bg-black cursor-pointer bg-white text-black dark:text-white flex items-center space-x-2"
          >

            <span className='hover:text-[#7fcfec] duration-300 flex items-center justify-center gap-1'>Sign up<i className="ri-arrow-right-line"></i></span>
          </HoverBorderGradient>

        </form>

        <div className="flex items-center -mt-5 justify-center space-x-2">
          <div className="h-px w-20 bg-neutral-300"></div>
          <p className="text-neutral-500 text-md">OR</p>
          <div className="h-px w-20 bg-neutral-300"></div>
        </div>


        
        <p className="text-center text-md text-neutral-500">
          Already have an account? <a href="#" className="text-[#7fcfec] hover:underline duration-300">Log in</a>
        </p>
      </div>
      <div className="absolute inset-0 -z-10">
        <BackgroundBeams />
      </div>
    </div>

  )
}

export default Signup
