
import { Food } from "../models/food.models.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js"
import mongoose from "mongoose"

const createFood =asyncHandler(async (req, res)=>{
    const {title, description, price, foodTags, catagory ,code, isAvailable, resturent} = req.body
    console.log(title, description, price,resturent);
    
    if(!title || !description|| !price || !resturent)
        return res.status(400).json(new apiError(400, {}, "Provide title, description,price and resturent"))
    try {
        const createdFood = await Food.create({title, description, price, foodTags, catagory ,code, isAvailable, resturent})
        return res.status(200).json(new apiResponse(200, createdFood, "Food created successfully"))
    } catch (error) {
        return res.status(500).json(new apiError(500, {}, "Could not create food"))
    }
})

const getAllFoods = asyncHandler(async(req, res)=>{
    const foods = await Food.find({})
    if(!foods)
        return res.status(404).json(new apiError(404, foods, "No food found"))
    return res.status(200).json(new apiResponse(200, foods, "Foods fetched successfully"))
})

const updateFood  = asyncHandler(async(req, res)=>{
    const {foodId} = req.params
    const {updatedTitle, updatedPrice, updatedDescription} = req.body
    if(!foodId || !updatedTitle || !updatedPrice || !updatedDescription)
        return res.status(400).json(new apiError(400, {}, "Provide all updated details"))
    const food =  await Food.findById(new mongoose.Types.ObjectId(foodId))
    if(!food)
        return res.status(404).json(new apiError(404, {}, "Food not found"))
    try {
        const updatedFood = await Food.findByIdAndUpdate(food._id, {title: updatedTitle,price: updatedPrice,description: updatedDescription})
        return res.status(200).json(new apiResponse(200, updatedFood, "Food updated successfully"))
    } catch (error) {
        return res.status(500).json(new apiError(500, {}, "Could not update food.Error on update food api"))
    }
})

const deleteFood = asyncHandler(async(req, res)=>{
    const {foodId} = req.params
    const food = await Food.findById(new mongoose.Types.ObjectId(foodId))
    if(!food)
        return res.status(404).json(new apiError(404, {}, "Food not found"))
    try {
        await Food.findByIdAndDelete(food._id);return res.status(200).json(new apiResponse(200, {}, "Food deleted successfully"))
    } catch (error) {
        return res.status(500).json(500, {}, "Could not delete food")
    }
})



export{
    createFood,
    getAllFoods,
    updateFood,
    deleteFood,

}