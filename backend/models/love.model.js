import mongoose, { Schema } from "mongoose";

const loveSchema = new Schema(
    {
        blog: {
            type: Schema.Types.ObjectId,
            ref: "Blog"
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        lovedby: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }]
    }, { timestamps: true }
)

export const Love = mongoose.model("Love", loveSchema);