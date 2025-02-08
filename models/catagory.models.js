import mongoose from "mongoose"

const catagorySchema  = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        default :"https://icons.veryicon.com/png/o/miscellaneous/fangshan-design_icon/category-18.png"
    }
}, {timeStamps :true})


export const Catagory = mongoose.model("Catagory", catagorySchema)