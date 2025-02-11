import { Catagory } from "../models/catagory.models.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createCatagory = asyncHandler(async(req, res)=>{

    const {title, imgUrl} = req.body

    if(!title)
        return res.send(new apiError(400, "Provide title for the catagory"))
    try {
        const createdCatagory =await Catagory.create({title, imgUrl})
        console.log(createdCatagory);
        return res.status(200).json(new apiResponse(200, createdCatagory, "Catagory created successfully"))
    } catch (error) {
        return res.status(500).json(new apiError(500, {}, "Could not create catagory"))
    }
})

const getAllCatagories = asyncHandler(async (req, res)=>{
    try {
        const catagories =await Catagory.find({})
        if(!catagories)
            return res.status(404).json(new apiResponse(404, {}, "No catagory found"))
        return res.status(200).json(new apiResponse(200, catagories, "Catagories fetched"))
    } catch (error) {
        return res.status(500).json(new apiError(500, {}, "Could not get all catagories"))
    }
})

// const  updateCatagory = {}    ///to be completed
// const  deleteCatagory = {}    ///to be completed



export {
    createCatagory,
    getAllCatagories
}