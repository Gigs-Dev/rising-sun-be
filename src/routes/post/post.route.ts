import { Router } from "express";

import { createPost, getPosts, deletePost } from "../../controller/post/post.controller";


const router = Router();

router.get('/', getPosts);

router.post('/create', createPost);

router.delete('/:id', deletePost);

export default router;
