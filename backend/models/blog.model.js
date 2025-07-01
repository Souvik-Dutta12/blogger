import mongoose, { Schema } from "mongoose";
import slugify from "slugify";


const blogSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        shortDescription: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String, //cloudinary
            required: true,
        },
        authorName: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        tags:
            [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Tag"
                }
            ],
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft',
        }

    }, { timestamps: true }
)

//slugify
blogSchema.pre('validate', function (next) {
    if (this.title && !this.slug) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
})


export const Blog = mongoose.model("Blog", blogSchema);