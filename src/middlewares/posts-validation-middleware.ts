import { NextFunction, Response, request } from 'express';
import { body } from "express-validator";
import { InputValidationMiddleware } from "./input-validation-middleware";
import { blogsRepository } from "../repositories/blogsRepository";
import { postsRepository } from "../repositories/postsRepository";
import { HTTP_STATUSES } from "../utils";
import { RequestWithParams } from '../types/requestModelType';

export const PostValidationByBlogIdUpdate =[
     (req: RequestWithParams<{id: string}>, res: Response, next: NextFunction) => {
            const postID = req.params.id;
            const existingPost = postsRepository.findPostById(postID);
            if(!existingPost){
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            } else {
                next()
            }
        },
];

export const PostsValidationMiddleware = [
   body("title").isString().trim().isLength({min: 1, max: 30}).withMessage("title is incorect or wrong format"),

   body("shortDescription").isString().trim().isLength({min: 1, max: 100}).withMessage("shortDescription is incorect or wrong format"),

   body("content").isString().trim().isLength({min: 1, max: 1000}).withMessage("content is incorect or wrong format"),

   body("blogId").isString().trim().notEmpty().withMessage("blogId value is empty").custom(blogId => {
    const blog = blogsRepository.findBlogById(blogId);
    if(!blog){
        throw new Error("Blog is not found in DB")
    } else {
        return true
    }
   }),

   InputValidationMiddleware
]