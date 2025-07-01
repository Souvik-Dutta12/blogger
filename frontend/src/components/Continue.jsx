import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { HoverBorderGradient } from "../components/ui/hover-border-gradient";
import Footer from "../components/Footer"
import { Button } from "../components/ui/moving-border";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { Link } from "react-router";

const Update = () => {
  const [authorName, setAuthorName] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [useAIDescription, setUseAIDescripton] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState("")


  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);


  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const { navigate, axios, setBlogs } = useAppContext();
  const { slug: blogSlug } = useParams();

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      ["link"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "link",
    "list",
    "bullet",
    "color",      
  "background", 
  ];


  useEffect(() => {
    const generateSlug = (text) => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-") // replace spaces and non-word chars with dash
        .replace(/^-+|-+$/g, "");  // remove leading/trailing dashes
    };
    setSlug(generateSlug(title));
  }, [title]);

  useEffect(() => {
    const fetchBlogToEdit = async () => {
      if (!blogSlug) return;
      try {
        const res = await axios.get(`/blogs/blog/${blogSlug}`);
        const blog = res.data.data;

        setTitle(blog.title);
        setSlug(blog.slug);
        setShortDescription(blog.shortDescription);
        setAuthorName(blog.authorName);
        setDescription(blog.description);
        setTags(blog.tags || []);
        setStatus(blog.status);
        setCoverImage(blog.coverImage);
      } catch (error) {
        toast.error("Failed to load blog data for editing");
      }
    };
    fetchBlogToEdit();
  }, [blogSlug]);


  // Add tag when user presses Enter or comma
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  // Remove tag by index
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !slug || !shortDescription || !authorName || !description) {
      return toast.error("Please fill in all required fields.");
    }

    setIsSubmitting(true);

    try {
      // Build the payload dynamically
      const detailsPayload = {};

      if (title) detailsPayload.title = title;
      if (slug) detailsPayload.newSlug = slug;
      if (shortDescription) detailsPayload.shortDescription = shortDescription;
      if (description) detailsPayload.description = description;
      if (authorName) detailsPayload.authorName = authorName;
      if (status) detailsPayload.status = status;
      if (Array.isArray(tags)) detailsPayload.tags = tags.map(tag => typeof tag === "string" ? tag : tag.name); // include even empty array

      // 1. Update blog details
      await axios.patch(`/blogs/blog/${blogSlug}`, detailsPayload);

      // 2. Update cover image only if a new file is selected
      if (coverImage && typeof coverImage !== "string") {
        const formData = new FormData();
        formData.append("coverImage", coverImage);

        await axios.patch(`/blogs/blog/${blogSlug}/cover-image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success("Blog updated successfully!");
      navigate("/draft");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update blog."
      );
    } finally {
      setIsSubmitting(false);
    }
  };



  const generateAIDescription = async () => {
    if (!title || !shortDescription) {
      return toast.error("Title and short description are required.");
    }

    setIsGenerating(true);
    try {
      const res = await axios.post("/blogs/blog/preview", {
        title,
        shortDescription
      });

      const aiDescription = res.data?.data?.description;

      if (aiDescription) {
        setUseAIDescripton(true);            // track that AI was used
        setDescription(aiDescription);       //  show in ReactQuill editor
        toast.success("AI description generated!");
      } else {
        toast.error("AI did not return any description.");
      }
    } catch (error) {
      toast.error("AI generation failed.");

    } finally {
      setIsGenerating(false);
    }
  };


  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"))
  const handleChange = (value) => {
    setDescription(value);
  }
  return (

    user ? (
      <>
        <div className="w-screen md:w-screen sm:w-[85vw] mx-auto mt-0 md:mt-40 sm:mt-5 px-7 md:px-20 sm:px-5 bg-white dark:bg-black rounded shadow-md">
          <h1 className="relative z-10 text-3xl sm:text-3xl md:text-4xl lg:text-5xl  bg-clip-text h-20 text-transparent bg-gradient-to-b from-white to-neutral-500  text-center font-sans font-bold leading-tight">
            Continue Your Blog
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6 mt-5 ">

            <span className="text-neutral-500 cursor-pointer w-auto hover:text-white duration-300 flex gap-1 items-center">
              <Link to={"/draft"}>
                <i className="ri-arrow-left-long-line"></i>Back
              </Link>
            </span>
            {/* Author Name */}
            <div className="flex flex-col gap-1 md:w-1/3 sm:w-full">


              <label htmlFor="authorName" className="block text-md font-bold text-white">
                Author Name
              </label>
              <input
                type="text"
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
                className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500"
                placeholder="Your full name"
              />
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1 md:w-1/2 sm:w-full">
              <label htmlFor="title" className="block text-md font-bold text-white">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500"
                placeholder="Enter your blog title"
              />
            </div>

            {/* Slug (readonly) */}
            <div className="flex flex-col gap-1 md:w-1/2 sm:w-full">
              <label htmlFor="slug" className="block text-md font-bold text-white">
                Slug (auto-generated)
              </label>
              <input
                type="text"
                id="slug"
                value={slug}
                readOnly
                className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-700 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500 cursor-not-allowed "
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="w-full">
                <div className="flex flex-col gap-1 md:w-1/3 sm:w-full">
                  <label htmlFor="coverImage" className="block text-md font-bold text-white">
                    Cover Image
                  </label>
                  <input
                    type="file"
                    id="coverImage"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setCoverImage(e.target.files[0]); // This will now be a File object
                      }
                    }}
                    className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500 cursor-pointer"
                  />
                </div>

                {coverImage && (
                  <img
                    src={typeof coverImage === "string" ? coverImage : URL.createObjectURL(coverImage)}
                    alt="Cover Preview"
                    className="mt-4 rounded-md max-h-60 object-cover"
                  />
                )}
              </div>


              {/* Tags Input */}
              <div className="flex flex-col gap-1 md:w-2/3 sm:w-full mt-5 md:mt-0 sm:mt-5">
                <label htmlFor="tags" className="block text-md font-bold text-white">
                  Tags (press Enter or comma to add)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add tags"
                  className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500 "
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, idx) => {
                    const tagName = typeof tag === "string" ? tag : tag.name;
                    return (
                      <span
                        key={tag._id || tagName || idx}
                        className="flex items-center bg-zinc-600 text-white rounded px-2 py-1 text-sm cursor-pointer select-none"
                        onClick={() => removeTag(idx)}
                        title="Click to remove tag"
                      >
                        {tagName} &times;
                      </span>
                    );
                  })}

                </div>
              </div>
            </div>
            {/* Short Description */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="shortDescription" className="block text-md font-bold text-white">
                Short Description
              </label>
              <textarea
                id="shortDescription"
                rows={3}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                maxLength={250}
                placeholder="A brief summary of your blog"
                className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500 resize-none"
                required
              />
              <p className="text-sm dark:text-neutral-400 mt-1">
                {shortDescription.length} / 250 characters
              </p>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1 w-full relative">
              <label htmlFor="description" className="block text-md font-bold text-white">
                Description
              </label>
              <ReactQuill
                value={description}
                onChange={handleChange}
                theme="snow"
                placeholder="Write your blog content here..."
                modules={modules}
                formats={formats}
              />

              <div className="absolute bottom-5 right-3">
                <Button
                  type="button"
                  onClick={generateAIDescription}
                  containerClassName="w-auto rounded-md hover:bg-purple-700 duration-300"
                  borderRadius="1 rem"
                  className={`bg-white rounded-md px-5 py-0 dark:bg-black/90 z-40 cursor-pointer text-black dark:text-white border-neutral-200 text-sm md:text-lg dark:border-slate-800 flex gap-3 items-center ${isGenerating ? " cursor-not-allowed" : "hover:text-[#7fcfec]"
                    }`}
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-50"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-50"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate with AI <i className="ri-bard-fill"></i>
                    </>
                  )}
                </Button>
              </div>

            </div>

            {/* Submit Button */}
            {isSubmitting ? (
              <div className="flex justify-center items-center gap-2 mt-10">
                <svg
                  className="animate-spin h-6 w-6 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <p className="text-white text-sm">Please wait while we post your masterpiece...</p>
              </div>
            ) : (
              <div className="flex mx-auto justify-center gap-6 mt-10 mb-15">
                <div className=" flex justify-center text-center">
                  <HoverBorderGradient
                    containerClassName="rounded-full"
                    as="button"
                    type="submit"
                    onClick={() => setStatus("draft")}
                    className="px-7 py-3 dark:bg-zinc-800 cursor-pointer bg-white text-black dark:text-white flex items-center space-x-2"
                  >
                    <span className="hover:text-[#7fcfec] duration-300">Save blog</span>
                  </HoverBorderGradient>
                </div>
                <div className=" flex justify-center text-center">
                  <HoverBorderGradient
                    containerClassName="rounded-full"
                    as="button"
                    type="submit"
                    onClick={() => setStatus("published")}
                    className="px-7 py-3 dark:bg-zinc-900 cursor-pointer bg-white text-black dark:text-white flex items-center space-x-2"
                  >
                    <span className="hover:text-[#7fcfec] duration-300">Post blog</span>
                  </HoverBorderGradient>
                </div>
              </div>
            )}

          </form>
        </div>

        <Footer />
      </>
    ) : null
  )
};

export default Update
