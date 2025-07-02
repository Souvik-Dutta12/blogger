import React, { useState, useEffect } from 'react'
import { Button } from "../components/ui/moving-border";
import { Link } from 'react-router';
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";
import { HoverBorderGradient } from "../components/ui/hover-border-gradient";
import Footer from "../components/Footer"
import Pagination from '../components/Pagination';
import { GlareCard } from "../components/ui/glare-card";
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';


const CollectionHero = () => {

  const [tags, setTags] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);


  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const [draftBlogs, setDraftBlogs] = useState([]);

  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [totalFilteredCount, setTotalFilteredCount] = useState(0);


  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const { axios, navigate } = useAppContext();

  const postsPerPage = 12;

  const currentBlogs = filteredBlogs;




  const fetchTags = async () => {
    try {
      const res = await axios.get("/tags/");

      setTags(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch tags");
    }
  };

  useEffect(() => {

    if (!token || !user) {
      toast.error("Please login to access our collection");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }
    fetchTags();
  }, []);

  const handleTagClick = (tagName) => {
    setSelectedTags(prev => {
      const alreadySelected = prev.includes(tagName);

      if (alreadySelected) {
        // Remove tag
        return prev.filter(tag => tag !== tagName);
      } else {
        // Add tag (only if less than 3)
        if (prev.length < 3) {
          return [...prev, tagName];
        } else {
          toast.error("You can select up to 3 tags only");
          return prev;
        }
      }
    });
  };

  const fetchUserBlogs = async () => {
    try {
      const res = await axios.get(`/users/user/${user._id}/blogs`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      const allUserBlogs = res.data.data;
      setPublishedBlogs(allUserBlogs.filter(blog => blog.status === "published"));
      setDraftBlogs(allUserBlogs.filter(blog => blog.status === "draft"));
    } catch (err) {

    }
  }

  useEffect(() => {

    if(!user?._id || !token) return;
    fetchUserBlogs();

  }, [token,user]);

  const fetchFilteredBlogs = async () => {
    try {
      const query = {
        page: currentPage,
        limit: postsPerPage,
        status: "published"
      };

      if (selectedTags.length > 0) {
        query.tags = selectedTags.join(",");
      }

      const res = await axios.get("/blogs/tags", { params: query });

      const { blogs, pagination } = res.data.data;
      setFilteredBlogs(blogs);
      setTotalFilteredCount(pagination.total);
    } catch (err) {
      toast.error("Failed to fetch blogs");
    }
  };

  useEffect(() => {
    fetchFilteredBlogs();
  }, [selectedTags, currentPage]);

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, [currentPage]);


  return (
    <>

      <div className="md:h-auto h-1/2 md:w-full sm:w-[90vw] rounded-md bg-black relative flex flex-col items-center justify-center antialiased md:mt-50  sm:mt-10">
        <h1 className='relative z-10 text-lg sm:text-lg md:text-2xl lg:text-2xl max-w-8xl bg-clip-text md:h-35 text-transparent bg-gradient-to-b from-white to-neutral-500  text-center font-sans p-9 font-bold leading-tight '>Welcome to the blog collection! Explore a variety of posts shared by our community — from personal insights to helpful tutorials. Got something to share? You can also write your own blog right from here and let your voice be heard. Start expressing your thoughts, stories, or knowledge with just a click!</h1>
        <Link to={"/writeblog"} className=''>
          <Button
            containerClassName="w-auto  hover:bg-zinc-800"
            borderRadius="1.75rem"
            className="bg-white px-5 dark:bg-black/90 hover:bg-zinc-800 duration-700 z-40 cursor-pointer text-black dark:text-white border-neutral-200 dark:border-slate-800 flex gap-3"
          >Write your own blog

          </Button>
        </Link>
      </div>
      <div className="w-full md:w-full sm:w-[90vw] mt-3 p-6 flex items-center justify-center gap-10 md:gap-20 sm:gap-10">
        <button className='cursor-pointer'>
          <Link to={'/total'}>
            <GlareCard className="flex flex-col items-center justify-center">

              <h1 className='flex items-center md:gap-2 sm:gap-1 md:text-4xl sm:text-lg justify-center font-bold'>Total blog <i className="ri-news-line"></i></h1>
              <span className='font-bold md:text-4xl sm:text-lg'>{publishedBlogs.length}</span>

            </GlareCard>
          </Link>
        </button>
        <button className=' cursor-pointer'>
          <Link to={'/draft'}>
            <GlareCard className="flex flex-col items-center justify-center">
              <h1 className='flex items-center md:gap-2 sm:gap-1 md:text-4xl sm:text-lg justify-center font-bold'>Draft<i className="ri-draft-line"></i></h1>
              <span className='font-bold md:text-4xl sm:text-lg'>{draftBlogs.length}</span>
            </GlareCard>
          </Link>
        </button>

      </div>

      <div className="w-full md:w-full sm:w-[90vw] min-h-screen p-6 ">
        <h1 className=" text-5xl sm:text-5xl md:text-7xl  bg-clip-text h-30 text-transparent bg-gradient-to-b from-white to-neutral-700  text-center font-sans font-bold  md:mt-10 sm:-mt-20">Our Collections</h1>
        <div className="w-full md:w-full sm:w-[90vw] flex flex-wrap gap-2 p-5">
          {tags.map((tag) => (
            <span
              key={tag._id}
              onClick={() => handleTagClick(tag.name)}
              className={`cursor-pointer transition-all duration-300 rounded-md border px-1.5 py-0.5 text-sm leading-none
      ${selectedTags.includes(tag.name)
                  ? "bg-cyan-800 text-cyan-200  border-cyan-600"
                  : "bg-cyan-300/10 text-cyan-500 border-cyan-400"
                }
      
      hover:bg-cyan-300 hover:border-cyan-500 hover:text-black

    `}
            >
              {tag.name}
            </span>
          ))}

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 justify-items-center">
          {currentBlogs.map((blog, index) => (
            <CardContainer key={blog._id} className="inter-var">
              <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1]  w-[90vw] max-w-[22rem] md:w-[22rem]  h-[500px] flex flex-col rounded-xl p-6 border">

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

        <Pagination
          totalPosts={totalFilteredCount}
          postsPerPage={postsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />

      </div>


      <Footer />
    </>
  )
}

export default CollectionHero