import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
    unitNumber:{
        type:String,
    },
    streetNumber:{
        type:String,
        default:"N/A"
    },
    addressLine1:{
        type:String,
        default:"N/A"
    },
    addressLine2:{
        type:String,
        default:"N/A"
    },
    city:{
        type:String,
        default:"N/A"
    },
    region:{
        type:String,
        default:"N/A"
    },
    postalCode:{
        type:String,
        default:"N/A"
    },
    country:{
        type:Schema.Types.ObjectId,
        ref:"Country",
        default:"N/A"
    },
})


const Address = mongoose.model("Address", addressSchema)

export{ Address }