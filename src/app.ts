import express from "express";
import { blogsRouter } from "./routes/blogs-router";
import { postsRouter } from "./routes/posts-router";
import { testRouter } from "./routes/testing-router";

export const app = express();

export const RouterPaths = {
    blogs: '/blogs',
    posts: '/posts',
    testing: '/testing/all-data'
}

const parseMiddleware = express.json();
app.use(parseMiddleware);
app.use(RouterPaths.blogs, blogsRouter);
app.use(RouterPaths.posts, postsRouter);
app.use(RouterPaths.testing, testRouter);