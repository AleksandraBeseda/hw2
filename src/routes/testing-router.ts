import { Router, Request, Response } from "express";
import { HTTP_STATUSES } from "../utils";
import { postsRepository } from "../repositories/postsRepository";
import { blogsRepository } from "../repositories/blogsRepository";

export const testRouter = Router({});

testRouter.delete("/", (req: Request, res: Response) => {
    postsRepository.deleteAllPosts();
    blogsRepository.deleteAllBlogs();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
