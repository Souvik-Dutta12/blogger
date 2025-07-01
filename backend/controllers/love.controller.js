import { Comment } from "../models/comment.model.js";
import { Love } from "../models/love.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getLoveCount = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const loveCount = comment.loves?.length || 0;

  return res.status(200).json(
    new ApiResponse(200, { loveCount }, "Love count fetched successfully")
  );
});

export {
  getLoveCount
}