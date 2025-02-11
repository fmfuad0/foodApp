import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema  = new mongoose.Schema({
    fullName:{
        type : String,
        required : true,
    },
    username:{
        type : String,
        required : true,
        unique : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    userType:{
        type : String,
        default : "client",
        enum: ["client", "admin", "vendor", "driver"]
    },
    phone:{
        type : String,
        required : true,
        unique : true
    },
    profileImage:{
        type : String,
        default: "https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg"
    },
    accessToken:{
        type : String,
        default:null
    },
    refreshToken:{
        type : String,
        default:null
    }
}, {timeStamps :true})


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    console.log("triggered");
    var privateKey = process.env.accessTokenSecret;
    var token = jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        privateKey,
        {
            expiresIn: process.env.accessTokenExpiry
        }
    );
    console.log("Access token created :"+token);
    return token
}

userSchema.methods.generateRefreshToken = function () {
    const token = jwt.sign(
        {
            _id: this._id,
        },
        process.env.refreshTokenSecret,
        {
            expiresIn: process.env.refreshTokenExpiry
        }
    )
    console.log("Refresh token created :"+token);
    return token
}

export const User = mongoose.model("User", userSchema)