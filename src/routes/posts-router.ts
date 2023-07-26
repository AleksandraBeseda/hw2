import { Router, Request, Response } from "express";
import { HTTP_STATUSES } from "../utils";
import { postsRepository } from "../repositories/postsRepository";
import { RequestWithBody, RequestWithBodyAndParams, RequestWithParams } from "../types/requestModelType";
import { basicAuthMiddleware } from "../middlewares/basic-auth-middleware";
import { PostsValidationMiddleware } from "../middlewares/posts-validation-middleware";

export const postsRouter = Router({});

postsRouter.get("/", (req: Request, res: Response) => {
    const foundPosts = postsRepository.findPosts();
    res.status(HTTP_STATUSES.OK_200).send(foundPosts)
});

postsRouter.get("/:id", (req: RequestWithParams<{id: string}>, res: Response) => {
    const id = req.params.id;
    const foundPost = postsRepository.findPostById(id);
    if(foundPost){
        res.status(HTTP_STATUSES.OK_200).send(foundPost);
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

postsRouter.post("/", 
basicAuthMiddleware, 
PostsValidationMiddleware,
(req: RequestWithBody<{title: string, shortDescription: string, content: string, blogId: string}> , res: Response) => {
    const createdPost = postsRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    res.status(HTTP_STATUSES.CREATED_201).send(createdPost) 
});

postsRouter.put("/:id",
basicAuthMiddleware,
PostsValidationMiddleware,
(req: RequestWithBodyAndParams<{id: string}, {title: string, shortDescription: string, content: string, blogId: string}> , res: Response) => {
    console.log("here")
    const postId = req.params.id;
    const existingPost = postsRepository.findPostById(postId);
    if(!existingPost){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
    const updatedPost = postsRepository.updatePost(postId, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    if(updatedPost){
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
})

postsRouter.delete("/:id", basicAuthMiddleware, (req: RequestWithParams <{id: string}>, res: Response) => {
    const isPostDeleted = postsRepository.deletePost(req.params.id);
    if(isPostDeleted){
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }else{
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
})
