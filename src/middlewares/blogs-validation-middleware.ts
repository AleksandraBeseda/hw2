import { body } from "express-validator";
import { InputValidationMiddleware } from "./input-validation-middleware";

const urlPattern ='^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$';

export const BlogsValidationMiddleware = [
    body("name").isString().trim().isLength({min:1, max: 15}).withMessage("Name should be less then 15 letters"),

    body("description").isString().trim().isLength({min:1, max: 500}).withMessage("Description should be less then 500 letters"),
    
    body("websiteUrl").matches(urlPattern).isLength({min:1, max: 100}).withMessage("websiteUrl should be less then 500 letters"),

    InputValidationMiddleware
]