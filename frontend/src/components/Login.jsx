import React, { useState } from 'react';
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { BackgroundBeams } from "./ui/background-beams";
import { useAppContext } from '../context/AppContext';
import { Link } from "react-router-dom"; // ✅ Import Link
import { toast } from 'react-toastify';

const Login = () => {
  const { axios, setToken, navigate, setUser } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("/users/login", {
      email,
      password,
    });

    const token = res?.data?.data?.accessToken;
    const { user } = res.data.data;

    if (token) {
      setUser(user);
      setToken(token);

      // ✅ Save token & user based on "Remember Me" choice
      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      toast.success("Logged in successfully!");
      navigate("/");
    } else {
      toast.error("Login failed");
    }

  } catch (err) {
    toast.error("Login failed!");
  }
};



  return (
    <div className="md:min-h-screen z-20 md:w-screen sm:w-[85vw] flex items-center justify-center px-4">
      <div className="w-full z-40 max-w-md bg-transparent rounded-xl shadow-md md:p-10 sm:p-5 md:mt-29 space-y-5">
        <h2 className="font-bold text-center relative z-10 text-2xl sm:text-5xl md:text-6xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 font-sans leading-tight">
          Login to Blogger
        </h2>

        <form className="-mt-6 w-full flex flex-col gap-3 p-6" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className='flex flex-col gap-1'>
            <label htmlFor="email" className="block text-md font-bold text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder='Enter email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500"
            />
          </div>

          {/* Password Field */}
          <div className='flex flex-col gap-1'>
            <label htmlFor="password" className="block text-md font-bold text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder='Enter password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500"
            />
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between text-md font-bold">
            <label className="flex items-center gap-2 text-neutral-500 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
                className="appearance-none h-4 w-4 rounded-full border border-gray-400 checked:bg-[#7fcfec] checked:border-transparent transition duration-200"
              />
              Remember me
            </label>
            <Link to="/login" className="text-[#7fcfec] hover:underline duration-300">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <HoverBorderGradient
            onClick={(e) => handleSubmit(e)}
            containerClassName="rounded-full w-full mt-2"
            as="button"
            className="dark:bg-black cursor-pointer bg-white text-black dark:text-white flex items-center space-x-2"
          >
            <span className='hover:text-[#7fcfec] duration-300 flex items-center justify-center gap-1'>
              Log in<i className="ri-arrow-right-line"></i>
            </span>
          </HoverBorderGradient>
        </form>

        {/* Sign Up Redirect */}
        <p className="text-center text-md text-neutral-500 -mt-4">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-[#7fcfec] hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <div className="absolute inset-0 -z-10">
        <BackgroundBeams />
      </div>
    </div>
  );
};

export default Login;
