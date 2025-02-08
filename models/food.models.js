import mongoose, { Schema } from "mongoose";

const foodSchema = new Schema({
    title:{
        type: String,
        requierd:true
    },
    description:{
        type:String,
        required:[true, "Description is required"]
    },
    price:{
        type:Number,
        required: true
    },
    foodTags:{
        type:String
    },
    catagory:{
        type: Schema.Types.ObjectId,
        ref:"Catagory"
    },
    code:{
        type:String
    },
    isAvailable:{
        type:Boolean,
        default:true
    },
    resturent:{
        type : Schema.Types.ObjectId,
        ref: "Resturent"
    }
})



export const Food = mongoose.model("Food", foodSchema)