import mongoose, { model, Schema } from "mongoose";

const PostSchema = new Schema({
    desc: {
        type: String,
        required: true,
    },
}, { timestamps: true })

const Posts = model('Posts', PostSchema);

export default Posts;
