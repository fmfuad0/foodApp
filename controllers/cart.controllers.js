import mongoose, { Schema } from "mongoose";
import { Cart } from "../models/cart.models.js";
import { Food } from "../models/food.models.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { response } from "express";


const addFoodToCart = asyncHandler(async (req, res) => {
    const { foodId, qty } = req.params
    if (!foodId)
        return res.status(400).json(new apiError(400, {}, "Food id not found"))
    try {
        const food = await Food.findById(new mongoose.Types.ObjectId(foodId))
        if (!food)
            return res.status(404).json(new apiError(404, {}, "Food not found"))
        let activeCart = await Cart.findOne({ $and: [{ orderedBy: req.user._id }, { activeStatus: true }, {resturent:food.resturent}] })

        console.log("Found cart: ", activeCart);

        if (!activeCart) {
            activeCart = await Cart.create({ orderedBy: req.user._id, resturent: food.resturent })
            console.log("Created cart : ", activeCart);
        }
        console.log(activeCart._id);
        var isAlreadyAdded = false
        for (let index = 0; index < activeCart.foods.length; index++) {
            if (activeCart.foods[index].foodItem.equals(food._id)) {
                console.log("Food found");
                isAlreadyAdded = true;
                await Cart.findByIdAndUpdate(
                    activeCart._id,
                    {
                        $inc: { "foods.$[elem].qty": qty }
                    },
                    {
                        new: true,
                        arrayFilters: [{ "elem.foodItem": food._id }]  // Filter to target the right element in the array
                    }
                );
                break;  // Once you find and update the food, no need to continue looping
            }
        }

        if (!isAlreadyAdded) {
            let cartItem = new Object()
            cartItem.foodItem = food._id,
            cartItem.qty = qty
            await Cart.findByIdAndUpdate(activeCart._id,
                { $push: { "foods": cartItem } },
                { new: true }
            )
        }
        activeCart = await Cart.findByIdAndUpdate(activeCart._id,
            { $inc: { "totalAmount": (food.price * qty) } },
            { new: true }
        )
        // console.log(activeCart);
        return res.status(200).json(new apiResponse(200, activeCart, "Food added to cart"))
    } catch (error) {
        return res.status(500).json(new apiError(500, {}, "Could not add food into cart" + error.message))
    }

})

const removeFoodFromCart = asyncHandler(async (req, res) => {
    const { foodId, qty } = req.params

    if (!foodId)
        return res.status(400).json(new apiError(400, {}, "Food id not found"))
    try {
        const food = await Food.findById(new mongoose.Types.ObjectId(foodId))
        if (!food)
            return res.status(404).json(new apiError(404, {}, "Food not found"))
        let activeCart = await Cart.findOne({ $and: [{ orderedBy: req.user._id }, { activeStatus: true }] })

        console.log("Found cart: ", activeCart);
        if (!activeCart)
            return res.status(404).json(new apiError(404, {}, "Cart not found"))
        let tmp = false
        let dlt = false
        for (let index = 0; index < activeCart.foods.length; index++) {
            if (activeCart.foods[index].foodItem.equals(food._id) && activeCart.foods[index].qty > 0) {
                console.log("Food found");
                if (activeCart.foods[index].qty === 1) {
                    activeCart = await Cart.findByIdAndUpdate(activeCart._id,
                        { $pull: { "foods": { foodItem: food._id, qty: 1 } } },
                        {new:true}
                    );
                    return res.status(200).json(new apiResponse(200, activeCart, "Food successfully removed from cart"))
                }
                else
                    tmp = true
                break;
            }
        }
        if (tmp) {
            if (tmp)
                await Cart.findByIdAndUpdate(activeCart._id,
                    { $inc: { "foods.$[elem].qty": -1 * qty } },
                    {
                        new: true,
                        arrayFilters: [{ "elem.foodItem": food._id }]
                    }
                );
            activeCart = await Cart.findByIdAndUpdate(activeCart._id,
                { $inc: { "totalAmount": (-1 * food.price * qty) } },
                { new: true }
            )
            return res.status(200).json(new apiResponse(200, activeCart, "Food removed from cart"))
        }
        return res.status(200).json(new apiError(404, {}, "Food not found in cart"))
        // console.log(activeCart);
    } catch (error) {
        return res.status(500).json(new apiError(500, {}, "Could not remove food from cart" + error.message))
    }
})

const getCart = asyncHandler(async(req, res)=>{
    console.log("Getting");
    
    console.log(req.user._id);
    try{
        return res.status(200).json(new apiResponse(200, await Cart.find({$and:[{orderedBy:req.user._id}, {activeStatus:true}]}), "Cart fetched successfuly"))
    } catch (error) {
        return res.status(500).json(new apiError(500, {}, "Could not fetch cart"))
    }
})



export {
    addFoodToCart,
    removeFoodFromCart,
    getCart
}