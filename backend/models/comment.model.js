import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
    {
        blog: {
            type: Schema.Types.ObjectId,
            ref: "Blog",
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
            maxlength: 1000,
        },
        loves: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            }
        ],

    }, { timestamps: true }
)


//add delete
export const Comment = mongoose.model("Comment", commentSchema); 