import { Request, Response } from "express";
import Posts from "../../model/post.model";
import { handle500Errors } from "../../util/api-response";


export const createPost = async (req: Request, res: Response) => {
    try {
        const post = await Posts.create({
            ...req.body
        })
        await post.save()
        res.status(201).json(post);
    } catch (error) {
        handle500Errors(error, res)
    }
}


export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Posts.find().sort({ createdAt: -1 });

        if(posts.length === 0){
            return res.status(404).json({ message: 'No created post' })
        }

        res.status(200).json(posts);
    } catch (error) {
        handle500Errors(error, res)
    }
}


export const getSinglePost = async (req: Request, res: Response) => {
    try {
        const post = await Posts.findById(req.params.id);
        if(!post)  return res.status(404).json('Post not found or does not exist');

        res.status(200).json(post);
    } catch (error) {
        handle500Errors(error, res)
    }
}


export const deletePost  = async (req: Request, res: Response) => {
    try {
        const post = await Posts.findById(req.params.id);
        if(!post) return res.status(404).json('Not found or already deleted');

        await Posts.findByIdAndDelete(req.params.id);

        res.status(200).json('Post deleted successfully!')
    } catch (error) {
        handle500Errors(error, res)
    }
}

