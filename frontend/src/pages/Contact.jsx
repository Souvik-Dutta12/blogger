import React, { useState } from "react";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import { Button } from "../components/ui/moving-border";

const Contact = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      toast.error("Please fill out all fields.");
      return;
    }

    // TODO: Send data to backend or email service
    toast.success("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <section className="md:min-h-screen z-20 md:w-screen sm:w-[85vw] flex flex-col md:flex-row items-center justify-center px-4  mt-10">
        <div className="w-full z-40 max-w-2xl bg-transparent flex flex-col  rounded-xl shadow-md md:p-10 sm:p-5 space-y-5">
          <h2 className="font-bold  text-center relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl  bg-clip-text  text-transparent bg-gradient-to-b from-white to-neutral-500 font-sans leading-tight ">
            Contact Us
          </h2>
          <p className="font-bold  text-center relative z-10 text-2xl  bg-clip-text  text-transparent bg-gradient-to-b from-white to-neutral-500 font-sans leading-tight ">
            Have questions, feedback, or just want to say hello? Fill out the form below and we’ll get back to you shortly.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full z-40 max-w-2xl bg-transparent flex flex-col  rounded-xl shadow-md md:p-10 sm:p-5 space-y-5"
        >
          <div className="flex flex-col gap-1">
            <label className="block text-md font-bold text-white">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500"
              placeholder="Your name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-md font-bold text-white">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-md font-bold text-white">Message</label>
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500 resize-none"
              placeholder="Your message..."
            ></textarea>
          </div>
          <Button
            containerClassName={`w-full hover:bg-purple-700 duration-500`}
            type="submit"
            borderRadius="1.75rem"
            className="w-full bg-white dark:bg-black/90 z-40 text-md cursor-pointer text-black dark:text-white border-neutral-200 dark:border-slate-800 flex gap-3"
          >
            Send message
          </Button>
        </form>
      </section>

      <Footer />
    </>
  );
};

export default Contact;
