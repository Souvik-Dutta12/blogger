import { User } from '../models/user.model.js';
import { Blog } from '../models/blog.model.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { uploadOncloudinary } from '../utils/cloudinary.js';

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}
const signUpUser = asyncHandler(
    async (req, res) => {
        // check for existing email/username

        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            throw new ApiError(400, "All fields are required");
        }

        //exist already 
        const exsistedUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (exsistedUser) {
            throw new ApiError(409, "User already exists");
        }

        const user = await User.create({
            username: username.toLowerCase(),
            email,
            password,
        })


        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            throw new ApiError(500, "Failed to create user");
        }

        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered successfully")
        )
    }
)

const loginUser = asyncHandler(async (req, res) => {

    // find user by email
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    // compare password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }
    // access and refresh token(s)

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //cookie
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                }
                , "User loggedin Successfully")
        )

})

const logoutUser = asyncHandler(async (req, res) => {

    // remove refresh token
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }

    )


    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {

    const inComingRrefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!inComingRrefreshToken) {
        throw new ApiError(401, "Unauthorised request")
    }

    try {
        const decodedToken = jwt.verify(inComingRrefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Unauthorised request")
        }

        if (inComingRrefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)


        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh Token")
    }

})

const updateProfileImage = asyncHandler(async (req, res) => {
    const profileImageLocalPath = req.file?.path;

    if (!profileImageLocalPath) {
        throw new ApiError(400, "Profile image is required.");
    }

    const uploadedImage = await uploadOncloudinary(profileImageLocalPath);

    if (!uploadedImage.url) {
        throw new ApiError(500, "Error while uploading profile image.");
    }

    await User.findByIdAndUpdate(
        req.user._id,
        { $set: { profileImage: uploadedImage.url } },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, null, "Profile image updated successfully")
    );
});


const getUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const currentUser = await User.findById(userId).select("-password -refreshToken");

    if (!currentUser) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200)
        .json(new ApiResponse(200, currentUser, "User found successfully"))

})

const updateUserProfile = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!password) {
        throw new ApiError(400, "Password is required to update profile.");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Incorrect password.");
    }

    const updateFields = {};

    if (username) updateFields.username = username;
    if (email) updateFields.email = email;

    // Check and upload new profile image if exists

    if (req.file?.path) {
        const uploadedImage = await uploadOncloudinary(req.file.path);


        if (!uploadedImage.url) {
            throw new ApiError(500, "Image upload failed.");
        }
        updateFields.profileImage = uploadedImage.url;
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateFields },
        { new: true }
    ).select("_id username email profileImage");


    return res.status(200).json(
        new ApiResponse(200, updatedUser, "User profile updated successfully.")
    );
});


const getBlogsByUser = asyncHandler(async (req, res) => {
    const userID = req.user?._id;

    if (!userID) {
        throw new ApiError(404, "User not found");
    }

    if (!mongoose.Types.ObjectId.isValid(userID)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const userWithBlogs = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userID),
            },
        },
        {
            $lookup: {
                from: "blogs",
                localField: "blogs",
                foreignField: "_id",
                as: "blogs",
                pipeline: [
                    {
                        $sort: {
                            updatedAt: -1,

                        }
                    },
                    {
                        $project: {
                            title: 1,
                            slug: 1,
                            shortDescription: 1,
                            description: 1,
                            authorName: 1,
                            coverImage: 1,
                            tags: 1,
                            status: 1,
                            createdAt: 1,
                            updatedAt: 1
                        },
                    },
                ],
            },
        },
    ]);

    if (!userWithBlogs || userWithBlogs.length === 0) {
        throw new ApiError(404, "User not found");
    }

    const user = userWithBlogs[0];

    if (!user.blogs || user.blogs.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "User has no blogs yet")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, user.blogs, "Successfully fetched all blogs")
    );
});



export {
    signUpUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    updateProfileImage,
    getUserById,
    updateUserProfile,
    getBlogsByUser
}