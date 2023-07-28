import { Router, Request, Response, NextFunction } from "express";
import { HTTP_STATUSES } from "../utils";
import { blogsRepository } from "../repositories/blogsRepository";
import { RequestWithBody, RequestWithBodyAndParams, RequestWithParams } from "../types/requestModelType";
import { basicAuthMiddleware } from "../middlewares/basic-auth-middleware";
import { BlogsValidationMiddleware } from "../middlewares/blogs-validation-middleware";

export const blogsRouter = Router({});

blogsRouter.get("/", (req: Request, res: Response) => {
    const foundBlogs = blogsRepository.findBlogs();
    res.status(HTTP_STATUSES.OK_200).send(foundBlogs);
});

blogsRouter.get("/:id", (req: RequestWithParams<{id: string}>, res: Response) => {
    const foundBlog = blogsRepository.findBlogById(req.params.id);
    if(foundBlog){
        res.status(HTTP_STATUSES.OK_200).send(foundBlog);
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

blogsRouter.post("/", 
basicAuthMiddleware, 
BlogsValidationMiddleware, 
(req: RequestWithBody<{name: string, description: string, websiteUrl: string}> , res: Response) => {
    const createBlog = blogsRepository.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    res.status(HTTP_STATUSES.CREATED_201).send(createBlog);
});

blogsRouter.put("/:id", 
basicAuthMiddleware, 
BlogsValidationMiddleware, 
(req: RequestWithBodyAndParams<{id: string}, {name: string, description: string, websiteUrl: string}>, res: Response) => {
    const blogId = req.params.id;
    const foundBlogById = blogsRepository.findBlogById(blogId);
    if(foundBlogById){
        blogsRepository.updateBlog(blogId, req.body.name, req.body.description, req.body.websiteUrl);//we don't need to return
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }else{
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

blogsRouter.delete("/:id", basicAuthMiddleware, (req: RequestWithParams <{id: string}>, res: Response) => {
    const isBlogDeleted = blogsRepository.deleteBlog(req.params.id);
    if(isBlogDeleted){
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }else{
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
})