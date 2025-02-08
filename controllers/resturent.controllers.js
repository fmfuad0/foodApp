import { error } from "console";
import { Resturent } from "../models/resturent.models.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";


const createResturent = asyncHandler(async (req, res) => {
    try {
        const { title, imgUrl, foods, time, pickup, delevery, isOpen, logoUrl, rating, ratingCount, coords, } = req.body

        if (!title || !coords)
            return res.status(500)
                .json(new apiError(500, "provide title and address"))

        const createdResturent = new Resturent({
            title, imgUrl, foods, time, pickup, delevery, isOpen, logoUrl, rating, ratingCount, coords,
        })
        await createdResturent.save()
        res.status(200)
            .json(new apiResponse(200, createdResturent, "success creating resturent"))
    } catch (error) {
        res.status(400)
            .json(new apiError(500, "Error creating resturent"))
    }
})

const getAllResturents = asyncHandler(async (req, res) => {
    try {
        const result = await Resturent.find({})
        // console.log(result);
        return res.status(200)
            .json(new apiResponse(200, result, "Resturents fetched"))
    } catch (error) {
        console.log(error);
        return res.status(500)
            .json(
                new apiError(500, "Could not fetch all resturents" + error.message, error)
            )
    }
})

const getResturentDetails = asyncHandler(async (req, res) => {
    const {resturentId} = req.params
    if (!resturentId) {
        console.error(400, "Id not found")
        return res.status(400)
        .json(new apiError(400, {}, "Provide resturent id"))
    }
    try {
    const result = await Resturent.findById(new mongoose.Types.ObjectId(resturentId))
    if (!result)
        {
            return res
            .status(404)
            .json(
                new apiError(404, {}, "Resturent not found")
            )
            
        }
        return res.status(200)
        .json(new apiResponse(200, result, "Resturent details fetched"))
    } catch (error) {
        console.log(error);
        return res.status(500)
            .json(new apiError(500, {}, "Could not fetch resturent data" + error.message, error))
    }
})

const deleteResturent = asyncHandler(async (req, res) => {
    const { resturentId } = req.params
    if(!resturentId)
        return res.status(400).json(new apiError(400, {}, "provide resturent id"))
    const resturent = await Resturent.findOne(new mongoose.Types.ObjectId(resturentId))
    if (!resturent)
        return res.status(404).json(new apiError(404, {}, "resturent not found"))
    try{await Resturent.findByIdAndDelete(resturent._id);return res.status(200).json(new apiResponse(200, {}, "Resturent has been deleted succssfully"))}
    catch(error){return res.status(500).json(new apiError(500, {}, "Could not delete resturent"))}
})


export {
    createResturent,
    getAllResturents,
    getResturentDetails,
    deleteResturent

}

