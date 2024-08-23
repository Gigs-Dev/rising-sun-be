"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.getSinglePost = exports.getPosts = exports.createPost = void 0;
const post_model_1 = __importDefault(require("../../model/post.model"));
const api_response_1 = require("../../util/api-response");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.default.create(Object.assign({}, req.body));
        yield post.save();
        res.status(201).json(post);
    }
    catch (error) {
        (0, api_response_1.handle500Errors)(error, res);
    }
});
exports.createPost = createPost;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_model_1.default.find().sort({ createdAt: -1 });
        if (posts.length === 0) {
            return res.status(404).json({ message: 'No created post' });
        }
        res.status(200).json(posts);
    }
    catch (error) {
        (0, api_response_1.handle500Errors)(error, res);
    }
});
exports.getPosts = getPosts;
const getSinglePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.default.findById(req.params.id);
        if (!post)
            return res.status(404).json('Post not found or does not exist');
        res.status(200).json(post);
    }
    catch (error) {
        (0, api_response_1.handle500Errors)(error, res);
    }
});
exports.getSinglePost = getSinglePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.default.findById(req.params.id);
        if (!post)
            return res.status(404).json('Not found or already deleted');
        yield post_model_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json('Post deleted successfully!');
    }
    catch (error) {
        (0, api_response_1.handle500Errors)(error, res);
    }
});
exports.deletePost = deletePost;
