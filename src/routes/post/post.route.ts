import { Router } from "express";

import { createPost, getPosts, deletePost, getSinglePost } from "../../controller/post/post.controller";


const router = Router();

router.get('/', getPosts);

router.get('/:id', getSinglePost);

router.post('/create', createPost);

router.delete('/:id', deletePost);

export default router;
