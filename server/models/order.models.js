import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    cart:{
        type:Schema.Types.ObjectId,
        ref:"Cart"
    },
    payment:{
        type:String,
        enum:["Bkash", "Nagad", "Rocket"],
        default:"Bkash"
    },
    driver:{
        type: Schema.Types.ObjectId,
        ref : "Driver"
    },
    deleveryFee:{
        type:Number,
        default:100
    },
    totalOrderPrice:{
        type:Number,
        default:100
    },
    orderedBy:{
        type:Schema.Types.ObjectId,
        ref : "User"
    },
    // shippingAddress:{
    //     type: Schema.Types.ObjectId,
    //     ref : "Address",
    //     default : "N/A"
    // },
    status:{
        type:String,
        enum:["preparing", "prepared", "On the way", "waiting to be recieved", "Delivered", "Canceled"],
        default:"preparing"
    }
}, {timestamps: true})


export const Order = mongoose.model("Order", orderSchema)