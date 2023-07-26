import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";
import { HTTP_STATUSES } from "../utils";

const ErrorFormatter = ({msg, path}: any) => {
    return {
        message: msg,
        field: path
    }
};

export const InputValidationMiddleware = (req: Request, res: Response, next: NextFunction) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsMessages = errors.array({ onlyFirstError: true }).map(error => ErrorFormatter(error))  
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages });
    } else {
        next();
    }
}