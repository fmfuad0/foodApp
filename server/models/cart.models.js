import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
    foods:{
        type:[{
                foodItem: {
                    type:Schema.Types.ObjectId,
                    ref: "Food"
                },
                qty: {
                    type:Number,
                    default:0
                }
            }
        ],
    },
    totalAmount:{
        type:Number,
        default:0
    },
    orderedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    activeStatus:{
        type:Boolean,
        default:true
    },
    resturent:{
        type:Schema.Types.ObjectId,
        ref:"Resturent"
    }
}, {timestamps:true})

const Cart = mongoose.model("Cart", cartSchema)

export{ Cart }