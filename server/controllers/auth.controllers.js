import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import bcrypt from "bcryptjs"

const registerUser = async (req, res) => {
    console.log("Registering");
    const { fullName, username, email, password, phone, address } = req.body;
    
    // Check if all fields are provided
    if (!fullName || !username || !email || !password || !phone || !address) {
        return res.status(400).json(new apiError(400, "All fields are required"));
    }
    
    try {
        // Check if user is already registered
        if (await User.findOne({ email } || { username } )) {
            throw new apiError(400, "User already registered");
        }
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = await  bcrypt.hash(password, salt)
        // Create a new user
        const user = await User.create({ 
            fullName,
            username,
            email,
            password : hashedPassword,
            phone,
            address
        })
        const createdUser = await User.findById(user._id).select("-password");
        
        console.log(createdUser);
        
        return res.status(201).json(new apiResponse(201, createdUser, "Successfully registered"));
    } catch (error) {
        console.error(error);  // Logging the error for easier debugging
        return res.status(error.statusCode || 500).json(new apiError(error.statusCode || 500, error.message || "Internal Server Error"));
    }
};

const loginUser = async (req, res) => {
    const {username, password} = req.body
    if(!username || !password)
        return new apiError(400, "Username and password are required")

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 * 1000
    };

    try {
        const user = await User.findOne({username:username})
        if(!user)
            throw new apiError(404, {}, "User not found")
        if(await user.isPasswordCorrect(password)){
            const refreshToken = user.generateRefreshToken()
            const accessToken = user.generateAccessToken()
            console.log("Logged in user : "+user.username);
            user.refreshToken = refreshToken
            user.accessToken = accessToken
            const loggedInUser = await user.save({validateBeforeSave:false})
            // console.log(loggedInUser);
            
            return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new apiResponse(200, loggedInUser, "Logged in successcully")
            )
        }
        throw new apiError(500, {}, "Wrong credentials")
    } catch (error) {
        return res.status(500).json(error)
    }
}


export {
    registerUser,
    loginUser
};
