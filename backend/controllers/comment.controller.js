import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createComment = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.user?._id; // ✅ Fix here
  const { content } = req.body;

  if (!slug) {
    throw new ApiError(404, "Blog not found");
  }

  const blog = await Blog.findOne({ slug });
  const blogId = blog?._id;

  if (!blogId) {
    throw new ApiError(404, "Blog not found");
  }

  if (!userId) {
    throw new ApiError(401, "Unauthorized User");
  }

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const comment = await Comment.create({
    content,
    user: userId,       // Make sure to store the userId in the comment
    blog: blogId      // Optionally, store the slug or blog ID here
  });

  const createdComment = await Comment.findById(comment._id);

  if (!createdComment) {
    throw new ApiError(404, "Comment not found");
  }

  return res.status(200).json(
    new ApiResponse(200, createdComment, "Comment created successfully") // ✅ Fix here too
  );
});

const getCommentsByBlog = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    throw new ApiError(404, "Blog not found");
  }

  const blog = await Blog.findOne({ slug });

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const comments = await Comment.find({ blog: blog?._id }).populate("user", "username email profileImage").sort({ createdAt: -1 });

  if (!comments || comments.length === 0) {
    throw new ApiError(404, "No comments found for this blog")
  }

  return res.status(200)
    .json(
      new ApiResponse(200, comments, "Comments fetched successfully")
    )
})

const toggleLove = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id;

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  if (!userId) {
    throw new ApiError(401, "Unauthorized User");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const alreadyLoved = comment.loves.some(id => id.toString() === userId.toString());

  if (alreadyLoved) {
    comment.loves = comment.loves.filter(id => id.toString() !== userId.toString());
  } else {
    comment.loves.push(userId);
  }

  await comment.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      { loved: !alreadyLoved, loveCount: comment.loves.length },
      "Comment love status toggled"
    )
  );
});

const deleteComment = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized user");
  }

  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(404, "Comment ID not provided");
  }

  const comment = await Comment.findById(commentId).populate("blog");
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Check if the user owns the blog
  const blogOwnerId = comment.blog?.user?.toString(); // assuming blog.user stores blog creator's ID

  if (blogOwnerId !== userId.toString()) {
    throw new ApiError(403, "Only the blog owner can delete comments");
  }

  await Comment.findByIdAndDelete(commentId);

  return res.status(200).json(
    new ApiResponse(200, null, "Comment deleted successfully")
  );
});

export {
  createComment,
  getCommentsByBlog,
  toggleLove,
  deleteComment
}