import express, { Request, Response } from "express";
import { HTTP_STATUSES } from "./utils";
import { blogsRouter } from "./routes/blogs-router";
import { postsRouter } from "./routes/posts-router";
import { testRouter } from "./routes/testing-router";

export const app = express();

const parseMiddleware = express.json();
app.use(parseMiddleware);
app.use("/blogs", blogsRouter);
app.use("/posts", postsRouter);
app.use("/testing/all-data", testRouter);