import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import { CardContainer, CardItem, CardBody } from '../components/ui/3d-card'
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router';

const Total = () => {


  const localuser = JSON.parse(localStorage.getItem("user"));

  const { user, setBlogs, blogs, axios } = useAppContext();

  const [userBlogs, setUserBlogs] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [confirmationInput, setConfirmationInput] = useState("");

  const fetchUserBlogs = async () => {
    try {
      const res = await axios.get(`/users/user/${user._id}/blogs`);
      const allUserBlogs = res.data.data;
      const publishedBlogs = allUserBlogs.filter(blog => blog.status === "published");
      setUserBlogs(publishedBlogs);
    } catch (error) {
      toast.error("Failed to fetch blogs");
    }
  }

  useEffect(() => {

    if (user && user._id) {
      fetchUserBlogs()
    }
  }, [user, blogs])

  const handleDeleteBlog = async () => {
    if (!blogToDelete || !blogToDelete.slug) {
      return toast.error("Invalid blog selected for deletion");
    }

    try {

      const response = await axios.delete(`/blogs/blog/${blogToDelete.slug}`);

      if (response.status === 200) {
        toast.success("Blog deleted successfully");


        setBlogs((prev) => prev.filter((blog) => blog.slug !== blogToDelete.slug));

        setShowModal(false);
        setBlogToDelete(null);
        setDeleteReason("");
        setConfirmationInput("");
      } else {

        toast.error("Failed to delete blog. Please try again.");
      }
    } catch (err) {

      toast.error("Failed to delete blog. Server error occurred.");
    }
  };


  return (
    localuser ? (
      <>
        <div className='md:min-h-screen h-1/2 md:w-full sm:w-[90vw] rounded-md bg-black relative flex flex-col items-center justify-center'>


          <h1 className='relative z-10 text-3xl sm:text-3xl md:text-4xl lg:text-5xl mt-5 md:mt-40 sm:mt-5 bg-clip-text h-35  text-transparent bg-gradient-to-b from-white to-neutral-500  text-center font-sans font-bold leading-tight'>
            {
              userBlogs.length !== 0 ? "Your posted blogs" : "No posted blog yet"
            }
          </h1>
          <div className="w-full md:w-full sm:w-[90vw] -mt-15 md:-mt-10 sm:-mt-15 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 justify-items-center pr-5 md:pr-3 sm:pr-5 pl-5 md:pl-0 sm:pl-5">

            {Array.isArray(userBlogs) && userBlogs.length > 0 && userBlogs.map((blog, index) => (
              <CardContainer key={blog._id} className="inter-var">
                <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full sm:w-[22rem] h-[500px] flex flex-col rounded-xl p-6 border">

                  <div className='flex flex-col justify-evenly h-full'>
                    <CardItem className="text-xl font-bold text-neutral-600 dark:text-white">
                      {blog.title}
                    </CardItem>

                    <CardItem as="p" className="text-neutral-500 text-sm max-w-sm dark:text-neutral-300 mt-2">
                      {blog.shortDescription || "No description provided."}
                    </CardItem>
                  </div>

                  <CardItem translateZ="20" className="w-full mt-4 flex-grow">
                    <img
                      src={blog.coverImage || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop"}
                      height="1000"
                      width="1000"
                      className="h-60 w-full object-center rounded-xl group-hover/card:shadow-xl"
                      alt="blog thumbnail"
                    />
                  </CardItem>

                  <div className="flex justify-between items-center mt-6">
                    <CardItem
                      translateZ={60}
                      as="a"
                      href={`/blogs/${encodeURIComponent(blog.slug)}`}
                      className="px-4 py-2 rounded-xl text-lg font-normal dark:text-[#7fcfec]"
                    >
                      <Link to={`/blogs/${encodeURIComponent(blog.slug)}`}>
                        Edit
                      </Link>
                    </CardItem>
                    <CardItem
                      translateZ={60}
                      as="button"
                      onClick={() => {
                        setBlogToDelete(blog);
                        setShowModal(true);
                      }}

                      className="px-4 py-2 rounded-xl text-lg font-normal dark:text-red-500 cursor-pointer"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </CardItem>

                  </div>

                </CardBody>
              </CardContainer>
            ))}

          </div>
        </div>


        {showModal && blogToDelete && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-white/10 z-100">
            <div className="bg-white dark:bg-zinc-950 rounded-lg p-6 w-[90%] max-w-lg shadow-xl">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Confirm Deletion</h2>

              <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">
                Please type <strong className="text-red-600 dark:text-red-400">"{blogToDelete.title}"</strong> to confirm deletion of this blog.
              </p>

              <input
                type="text"
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder="Type the blog title to confirm"
                className="w-full text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500"
              />

              <textarea
                placeholder="Optional: Reason for deletion"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full mt-2 text-md font-normal px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 focus:outline-none focus:ring-0 focus:ring-zinc-500 resize-none"
                rows={3}
              />

              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setBlogToDelete(null);
                    setDeleteReason("");
                    setConfirmationInput("");
                  }}
                  className="px-5 py-2 cursor-pointer rounded-xl bg-gray-300 text-black dark:bg-zinc-800 dark:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteBlog}
                  disabled={confirmationInput.trim() !== blogToDelete.title}
                  className={`px-4 py-2  rounded-xl text-white ${confirmationInput.trim().toLowerCase() === blogToDelete.title.toLowerCase()
                    ? "bg-red-500 hover:bg-red-700 cursor-pointer"
                    : "bg-red-300 cursor-not-allowed"
                    }`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}


        <Footer />
      </>) : null

  )
}

export default Total
