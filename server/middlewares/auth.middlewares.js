import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async(req, res, next)=>{
    try {
        console.log("running");
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")    
        console.log(token);
        
        if(!token)
            throw new apiError(400, "Unauthorized request")
        // console.log(jwt.verify(token, process.env.accessTokenSecret));
        
        const decodedToken =jwt.verify(token, process.env.accessTokenSecret)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        // console.log(user);
        
        if(!user)
            throw new apiError(401, "Invalid access token")
        // console.log(user)
        req.user = user
        next()
    } catch (error) {
        return res.status(402).json(new apiError(402, {}, error.name || "Invalid token"));
    }
})