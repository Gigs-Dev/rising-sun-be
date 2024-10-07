import { Router } from "express";

import { createPost, getPosts, deletePost, getSinglePost } from "../../controller/post/post.controller";
import { verifyUser, verifyToken } from "../../util/verifyJwt";


const router = Router();

router.get('/', verifyToken, getPosts);

router.get('/:id', verifyToken, getSinglePost);

router.post('/create', verifyToken,  createPost);

router.delete('/:id', verifyToken,  deletePost);

export default router;
