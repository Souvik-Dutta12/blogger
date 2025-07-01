import { Tag } from "../models/tag.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getGeminiColorForTag } from "../utils/getColorFromAi.js"
import { Blog } from "../models/blog.model.js";


const getAllTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find().sort("name");

  if (!tags || tags.length === 0) {
    throw new ApiError(404, "No tags found")
  }

  return res.status(200)
    .json(
      new ApiResponse(200, tags, "Tags fetched successfully")
    )
})

export {

  getAllTags
}