import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { HoverBorderGradient } from "../components/ui/hover-border-gradient";
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';

const ReadBlog = () => {
  const { slug } = useParams();
  const { axios } = useAppContext();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState([]);

  const [lovedComments, setLovedComments] = useState({});
  const [loveCounts, setLoveCounts] = useState({});

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);


  useEffect(() => {
    if (!comments || !user?._id) return;
    const initialLoved = {};
    const initialCounts = {};

    comments.forEach(comment => {
      initialLoved[comment._id] = comment.loves.includes(user._id);
      initialCounts[comment._id] = comment.loves.length;
    });

    setLovedComments(initialLoved);
    setLoveCounts(initialCounts);
  }, [comments, user?._id]);

  useEffect(() => {

    fetchBlogData();
    fetchBlogComments(); // ✅ both triggered on mount/slug change

  }, [slug]);

  //  Fetch blog data
  const fetchBlogData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/blogs/blog/${slug}`);

      if (res.data.success) {
        setData(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("404! Blog not found");
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments
  const fetchBlogComments = async () => {

    try {
      const res = await axios.get(`/comments/comment/${slug}`);

      // If successful, even if there are no comments, set empty array
      if (res.data.success) {
        const commentData = res.data.data;
        setComments(commentData || []);
      }
    } catch (error) {

    }


  };

  const handleToggleLove = async (commentId) => {
    try {
      const res = await axios.patch(`/comments/comment/${commentId}/toggle`);

      const { loved, loveCount } = res.data.data;

      setLovedComments(prev => ({ ...prev, [commentId]: loved }));
      setLoveCounts(prev => ({ ...prev, [commentId]: loveCount }));
    } catch (err) {

      toast.error("Failed to toggle love");
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!name || !content) return toast.error("Please fill in all fields");

    setSubmitting(true);
    try {
      const res = await axios.post(`/comments/comment/${slug}/create`, { name, content });

      if (res.data.success) {
        toast.success("Comment posted!");
        setName('');
        setContent('');
        fetchBlogComments(); //  refresh comment list
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  //  Handle loading & empty
  if (loading) return <div className="text-center py-10 text-neutral-500">Loading blog...</div>;
  if (!data) return <div className="text-center py-10 text-red-500">Blog not found.</div>;

  const { coverImage, title, shortDescription, authorName, createdAt, tags, description } = data;

DOMPurify.addHook("uponSanitizeAttribute", function (node, data) {
  if (data.attrName === "style") {
    const allowedStyles = ["text-align", "color", "background-color"];
    const styles = data.attrValue.split(";").map((s) => s.trim());

    const filtered = styles.filter((style) => {
      const [property] = style.split(":").map((part) => part.trim());
      return allowedStyles.includes(property);
    });

    data.attrValue = filtered.join("; ");
  }
});

  const cleanedDescription = DOMPurify.sanitize(
    description.replace(/<p>(\s|&nbsp;|<br>)*<\/p>/g, ""), // clean empty p
    {
      ALLOWED_ATTR: ["style", "href", "target"],
      FORBID_TAGS: ["style"],
    }
  ).replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');


  const handleDelete = async (commentId) => {
    try {
      const res = await axios.delete(`/comments/comment/${commentId}`);
      if (res.status === 200) {
        toast.success("Comment deleted successfully");

        // ✅ update state without reload
        setComments((prev) => prev.filter((c) => c._id !== commentId));

        setLovedComments((prev) => {
          const updated = { ...prev };
          delete updated[commentId];
          return updated;
        });

        setLoveCounts((prev) => {
          const updated = { ...prev };
          delete updated[commentId];
          return updated;
        });
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to delete comment";
      toast.error(msg);
    }
  };

  const confirmDelete = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };


  return (
    <>
      <div className="max-w-4xl mx-auto px-4 lg:pt-40 py-10 bg-white dark:bg-neutral-950 rounded-xl shadow-md">
        <img
          src={coverImage}
          alt={title}
          className="border border-zinc-600 w-full object-center shadow-md rounded-lg mb-6"
        />
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">{title}</h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-300 mb-4">{shortDescription}</p>
        <div className="flex justify-between text-sm text-neutral-400 dark:text-neutral-500 mb-6">
          <span>By {authorName}</span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, i) => (
            <span key={i} className="rounded-md border border-cyan-400 bg-cyan-200 px-1.5 py-0.5 text-sm text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-500">
              #{tag.name}
            </span>
          ))}
        </div>
        <div
          className="blog-content prose prose-zinc dark:prose-invert max-w-none custom-prose"
          dangerouslySetInnerHTML={{ __html: cleanedDescription }}
        ></div>

        {/* Comment Section */}
        <div className="mt-15">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-neutral-800 dark:text-white">Comments
            { 
              comments.length !== 0 ? (
              <span className='ml-3 text-sm font-semibold text-neutral-500'>
                {comments.length}
              </span>
              ) : (null)
            }
          </h2>

          {user ? (<form onSubmit={handleCommentSubmit} className="mb-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full mb-2 px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 text-white"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Leave a comment..."
              rows="4"
              className="w-full text-md px-4 py-2 border rounded-xl bg-zinc-900 border-zinc-600 text-white resize-none"
            />
            <HoverBorderGradient
              containerClassName="rounded-xl mt-2"
              as="button"
              type="submit"
              className="dark:bg-black cursor-pointer bg-white text-black dark:text-white flex items-center space-x-2"
              disabled={submitting}
            >
              <span className='hover:text-[#7fcfec] duration-300'>Post comment</span>
            </HoverBorderGradient>
          </form>) : null}

          {/* Comments */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-neutral-400">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="border-t pt-4 dark:border-gray-700 flex justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                      <strong>{comment.user.username}</strong> — {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-neutral-800 dark:text-neutral-200">{comment.content}</p>
                  </div>
                  <div className="flex items-center">
                    {user ? (
                      <div className='flex items-center justify-center gap-7'>
                        <div className='flex items-center justify-center'>
                          <i
                            className={`ri-heart-fill text-xl mr-2 cursor-pointer transition-colors ${lovedComments[comment._id] ? "text-pink-600" : "text-zinc-500 hover:text-pink-600"
                              }`}
                            onClick={() => handleToggleLove(comment._id)}
                          ></i>

                          <span className="text-sm text-zinc-500">{loveCounts[comment._id]}</span>
                        </div>
                        {user && data?.user && user._id === data?.user && (
                          <button
                            className="text-red-500 text-lg cursor-pointer"
                            onClick={() => confirmDelete(comment._id)}
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>



                        )}
                      </div>




                    ) : null}

                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-100 flex items-center justify-center">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 w-[90%] max-w-md text-center border border-zinc-700">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Delete Comment?</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6">
                Are you sure you want to delete this comment? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    handleDelete(commentToDelete);
                    setShowDeleteModal(false);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-red-600"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-zinc-300 dark:bg-zinc-700 text-black dark:text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-zinc-400 dark:hover:bg-zinc-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}



      </div>
      <Footer />
    </>
  );
};

export default ReadBlog;
