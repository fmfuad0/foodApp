import mongoose, { Schema } from "mongoose";
import { title } from "process";
import { stringify } from "querystring";

const resturentSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
    },
    foods: {
        type: []
    },
    time: {
        type: String
    },
    pickup: {
        type: Boolean,
        default: true
    },
    delevery: {
        type: Boolean,
        default: true
    },
    isOpen: {
        type: Boolean,
        default: true
    },
    logoUrl: {
        type: String,
    },
    rating: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    ratingCount: {
        type: Number
    },
    coords: {
        latitude: { type: String },
        latitudeDelta: { type: String },
        longitude: { type: String },
        latitudeDelta: { type: String },
        address: { type: String },
        title: { type: String },
    }
}, {timestamps:true})



export const Resturent = mongoose.model("Resturent", resturentSchema)