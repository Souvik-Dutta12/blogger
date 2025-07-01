import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ useNavigate for programmatic navigation
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const Collection = () => {
  const [menu] = useState("");

  const [publishedBlogs, setPublishedBlogs] = useState([]);

  const { blogs, navigate, axios } = useAppContext();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));



  const fetchPublishedBlogs = async () => {
    try {
      const res = await axios.get("/blogs/blog");
      const blogs = res.data.data.blogs;
      const temp = blogs.filter(blog => blog.status === "published");
      setPublishedBlogs(temp);
    } catch (err) {

    }
  }

  useEffect(() => {
    fetchPublishedBlogs();
  }, [blogs])


  const filteredBlogs = publishedBlogs.slice(0, 8);
  // ✅ Load more handler: check login
  const handleLoadMore = () => {
    if (token && user) {
      navigate("/collection");
    } else {
      navigate("/login");
      toast.error("Please login to view more collections.");
    }
  };

  return (
    <div className="w-full md:w-full sm:w-[85vw] min-h-screen p-6">
      <h1 className="text-5xl sm:text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-700 text-center font-sans font-bold md:mt-10 sm:-mt-20">
        Few Collections
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center mt-10 items-stretch">
        {filteredBlogs.map((blog, index) => (
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
                  translateZ={20}

                  className="px-4 py-2 rounded-xl text-md font-normal dark:text-white"
                >
                  <Link to={`/blogs/blog/${encodeURIComponent(blog.slug)}`}>
                    Read more →
                  </Link>
                </CardItem>
              </div>

            </CardBody>
          </CardContainer>
        ))}
      </div>

      <div className="flex justify-center mt-10 text-center">
        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          className="dark:bg-black cursor-pointer bg-white text-black dark:text-white flex items-center space-x-2"
          onClick={handleLoadMore}
        >
          <span className="hover:text-[#7fcfec] duration-300 text-xl">Load more</span>
        </HoverBorderGradient>
      </div>
    </div>
  );
};

export default Collection;
