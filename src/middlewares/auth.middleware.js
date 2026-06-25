import jwt from "jsonwebtoken";
import { errorResponse } from "../helpers/response.helper.js";
import { env } from "../config/env.js";

const authMiddlewere = (req,res,next,) => {
    try{
        const authorization = req.headers.authorization;
        if(!authorization){
            return errorResponse(res,"Token requerido",401);
        }
        const token = authorization.replace("Bearer ","",);
        const decoded = jwt.verify(token,env.JWT_SECRET,);
        req.user = {userId: decoded.userId, role: decoded.role};next();
    }catch(error){
        errorResponse(res,"Token invalido",401,);
    }
};

export { authMiddlewere };