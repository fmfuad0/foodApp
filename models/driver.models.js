import mongoose, { Schema } from "mongoose";

const driverSchema = new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    isAvailable:{
        type:Boolean,
        default:true
    }
})


export const Driver = mongoose.model("Driver", driverSchema)