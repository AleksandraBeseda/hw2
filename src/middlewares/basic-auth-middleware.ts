import { HTTP_STATUSES } from "../utils";
import { Request, Response, NextFunction } from "express";

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction ) => {
    //decode to base64
    const auth = btoa("admin:qwerty");
    if(req.headers.authorization===`Basic ` + auth){
        next();
    } else {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
};