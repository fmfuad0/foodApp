import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async(req, res, next)=>{
    try {
        console.log("Authenticating");
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")    
        
        if(!token)
            throw new apiError(400, "Unauthorized request")
        // console.log(jwt.verify(token, process.env.accessTokenSecret));
        // console.log(token);
        
        const decodedToken =jwt.verify(token, process.env.accessTokenSecret)
        // console.log(decodedToken);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        // console.log(user);
        
        // console.log(user);
        
        if(!user)
            throw new apiError(401, "Invalid access token")
        // console.log(user)
        req.user = user
        console.log("authenticated");
        
        next()
    } catch (error) {
        return res.status(402).json(new apiError(402, {}, error.name || "Invalid token"));
    }
})