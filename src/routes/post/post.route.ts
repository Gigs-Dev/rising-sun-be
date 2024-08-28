import { Router } from "express";

import { createPost, getPosts, deletePost, getSinglePost } from "../../controller/post/post.controller";
import { verifyUser, verifyTokenAndAdmin } from "../../util/verifyJwt";


const router = Router();

router.get('/', verifyUser, getPosts);

router.get('/:id', verifyUser, getSinglePost);

router.post('/create', verifyTokenAndAdmin,  createPost);

router.delete('/:id', verifyTokenAndAdmin,  deletePost);

export default router;
